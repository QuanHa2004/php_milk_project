<?php

namespace Controllers\Customer;

use Helpers\Response;
use Controllers\AuthController;
use Models\User;

class UserController
{
    private $user_id;

    private function authenticate()
    {
        $auth = new AuthController();
        try {
            $payload = $auth->decodeToken();
            $this->user_id = $payload->sub;
        } catch (\Exception $e) {
            Response::json(['error' => $e->getMessage()], 401);
        }
    }

    public function updateUser($data)
    {
        $this->authenticate();

        if (!$data) {
            Response::json(["error" => "Không có dữ liệu"], 400);
        }

        $updateData = [];

        if (isset($data["full_name"])) {
            $updateData["full_name"] = $data["full_name"];
        }

        if (isset($data["phone"])) {
            $updateData["phone"] = $data["phone"];
        }

        if (isset($data["address"])) {
            $updateData["address"] = $data["address"];
        }

        $updated = User::updateUser($this->user_id, $updateData);

        if ($updated > 0) {
            Response::json(["message" => "Cập nhật thành công"], 200);
        } else {
            Response::json([
                "message" => "Không thay đổi"
            ], 200);
        }
    }
}
