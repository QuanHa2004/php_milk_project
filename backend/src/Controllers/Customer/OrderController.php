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

    public function checkout($data)
    {
        $this->authenticate();

        $auth = new AuthController();
        $user = $auth->currentUser();

        $full_name = $user['full_name'];
        $phone     = $user['phone'];
        $address   = $user['address'];

        if (empty($data['payment_method'])) {
            Response::json(['error' => 'Thiếu phương thức thanh toán'], 400);
        }

        if (!$full_name || !$phone || !$address) {
            Response::json(['error' => 'Vui lòng cung cấp đầy đủ số điện thoại, địa chỉ'], 400);
        }

        $cart = Cart::getCartByUserId($this->user_id);
        if (!$cart) Response::json(['error' => 'Giỏ hàng trống'], 400);

        $cart_items = Cart::getCartItems($cart['cart_id']);
        $items_to_buy = array_filter($cart_items, fn($item) => $item['is_checked'] == 1);

        $shipping_fee = $data['shipping_fee'] ?? 0;
        $subtotal = array_reduce($items_to_buy, fn($sum, $item) => $sum + $item['price'] * $item['quantity'], 0);
        $total_amount = $subtotal + $shipping_fee;

        $db = Connection::get();
        $db->beginTransaction();

        try {

            $order_id = Order::create([
                'user_id'        => $this->user_id,
                'full_name'      => $full_name,
                'phone'          => $phone,
                'address'        => $address,
                'shipping_fee'   => $shipping_fee,
                'total_amount'   => $total_amount,
                'payment_method' => $data['payment_method'],
                'note'           => $data['note'] ?? ''
            ]);

            foreach ($items_to_buy as $item) {

                if (empty($item['batch_id'])) {
                    throw new \Exception(
                        "Cart item thiếu batch_id (variant {$item['variant_id']})"
                    );
                }

                Order::addDetail([
                    'order_id'   => $order_id,
                    'variant_id' => $item['variant_id'],
                    'batch_id'   => $item['batch_id'],
                    'price'      => $item['price'],
                    'quantity'   => $item['quantity']
                ]);

                if (!Product::decreaseStock(
                    $item['variant_id'],
                    $item['quantity'],
                    $item['batch_id']
                )) {
                    throw new \Exception(
                        "Không đủ tồn kho cho sản phẩm {$item['variant_id']}"
                    );
                }

                if ($data['payment_method'] === 'COD') {
                    Cart::removeItem(
                        $cart['cart_id'],
                        $item['variant_id'],
                        $item['batch_id']
                    );
                }
            }

            if ($data['payment_method'] === 'VNPAY') {
                $db->commit();

                $paymentCtrl = new PaymentController();
                $vnp_Url = $paymentCtrl->createPaymentUrl([
                    'order_id'   => $order_id,
                    'amount'     => $total_amount,
                    'order_desc' => "Thanh toan don hang #$order_id"
                ]);

                Response::json([
                    'message'     => 'Chuyển hướng đến VNPay',
                    'order_id'    => $order_id,
                    'payment_url' => $vnp_Url
                ]);
            }

            Order::addPaymentLog($order_id, 'COD', $total_amount, 'SUCCESS');
            $db->commit();

            Response::json([
                'message' => 'Đặt hàng thành công',
                'order_id' => $order_id
            ]);
        } catch (\Exception $e) {
            $db->rollBack();
            Response::json(['error' => 'Lỗi đặt hàng: ' . $e->getMessage()], 500);
        }
    }

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

            $order = Order::find($order_id);

            if (!$order || $order['user_id'] != $this->user_id) {
                Response::json(['error' => 'Đơn hàng không tồn tại hoặc không hợp lệ'], 404);
            }

            if (!in_array($order['status'], ['pending', 'cancelled'])) {
                Response::json(['error' => 'Đơn hàng này không thể thanh toán lại'], 400);
            }

            $orderDetails = Order::getDetails($order_id);

            foreach ($orderDetails as $item) {
                if (!Product::decreaseStock(
                    $item['variant_id'],
                    $item['quantity'],
                    $item['batch_id']
                )) {
                    throw new \Exception("Sản phẩm {$item['product_name']} hiện đã hết hàng.");
                }
            }

            $stmt = $db->prepare("UPDATE `orders` SET status = 'pending', payment_method = 'VNPAY' WHERE order_id = :id");
            $stmt->execute(['id' => $order_id]);

            $db->commit();

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

    public function orderHistory()
    {
        $this->authenticate();
        $orders = Order::getOrdersByUserId($this->user_id);
        Response::json([
            'data' => $orders ?: []
        ], 200);
    }
}
