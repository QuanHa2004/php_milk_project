<?php

namespace Models;

use Database\Connection;
use PDO;

class Category {

    public static function all() {
        $db = Connection::get();
        $stmt = $db->query("SELECT * FROM category ORDER BY category_id DESC");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
