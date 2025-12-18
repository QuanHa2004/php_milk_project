<?php

namespace Controllers\Admin;

use Helpers\Response;
use Models\Product;
use Exception;

class ProductController
{
    public function getProductList()
    {
        try {
            $product = Product::all();

            Response::json([
                'data' => $product
            ], 200);
        } catch (Exception $e) {
            Response::json([
                'message' => 'Không thể lấy danh sách sản phẩm',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function addProduct($data)
    {
        try {
            if (!$data) {
                Response::json([
                    'message' => 'Dữ liệu gửi lên không hợp lệ'
                ], 400);
                return;
            }

            // Validate bắt buộc
            if (empty($data['product_name']) || empty($data['category_id'])) {
                Response::json([
                    'message' => 'Tên sản phẩm và danh mục là bắt buộc'
                ], 422);
                return;
            }

            $productId = Product::create($data);

            Response::json([
                'message' => 'Thêm sản phẩm thành công',
                'product_id' => $productId
            ], 201);
        } catch (Exception $e) {
            Response::json([
                'message' => 'Lỗi khi thêm sản phẩm',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
