<?php

namespace Models;

use Database\Connection;
use PDO;
use PDOException;

class Product
{
    /* ============================
       1. LẤY TẤT CẢ SẢN PHẨM
    ============================ */
    // Trả về danh sách sản phẩm (kèm tên danh mục)
    public static function all()
    {
        $db = Connection::get();

        $sql = "SELECT 
                p.product_id,
                p.product_name,
                p.category_id,
                c.category_name,
                p.image_url,
                p.description,
                p.created_at,
                p.is_hot,
                MIN(v.price) as price,
                SUM(v.stock_quantity) as quantity
            FROM product p
            LEFT JOIN category c ON p.category_id = c.category_id
            LEFT JOIN product_variant v ON p.product_id = v.product_id
            WHERE p.is_deleted = 0
            GROUP BY p.product_id
            ORDER BY p.product_id DESC";

        return $db->query($sql)->fetchAll(PDO::FETCH_ASSOC);
    }


    /* ============================
       2. LẤY SẢN PHẨM THEO DANH MỤC
    ============================ */
    // Lấy danh sách sản phẩm theo category_id
    public static function getByCategory($category_id)
    {
        $db = Connection::get();

        $sql = "
            SELECT 
                p.product_id,
                p.product_name,
                p.category_id,
                c.category_name,
                p.price,
                p.quantity,
                p.discount_percent,
                p.image_url,
                p.description,
                p.created_at,
                p.is_hot
            FROM product p
            LEFT JOIN category c ON p.category_id = c.category_id
            WHERE p.category_id = :category_id AND p.is_deleted = 0
            ORDER BY p.product_id DESC
        ";

        $stmt = $db->prepare($sql);
        $stmt->execute(['category_id' => $category_id]);

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }


    /* ============================
       3. LẤY CHI TIẾT SẢN PHẨM
    ============================ */
    // Lấy thông tin sản phẩm + product_detail
    public static function find($product_id)
    {
        $db = Connection::get();

        // =================================================================
        // BƯỚC 1: Lấy thông tin chung sản phẩm và chi tiết (Giữ nguyên)
        // =================================================================
        $sql = "
        SELECT 
            p.*, 
            pd.origin, pd.ingredients, pd.`usage`, pd.storage,
            pd.calories, pd.protein, pd.fat, pd.carbohydrates, pd.sugar,
            pd.vitamins, pd.minerals, pd.other_nutrients
        FROM product p
        LEFT JOIN product_detail pd ON p.product_id = pd.product_id
        WHERE p.product_id = :product_id AND p.is_deleted = 0
    ";

        $stmt = $db->prepare($sql);
        $stmt->execute(['product_id' => $product_id]);
        $product = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$product) return null;

        // =================================================================
        // BƯỚC 2: Lấy danh sách các biến thể (Variants) (Giữ nguyên)
        // =================================================================
        $sqlVariants = "
        SELECT 
            v.variant_id, 
            v.variant_name, 
            v.volume, 
            v.packaging_type, 
            v.price, 
            v.stock_quantity
        FROM product_variant v
        WHERE v.product_id = :product_id AND v.is_active = 1
        ORDER BY v.price ASC
    ";

        $stmtVariants = $db->prepare($sqlVariants);
        $stmtVariants->execute(['product_id' => $product_id]);
        $variants = $stmtVariants->fetchAll(PDO::FETCH_ASSOC);

        // Nếu không có biến thể nào, trả về luôn để tránh lỗi bước 3
        if (empty($variants)) {
            $product['variants'] = [];
            return $product;
        }

        // =================================================================
        // BƯỚC 3: TỐI ƯU - Lấy Batch cho TẤT CẢ variant chỉ bằng 1 query
        // =================================================================

        // 3.1. Lấy danh sách tất cả variant_id
        $variantIds = array_column($variants, 'variant_id');

        // 3.2. Tạo chuỗi placeholder (?,?,?) cho câu lệnh SQL IN
        $placeholders = str_repeat('?,', count($variantIds) - 1) . '?';

