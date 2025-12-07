<?php

namespace Controllers\Customer;

use Models\Order;
use Models\Product; // Để cộng lại kho khi thanh toán thất bại
use Models\Cart;    // Để xóa giỏ hàng khi thanh toán thành công

class PaymentController
{
    /* ============================================
       1. TẠO URL THANH TOÁN VNPAY
    ============================================ */
    // Tạo link thanh toán dựa trên order_id + amount
    public function createPaymentUrl($data)
    {
        if (empty($data['order_id']) || empty($data['amount'])) {
            return null;
        }

        $orderId   = $data['order_id'];
        $amount    = $data['amount'];
        $orderDesc = $data['order_desc'] ?? "Thanh toan don hang #$orderId";

        $vnp_TxnRef = $orderId . '_' . date('His');
        $vnp_Amount = $amount * 100;

        $inputData = [
            "vnp_Version"   => "2.1.0",
            "vnp_TmnCode"   => VNPAY_TMN_CODE,
            "vnp_Amount"    => $vnp_Amount,
            "vnp_Command"   => "pay",
            "vnp_CreateDate" => date('YmdHis'),
            "vnp_CurrCode"  => "VND",
            "vnp_IpAddr"    => $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1',
            "vnp_Locale"    => "vn",
            "vnp_OrderInfo" => $orderDesc,
            "vnp_OrderType" => "billpayment",
            "vnp_ReturnUrl" => VNPAY_RETURN_URL,
            "vnp_TxnRef"    => $vnp_TxnRef
        ];

        ksort($inputData);

        $query = "";
        $hashdata = "";
        $i = 0;

        foreach ($inputData as $key => $value) {
            $hashdata .= ($i ? '&' : '') . urlencode($key) . "=" . urlencode($value);
            $query    .= urlencode($key) . "=" . urlencode($value) . '&';
            $i = 1;
        }

        $vnp_Url = VNPAY_PAYMENT_URL . "?" . $query;

        if (defined('VNPAY_HASH_SECRET')) {
            $vnpSecureHash = hash_hmac('sha512', $hashdata, VNPAY_HASH_SECRET);
            $vnp_Url .= 'vnp_SecureHash=' . $vnpSecureHash;
        }

        return $vnp_Url;
    }


    /* ============================================
       2. XỬ LÝ KHI VNPAY GỌI TRẢ VỀ (RETURN URL)
    ============================================ */
    // Kiểm tra chữ ký, cập nhật đơn hàng, xử lý kho & giỏ hàng
    public function vnpayReturn()
    {
        if (empty($_GET['vnp_SecureHash'])) {
            die("Truy cập không hợp lệ");
        }

        // Lấy dữ liệu VNPay trả về
        $vnp_SecureHash = $_GET['vnp_SecureHash'];
        $inputData = [];

        foreach ($_GET as $key => $value) {
            if (substr($key, 0, 4) == "vnp_") {
                $inputData[$key] = $value;
            }
        }

        unset($inputData['vnp_SecureHash']);
        ksort($inputData);

        // Tạo chuỗi hash
        $hashData = "";
        $i = 0;
        foreach ($inputData as $key => $value) {
            $hashData .= ($i ? '&' : '') . urlencode($key) . "=" . urlencode($value);
            $i = 1;
        }

        // So sánh chữ ký
        $secureHash = hash_hmac('sha512', $hashData, VNPAY_HASH_SECRET);

        if ($secureHash == $vnp_SecureHash) {

            // Lấy order_id từ mã giao dịch
            $parts = explode('_', $_GET['vnp_TxnRef']);
            $order_id = intval($parts[0]);

            $vnp_ResponseCode = $_GET['vnp_ResponseCode'];
            $vnp_TransactionNo = $_GET['vnp_TransactionNo'];
            $vnp_BankCode = $_GET['vnp_BankCode'];
            $vnp_Amount = $_GET['vnp_Amount'] / 100;

            // 1. Ghi log thanh toán
            Order::addPaymentLog(
                $order_id,
                'VNPAY',
                $vnp_Amount,
                $vnp_ResponseCode == '00' ? 'SUCCESS' : 'FAILED',
                [
                    'transaction_code' => $vnp_TransactionNo,
                    'bank_code'        => $vnp_BankCode,
                    'response_code'    => $vnp_ResponseCode,
                    'note'             => 'VNPay Return'
                ]
            );

            /* ============================
               THÀNH CÔNG
            ============================ */
            if ($vnp_ResponseCode == '00') {

                // A. Cập nhật trạng thái đơn hàng
                Order::updateStatus($order_id, 'processing', true);

                // B. Xóa sản phẩm khỏi giỏ hàng
                $order = Order::find($order_id);
                if ($order) {
                    $cart = Cart::getCartByUserId($order['user_id']);
                    if ($cart) {
                        $orderDetails = Order::getDetails($order_id);
                        foreach ($orderDetails as $detail) {
                            Cart::removeItem($cart['cart_id'], $detail['product_id']);
                        }
                    }
                }

                header("Location: http://localhost:3000/checkout/success?order_id=$order_id&error_code=$vnp_ResponseCode");
                exit;
            }

            /* ============================
               THẤT BẠI
            ============================ */ else {

                // A. Hủy đơn hàng
                Order::updateStatus($order_id, 'cancelled', false);

                // B. Trả hàng về kho
                $orderDetails = Order::getDetails($order_id);
                foreach ($orderDetails as $detail) {
                    Product::increaseStock($detail['product_id'], $detail['quantity']);
                }

                // C. Giữ nguyên giỏ hàng

                header("Location: http://localhost:3000/checkout/failed?order_id=$order_id&error_code=$vnp_ResponseCode");
                exit;
            }
        } else {
            echo "Sai chữ ký bảo mật (Invalid Signature)";
        }
    }
}
