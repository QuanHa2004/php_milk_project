<?php

namespace Controllers\Customer;

use Models\Product;
use Helpers\Response;
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

    public function getVolumes()
    {
        try {
            $volumes = Product::getAllVolumes();
            Response::json(['data' => $volumes]);
        } catch (Exception $e) {
            error_log($e->getMessage());
            Response::json(['error' => 'Lỗi server'], 500);
        }
    }

    public function getBrands()
    {
        try {
            // Gọi static method từ Model (xem phần Model bên dưới)
            $brands = Product::getAllBrands();

            // Trả về kết quả JSON
            Response::json([
                'data' => $brands
            ]);
        } catch (Exception $e) {
            error_log($e->getMessage());
            Response::json(['error' => 'Lỗi server khi lấy danh sách thương hiệu'], 500);
        }
    }

    public function getByCategory($category_id)
    {
        $products = Product::getByCategory($category_id);

        Response::json([
            'data' => $products
        ]);
    }

    public function detail($product_id)
    {
        $product = Product::find($product_id);

        if (!$product) {
            Response::json(['error' => 'Sản phẩm không tồn tại'], 404);
        }

        Response::json($product);
    }

    public function search($search_name)
    {
        $products = Product::searchByName($search_name);

        if (!$products) {
            Response::json(['error' => 'Không tìm thấy sản phẩm'], 404);
        }

        Response::json([
            'data' => $products
        ]);
    }

    public function filterProduct($data)
    {
        try {
            // 2. Lấy các tham số (bao gồm cả volume)
            $categoryId = isset($data['category_id']) ? $data['category_id'] : null;
            $brandName = isset($data['brand_name']) ? $data['brand_name'] : null;

            // --- QUAN TRỌNG: Lấy thêm volume ---
            $volume = isset($data['volume']) ? $data['volume'] : null;

            // 3. Gọi Model và truyền ĐỦ 3 tham số
            // Lưu ý: Hàm Product::filter phải được định nghĩa nhận 3 tham số như bạn đã sửa ở Model
            $products = Product::filter($categoryId, $brandName, $volume);

            if ($products === false) {
                Response::json(['error' => 'Lỗi truy vấn dữ liệu'], 500);
                return;
            }

            Response::json([
                'data' => $products
            ]);
        } catch (Exception $e) {
            error_log($e->getMessage());
            Response::json(['error' => 'Lỗi server khi lọc sản phẩm'], 500);
        }
    }
}
