<?php

namespace Controllers\Customer;

use Helpers\Response;
use Controllers\AuthController;
use Models\Promotion;
use Exception;
use Database\Connection;

class PromotionController
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

    public function getPromotionList()
    {
        $this->authenticate();

        try {
            $promotion = Promotion::userPromotion($this->user_id);

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

    public function usePromotion($data)
    {
        $this->authenticate();

        $promo_code = $data['promo_code'] ?? null;
        $order_total = $data['order_total'] ?? 0;

        if (!$promo_code) {
            Response::json(['message' => 'Thiếu mã giảm giá'], 400);
        }

        $db = Connection::get();

        try {
            $db->beginTransaction();

            $promotion = Promotion::validatePromotion(
                $promo_code,
                $this->user_id,
                $order_total
            );

            if (!$promotion) {
                throw new Exception("Mã giảm giá không hợp lệ hoặc đã hết lượt");
            }

            Promotion::markUsed($this->user_id, $promotion['promo_id']);
            Promotion::increaseUsage($promotion['promo_id']);

            $discount = Promotion::calculateDiscount($promotion, $order_total);

            $db->commit();

            Response::json([
                'success' => true,
                'promo_id' => $promotion['promo_id'],
                'discount' => $discount
            ], 200);
        } catch (Exception $e) {
            $db->rollBack();

            Response::json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }
}
