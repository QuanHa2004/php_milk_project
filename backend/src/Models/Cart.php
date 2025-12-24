<?php

namespace Models;

use Database\Connection;
use PDO;

class Cart
{
    // =========================
    // CART KHỞI TẠO & TRUY VẤN
    // =========================
    public static function getCartByUserId($user_id)
    {
        $db = Connection::get();
        $stmt = $db->prepare("SELECT cart_id FROM cart WHERE user_id = :user_id");
        $stmt->execute(['user_id' => $user_id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public static function findOrCreate($user_id)
    {
        $db = Connection::get();

        $stmt = $db->prepare("SELECT cart_id FROM cart WHERE user_id = :user_id");
        $stmt->execute(['user_id' => $user_id]);
        $cart = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($cart) {
            return $cart['cart_id']; 
        }

        $stmt = $db->prepare("INSERT INTO cart (user_id, created_at) VALUES (:user_id, NOW())");
        $stmt->execute(['user_id' => $user_id]);

        return $db->lastInsertId();
    }

    public static function getCartItems($cart_id)
    {
        $db = Connection::get();

        $stmt = $db->prepare("
            SELECT 
                ci.variant_id,
                ci.batch_id,
                ci.quantity,
                ci.is_checked,

                pv.price,
                pv.volume,
                pv.packaging_type,

                p.product_id,
                p.product_name,
                p.image_url

            FROM cart_item ci
            JOIN product_variant pv ON ci.variant_id = pv.variant_id
            JOIN product p ON pv.product_id = p.product_id
            WHERE ci.cart_id = :cart_id
        ");

        $stmt->execute(['cart_id' => $cart_id]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // =========================
    // CART ITEM - THÊM, XÓA, CẬP NHẬT
    // =========================
    public static function addItem($cart_id, $variant_id, $quantity, $batch_id = null, $is_checked = 0)
    {
        $db = Connection::get();

        // Kiểm tra xem item đã tồn tại chưa
        $stmt = $db->prepare("
            SELECT * FROM cart_item 
            WHERE cart_id = :cart_id 
              AND variant_id = :variant_id 
              AND (batch_id = :batch_id OR (:batch_id IS NULL AND batch_id IS NULL))
        ");
        $stmt->execute([
            'cart_id' => $cart_id,
            'variant_id' => $variant_id,
            'batch_id' => $batch_id
        ]);
        $item = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($item) {
            // Nếu đã tồn tại → tăng số lượng
            $stmt = $db->prepare("
                UPDATE cart_item 
                SET quantity = quantity + :qty 
                WHERE cart_id = :cart_id 
                  AND variant_id = :variant_id 
                  AND (batch_id = :batch_id OR (:batch_id IS NULL AND batch_id IS NULL))
            ");
            $stmt->execute([
                'qty' => $quantity,
                'cart_id' => $cart_id,
                'variant_id' => $variant_id,
                'batch_id' => $batch_id
            ]);
        } else {
            // Chưa tồn tại → tạo mới
            $stmt = $db->prepare("
                INSERT INTO cart_item (cart_id, variant_id, batch_id, quantity, is_checked)
                VALUES (:cart_id, :variant_id, :batch_id, :quantity, :is_checked)
            ");
            $stmt->execute([
                'cart_id' => $cart_id,
                'variant_id' => $variant_id,
                'batch_id' => $batch_id,
                'quantity' => $quantity,
                'is_checked' => $is_checked
            ]);
        }
    }

    public static function removeItem($cart_id, $variant_id, $batch_id)
    {
        $db = Connection::get();

        $stmt = $db->prepare("
            DELETE FROM cart_item
            WHERE cart_id = :cart_id
              AND variant_id = :variant_id
              AND batch_id = :batch_id
        ");

        $stmt->execute([
            'cart_id'   => $cart_id,
            'variant_id' => $variant_id,
            'batch_id'  => $batch_id
        ]);

        return $stmt->rowCount();
    }

    public static function updateItemQuantity($cart_id, $variant_id, $batch_id, $quantity)
    {
        $db = Connection::get();
        $stmt = $db->prepare("
            UPDATE cart_item
            SET quantity = :quantity
            WHERE cart_id = :cart_id
              AND variant_id = :variant_id
              AND batch_id = :batch_id
        ");
        $stmt->execute([
            'quantity' => $quantity,
            'cart_id' => $cart_id,
            'variant_id' => $variant_id,
            'batch_id' => $batch_id
        ]);
    }

    public static function updateItemStatus($cart_id, $variant_id, $is_checked)
    {
        $db = Connection::get();
        $stmt = $db->prepare("
            UPDATE cart_item 
            SET is_checked = :is_checked 
            WHERE cart_id = :cart_id AND variant_id = :variant_id
        ");
        $stmt->execute([
            'is_checked' => $is_checked ? 1 : 0,
            'cart_id' => $cart_id,
            'variant_id' => $variant_id
        ]);

        return $stmt->rowCount();
    }

    // =========================
    // CART CLEAR
    // =========================
    public static function clearCart($cart_id)
    {
        $db = Connection::get();
        $stmt = $db->prepare("
            DELETE FROM cart_item 
            WHERE cart_id = :cart_id AND is_checked = 1
        ");
        $stmt->execute(['cart_id' => $cart_id]);
    }
}
