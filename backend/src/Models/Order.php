<?php

namespace Models;

use Database\Connection;
use PDO;

class Order
{
    // Tạo đơn hàng chính
    public static function create($user_id, $data, $total_amount)
    {
        $db = Connection::get();
        
        // 1. Xử lý Logic ngày giao hàng
        $delivery_date = $data['delivery_date'] ?? null;

        if (empty($delivery_date)) {
            // Nếu không chọn ngày -> Mặc định là 3 ngày sau
            $delivery_date = date('Y-m-d H:i:s', strtotime('+3 days'));
        } elseif (is_numeric($delivery_date)) {
            // Nếu gửi lên là dạng số (Timestamp như lỗi của bạn: 1764763311) -> Convert sang Date
            $delivery_date = date('Y-m-d H:i:s', $delivery_date);
        }
        // Nếu đã là chuỗi '2025-12-06' thì giữ nguyên

        $sql = "INSERT INTO `order` (user_id, status, delivery_address, delivery_date, order_date, total_amount, is_paid) 
                VALUES (:user_id, 'pending', :delivery_address, :delivery_date, NOW(), :total_amount, 0)";
        
        $stmt = $db->prepare($sql);
        $stmt->execute([
            'user_id' => $user_id,
            'delivery_address' => $data['delivery_address'],
            'delivery_date' => $delivery_date, // Biến đã được format chuẩn MySQL
            'total_amount' => $total_amount
        ]);

        return $db->lastInsertId();
    }

    // Tạo chi tiết đơn hàng
    public static function addDetail($order_id, $product_id, $price, $quantity)
    {
        $db = Connection::get();
        $total_amount = $price * $quantity;

        $sql = "INSERT INTO order_detail (order_id, product_id, price, quantity, total_amount) 
                VALUES (:order_id, :product_id, :price, :quantity, :total_amount)";
        
        $stmt = $db->prepare($sql);
        $stmt->execute([
            'order_id' => $order_id,
            'product_id' => $product_id,
            'price' => $price,
            'quantity' => $quantity,
            'total_amount' => $total_amount
        ]);
    }

    // Tạo thông tin thanh toán
    public static function addPayment($order_id, $payment_method, $amount)
    {
        $db = Connection::get();
        $sql = "INSERT INTO payment (order_id, payment_method, transaction_code, amount, status, payment_date, note) 
                VALUES (:order_id, :payment_method, :transaction_code, :amount, 'pending', NOW(), '')";
        
        // Tạo mã giao dịch ngẫu nhiên
        $transaction_code = strtoupper(uniqid('TRX_'));

        $stmt = $db->prepare($sql);
        $stmt->execute([
            'order_id' => $order_id,
            'payment_method' => $payment_method, // ENUM: 'COD', 'MOMO', 'VNPAY', ...
            'transaction_code' => $transaction_code,
            'amount' => $amount
        ]);
    }
}