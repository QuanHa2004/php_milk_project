<?php

// 1. Hàm đọc file .env và nạp vào môi trường
$envPath = __DIR__ . '/../.env';

if (file_exists($envPath)) {
    $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        // Bỏ qua dòng comment
        if (strpos(trim($line), '#') === 0) continue;

        // Tách Key và Value
        if (strpos($line, '=') !== false) {
            list($name, $value) = explode('=', $line, 2);
            $name = trim($name);
            $value = trim($value);

            // Nạp vào biến môi trường
            putenv(sprintf('%s=%s', $name, $value));
            $_ENV[$name] = $value;
            $_SERVER[$name] = $value;
        }
    }
}

// Token
define('SECRET_KEY', getenv('SECRET_KEY') ?: 'mysecretkey');
define('REFRESH_SECRET_KEY', getenv('REFRESH_SECRET_KEY') ?: 'myrefreshsecretkey');
define('ALGORITHM', getenv('ALGORITHM') ?: 'HS256');
define('ACCESS_TOKEN_EXPIRE_MINUTES', intval(getenv('ACCESS_TOKEN_EXPIRE_MINUTES') ?: 60));
define('REFRESH_TOKEN_EXPIRE_DAYS', intval(getenv('REFRESH_TOKEN_EXPIRE_DAYS') ?: 7));


// Database
define('DB_HOST', 'localhost');
define('DB_NAME', 'milk_project');
define('DB_USER', 'root');
define('DB_PASS', '123456');


// VNPay
define('VNPAY_TMN_CODE', getenv('VNPAY_TMN_CODE') ?: 'RWERB2P2');
define('VNPAY_HASH_SECRET', getenv('VNPAY_HASH_SECRET') ?: '9IVACPOL7QYROWDQ5I5M2MTJX6VQPEF1');
define('VNPAY_PAYMENT_URL', getenv('VNPAY_PAYMENT_URL') ?: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html');
define('VNPAY_RETURN_URL', getenv('VNPAY_RETURN_URL') ?: 'http://localhost:8000/payment/vnpay_return');
define('VNPAY_IPN_URL', getenv('VNPAY_IPN_URL') ?: 'https://your-ngrok-url.ngrok-free.app/vnpay-ipn');


// Google auth account
define('GOOGLE_CLIENT_ID', getenv('GOOGLE_CLIENT_ID'));
define('GOOGLE_CLIENT_SECRET', getenv('GOOGLE_CLIENT_SECRET'));
define('GOOGLE_REDIRECT_URL', getenv('GOOGLE_REDIRECT_URL'));
