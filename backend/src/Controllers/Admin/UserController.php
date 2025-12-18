<?php

namespace Controllers\Admin;

use Helpers\Response;
use Models\User;
use Exception;

class UserController
{

    public function getUserList()
    {
        try {
            $user = User::all();

            Response::json([
                'data' => $user
            ], 200);
        } catch (Exception $e) {
            Response::json([
                'message' => 'Không thể lấy danh sách khách hàng',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
