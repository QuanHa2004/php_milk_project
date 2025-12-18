<?php

namespace Controllers\Admin;

use Helpers\Response;
use Models\Category;
use Exception;

class CategoryController
{
    public function addCategory($data)
    {
        if (empty($data['category_name'])) {
            Response::json(['error' => 'Vui lòng nhập tên danh mục'], 400);
        }

        $name = trim($data['category_name']);

        try {
            if (Category::exists($name)) {
                Response::json(['error' => 'Tên danh mục này đã tồn tại'], 409);
            }

            $id = Category::create($name);

            Response::json([
                'message' => 'Thêm danh mục thành công',
                'category_id' => $id
            ]);
        } catch (\PDOException $e) {
            Response::json(['error' => 'Lỗi cơ sở dữ liệu: ' . $e->getMessage()], 500);
        } catch (\Exception $e) {
            Response::json(['error' => 'Lỗi hệ thống: ' . $e->getMessage()], 500);
        }
    }

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
