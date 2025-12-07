<?php

namespace Database;

use PDO;

class Connection
{
    // Singleton PDO instance
    private static $instance = null;

    // Lấy kết nối database (chỉ tạo 1 lần)
    public static function get()
    {
        if (!self::$instance) {
            self::$instance = new PDO(
                "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8",
                DB_USER,
                DB_PASS,
                [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
            );
        }
        return self::$instance;
    }
}
