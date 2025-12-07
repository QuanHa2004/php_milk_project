<?php

namespace Controllers\Customer;

use Helpers\Response;
use Controllers\AuthController;
use Controllers\Customer\PaymentController;
use Database\Connection;
use Models\Cart;
use Models\Order;
use Models\Product;

class OrderController
{
    private $user_id;

    /* ============================
       1. XÁC THỰC NGƯỜI DÙNG
    ============================ */
    private function authenticate()
    {
        $auth = new AuthController();
        try {
            $payload = $auth->decodeToken();
            $this->user_id = $payload->sub;
        } catch (\Exception $e) {
            Response::json(['error' => $e->getMessage()], 401);
        }
    }


    /* ============================
       2. TẠO ĐƠN HÀNG (CHECKOUT)
    ============================ */
    // Xử lý đặt hàng + thanh toán (COD / VNPay)
    public function checkout($data)
    {
        $this->authenticate();

        // Kiểm tra dữ liệu đầu vào
        if (
            empty($data['delivery_address']) || empty($data['payment_method']) ||
            empty($data['full_name']) || empty($data['phone'])
        ) {
            Response::json(['error' => 'Vui lòng cung cấp đầy đủ: Tên, SĐT, Địa chỉ và Phương thức thanh toán'], 400);
        }

        // Lấy giỏ hàng
        $cart = Cart::getCartByUserId($this->user_id);
        if (!$cart) Response::json(['error' => 'Giỏ hàng trống'], 400);

        $cart_items = Cart::getCartItems($cart['cart_id']);

        // Lọc sản phẩm được chọn
        $items_to_buy = array_filter($cart_items, fn($item) => $item['is_checked'] == 1);
        if (empty($items_to_buy)) {
            Response::json(['error' => 'Vui lòng chọn sản phẩm để thanh toán'], 400);
        }

        // Tính tổng tiền
        $shipping_fee = $data['shipping_fee'] ?? 0;
        $subtotal = array_reduce($items_to_buy, fn($sum, $item) => $sum + $item['price'] * $item['quantity'], 0);
        $total_amount = $subtotal + $shipping_fee;

        // Bắt đầu transaction
        $db = Connection::get();
        $db->beginTransaction();

        try {
            // 1. Tạo đơn hàng
            $order_id = Order::create([
                'user_id'        => $this->user_id,
                'full_name'      => $data['full_name'],
                'phone'          => $data['phone'],
                'address'        => $data['delivery_address'],
                'shipping_fee'   => $shipping_fee,
                'total_amount'   => $total_amount,
                'payment_method' => $data['payment_method'],
                'note'           => $data['note'] ?? ''
            ]);

            // 2. Tạo chi tiết đơn + trừ kho
            foreach ($items_to_buy as $item) {

                Order::addDetail([
                    'order_id'     => $order_id,
                    'product_id'   => $item['product_id'],
                    'product_name' => $item['product_name'],
                    'price'        => $item['price'],
                    'quantity'     => $item['quantity']
                ]);

                // Trừ kho
                if (!Product::decreaseStock($item['product_id'], $item['quantity'])) {
                    throw new \Exception("Sản phẩm {$item['product_name']} không đủ số lượng trong kho.");
                }

                // Xóa khỏi giỏ nếu không phải VNPay
                if ($data['payment_method'] !== 'VNPAY') {
                    Cart::removeItem($cart['cart_id'], $item['product_id']);
                }
            }

            // 3. Xử lý thanh toán
            if ($data['payment_method'] === 'VNPAY') {

                // Lưu đơn hàng trước khi redirect
                $db->commit();

                $paymentCtrl = new PaymentController();
                $paymentData = [
                    'order_id'   => $order_id,
                    'amount'     => $total_amount,
                    'order_desc' => "Thanh toan don hang #$order_id"
                ];

                $vnp_Url = $paymentCtrl->createPaymentUrl($paymentData);

                Response::json([
                    'message'     => 'Chuyển hướng đến VNPay',
                    'order_id'    => $order_id,
                    'payment_url' => $vnp_Url
                ]);
            } else {
                // Thanh toán COD
                Order::addPaymentLog($order_id, 'COD', $total_amount, 'PENDING');
                $db->commit();

                Response::json([
                    'message'  => 'Đặt hàng thành công',
                    'order_id' => $order_id
                ]);
            }
        } catch (\Exception $e) {
            $db->rollBack();
            Response::json(['error' => 'Lỗi đặt hàng: ' . $e->getMessage()], 500);
        }
    }


    /* ============================
       3. THANH TOÁN LẠI ĐƠN HÀNG
    ============================ */
    // Tạo link thanh toán lại cho đơn Pending/Cancelled
    public function retryPayment($data)
    {
        $this->authenticate();

        if (empty($data['order_id'])) {
            Response::json(['error' => 'Thiếu mã đơn hàng'], 400);
        }

        $order_id = $data['order_id'];
        $db = Connection::get();

        try {
            $db->beginTransaction();

            // 1. Lấy đơn hàng
            $order = Order::find($order_id);

            if (!$order || $order['user_id'] != $this->user_id) {
                Response::json(['error' => 'Đơn hàng không tồn tại hoặc không hợp lệ'], 404);
            }

            // Chỉ cho phép retry nếu đơn Pending hoặc Cancelled
            if (!in_array($order['status'], ['pending', 'cancelled'])) {
                Response::json(['error' => 'Đơn hàng này không thể thanh toán lại'], 400);
            }

            // 2. Trừ kho lại
            $orderDetails = Order::getDetails($order_id);

            foreach ($orderDetails as $item) {
                if (!Product::decreaseStock($item['product_id'], $item['quantity'])) {
                    throw new \Exception("Sản phẩm {$item['product_name']} hiện đã hết hàng.");
                }
            }

            // 3. Cập nhật trạng thái đơn hàng
            $stmt = $db->prepare("UPDATE `orders` SET status = 'pending', payment_method = 'VNPAY' WHERE order_id = :id");
            $stmt->execute(['id' => $order_id]);

            $db->commit();

            // 4. Tạo link thanh toán mới
            $paymentCtrl = new PaymentController();
            $paymentData = [
                'order_id'   => $order_id,
                'amount'     => $order['total_amount'],
                'order_desc' => "Thanh toan lai don hang #$order_id"
            ];

            $vnp_Url = $paymentCtrl->createPaymentUrl($paymentData);

            Response::json([
                'message'     => 'Tạo link thanh toán lại thành công',
                'payment_url' => $vnp_Url
            ]);
        } catch (\Exception $e) {
            $db->rollBack();
            Response::json(['error' => $e->getMessage()], 500);
        }
    }
}
