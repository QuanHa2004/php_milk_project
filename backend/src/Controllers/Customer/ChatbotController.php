<?php

namespace Controllers\Customer;

use Services\AIClient;
use Models\Product;
use Helpers\Response;

class ChatbotController
{
    private $aiClient;
    private $productModel;

    public function __construct()
    {
        $this->aiClient = new AIClient();
        $this->productModel = new Product();
    }

    /**
     * @param array $data Dữ liệu đã được decode từ index.php
     */
    public function consult($data)
    {
        $userMessage = $data['message'] ?? '';

        if (empty($userMessage)) {
            return Response::json(['error' => 'Vui lòng nhập tin nhắn'], 400);
        }

        // 1. Lấy context sản phẩm từ Database
        // Bạn có thể lọc bớt thông tin (chỉ lấy name, price, description) để tiết kiệm Token cho AI
        $products = $this->productModel->all();
        $context = "Danh sách sản phẩm sữa hiện có tại cửa hàng:\n";

        foreach ($products as $p) {
            $context .= "- ID: {$p['id']}, Tên: {$p['name']}, Giá: {$p['price']}đ, Mô tả: {$p['description']}\n";
        }

        // 2. Xây dựng Prompt
        $prompt = "Bạn là trợ lý ảo tư vấn sữa thông minh. Dựa trên ngữ cảnh sau:\n$context\n\n" .
            "Câu hỏi của khách: '$userMessage'\n\n" .
            "Hãy phản hồi bằng định dạng JSON (chỉ trả về JSON, không kèm văn bản khác) với cấu trúc:\n" .
            "{\n" .
            "  \"reply\": \"Nội dung tư vấn cho khách\",\n" .
            "  \"suggested_ids\": [mảng các ID sản phẩm phù hợp]\n" .
            "}";

        // 3. Gọi Service AI
        try {
            $aiResult = $this->aiClient->generateResponse($prompt);

            // Ollama trả về nội dung AI nằm trong key 'response'
            $rawResponse = $aiResult['response'] ?? '{}';

            // Decode nội dung AI trả về (vì ta ép AI trả về JSON string)
            $parsedResponse = json_decode($rawResponse, true);

            if (!$parsedResponse) {
                // Trường hợp AI không trả về đúng format JSON
                return Response::json([
                    'reply' => $rawResponse, // Trả về text thô nếu không parse được
                    'suggested_ids' => []
                ]);
            }

            return Response::json($parsedResponse);
        } catch (\Exception $e) {
            return Response::json(['error' => 'Lỗi kết nối AI: ' . $e->getMessage()], 500);
        }
    }
}
