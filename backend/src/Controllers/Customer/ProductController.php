<?php

namespace Controllers\Customer;

use Models\Product;
use Helpers\Response;

class ProductController
{

    /* ============================
       1. LẤY TẤT CẢ SẢN PHẨM
    ============================ */
    // Trả về toàn bộ danh sách sản phẩm
    public function index()
    {
        return Response::json(Product::all_1());
    }

    /* ============================
       2. LẤY SẢN PHẨM THEO DANH MỤC
    ============================ */
    // Lấy danh sách sản phẩm theo category_id
    public function getByCategory($category_id)
    {
        $products = Product::getByCategory($category_id);
        Response::json($products);
    }

    /* ============================
       3. LẤY CHI TIẾT SẢN PHẨM
    ============================ */
    // Lấy thông tin chi tiết của 1 sản phẩm
    public function detail($product_id)
    {
        $product = Product::find($product_id);

        if (!$product) {
            Response::json(['error' => 'Sản phẩm không tồn tại'], 404);
        }

        Response::json($product);
    }

    /* ============================
       4. TÌM KIẾM SẢN PHẨM
    ============================ */
    // Tìm sản phẩm theo tên
    public function search($search_name)
    {
        $products = Product::searchByName($search_name);

        if (!$products) {
            Response::json(['error' => 'Không tìm thấy sản phẩm'], 404);
        }

        Response::json($products);
    }

    /* ============================
       5. TÍNH TOÁN / LẤY GIÁ BIẾN THỂ
    ============================ */
    public function calculateVariant($data)
    {
        $product_id = $data["product_id"] ?? null;
        $volume = $data["size"] ?? null;        // Mapping từ 'size' (client) sang 'volume' (db)
        $packaging_type = $data["pack"] ?? null; // Mapping từ 'pack' (client) sang 'packaging_type' (db)

        // 1. Validate dữ liệu đầu vào
        if (!$product_id || !$volume || !$packaging_type) {
            return Response::json(['error' => 'Vui lòng chọn đầy đủ phân loại'], 400);
        }

        // 2. Lấy thông tin từ Model
        $variant = Product::getVariantPrice($product_id, $volume, $packaging_type);

        // 3. Kiểm tra nếu không tìm thấy biến thể phù hợp
        if (!$variant) {
            return Response::json(['error' => 'Sản phẩm tạm hết hàng hoặc không tồn tại loại này'], 404);
        }

        // 4. Trả về kết quả
        // Lưu ý: Giá trong DB là giá của đơn vị đóng gói đó (Thùng/Lốc) nên lấy trực tiếp
        return Response::json([
            "success" => true,
            "product_id" => $product_id,
            "variant_id" => $variant['variant_id'], // Quan trọng: Cần ID này để add to cart
            "size" => $volume,
            "pack" => $packaging_type,
            "price" => $variant['price'],           // Giá bán của loại đóng gói này
            "stock" => $variant['stock_quantity']   // Số lượng tồn kho
        ]);
    }
}
