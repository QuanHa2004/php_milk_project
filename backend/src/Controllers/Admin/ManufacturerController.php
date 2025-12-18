<?php

namespace Controllers\Admin;

use Helpers\Response;
use Models\Manufacturer;
use Exception;

class ManufacturerController
{
    public function addManufacturer($data)
    {
        try {
            if (empty($data['manufacturer_name'])) {
                Response::json([
                    'success' => false,
                    'message' => 'Tên nhà sản xuất không được để trống'
                ], 400);
            }

            Manufacturer::create($data);

            Response::json([
                'success' => true,
                'message' => 'Thêm nhà sản xuất thành công'
            ], 201);
        } catch (\Exception $e) {
            Response::json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function getManufacturerList()
    {
        try {
            $manufacturers = Manufacturer::all();

            Response::json([
                'data' => $manufacturers
            ], 200);
        } catch (Exception $e) {
            Response::json([
                'message' => 'Không thể lấy danh sách danh mục',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
