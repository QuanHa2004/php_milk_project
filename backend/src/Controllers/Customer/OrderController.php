<?php

namespace Controllers\Customer;

use Helpers\Response;
use Controllers\AuthController;
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
        // 1. Xác thực user
        $this->authenticate();

        if (empty($data['delivery_address']) || empty($data['payment_method'])) {
            Response::json(['error' => 'Vui lòng cung cấp địa chỉ và phương thức thanh toán'], 400);
        }

        // 2. Lấy thông tin giỏ hàng
        $cart = Cart::getCartByUserId($this->user_id);
        if (!$cart) {
            Response::json(['error' => 'Giỏ hàng trống'], 400);
        }

        $cart_items = Cart::getCartItems($cart['cart_id']);
        
        // Lọc chỉ lấy những sản phẩm được tick chọn (is_checked)
        $items_to_buy = array_filter($cart_items, function($item) {
            return $item['is_checked'] == 1;
        });

        if (empty($items_to_buy)) {
            Response::json(['error' => 'Vui lòng chọn sản phẩm để thanh toán'], 400);
        }

        // 3. Tính tổng tiền (Server side calculation để bảo mật)
        $total_amount = 0;
        foreach ($items_to_buy as $item) {
            $total_amount += $item['price'] * $item['quantity'];
        }

        // 4. Bắt đầu Transaction (Quan trọng)
        $db = Connection::get();
        $db->beginTransaction();

        try {
            // A. Tạo Order
            $order_id = Order::create($this->user_id, $data, $total_amount);

            // B. Tạo Order Detail & Cập nhật Product & Validate Tồn kho
            foreach ($items_to_buy as $item) {
                // Thêm chi tiết đơn
                Order::addDetail($order_id, $item['product_id'], $item['price'], $item['quantity']);

                // Cập nhật kho hàng (Product)
                $updated = Product::decreaseStock($item['product_id'], $item['quantity']);
                if (!$updated) {
                    throw new \Exception("Sản phẩm " . $item['product_name'] . " không đủ số lượng trong kho.");
                }
            }

            // C. Tạo Payment
            Order::addPayment($order_id, $data['payment_method'], $total_amount);

            // D. Xóa sản phẩm đã mua khỏi Cart Item
            Cart::clearCart($cart['cart_id']);

            // Mọi thứ thành công, commit transaction
            $db->commit();

            Response::json([
                'message' => 'Đặt hàng thành công',
                'order_id' => $order_id
            ]);

        } catch (\Exception $e) {
            // Có lỗi xảy ra, hoàn tác tất cả thay đổi DB
            $db->rollBack();
            Response::json(['error' => 'Lỗi đặt hàng: ' . $e->getMessage()], 500);
        }
    }
}