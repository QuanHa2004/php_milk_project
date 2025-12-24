<?php

namespace Models;

use Database\Connection;
use PDO;

class User
{
    // =========================
    // CRUD CƠ BẢN
    // =========================
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

    public static function findById($userId)
    {
        $db = Connection::get();
        $stmt = $db->prepare("SELECT * FROM user WHERE user_id = :id");
        $stmt->execute([':id' => $userId]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public static function findByEmail($email)
    {
        $db = Connection::get();
        $stmt = $db->prepare("SELECT * FROM user WHERE email = :email LIMIT 1");
        $stmt->execute(['email' => $email]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public static function all()
    {
        $db = Connection::get();
        $stmt = $db->query("SELECT * FROM user");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // =========================
    // GOOGLE AUTH
    // =========================
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

    // =========================
    // CẬP NHẬT THÔNG TIN NGƯỜI DÙNG
    // =========================
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

    public static function updateStatus($userId, $status)
    {
        $db = Connection::get();
        $stmt = $db->prepare("
            UPDATE user 
            SET is_deleted = :is_deleted 
            WHERE user_id = :user_id
        ");

        $stmt->execute([
            ':is_deleted' => $status,
            ':user_id' => $userId
        ]);

        return $stmt->rowCount() > 0;
    }

    // =========================
    // OTP & PASSWORD RESET
    // =========================
    public static function saveOtp($user_id, $otp)
    {
        $db = Connection::get();
        $stmt = $db->prepare("
            UPDATE user 
            SET reset_otp = :otp, reset_otp_expire = DATE_ADD(NOW(), INTERVAL 5 MINUTE)
            WHERE user_id = :user_id
        ");
        return $stmt->execute([
            'otp' => $otp,
            'user_id' => $user_id
        ]);
    }

    public static function clearOtp($user_id)
    {
        $db = Connection::get();
        $stmt = $db->prepare("
            UPDATE user 
            SET reset_otp = NULL, reset_otp_expire = NULL
            WHERE user_id = :user_id
        ");
        return $stmt->execute(['user_id' => $user_id]);
    }

    public static function updatePassword($user_id, $hashedPassword)
    {
        $db = Connection::get();
        $stmt = $db->prepare("
            UPDATE user 
            SET password_hash = :password, updated_at = NOW() 
            WHERE user_id = :user_id
        ");
        return $stmt->execute([
            'password' => $hashedPassword,
            'user_id' => $user_id
        ]);
    }

    // =========================
    // TRUY VẤN DANH SÁCH
    // =========================
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
