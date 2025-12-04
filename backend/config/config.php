<?php

define('SECRET_KEY', getenv('SECRET_KEY') ?: 'mysecretkey');
define('REFRESH_SECRET_KEY', getenv('REFRESH_SECRET_KEY') ?: 'myrefreshsecretkey');
define('ALGORITHM', getenv('ALGORITHM') ?: 'HS256');
define('ACCESS_TOKEN_EXPIRE_MINUTES', intval(getenv('ACCESS_TOKEN_EXPIRE_MINUTES') ?: 60));
define('REFRESH_TOKEN_EXPIRE_DAYS', intval(getenv('REFRESH_TOKEN_EXPIRE_DAYS') ?: 7));


define('DB_HOST', 'localhost');
define('DB_NAME', 'php_milk_project');
define('DB_USER', 'root');
define('DB_PASS', '123456');


define('VNPAY_TMN_CODE', getenv('VNPAY_TMN_CODE') ?: 'RWERB2P2');
define('VNPAY_HASH_SECRET', getenv('VNPAY_HASH_SECRET') ?: '3QAZ7VO3NHAL3X23QCE4CW2EQKVKNRDK');
define('VNPAY_PAYMENT_URL', getenv('VNPAY_PAYMENT_URL') ?: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html');

define('VNPAY_RETURN_URL', getenv('VNPAY_RETURN_URL') ?: 'http://localhost:3000/vnpay-return');
define('VNPAY_IPN_URL', getenv('VNPAY_IPN_URL') ?: 'https://your-ngrok-url.ngrok-free.app/vnpay-ipn');