<?php

namespace Controllers\Admin;

use Helpers\Response;
use Models\User;
use Exception;

class UserController
{
    public function updateStatus($data)
    {
        try {

            if (!isset($data['user_id'], $data['is_deleted'])) {
                return Response::json([
                    'success' => false,
                    'message' => 'Thiếu dữ liệu'
                ], 400);
            }

            $userId = (int)$data['user_id'];
            $status = (int)$data['is_deleted'];

            if (!in_array($status, [0, 1])) {
                return Response::json([
                    'success' => false,
                    'message' => 'Trạng thái không hợp lệ'
                ], 422);
            }

            $user = User::findById($userId);
            if (!$user) {
                return Response::json([
                    'success' => false,
                    'message' => 'Người dùng không tồn tại'
                ], 404);
            }

            User::updateStatus($userId, $status);

            Response::json([
                'success' => true,
                'message' => 'Cập nhật trạng thái người dùng thành công',
                'data' => [
                    'user_id' => $userId,
                    'is_deleted' => $status
                ]
            ], 200);
        } catch (Exception $e) {
            Response::json([
                'success' => false,
                'message' => 'Lỗi hệ thống',
                'error' => $e->getMessage()
            ], 500);
        }
    }

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

    public function getNewUsers()
    {
        try {
            $users = User::newUsers();
            Response::json([
                'success' => true,
                'data' => $users
            ]);
        } catch (Exception $e) {
            Response::json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
