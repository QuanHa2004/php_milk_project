<?php

namespace Models;

use Database\Connection;
use PDO;

class Product {

    public static function all() {
        $db = Connection::get();

        $sql = "
            SELECT 
                p.product_id,
                p.product_name,
                p.category_id,
                c.category_name,
                p.manufacturer_id,
                m.manufacturer_name,
                p.price,
                p.discount_percent,
                p.image_url,
                p.description,
                p.created_at,
                p.is_hot
            FROM product p
            LEFT JOIN category c ON p.category_id = c.category_id
            LEFT JOIN manufacturer m ON p.manufacturer_id = m.manufacturer_id
            WHERE p.is_deleted = 0
            ORDER BY p.product_id DESC
        ";

        $stmt = $db->query($sql);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public static function getByCategory($category_id) {
        $db = Connection::get();

        $sql = "
            SELECT 
                p.product_id,
                p.product_name,
                p.category_id,
                c.category_name,
                p.price,
                p.discount_percent,
                p.image_url,
                p.description,
                p.created_at,
                p.is_hot
            FROM product p
            LEFT JOIN category c ON p.category_id = c.category_id
            WHERE p.category_id = :category_id AND p.is_deleted = 0
            ORDER BY p.product_id DESC
        ";

        $stmt = $db->prepare($sql);
        $stmt->execute(['category_id' => $category_id]);

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public static function find($product_id)
    {
        $db = Connection::get();
        $stmt = $db->prepare("SELECT product_id, product_name, price, image_url, description FROM product WHERE product_id = :product_id");
        $stmt->execute(['product_id' => $product_id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public static function searchByName($search_name)
    {
        $db = Connection::get();
        $stmt = $db->prepare("SELECT product_id, product_name, category_id, manufacturer_id, price, discount_percent, image_url, description FROM product WHERE product_name LIKE :search_name");
        $stmt->execute(['search_name' => "%$search_name%"]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
