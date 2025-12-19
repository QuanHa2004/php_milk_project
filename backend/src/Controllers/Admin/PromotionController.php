<?php

namespace Controllers\Admin;

use Controllers\AuthController;
use Helpers\Response;
use Models\Promotion;
use Exception;

class PromotionController {
    public function addPromotion($data) {
        try {

            $auth = new AuthController(); 
            $currentUser = $auth->currentUser(); 

            $data['created_by'] = $currentUser['user_id']; 

            if (empty($data['promo_code']) || empty($data['discount_value']) || empty($data['start_date']) || empty($data['end_date'])) {
                Response::json(['success' => false, 'error' => 'Vui lòng điền đầy đủ thông tin bắt buộc'], 400);
                return;
            }

            if (strtotime($data['end_date']) <= strtotime($data['start_date'])) {
                Response::json(['success' => false, 'error' => 'Ngày kết thúc phải sau ngày bắt đầu'], 400);
                return;
            }

            if (($data['discount_type'] ?? 'percent') === 'fixed') {
                $data['max_discount_value'] = $data['discount_value'];
            }

            $promo_id = Promotion::create($data);

            Response::json(['success' => true, 'promo_id' => $promo_id]);

        } catch (\Exception $e) {
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