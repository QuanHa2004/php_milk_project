<?php

namespace Controllers\Admin;

use Controllers\AuthController;
use Helpers\Response;
use Models\Promotion;
use Exception;

class PromotionController {
    public function addPromotion($data) {
        try {
            // --- BƯỚC 1: LẤY USER TỪ TOKEN ---
            // Khởi tạo AuthController để dùng hàm currentUser()
            $auth = new AuthController(); 
            
            // Hàm này sẽ tự throw Exception nếu token lỗi hoặc hết hạn
            // Nó trả về mảng user (bao gồm user_id)
            $currentUser = $auth->currentUser(); 

            // Gán user_id lấy từ token vào data
            $data['created_by'] = $currentUser['user_id']; 

            // --- BƯỚC 2: VALIDATE DỮ LIỆU ---
            if (empty($data['promo_code']) || empty($data['discount_value']) || empty($data['start_date']) || empty($data['end_date'])) {
                Response::json(['success' => false, 'error' => 'Vui lòng điền đầy đủ thông tin bắt buộc'], 400);
                return;
            }

            // Logic kiểm tra ngày tháng...
            if (strtotime($data['end_date']) <= strtotime($data['start_date'])) {
                Response::json(['success' => false, 'error' => 'Ngày kết thúc phải sau ngày bắt đầu'], 400);
                return;
            }

            // Xử lý mặc định
            if (($data['discount_type'] ?? 'percent') === 'fixed') {
                $data['max_discount_value'] = $data['discount_value'];
            }

            // --- BƯỚC 3: GỌI MODEL ---
            $promo_id = Promotion::create($data);

            Response::json(['success' => true, 'promo_id' => $promo_id]);

        } catch (\Exception $e) {
            // Nếu lỗi do Token (hết hạn/không hợp lệ), trả về 401
            if ($e->getMessage() === "Token đã hết hạn, vui lòng đăng nhập lại" || $e->getMessage() === "Token không hợp lệ") {
                Response::json(['success' => false, 'error' => $e->getMessage()], 401);
            } else {
                Response::json(['success' => false, 'error' => $e->getMessage()], 500);
            }
        }
    }

    public function getPromotionList()
    {
        try {
            $promotion = Promotion::all();

            Response::json([
                'data' => $promotion
            ], 200);
        } catch (Exception $e) {
            Response::json([
                'message' => 'Không thể lấy danh sách mã giảm giá',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}