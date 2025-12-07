<?php

namespace Controllers;

use Models\User;
use Controllers\AuthController;

class SocialAuthController
{

    /* ============================================
       1. CHUYỂN HƯỚNG NGƯỜI DÙNG SANG GOOGLE LOGIN
    ============================================ */
    public function redirectToGoogle()
    {

        if (!defined('GOOGLE_CLIENT_ID')) {
            die('Lỗi cấu hình: GOOGLE_CLIENT_ID chưa được khai báo');
        }

        $params = [
            'client_id'     => GOOGLE_CLIENT_ID,
            'redirect_uri'  => GOOGLE_REDIRECT_URL,
            'response_type' => 'code',
            'scope'         => 'email profile',
            'access_type'   => 'online'
        ];

        $url = "https://accounts.google.com/o/oauth2/auth?" . http_build_query($params);
        header("Location: $url");
        exit;
    }


    /* ============================================
       2. GOOGLE CALLBACK – NHẬN CODE & LẤY USER INFO
    ============================================ */
    public function handleGoogleCallback()
    {

        // Không có code → lỗi hoặc người dùng hủy
        if (!isset($_GET['code'])) {
            header("Location: http://localhost:3000/login?error=Google_Login_Failed");
            exit;
        }

        // A. Đổi code lấy access_token
        $tokenUrl = "https://oauth2.googleapis.com/token";
        $postData = [
            'code'          => $_GET['code'],
            'client_id'     => GOOGLE_CLIENT_ID,
            'client_secret' => GOOGLE_CLIENT_SECRET,
            'redirect_uri'  => GOOGLE_REDIRECT_URL,
            'grant_type'    => 'authorization_code'
        ];

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $tokenUrl);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($postData));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

        $response = curl_exec($ch);
        curl_close($ch);

        $tokenData = json_decode($response, true);

        if (!isset($tokenData['access_token'])) {
            die("Lỗi: Không lấy được Access Token từ Google. Response: " . $response);
        }

        // B. Lấy thông tin user từ Google
        $userInfoUrl = "https://www.googleapis.com/oauth2/v2/userinfo";

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $userInfoUrl);
        curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer " . $tokenData['access_token']]);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

        $userData = json_decode(curl_exec($ch), true);
        curl_close($ch);

        $avatar = $userData['picture'] ?? null;

        // C. Xử lý login/register
        $this->processSocialLogin(
            $userData['email'],
            $userData['name'],
            'google_id',
            $userData['id'],
            $avatar
        );
    }


    /* ============================================
       3. LOGIC CHUNG: LƯU USER + TẠO JWT TOKEN
    ============================================ */
    private function processSocialLogin($email, $name, $providerField, $socialId, $avatar = null)
    {

        $user = User::findByEmail($email);

        if ($user) {
            // Nếu user có nhưng chưa lưu google_id → cập nhật
            if (empty($user['google_id'])) {
                User::updateGoogleInfo($user['user_id'], $socialId, $avatar);
            }

            $userId = $user['user_id'];
            $roleId = $user['role_id'];
        } else {
            $userId = User::createGoogleUser($name, $email, $socialId, $avatar);
            $roleId = 2;
        }

        $authController = new AuthController();
        $token = $authController->generateToken($userId, $roleId);

        // 3. Redirect về frontend kèm token
        header("Location: http://localhost:3000/login?social_token=" . $token);
        exit;
    }
}
