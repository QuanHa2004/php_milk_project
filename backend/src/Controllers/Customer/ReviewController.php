<?php

namespace Controllers\Customer;

use Controllers\AuthController;
use Helpers\Response;
use Models\Review;
use Exception;

class ReviewController
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

    public function addReview($data)
    {
        $this->authenticate();

        try {

            if (
                empty($data['variant_id']) ||
                empty($data['rating'])
            ) {
                throw new Exception('Thiếu dữ liệu đánh giá');
            }

            $reviewData = [
                'variant_id' => (int) $data['variant_id'],
                'user_id'    => $this->user_id, 
                'rating'     => (int) $data['rating'],
                'comment'    => trim($data['comment'] ?? '')
            ];

            $reviewId = Review::create($reviewData);

            Response::json([
                'success' => true,
                'message' => 'Thêm nhà cung cấp thành công',
                'review_id' => $reviewId
            ], 201);
        } catch (Exception $e) {
            Response::json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function getProductReviews($product_id, $variant_id)
    {
        try {
            $supplier = Review::getReviews($product_id, $variant_id);

            Response::json([
                'data' => $supplier
            ], 200);
        } catch (Exception $e) {
            Response::json([
                'message' => 'Không thể lấy danh sách danh mục',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
