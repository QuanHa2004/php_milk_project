<?php

namespace Controllers\Admin;

use Helpers\Response;
use Models\Review;
use Exception;

class ReviewController
{


    public function getReviewList()
    {
        try {
            $supplier = Review::all();

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
