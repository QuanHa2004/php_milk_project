<?php

namespace Controllers\Admin;

use Helpers\Response;
use Models\Order;
use Exception;

class OrderController
{

    public function getOrderList()
    {
        try {
            $orders = Order::all();

            Response::json([
                'data' => $orders
            ], 200);
        } catch (Exception $e) {
            Response::json([
                'message' => 'Không thể lấy danh sách đơn hàng',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getMonthlyRevenue()
    {
        try {
            $data = Order::totalRevenueAndOrders();
            Response::json([
                'success' => true,
                'data' => $data
            ]);
        } catch (Exception $e) {
            Response::json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
