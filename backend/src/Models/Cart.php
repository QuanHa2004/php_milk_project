<?php

namespace Models;

use Database\Connection;
use PDO;

class Cart
{
    public static function getCartByUserId($user_id)
    {
        $db = Connection::get();
        $stmt = $db->prepare("SELECT cart_id FROM cart WHERE user_id = :user_id");
        $stmt->execute(['user_id' => $user_id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public static function createCart($user_id)
    {
        $db = Connection::get();
        $stmt = $db->prepare("INSERT INTO cart (user_id) VALUES (:user_id)");
        $stmt->execute(['user_id' => $user_id]);
        return $db->lastInsertId();
    }

    public static function getCartItems($cart_id)
    {
        $db = Connection::get();
        $stmt = $db->prepare("
            SELECT ci.quantity, ci.is_checked, p.product_id, p.product_name, p.description, p.image_url, p.price
            FROM cart_item ci
            JOIN product p ON ci.product_id = p.product_id
            WHERE ci.cart_id = :cart_id
        ");
        $stmt->execute(['cart_id' => $cart_id]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public static function addItem($cart_id, $product_id, $quantity)
    {
        $db = Connection::get();

        $stmt = $db->prepare("SELECT * FROM cart_item WHERE cart_id = :cart_id AND product_id = :product_id");
        $stmt->execute(['cart_id' => $cart_id, 'product_id' => $product_id]);
        $item = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($item) {
            $stmt = $db->prepare("UPDATE cart_item SET quantity = quantity + :qty WHERE cart_id = :cart_id AND product_id = :product_id");
            $stmt->execute(['qty' => $quantity, 'cart_id' => $cart_id, 'product_id' => $product_id]);
        } else {
            $stmt = $db->prepare("INSERT INTO cart_item (cart_id, product_id, quantity, is_checked) VALUES (:cart_id, :product_id, :quantity, 0)");
            $stmt->execute(['cart_id' => $cart_id, 'product_id' => $product_id, 'quantity' => $quantity]);
        }
    }

    public static function removeItem($cart_id, $product_id)
    {
        $db = Connection::get();
        $stmt = $db->prepare("DELETE FROM cart_item WHERE cart_id = :cart_id AND product_id = :product_id");
        $stmt->execute(['cart_id' => $cart_id, 'product_id' => $product_id]);
        return $stmt->rowCount();
    }

    public static function updateItemQuantity($cart_id, $product_id, $quantity)
    {
        $db = Connection::get();
        if ($quantity <= 0) {
            return self::removeItem($cart_id, $product_id);
        }

        $stmt = $db->prepare("UPDATE cart_item SET quantity = :quantity WHERE cart_id = :cart_id AND product_id = :product_id");
        $stmt->execute(['quantity' => $quantity, 'cart_id' => $cart_id, 'product_id' => $product_id]);
        return $stmt->rowCount();
    }

    public static function updateItemStatus($cart_id, $product_id, $is_checked)
    {
        $db = Connection::get();
        $stmt = $db->prepare("UPDATE cart_item SET is_checked = :is_checked WHERE cart_id = :cart_id AND product_id = :product_id");
        $stmt->execute([
            'is_checked' => $is_checked ? 1 : 0,
            'cart_id' => $cart_id,
            'product_id' => $product_id
        ]);
        return $stmt->rowCount();
    }
}
