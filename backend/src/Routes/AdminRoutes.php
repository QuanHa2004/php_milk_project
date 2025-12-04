<?php

if ($uri === "/admin/reports" && $method === "GET") {
    $dashboard->getReport();
    exit;
}

if ($uri === "/admin/orders" && $method === "GET") {
    $dashboard->getOrders();
    exit;
}

if ($uri === "/admin/categories" && $method === "GET") {
    $dashboard->getCategories();
    exit;
}

if ($uri === "/admin/products" && $method === "GET") {
    $dashboard->getProducts();
    exit;
}
