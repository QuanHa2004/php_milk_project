<?php

namespace Models;

use Database\Connection;
use PDO;
use Exception;

class Invoice
{
    public static function all()
    {
        $db = Connection::get();

        $sql = "
            SELECT 
                i.invoice_id,
                i.supplier_id,
                s.supplier_name,
                i.total_amount,
                i.created_at
            FROM invoice i
            LEFT JOIN supplier s 
                ON i.supplier_id = s.supplier_id
            ORDER BY i.created_at DESC
        ";

        $stmt = $db->query($sql);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }


    public static function createInvoice($data)
    {
        $db = Connection::get();
        try {
            $stmt = $db->prepare("INSERT INTO invoice (supplier_id, total_amount) VALUES (?, ?)");
            $stmt->execute([
                $data['supplier_id'] ?? null,
                $data['total_amount'] ?? 0
            ]);
            return $db->lastInsertId();
        } catch (Exception $e) {
            throw new Exception("Tạo phiếu nhập thất bại: " . $e->getMessage());
        }
    }

    public static function addInvoiceDetail($item)
    {
        $db = Connection::get();
        try {
            $stmt = $db->prepare("INSERT INTO invoice_detail (invoice_id, variant_id, batch_id, quantity, price) VALUES (?, ?, ?, ?, ?)");
            $stmt->execute([
                $item['invoice_id'],
                $item['variant_id'],
                $item['batch_id'] ?? null,
                $item['quantity'],
                $item['price']
            ]);
        } catch (Exception $e) {
            throw new Exception("Thêm chi tiết phiếu nhập thất bại: " . $e->getMessage());
        }
    }
}
