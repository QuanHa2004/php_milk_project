<?php

namespace Controllers\Customer;

use Helpers\Response;
use Controllers\AuthController;
use Models\Cart;

class CartController
{
    private $user_id;

    /* ============================
       1. XÁC THỰC NGƯỜI DÙNG
    ============================ */
    // Lấy user_id từ token
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
       2. THÊM / XÓA / CẬP NHẬT GIỎ HÀNG
    ============================ */

    // Add an item to the authenticated user's cart
    public function add($data)
    {
        $this->authenticate();

        if (!isset($data['variant_id']) || !isset($data['quantity'])) {
            Response::json(['error' => 'Thiếu thông tin variant_id hoặc quantity'], 400);
        }

        $cart_id = Cart::findOrCreate($this->user_id);

        // batch_id có thể gửi từ frontend, nếu không có → null
        $batch_id = $data['batch_id'];

        Cart::addItem($cart_id, $data['variant_id'], $data['quantity'], $batch_id);

        Response::json([
            'message' => 'Đã thêm sản phẩm vào giỏ hàng',
            'cart_id' => $cart_id,
            'variant_id' => $data['variant_id'],
            'batch_id' => $batch_id,
            'quantity_added' => $data['quantity']
        ]);
    }

    // Remove an item from the authenticated user's cart
    public function remove($data)
    {
        $this->authenticate();
        $cart = Cart::getCartByUserId($this->user_id);

        if (!$cart) Response::json(['error' => 'Giỏ hàng trống'], 404);

        if (empty($data['variant_id']) || empty($data['batch_id'])) {
            Response::json(['error' => 'Thiếu variant_id hoặc batch_id'], 400);
        }

        $deleted = Cart::removeItem(
            $cart['cart_id'],
            $data['variant_id'],
            $data['batch_id']
        );

        if ($deleted > 0) {
            Response::json(['message' => 'Đã xóa sản phẩm khỏi giỏ hàng']);
        } else {
            Response::json(['error' => 'Sản phẩm không tồn tại'], 404);
        }
    }


    // Update quantity for a cart item
    public function update($data)
    {
        $this->authenticate();
        $cart = Cart::getCartByUserId($this->user_id);

        if (!$cart) Response::json(['error' => 'Giỏ hàng không tồn tại'], 404);

        if (
            empty($data['variant_id']) ||
            empty($data['batch_id']) ||
            !isset($data['quantity'])
        ) {
            Response::json(['error' => 'Thiếu dữ liệu'], 400);
        }

        Cart::updateItemQuantity(
            $cart['cart_id'],
            $data['variant_id'],
            $data['batch_id'],
            $data['quantity']
        );

        Response::json(['message' => 'Cập nhật thành công']);
    }



    /* ============================
       3. LẤY GIỎ HÀNG HIỆN TẠI
    ============================ */

    // Retrieve the authenticated user's cart and compute totals
    public function myCart()
    {
        $this->authenticate();

        $cart = Cart::getCartByUserId($this->user_id);

        if (!$cart) {
            Response::json([
                'user_id' => $this->user_id,
                'cart_id' => null,
                'items' => [],
                'total_price' => 0
            ]);
            return;
        }

        $cart_items = Cart::getCartItems($cart['cart_id']);

        $items = [];
        $total_price = 0;

        foreach ($cart_items as $ci) {

            $price = floatval($ci['price']);
            $qty   = intval($ci['quantity']);
            $total = $price * $qty;

            $total_price += $total;

            $items[] = [
                // ====== KHÓA CHÍNH ======
                'variant_id'     => (int)$ci['variant_id'],
                'batch_id'       => $ci['batch_id'] !== null ? (int)$ci['batch_id'] : null,

                // ====== SẢN PHẨM ======
                'product_id'     => (int)$ci['product_id'],
                'product_name'   => $ci['product_name'],
                'image_url'      => $ci['image_url'],

                // ====== BIẾN THỂ ======
                'volume'         => $ci['volume'],
                'packaging_type' => $ci['packaging_type'],

                // ====== GIÁ ======
                'price'          => $price,
                'quantity'       => $qty,
                'is_checked'     => (bool)$ci['is_checked'],
                'total'          => $total
            ];
        }

        Response::json([
            'user_id'     => $this->user_id,
            'cart_id'     => $cart['cart_id'],
            'items'       => $items,
            'total_price' => $total_price
        ]);
    }




    /* ============================
       4. CẬP NHẬT TRẠNG THÁI CHỌN SẢN PHẨM
    ============================ */

    // Toggle checked status for a cart item
    public function updateItemStatus($variant_id, $data)
    {
        $this->authenticate();

        $cart = Cart::getCartByUserId($this->user_id);
        if (!$cart) {
            Response::json(['error' => 'Giỏ hàng không tồn tại'], 404);
        }

        if (!isset($data['is_checked']) || !is_bool($data['is_checked'])) {
            Response::json(['error' => 'Dữ liệu trạng thái không hợp lệ'], 400);
        }

        $updated = Cart::updateItemStatus($cart['cart_id'], $variant_id, $data['is_checked']);

        if ($updated === 0) {
            Response::json(['error' => 'Không tìm thấy sản phẩm trong giỏ'], 404);
        }

        Response::json(['message' => 'Cập nhật trạng thái thành công']);
    }
}
