<?php

// =========================
// USER
// =========================
if ($uri === "/users/update" && $method === "POST") {
    $user->updateUser(json_decode(file_get_contents('php://input'), true));
    exit;
}

// =========================
// CATEGORY
// =========================
if ($uri === "/categories" && $method === "GET") {
    $category->getCategoryList();
    exit;
}

// =========================
// PRODUCT
// =========================
if ($uri === "/products" && $method === "GET") {
    $product->getProductList();
    exit;
}

if ($uri === "/volumes" && $method === "GET") {
    $product->getVolumes();
    exit;
}

if ($uri === "/brands" && $method === "GET") {
    $product->getBrands();
    exit;
}

if (preg_match("#^/([0-9]+)/products$#", $uri, $matches) && $method === "GET") {
    $product->getByCategory($matches[1]);
    exit;
}

if ($uri === "/products/filter" && $method === "POST") {
    $product->filterProduct(json_decode(file_get_contents('php://input'), true));
    exit;
}

if (preg_match("#^/products/([0-9]+)$#", $uri, $matches) && $method === "GET") {
    $product->detail((int)$matches[1]);
    exit;
}

if (preg_match("#^/products/search/(.*)$#", $uri, $matches) && $method === "GET") {
    $product->search(urldecode($matches[1]));
    exit;
}

// =========================
// CART
// =========================
if ($uri === "/carts/add" && $method === "POST") {
    $cart->add(json_decode(file_get_contents('php://input'), true));
    exit;
}

if ($uri === "/carts/remove" && $method === "DELETE") {
    $cart->remove(json_decode(file_get_contents('php://input'), true));
    exit;
}

if ($uri === "/carts/update" && $method === "PUT") {
    $cart->update(json_decode(file_get_contents('php://input'), true));
    exit;
}

if (preg_match('#^/carts/(\d+)/status$#', $uri, $matches) && $method === "PUT") {
    $cart->updateItemStatus((int)$matches[1], json_decode(file_get_contents('php://input'), true));
    exit;
}

if ($uri === "/carts/current_user" && $method === "GET") {
    $cart->myCart();
    exit;
}

// =========================
// ORDER
// =========================
if ($uri === "/orders/checkout" && $method === "POST") {
    $order->checkout(json_decode(file_get_contents('php://input'), true));
    exit;
}

if ($uri === "/orders/retry" && $method === "POST") {
    $order->retryPayment(json_decode(file_get_contents('php://input'), true));
    exit;
}

if ($uri === "/orders/history" && $method === "GET") {
    $order->orderHistory();
    exit;
}

// =========================
// PAYMENT
// =========================
if ($uri === "/checkout/process-vnpay" && $method === "POST") {
    $payment->createPaymentUrl(json_decode(file_get_contents('php://input'), true));
    exit;
}

if ($uri === "/payment/vnpay_return" && $method === "GET") {
    $payment->vnpayReturn();
    exit;
}

// =========================
// SOCIAL AUTH
// =========================
if ($uri === "/auth/google" && $method === "GET") {
    $socialAuth->redirectToGoogle();
    exit;
}

if ($uri === "/auth/google/callback" && $method === "GET") {
    $socialAuth->handleGoogleCallback();
    exit;
}

// =========================
// REVIEW
// =========================
if ($uri === "/reviews/add" && $method === "POST") {
    $review->addReview(json_decode(file_get_contents('php://input'), true));
    exit;
}

if (preg_match('#^/reviews/(\d+)/(\d+)$#', $uri, $matches) && $method === "GET") {
    $review->getProductReviews((int)$matches[1], (int)$matches[2]);
    exit;
}

// =========================
// PROMOTION
// =========================
if ($uri === "/promotions" && $method === "GET") {
    $promotion->getPromotionList();
    exit;
}
