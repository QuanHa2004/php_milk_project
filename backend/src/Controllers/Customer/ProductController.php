<?php

namespace Controllers\Customer;

use Models\Product;
use Helpers\Response;

class ProductController
{

    public function index()
    {
        $products = Product::all_1();

        Response::json([
            'data' => $products
        ]);
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
}
