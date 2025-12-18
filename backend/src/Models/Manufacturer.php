<?php 

namespace Models;

use Database\Connection;
use PDO;
use Exception;

class Manufacturer{
    public static function create($data){
        $db = Connection::get();

        $check = $db->prepare("
            SELECT manufacturer_id 
            FROM manufacturer 
            WHERE manufacturer_name = ?
        ");
        $check->execute([$data['manufacturer_name']]);

        if ($check->fetch()) {
            throw new Exception("Nhà sản xuất đã tồn tại");
        }

        $sql = "
            INSERT INTO manufacturer 
            (manufacturer_name, email, phone, address)
            VALUES (:manufacturer_name, :email, :phone, :address)
        ";

        $stmt = $db->prepare($sql);
        $stmt->bindParam(':manufacturer_name', $data['manufacturer_name']);
        $stmt->bindParam(':email', $data['email']);
        $stmt->bindParam(':phone', $data['phone']);
        $stmt->bindParam(':address', $data['address']);

        $stmt->execute();

        return $db->lastInsertId();
    }

    public static function all()
    {
        $db = Connection::get();
        $stmt = $db->query("SELECT * FROM manufacturer ORDER BY manufacturer_id DESC");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}