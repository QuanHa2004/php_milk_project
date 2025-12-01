<?php

namespace Controllers;

use Database\Connection;
use Helpers\Response;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Firebase\JWT\ExpiredException;

class AuthController
{

    public function register($data)
    {
        $db = Connection::get();

        if (empty($data['password']) || empty($data['email'])) {
            Response::json(['error' => 'Email và mật khẩu không được để trống'], 400);
        }

        try {
            $stmt = $db->prepare("SELECT user_id FROM user WHERE email = :email");
            $stmt->execute(['email' => $data['email']]);

            if ($stmt->fetch()) {
                Response::json(['error' => 'Email đã được sử dụng'], 400);
            }

            $password_hash = password_hash($data['password'], PASSWORD_DEFAULT);

            $sql = "INSERT INTO user (full_name, email, password_hash, phone, address, role_id) 
            VALUES (:full_name, :email, :password_hash, :phone, :address, :role_id)";

            $stmt = $db->prepare($sql);

            $stmt->execute([
                'full_name'     => $data['full_name'],
                'email'         => $data['email'],
                'password_hash' => $password_hash,
                'phone'         => $data['phone'] ?? null,
                'address'       => $data['address'] ?? null,
                'role_id'       => 2
            ]);

            Response::json(['message' => 'Đăng ký thành công']);
        } catch (\PDOException $e) {
            Response::json(['error' => 'Lỗi Database: ' . $e->getMessage()], 500);
        } catch (\Exception $e) {
            Response::json(['error' => 'Lỗi hệ thống: ' . $e->getMessage()], 500);
        }
    }

    public function login($data)
    {
        $db = Connection::get();

        $stmt = $db->prepare("SELECT * FROM user WHERE email = :email");
        $stmt->execute(['email' => $data['email']]);
        $user = $stmt->fetch(\PDO::FETCH_ASSOC);

        if (!$user || !password_verify($data['password'], $user['password_hash'])) {
            Response::json(['error' => 'Sai email hoặc mật khẩu'], 401);
        }

        $access_token = JWT::encode([
            'sub' => $user['user_id'],
            'email' => $user['email'],
            'role_id' => $user['role_id'],
            'exp' => time() + 60 * 60
        ], SECRET_KEY, ALGORITHM);

        $refresh_token = JWT::encode([
            'sub' => $user['user_id'],
            'email' => $user['email'],
            'role_id' => $user['role_id'],
            'exp' => time() + 7 * 24 * 60 * 60
        ], REFRESH_SECRET_KEY, ALGORITHM);

        Response::json([
            'access_token' => $access_token,
            'refresh_token' => $refresh_token,
            'token_type' => 'bearer',
            'expires_in' => 60 * 60,
            'role_id' => $user['role_id'],
            'email' => $user['email']
        ]);
    }

    public function decodeToken()
    {
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';

        if (!$authHeader || !preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            throw new \Exception("Token không hợp lệ");
        }

        $token = $matches[1];

        try {
            return JWT::decode($token, new Key(SECRET_KEY, ALGORITHM));
        } catch (ExpiredException $e) {
            throw new \Exception("Token đã hết hạn");
        } catch (\Exception $e) {
            throw new \Exception("Token không hợp lệ");
        }
    }


    public function currentUser()
    {
        $payload = $this->decodeToken();

        $user_id = $payload->sub ?? null;
        if (!$user_id) {
            throw new \Exception("Token không hợp lệ");
        }

        $db = Connection::get();
        $stmt = $db->prepare("SELECT user_id, full_name, email, phone, address, role_id 
                          FROM user 
                          WHERE user_id = :user_id");
        $stmt->execute(['user_id' => $user_id]);
        $user = $stmt->fetch(\PDO::FETCH_ASSOC);

        if (!$user) {
            throw new \Exception("Không tìm thấy người dùng");
        }

        return $user; 
    }


    public function profile()
    {
        try {
            $user = $this->currentUser();
            Response::json($user);
        } catch (\Exception $e) {
            Response::json(['error' => $e->getMessage()], 401);
        }
    }
}
