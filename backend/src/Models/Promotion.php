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
}
