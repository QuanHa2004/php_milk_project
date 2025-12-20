<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

// Xử lý preflight
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

// Lấy URI & method
$uri    = strtok($_SERVER["REQUEST_URI"], '?');
$method = $_SERVER["REQUEST_METHOD"];

// Load cấu hình & autoload
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../vendor/autoload.php';

// Khởi tạo controller
$auth       = new Controllers\AuthController();
$socialAuth = new Controllers\SocialAuthController();
$user       = new Controllers\Customer\UserController();
$category   = new Controllers\Customer\CategoryController();
$product    = new Controllers\Customer\ProductController();
$cart       = new Controllers\Customer\CartController();
$order      = new Controllers\Customer\OrderController();
$payment    = new Controllers\Customer\PaymentController();
$review     = new Controllers\Customer\ReviewController();
$promotion  = new Controllers\Customer\PromotionController();


$orderAdmin        = new Controllers\Admin\OrderController();
$categoryAdmin     = new Controllers\Admin\CategoryController();
$manufacturerAdmin = new Controllers\Admin\ManufacturerController();
$supplierAdmin     = new Controllers\Admin\SupplierController();
$productAdmin      = new Controllers\Admin\ProductController();
$invoiceAdmin      = new Controllers\Admin\InvoiceController();
$promotionAdmin    = new Controllers\Admin\PromotionController();
$userAdmin         = new Controllers\Admin\UserController();
$reviewAdmin       = new Controllers\Admin\ReviewController();

// Load route
require_once __DIR__ . '/../src/Routes/api.php';

// Mặc định: không tìm thấy route
http_response_code(404);
echo json_encode(["error" => "Không tìm thấy đường dẫn"]);
exit;
