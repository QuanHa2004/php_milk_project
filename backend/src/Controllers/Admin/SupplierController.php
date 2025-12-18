<?php

namespace Controllers\Admin;

use Helpers\Response;
use Models\Supplier;
use Exception;

class SupplierController
{
    public function addSupplier($data)
    {
        try {
            if (empty($data['supplier_name'])) {
                Response::json([
                    'success' => false,
                    'message' => 'Tên nhà cung cấp không được để trống'
                ], 400);
            }

            $supplierData = [
                'supplier_name' => trim($data['supplier_name']),
                'email'   => $data['email']   ?? null,
                'phone'   => $data['phone']   ?? null,
                'address' => $data['address'] ?? null
            ];

            $supplierId = Supplier::create($supplierData);

            Response::json([
                'success' => true,
                'message' => 'Thêm nhà cung cấp thành công',
                'supplier_id' => $supplierId
            ], 201);
        } catch (Exception $e) {
            Response::json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function getSupplierList()
    {
        try {
            $supplier = Supplier::all();

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
