<?php

namespace Services;

class AIClient
{
    private $ollama_url = "http://localhost:11434/api/generate";
    private $model = "qwen2.5:7b";

    public function generateResponse($prompt)
    {
        $data = [
            "model" => $this->model,
            "prompt" => $prompt,
            "stream" => false,
            "format" => "json" // Để dễ dàng bóc tách dữ liệu
        ];

        $ch = curl_init($this->ollama_url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);

        $response = curl_exec($ch);
        curl_close($ch);

        return json_decode($response, true);
    }
}
