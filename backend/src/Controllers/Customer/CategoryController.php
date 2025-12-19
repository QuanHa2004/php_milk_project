<?php

namespace Controllers\Customer;

use Models\Category;
use Helpers\Response;
use Exception;

class CategoryController {

    public function getCategoryList()
    {
        try {
            $categories = Category::all();

            Response::json([
                'data' => $categories
            ], 200);
        } catch (Exception $e) {
            Response::json([
                'message' => 'Không thể lấy danh sách danh mục',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