        // 3.3. Truy vấn lấy tất cả batch còn hàng của các variant này
        // Sắp xếp theo Expiration Date tăng dần để lô hết hạn trước lên đầu
        $sqlBatch = "
        SELECT batch_id, variant_id, quantity, expiration_date
        FROM product_batch
        WHERE variant_id IN ($placeholders) AND quantity > 0
        ORDER BY expiration_date ASC, batch_id ASC
    ";

        $stmtBatch = $db->prepare($sqlBatch);
        $stmtBatch->execute($variantIds);
        $allBatches = $stmtBatch->fetchAll(PDO::FETCH_ASSOC);

        // 3.4. Xử lý logic ghép Batch vào Variant ngay trong PHP (Nhanh hơn gọi DB nhiều lần)

        // Tạo mảng tạm để lưu batch tốt nhất cho mỗi variant
        // Key là variant_id, Value là thông tin batch
        $bestBatches = [];

        foreach ($allBatches as $batch) {
            $vId = $batch['variant_id'];
            // Vì SQL đã ORDER BY expiration_date ASC, nên batch đầu tiên xuất hiện 
            // trong vòng lặp chính là batch có HSD gần nhất (FIFO).
            // Ta chỉ lấy cái đầu tiên, các cái sau bỏ qua.
            if (!isset($bestBatches[$vId])) {
                $bestBatches[$vId] = $batch;
            }
        }

        // 3.5. Gán thông tin batch vào mảng variants ban đầu
        foreach ($variants as &$variant) {
            $vId = $variant['variant_id'];

            if (isset($bestBatches[$vId])) {
                $b = $bestBatches[$vId];
                $variant['batch_id'] = $b['batch_id'];
                $variant['batch_quantity'] = $b['quantity'];
                $variant['batch_expiration'] = $b['expiration_date'];
            } else {
                // Trường hợp variant đó không có batch nào còn hàng
                $variant['batch_id'] = null;
                $variant['batch_quantity'] = 0;
                $variant['batch_expiration'] = null;
            }
        }

