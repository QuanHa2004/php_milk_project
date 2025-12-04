<?php

// Category routes

if ($uri === "/categories" && $method === "GET") {
    $category->index();
    exit;
}

// Product routes

if ($uri === "/products" && $method === "GET") {
    $product->index();
    exit;
}

if (preg_match("#^/([0-9]+)/products$#", $uri, $matches) && $method === "GET") {
    $product->getByCategory($matches[1]);
    exit;
}

if (preg_match("#^/products/([0-9]+)$#", $uri, $matches) && $method === "GET") {
    $product_id = intval($matches[1]);
    $product->detail($product_id);
    exit;
}

if (preg_match("#^/products/search/(.+)$#", $uri, $matches) && $method === "GET") {
    $product->search(urldecode($matches[1]));
    exit;
}

// Cart routes

if ($uri === "/carts/add" && $method === "POST") {
    $cart->add(json_decode(file_get_contents('php://input'), true));
    exit;
}

if (preg_match("#^/carts/remove/([0-9]+)$#", $uri, $matches) && $method === "DELETE") {
    $cart->remove(intval($matches[1]));
    exit;
}

if ($uri === "/carts/update" && $method === "PUT") {
    $cart->update(json_decode(file_get_contents('php://input'), true));
    exit;
}

if (preg_match('#^/carts/(\d+)/status$#', $uri, $matches) && $method === "PUT") {
    
    $product_id = (int)$matches[1];

    $data = json_decode(file_get_contents('php://input'), true);
    $cart->updateItemStatus($product_id, $data);
    exit;
}

if ($uri === "/carts/current_user" && $method === "GET") {
    $cart->myCart();
    exit;
}

// Order routes
if ($uri === "/orders/checkout" && $method === "POST") {
    $data = json_decode(file_get_contents('php://input'), true);
    $order->checkout($data);
    exit;
}
