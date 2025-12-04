<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

$uri = strtok($_SERVER["REQUEST_URI"], '?');
$method = $_SERVER["REQUEST_METHOD"];

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../vendor/autoload.php';

$auth       = new Controllers\AuthController();
$category   = new Controllers\Customer\CategoryController();
$product    = new Controllers\Customer\ProductController();
$cart       = new Controllers\Customer\CartController();
$order      = new Controllers\Customer\OrderController();
$dashboard  = new Controllers\Admin\DashboardController();

require_once __DIR__ . '/../src/Routes/api.php';

http_response_code(404);
echo json_encode(["error" => "Route not found - Kiểm tra lại đường dẫn hoặc method"]);
exit;