        $product['variants'] = $variants;
        return $product;
    }



    /* ============================
       4. TÌM KIẾM SẢN PHẨM
    ============================ */
    // Tìm sản phẩm theo tên
    public static function searchByName($search_name)
    {
        $db = Connection::get();
        $search_name = trim($search_name);
        $sql = "SELECT product_id, product_name, category_id, price, quantity, discount_percent, image_url, description 
            FROM product 
            WHERE product_name LIKE :search_name 
            AND is_deleted = 0";
        $stmt = $db->prepare($sql);
        $stmt->execute(['search_name' => "%$search_name%"]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }


    /* ============================
       5. CẬP NHẬT KHO (TĂNG / GIẢM)
    ============================ */
    // Cộng số lượng kho
    public static function increaseStock($variant_id, $quantity, $batch_id)
    {
        $db = Connection::get();

        // 1. Trả lại số lượng cho batch
        $stmtBatch = $db->prepare("
        UPDATE product_batch
        SET quantity = quantity + :quantity
        WHERE batch_id = :batch_id
    ");

        if (!$stmtBatch->execute([
            'quantity' => $quantity,
            'batch_id' => $batch_id
        ])) {
            return false;
        }

        // 2. Trả lại tổng tồn kho cho variant
        $stmtVariant = $db->prepare("
        UPDATE product_variant
        SET stock_quantity = stock_quantity + :quantity
        WHERE variant_id = :variant_id
    ");

        return $stmtVariant->execute([
            'quantity' => $quantity,
            'variant_id' => $variant_id
        ]);
    }


    // Trừ số lượng kho (chỉ trừ khi đủ hàng)
    public static function decreaseStock($variant_id, $quantity)
    {
        $db = Connection::get();

        // Lấy batch còn hàng, hạn dùng sớm nhất
        $stmt = $db->prepare("
        SELECT batch_id, quantity
        FROM product_batch
        WHERE variant_id = :variant_id
          AND quantity > 0
        ORDER BY expiration_date ASC
        FOR UPDATE
    ");
        $stmt->execute(['variant_id' => $variant_id]);
        $batches = $stmt->fetchAll();

        $remain = $quantity;

        foreach ($batches as $batch) {
            if ($remain <= 0) break;

            $deduct = min($batch['quantity'], $remain);

            $db->prepare("
            UPDATE product_batch
            SET quantity = quantity - :deduct
            WHERE batch_id = :batch_id
        ")->execute([
                'deduct'   => $deduct,
                'batch_id' => $batch['batch_id']
            ]);

            $remain -= $deduct;
        }

        if ($remain > 0) {
            return false; // Không đủ hàng trong batch
        }

        // Cập nhật tổng tồn kho variant
        $db->prepare("
        UPDATE product_variant
        SET stock_quantity = stock_quantity - :quantity
        WHERE variant_id = :variant_id
    ")->execute([
            'quantity'   => $quantity,
            'variant_id' => $variant_id
        ]);

        return true;
    }



    /* ============================
       6. TẠO SẢN PHẨM MỚI
    ============================ */
    // Tạo sản phẩm + product_detail trong transaction
    public static function create($data)
    {
        $db = Connection::get();

        try {
            $db->beginTransaction();

            /* --- A. INSERT PRODUCT --- */
            $sqlProduct = "
                INSERT INTO product (
                    product_name, category_id, price, quantity,
                    discount_percent, image_url, description, is_hot, created_at
                ) VALUES (
                    :name, :cat_id, :price, :qty,
                    :discount, :img, :desc, :is_hot, NOW()
                )
            ";

            $stmt = $db->prepare($sqlProduct);
            $stmt->execute([
                'name'      => $data['product_name'],
                'cat_id'    => $data['category_id'],
                'price'     => $data['price'],
                'qty'       => $data['quantity'],
                'discount'  => $data['discount_percent'] ?? 0,
                'img'       => $data['image_url'] ?? null,
                'desc'      => $data['description'] ?? null,
                'is_hot'    => !empty($data['is_hot']) ? 1 : 0
            ]);

            $productId = $db->lastInsertId();


            /* --- B. INSERT PRODUCT_DETAIL --- */
            $vitamins = !empty($data['vitamins']) ? json_encode($data['vitamins'], JSON_UNESCAPED_UNICODE) : null;
            $minerals = !empty($data['minerals']) ? json_encode($data['minerals'], JSON_UNESCAPED_UNICODE) : null;

            $sqlDetail = "
                INSERT INTO product_detail (
                    product_id, origin, ingredients, `usage`, storage,
                    calories, protein, fat, carbohydrates, sugar,
                    vitamins, minerals, other_nutrients
                ) VALUES (
                    :id, :origin, :ingredients, :usage, :storage,
                    :cal, :prot, :fat, :carb, :sugar,
                    :vit, :min, :other
                )
            ";

            $stmtDetail = $db->prepare($sqlDetail);
            $stmtDetail->execute([
                'id'          => $productId,
                'origin'      => $data['origin'] ?? null,
                'ingredients' => $data['ingredients'] ?? null,
                'usage'       => $data['usage'] ?? null,
                'storage'     => $data['storage'] ?? null,
                'cal'         => $data['calories'] ?? 0,
                'prot'        => $data['protein'] ?? 0,
                'fat'         => $data['fat'] ?? 0,
                'carb'        => $data['carbohydrates'] ?? 0,
                'sugar'       => $data['sugar'] ?? 0,
                'vit'         => $vitamins,
                'min'         => $minerals,
                'other'       => $data['other_nutrients'] ?? null
            ]);

            $db->commit();
            return $productId;
        } catch (PDOException $e) {
            $db->rollBack();
            throw $e;
        }
    }

    public static function getVariantPrice($product_id, $volume, $packaging_type)
    {
        $db = Connection::get();

        $sql = "
        SELECT variant_id, price, stock_quantity 
        FROM product_variant 
        WHERE product_id = :product_id 
        AND volume = :volume 
        AND packaging_type = :packaging_type
        AND is_active = 1
        LIMIT 1
    ";

        $stmt = $db->prepare($sql);
        $stmt->execute([
            'product_id' => $product_id,
            'volume' => $volume,
            'packaging_type' => $packaging_type
        ]);

        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}
