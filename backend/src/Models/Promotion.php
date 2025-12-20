<?php

namespace Models;

use Database\Connection;
use PDO;
use Exception;

class Promotion
{
    public static function create($data)
    {
        $db = Connection::get();

        try {
            $stmt = $db->prepare("
                INSERT INTO promotion 
                (promo_code, description, discount_type, discount_value, max_discount_value, min_order_value, max_uses, start_date, end_date, is_active, created_by)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ");

            $stmt->execute([
                $data['promo_code'],
                $data['description'] ?? null,
                $data['discount_type'] ?? null,
                $data['discount_value'],
                $data['max_discount_value'],
                $data['min_order_value'],
                $data['max_uses'] ?? null,
                $data['start_date'],
                $data['end_date'],
                (int)($data['is_active'] ?? 1),
                $data['created_by'] ?? null
            ]);

            return $db->lastInsertId();
        } catch (Exception $e) {
            throw new Exception("Tạo mã giảm giá thất bại: " . $e->getMessage());
        }
    }

    public static function all()
    {
        $db = Connection::get();
        $stmt = $db->query("SELECT * FROM promotion");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public static function userPromotion($user_id)
    {
        $db = Connection::get();

        $stmt = $db->prepare("
            SELECT p.*
            FROM promotion p
            LEFT JOIN user_promotion up
                ON p.promo_id = up.promo_id
                AND up.user_id = :user_id
            WHERE p.is_active = 1
            AND p.start_date <= NOW()
            AND p.end_date >= NOW()
            AND up.user_promotion_id IS NULL
            AND (p.max_uses IS NULL OR p.uses_count < p.max_uses)
            ORDER BY p.end_date ASC
        ");

        $stmt->execute([
            'user_id' => $user_id
        ]);

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public static function validatePromotion($code, $user_id, $order_total)
    {
        $db = Connection::get();

        $stmt = $db->prepare("
            SELECT *
            FROM promotion
            WHERE promo_code = ?
            AND is_active = 1
            AND start_date <= NOW()
            AND end_date >= NOW()
            AND (max_uses IS NULL OR uses_count < max_uses)
            AND min_order_value <= ?
        ");
        $stmt->execute([$code, $order_total]);

        $promo = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$promo) return false;

        $stmt = $db->prepare("
            SELECT 1 FROM user_promotion
            WHERE user_id = ? AND promo_id = ?
        ");
        $stmt->execute([$user_id, $promo['promo_id']]);

        if ($stmt->fetch()) return false;

        return $promo;
    }


    public static function calculateDiscount($promo, $order_total)
    {
        if ($promo['discount_type'] === 'percent') {
            $discount = $order_total * ($promo['discount_value'] / 100);
            return min($discount, $promo['max_discount_value']);
        }

        return min($promo['discount_value'], $order_total);
    }

    public static function increaseUsage($promo_id)
    {
        $db = Connection::get();
        $stmt = $db->prepare("
            UPDATE promotion
            SET uses_count = uses_count + 1
            WHERE promo_id = ?
        ");
        $stmt->execute([$promo_id]);
    }

    public static function markUsed($user_id, $promo_id)
    {
        $db = Connection::get();
        $stmt = $db->prepare("
            INSERT INTO user_promotion (user_id, promo_id)
            VALUES (?, ?)
        ");
        $stmt->execute([$user_id, $promo_id]);
    }

    public static function updateStatus($promo_id, $is_active)
    {
        $db = Connection::get();

        $sql = "
            UPDATE promotion
            SET is_active = :is_active
            WHERE promo_id = :promo_id
        ";

        $stmt = $db->prepare($sql);
        $stmt->execute([
            'promo_id' => $promo_id,
            'is_active' => $is_active
        ]);

        return $stmt->rowCount();
    }
}
