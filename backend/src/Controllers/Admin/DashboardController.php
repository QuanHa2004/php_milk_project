<?php

namespace Controllers\Admin;

use Database\Connection;
use Helpers\Response;
use PDO;

class DashboardController
{

    public function getReport()
    {
        $db = Connection::get();

        $current_month = date('m');
        $current_year = date('Y');

        $report_sql = "
            SELECT 
                SUM(total_amount) as total_revenue,
                COUNT(order_id) as total_orders
            FROM `order`
            WHERE 
                MONTH(order_date) = :month AND 
                YEAR(order_date) = :year;
        ";

        $stmt = $db->prepare($report_sql);
        $stmt->execute(['month' => $current_month, 'year' => $current_year]);
        $report = $stmt->fetch(PDO::FETCH_ASSOC);

        $total_revenue = floatval($report['total_revenue'] ?? 0);
        $total_orders = intval($report['total_orders'] ?? 0);

        $customer_sql = "
            SELECT COUNT(user_id) as new_customer
            FROM `user`
            WHERE 
                role_id = 2 AND 
                MONTH(created_at) = :month AND 
                YEAR(created_at) = :year;
        ";

        $stmt = $db->prepare($customer_sql);
        $stmt->execute(['month' => $current_month, 'year' => $current_year]);
        $new_customer_data = $stmt->fetch(PDO::FETCH_ASSOC);
        $new_customer = intval($new_customer_data['new_customer'] ?? 0);


        $avg_value = ($total_orders > 0) ? ($total_revenue / $total_orders) : 0;

        Response::json([
            "total_revenue" => round($total_revenue, 2),
            "total_orders" => $total_orders,
            "new_customer" => $new_customer,
            "avg_value" => round($avg_value, 2),
        ]);
    }

    public function getOrders()
    {
        $db = Connection::get();

        $sql = "
            SELECT 
                o.order_id,
                u.full_name,
                o.order_date,
                o.total_amount,
                o.status
            FROM `order` o
            JOIN `user` u ON o.user_id = u.user_id
            WHERE u.is_deleted = 0
            ORDER BY o.order_date DESC;
        ";

        $stmt = $db->query($sql);
        $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

        Response::json($orders);
    }

    public function getCategories()
    {
        $db = Connection::get();

        $sql = "
            SELECT 
                c.category_id, 
                c.category_name,
                COALESCE(SUM(p.quantity), 0) AS quantity
            FROM category c
            LEFT JOIN product p 
                ON c.category_id = p.category_id AND p.is_deleted = 0
            GROUP BY c.category_id, c.category_name 
            ORDER BY c.category_id;
        ";

        $stmt = $db->query($sql);
        $categories = $stmt->fetchAll(\PDO::FETCH_ASSOC); // Đảm bảo dùng \PDO hoặc use PDO

        Response::json($categories);
    }

    public function getProducts()
    {
        $db = Connection::get();

        $sql = "
            SELECT 
                product_id,
                product_name,
                price,
                is_deleted,
                is_hot,
                quantity,      
                created_at
            FROM product
            ORDER BY product_id DESC;
        ";

        $stmt = $db->query($sql);
        $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

        Response::json($products);
    }
}
