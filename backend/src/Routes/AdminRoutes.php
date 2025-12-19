<?php

if ($uri === "/admin/total-revenue" && $method === "GET") {
    $orderAdmin->getMonthlyRevenue();
    exit;
}

if ($uri === "/admin/new-customer" && $method === "GET") {
    $userAdmin->getNewUsers();
    exit;
}

if ($uri === "/admin/orders" && $method === "GET") {
    $orderAdmin->getOrderList();
    exit;
}


if ($uri === "/admin/orders" && $method === "GET") {
    $orderAdmin->getOrderList();
    exit;
}

if ($uri === "/admin/users" && $method === "GET") {
    $userAdmin->getUserList();
    exit;
}

if ($uri === "/admin/reviews" && $method === "GET") {
    $reviewAdmin->getReviewList();
    exit;
}

if ($uri === "/admin/categories" && $method === "GET") {
    $categoryAdmin->getCategoryList();
    exit;
}

if ($uri === "/admin/manufacturers" && $method === "GET") {
    $manufacturerAdmin->getManufacturerList();
    exit;
}

if ($uri === "/admin/suppliers" && $method === "GET") {
    $supplierAdmin->getSupplierList();
    exit;
}

if ($uri === "/admin/products" && $method === "GET") {
    $productAdmin->getProductList();
    exit;
}

if ($uri === "/admin/promotions" && $method === "GET") {
    $promotionAdmin->getPromotionList();
    exit;
}

if ($uri === "/admin/invoices" && $method === "GET") {
    $invoiceAdmin->getInvoiceList();
    exit;
}




// =========================
// ADMIN POST ROUTES
// =========================
if ($uri === "/admin/categories/add" && $method === "POST") {
    $categoryAdmin->addCategory(json_decode(file_get_contents('php://input'), true));
    exit;
}

if ($uri === "/admin/products/add" && $method === "POST") {
    $productAdmin->addProduct(json_decode(file_get_contents('php://input'), true));
    exit;
}

if ($uri === "/admin/manufacturers/add" && $method === "POST") {
    $manufacturerAdmin->addManufacturer(json_decode(file_get_contents('php://input'), true));
    exit;
}

if ($uri === "/admin/suppliers/add" && $method === "POST") {
    $supplierAdmin->addSupplier(json_decode(file_get_contents('php://input'), true));
    exit;
}

if ($uri === "/admin/invoices/add" && $method === "POST") {
    $invoiceAdmin->addInvoice(json_decode(file_get_contents('php://input'), true));
    exit;
}

if ($uri === "/admin/promotions/add" && $method === "POST") {
    $promotionAdmin->addPromotion(json_decode(file_get_contents('php://input'), true));
    exit;
}
