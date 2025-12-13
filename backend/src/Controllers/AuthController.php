<?php

namespace Controllers;

use Database\Connection;
use Helpers\Response;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Firebase\JWT\ExpiredException;
use Models\Cart;

class AuthController
{
     /* ============================================
         1. TẠO TOKEN (dùng cho login + social login)
     ============================================ */
     // Generate a short-lived JWT access token for a user
     public function generateToken($userId, $roleId, $email = null)
    {
        $payload = [
            'sub'      => $userId,
            'role_id'  => $roleId,
            'email'    => $email,
            'iat'      => time(),
            'exp'      => time() + ACCESS_TOKEN_EXPIRE_MINUTES * 60
        ];

        return JWT::encode($payload, SECRET_KEY, ALGORITHM);
    }


     /* ============================================
         2. AUTH TRUYỀN THỐNG (REGISTER + LOGIN)
     ============================================ */
     // Register a new user or link a Google account to an existing user
     public function register($data)
    {
        $db = Connection::get();

        if (empty($data['password']) || empty($data['email']) || empty($data['full_name'])) {
            Response::json(['error' => 'Vui lòng điền đầy đủ thông tin'], 400);
        }

        try {
            // 1. Kiểm tra xem email đã có trong hệ thống chưa
            $stmt = $db->prepare("SELECT * FROM user WHERE email = :email");
            $stmt->execute(['email' => $data['email']]);
            $existingUser = $stmt->fetch(\PDO::FETCH_ASSOC);

            $password_hash = password_hash($data['password'], PASSWORD_DEFAULT);

            if ($existingUser) {
                // TRƯỜNG HỢP 1: Tài khoản đã có (do Google) nhưng CHƯA có mật khẩu
                // => Cho phép cập nhật mật khẩu để trở thành tài khoản thường
                if (empty($existingUser['password_hash'])) {

                    $sql = "UPDATE user SET 
                            full_name = :full_name, 
                            password_hash = :password_hash, 
                            phone = :phone, 
                            address = :address 
                            WHERE user_id = :user_id";

                    $stmt = $db->prepare($sql);
                    $stmt->execute([
                        'full_name'     => $data['full_name'],
                        'password_hash' => $password_hash,
                        'phone'         => $data['phone'] ?? null,
                        'address'       => $data['address'] ?? null,
                        'user_id'       => $existingUser['user_id']
                    ]);

                    // Đảm bảo giỏ hàng tồn tại (an toàn)
                    \Models\Cart::findOrCreate($existingUser['user_id']);

                    Response::json(['message' => 'Liên kết tài khoản thành công!']);
                    return;
                }

                // TRƯỜNG HỢP 2: Tài khoản đã có và ĐÃ có mật khẩu
                Response::json(['error' => 'Email này đã được sử dụng'], 400);
            }

            // TRƯỜNG HỢP 3: Tài khoản chưa tồn tại => INSERT mới (Logic cũ)
            $sql = "INSERT INTO user (full_name, email, password_hash, phone, address, role_id, created_at) 
                    VALUES (:full_name, :email, :password_hash, :phone, :address, 2, NOW())";

            $stmt = $db->prepare($sql);
            $stmt->execute([
                'full_name'     => $data['full_name'],
                'email'         => $data['email'],
                'password_hash' => $password_hash,
                'phone'         => $data['phone'] ?? null,
                'address'       => $data['address'] ?? null
            ]);

            // Tạo giỏ hàng
            $newUserId = $db->lastInsertId();
            Cart::findOrCreate($newUserId);

            Response::json(['message' => 'Đăng ký thành công']);
        } catch (\PDOException $e) {
            Response::json(['error' => 'Lỗi Database: ' . $e->getMessage()], 500);
        } catch (\Exception $e) {
            Response::json(['error' => 'Lỗi hệ thống: ' . $e->getMessage()], 500);
        }
    }

