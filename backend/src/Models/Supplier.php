<?php

namespace Models;

use Database\Connection;
use PDO;
use Exception;

class Supplier
{
    public static function create($data)
    {
        $db = Connection::get();

        // Kiểm tra trùng tên nhà cung cấp
        $check = $db->prepare("
            SELECT supplier_id
            FROM supplier
            WHERE supplier_name = ?
        ");
        $check->execute([$data['supplier_name']]);

        if ($check->fetch()) {
            throw new Exception("Nhà cung cấp đã tồn tại");
        }

        $sql = "
            INSERT INTO supplier
            (supplier_name, email, phone, address)
            VALUES (:supplier_name, :email, :phone, :address)
        ";

        $stmt = $db->prepare($sql);
        $stmt->bindParam(':supplier_name', $data['supplier_name']);
        $stmt->bindParam(':email', $data['email']);
        $stmt->bindParam(':phone', $data['phone']);
        $stmt->bindParam(':address', $data['address']);

        $stmt->execute();

        return $db->lastInsertId();
    }

    public static function all()
    {
        $db = Connection::get();
        $stmt = $db->query("SELECT * FROM supplier ORDER BY supplier_id DESC");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
