<?php

namespace Models;

use Database\Connection;
use PDO;

class Category
{

    public static function all()
    {
        $db = Connection::get();
        $stmt = $db->query("SELECT * FROM category ORDER BY category_id DESC");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public static function create($name)
    {
        $db = Connection::get();

        $sql = "INSERT INTO category (category_name) VALUES (:name)";
        $stmt = $db->prepare($sql);
        $stmt->execute(['name' => $name]);

        return $db->lastInsertId();
    }

    public static function exists($name)
    {
        $db = Connection::get();
        $stmt = $db->prepare("SELECT category_id FROM category WHERE category_name = :name");
        $stmt->execute(['name' => $name]);
        return $stmt->fetch();
    }
}