    // Authenticate user and return access/refresh tokens
    public function login($data)
    {
        $db = Connection::get();

        $stmt = $db->prepare("SELECT * FROM user WHERE email = :email");
        $stmt->execute(['email' => $data['email']]);
        $user = $stmt->fetch(\PDO::FETCH_ASSOC);

        if (!$user) {
            Response::json(['error' => 'Email không tồn tại'], 401);
        }

        // Không cho login nếu là tài khoản Google
        if (empty($user['password_hash'])) {
            Response::json(['error' => 'Tài khoản này được tạo bằng Google. Vui lòng đăng nhập bằng Google.'], 400);
        }

        if (!password_verify($data['password'], $user['password_hash'])) {
            Response::json(['error' => 'Mật khẩu không đúng'], 401);
        }

        $access_token = $this->generateToken($user['user_id'], $user['role_id'], $user['email']);

        $refresh_token = JWT::encode([
            'sub' => $user['user_id'],
            'exp' => time() + REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60
        ], REFRESH_SECRET_KEY, ALGORITHM);

        Response::json([
            'message'       => 'Đăng nhập thành công',
            'access_token'  => $access_token,
            'refresh_token' => $refresh_token,
            'token_type'    => 'bearer',
            'user' => [
                'id'        => $user['user_id'],
                'full_name' => $user['full_name'],
                'email'     => $user['email'],
                'role_id'   => $user['role_id'],
                'avatar'    => $user['avatar_url']
            ]
        ]);
    }


    /* 
    ============================================
    HELPER: LẤY TOKEN TỪ HEADER AN TOÀN
    → Hỗ trợ lấy Authorization header trên mọi server
    ============================================
    */
    // Extract bearer token from request headers in a portable way
    private function getBearerToken() 
    {
        $headers = null;

        // Lấy từ $_SERVER
        if (isset($_SERVER['Authorization'])) {
            $headers = trim($_SERVER["Authorization"]);
        }
        else if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
            $headers = trim($_SERVER["HTTP_AUTHORIZATION"]);
        } 
        // Lấy từ Apache
        else if (function_exists('apache_request_headers')) {
            $requestHeaders = apache_request_headers();
            $requestHeaders = array_combine(array_map('ucwords', array_keys($requestHeaders)), array_values($requestHeaders));
            
            if (isset($requestHeaders['Authorization'])) {
                $headers = trim($requestHeaders['Authorization']);
            }
        }

        // Tách token từ chuỗi "Bearer xxx"
        if (!empty($headers)) {
            if (preg_match('/Bearer\s(\S+)/', $headers, $matches)) {
                return $matches[1];
            }
        }

        return null;
    }


    /* 
    ============================================
    3. GIẢI MÃ TOKEN (Middleware)
    → Kiểm tra token hợp lệ, hết hạn, decode payload
    ============================================
    */
    // Decode and validate the JWT access token
    public function decodeToken()
    {
        $token = $this->getBearerToken();

        if (!$token) {
            throw new \Exception("Token không được cung cấp");
        }

        try {
            return JWT::decode($token, new Key(SECRET_KEY, ALGORITHM));
        } catch (ExpiredException $e) {
            throw new \Exception("Token đã hết hạn, vui lòng đăng nhập lại");
        } catch (\Exception $e) {
            throw new \Exception("Token không hợp lệ");
        }
    }


    /* 
    ============================================
    4. LẤY THÔNG TIN USER (CURRENT + PROFILE)
    ============================================
    */
    // Return current user info decoded from token
    public function currentUser()
    {
        $payload = $this->decodeToken();
        $user_id = $payload->sub ?? null;

        if (!$user_id) {
            throw new \Exception("Token không chứa thông tin User ID");
        }

        $db = Connection::get();
        $stmt = $db->prepare("
            SELECT user_id, full_name, email, phone, address, role_id, avatar_url, google_id 
            FROM user 
            WHERE user_id = :user_id
        ");
        $stmt->execute(['user_id' => $user_id]);
        $user = $stmt->fetch(\PDO::FETCH_ASSOC);

        if (!$user) {
            throw new \Exception("Người dùng không tồn tại");
        }

        return $user;
    }

    // API endpoint: return authenticated user's profile
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
