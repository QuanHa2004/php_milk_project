<?php

if ($uri === "/register" && $method === "POST") {
    $auth->register(json_decode(file_get_contents('php://input'), true));
    exit;
}

if ($uri === "/login" && $method === "POST") {
    $auth->login(json_decode(file_get_contents('php://input'), true));
    exit;
}

if ($uri === "/current_user" && $method === "GET") {
    $auth->profile();
    exit;
}

if ($uri === "/auth/forgot-password" && $method === "POST") {
    $auth->forgotPassword(json_decode(file_get_contents('php://input'), true));
    exit;
}

if ($uri === "/auth/verify-otp" && $method === "POST") {
    $auth->verifyOtp(json_decode(file_get_contents('php://input'), true));
    exit;
}

if ($uri === "/auth/reset-password" && $method === "POST") {
    $auth->resetPassword(json_decode(file_get_contents('php://input'), true));
    exit;
}


