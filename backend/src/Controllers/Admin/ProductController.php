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

    public function addVariant($data)
    {
        try {
            // 1. Validate dữ liệu đầu vào
            if (!$data) {
                Response::json(['message' => 'Dữ liệu không hợp lệ'], 400);
                return;
            }

            // Validate các trường bắt buộc đối với Biến thể
            if (empty($data['product_id']) || empty($data['price']) || empty($data['variant_name'])) {
                Response::json([
                    'message' => 'Vui lòng nhập đầy đủ: Sản phẩm gốc, Tên biến thể và Giá bán'
                ], 422);
                return;
            }

            // 2. Gọi Model để xử lý logic thêm mới
            $variantId = Product::createVariant($data);

            // 3. Trả về thành công
            Response::json([
                'message' => 'Thêm biến thể thành công',
                'variant_id' => $variantId
            ], 201);
        } catch (Exception $e) {
            // Xử lý lỗi (ví dụ: lỗi trùng lặp từ Model ném ra)
            $statusCode = ($e->getCode() === 409) ? 409 : 500; // 409: Conflict

            Response::json([
                'message' => 'Lỗi: ' . $e->getMessage(),
                'error' => $e->getMessage()
            ], $statusCode);
        }
    }
}
