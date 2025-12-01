<?php

define('SECRET_KEY', getenv('SECRET_KEY') ?: 'mysecretkey');
define('REFRESH_SECRET_KEY', getenv('REFRESH_SECRET_KEY') ?: 'myrefreshsecretkey');
define('ALGORITHM', getenv('ALGORITHM') ?: 'HS256');
define('ACCESS_TOKEN_EXPIRE_MINUTES', intval(getenv('ACCESS_TOKEN_EXPIRE_MINUTES') ?: 60));
define('REFRESH_TOKEN_EXPIRE_DAYS', intval(getenv('REFRESH_TOKEN_EXPIRE_DAYS') ?: 7));

define('DB_HOST', 'localhost');
define('DB_NAME', 'milk_project');
define('DB_USER', 'root');
define('DB_PASS', '123456');