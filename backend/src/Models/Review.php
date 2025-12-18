<?php

namespace Models;

use Database\Connection;
use PDO;
use Exception;

class Review
{

    public static function all()
    {
        $db = Connection::get();
        $stmt = $db->query("SELECT * FROM review");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
