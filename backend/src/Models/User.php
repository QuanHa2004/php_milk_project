<?php

namespace Models;

use Database\Connection;
use PDO;

class User
{

    public static function findByEmail($email)
    {
        $db = Connection::get();
        $stmt = $db->prepare("SELECT * FROM user WHERE email = :email LIMIT 1");
        $stmt->execute(['email' => $email]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public static function create($full_name, $email, $password_hash)
    {
        $db = Connection::get();
        $role_id = 2;

        $sql = "INSERT INTO user (full_name, email, password_hash, role_id, created_at) 
                VALUES (:name, :email, :pass, :role, NOW())";

        $stmt = $db->prepare($sql);
        $stmt->execute([
            'name'  => $full_name,
            'email' => $email,
            'pass'  => $password_hash,
            'role'  => $role_id
        ]);

        return $db->lastInsertId();
    }

    public static function updateGoogleInfo($user_id, $google_id, $avatar_url)
    {
        $db = Connection::get();

        $sql = "UPDATE user 
                SET google_id = :google_id,
                    avatar_url = :avatar_url
                WHERE user_id = :user_id";

        $stmt = $db->prepare($sql);
        $stmt->execute([
            'google_id' => $google_id,
            'avatar_url' => $avatar_url,
            'user_id'   => $user_id
        ]);
    }

    public static function createGoogleUser($fullName, $email, $google_id, $avatar_url)
    {
        $db = Connection::get();
        $role_id = 2;

        $sql = "INSERT INTO user (full_name, email, password_hash, role_id, google_id, avatar_url, created_at) 
                VALUES (:name, :email, NULL, :role, :google_id, :avatar, NOW())";

        $stmt = $db->prepare($sql);
        $stmt->execute([
            'name'      => $fullName,
            'email'     => $email,
            'role'      => $role_id,
            'google_id' => $google_id,
            'avatar'    => $avatar_url
        ]);

        return $db->lastInsertId();
    }

    public static function updateUser($user_id, $data)
    {
        $db = Connection::get();

        if (empty($data)) return false;

        $fields = [];
        $params = [];

        foreach ($data as $key => $value) {
            $allowed = ["full_name", "phone", "address", "avatar_url"];
            if (!in_array($key, $allowed)) continue;

            $fields[] = "$key = ?";
            $params[] = $value;
        }

        if (empty($fields)) return false;

        $params[] = $user_id;

        $sql = "UPDATE user SET " . implode(", ", $fields) . " WHERE user_id = ?";

        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        return $stmt->rowCount();
    }

    public static function all()
    {
        $db = Connection::get();
        $stmt = $db->query("SELECT * FROM user");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public static function newUsers()
    {
        $db = Connection::get();

        $sql = "
            SELECT 
                user_id,
                full_name,
                email,
                phone,
                address,
                avatar_url,
                role_id,
                created_at
            FROM user
            WHERE 
                is_deleted = 0
                AND MONTH(created_at) = MONTH(CURRENT_DATE())
                AND YEAR(created_at) = YEAR(CURRENT_DATE())
            ORDER BY created_at DESC
        ";  

        $stmt = $db->query($sql);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
