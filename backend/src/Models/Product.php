<?php

namespace Models;

use Database\Connection;
use PDO;
use Exception;

class Product
{
    /* =====================================================
     * 1. LIST / FILTER – DANH SÁCH & TÌM KIẾM SẢN PHẨM
     * ===================================================== */

    public static function all()
    {
        $db = Connection::get();

        $sql = "
            SELECT 
                p.product_id,
                p.product_name,
                p.category_id,
                c.category_name,
                p.image_url,
                p.description,
                p.is_deleted,
                p.is_hot,

            (
                SELECT SUM(pb.quantity)
                FROM product_variant pv
                JOIN product_batch pb ON pb.variant_id = pv.variant_id
                WHERE pv.product_id = p.product_id
                AND pv.is_active = 1
            ) AS total_stock,

            (
                SELECT MIN(price)
                FROM product_variant
                WHERE product_id = p.product_id AND is_active = 1
            ) AS min_price,

            (
                SELECT MAX(price)
                FROM product_variant
                WHERE product_id = p.product_id AND is_active = 1
            ) AS max_price,

            (
                SELECT JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'variant_id', pv.variant_id,
                        'variant_name', COALESCE(pv.variant_name, CONCAT(pv.packaging_type, ' ', pv.volume)),
                        'packaging_type', pv.packaging_type,
                        'volume', pv.volume,
                        'price', pv.price,
                        'stock_quantity', (
                            SELECT SUM(pb.quantity)
                            FROM product_batch pb
                            WHERE pb.variant_id = pv.variant_id
                        ),
                        'batches', (
                            SELECT JSON_ARRAYAGG(
                                JSON_OBJECT(
                                    'batch_id', pb.batch_id,
                                    'quantity', pb.quantity,
                                    'manufacturing_date', pb.manufacturing_date,
                                    'expiration_date', pb.expiration_date
                                )
                            )
                            FROM product_batch pb
                            WHERE pb.variant_id = pv.variant_id
                        )
                    )
                )
                FROM product_variant pv
                WHERE pv.product_id = p.product_id
                AND pv.is_active = 1
            ) AS variants
            FROM product p
            LEFT JOIN category c ON p.category_id = c.category_id
            ORDER BY p.product_id DESC
        ";

        $result = $db->query($sql)->fetchAll(PDO::FETCH_ASSOC);

        foreach ($result as &$row) {
            $row['variants'] = $row['variants']
                ? json_decode($row['variants'], true)
                : [];
        }

        return $result;
    }

    public static function getByCategory($category_id)
    {
        $db = Connection::get();

        $sql = "
            SELECT 
                p.product_id,
                p.product_name,
                p.category_id,
                c.category_name,
                p.image_url,
                p.description,
                p.created_at,
                p.is_hot,
                COALESCE(SUM(pv.stock_quantity), 0) AS total_quantity
            FROM product p
            LEFT JOIN category c ON p.category_id = c.category_id
            LEFT JOIN product_variant pv 
                ON p.product_id = pv.product_id
                AND pv.is_active = 1
            WHERE p.category_id = :category_id
            AND p.is_deleted = 0
            GROUP BY p.product_id
            ORDER BY p.product_id DESC
        ";

        $stmt = $db->prepare($sql);
        $stmt->execute(['category_id' => $category_id]);

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public static function filter($category_id, $brand_name, $volume = null)
    {
        $db = Connection::get();

        $sql = "
            SELECT 
                p.product_id,
                p.product_name,
                pv.variant_id,
                pv.volume,
                pv.packaging_type,
                pv.price,
                pv.stock_quantity,
                pv.brand_name,
                p.category_id,
                c.category_name,
                p.image_url,
                p.description
            FROM product p
            LEFT JOIN category c ON p.category_id = c.category_id
            JOIN product_variant pv 
                ON p.product_id = pv.product_id
                AND pv.is_active = 1
            WHERE p.is_deleted = 0
        ";

        $params = [];

        if (!empty($category_id)) {
            $sql .= " AND p.category_id = :category_id";
            $params['category_id'] = $category_id;
        }

        if (!empty($brand_name)) {
            $sql .= " AND pv.brand_name = :brand_name";
            $params['brand_name'] = $brand_name;
        }

        if (!empty($volume)) {
            $sql .= " AND pv.volume = :volume";
            $params['volume'] = $volume;
        }

        $sql .= " ORDER BY p.product_id DESC, pv.volume ASC";

        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if (empty($results)) return [];

        $variantIds = array_unique(array_column($results, 'variant_id'));
        $placeholders = str_repeat('?,', count($variantIds) - 1) . '?';

        $sqlBatch = "
            SELECT batch_id, variant_id, quantity, expiration_date
            FROM product_batch
            WHERE variant_id IN ($placeholders) AND quantity > 0
            ORDER BY expiration_date ASC, batch_id ASC
        ";

        $stmtBatch = $db->prepare($sqlBatch);
        $stmtBatch->execute(array_values($variantIds));
        $allBatches = $stmtBatch->fetchAll(PDO::FETCH_ASSOC);

        $bestBatches = [];
        foreach ($allBatches as $batch) {
            if (!isset($bestBatches[$batch['variant_id']])) {
                $bestBatches[$batch['variant_id']] = $batch;
            }
        }

        foreach ($results as &$row) {
            $vId = $row['variant_id'];
            if (isset($bestBatches[$vId])) {
                $row['batch_id'] = $bestBatches[$vId]['batch_id'];
                $row['batch_quantity'] = $bestBatches[$vId]['quantity'];
                $row['batch_expiration'] = $bestBatches[$vId]['expiration_date'];
            } else {
                $row['batch_id'] = null;
                $row['batch_quantity'] = 0;
                $row['batch_expiration'] = null;
            }
        }

        return $results;
    }

    public static function searchByName($search_name)
    {
        $db = Connection::get();
        $search_name = trim($search_name);

        $sql = "
            SELECT 
                p.product_id,
                p.product_name,
                p.category_id,
                p.image_url,
                p.description,
                p.is_hot,
                MIN(v.price) AS min_price,
                SUM(v.stock_quantity) AS total_quantity
            FROM product p
            LEFT JOIN product_variant v ON p.product_id = v.product_id
            WHERE p.product_name LIKE :search_name
            AND p.is_deleted = 0
            GROUP BY p.product_id
            ORDER BY p.product_id DESC
        ";

        $stmt = $db->prepare($sql);
        $stmt->execute(['search_name' => "%$search_name%"]);

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /* =====================================================
     * 2. DETAIL – CHI TIẾT SẢN PHẨM
     * ===================================================== */

    public static function find($product_id)
    {
        $db = Connection::get();

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

        $sqlVariants = "
            SELECT 
                v.variant_id, 
                v.variant_name, 
                v.brand_name,
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

        if (empty($variants)) {
            $product['variants'] = [];
            return $product;
        }

        $variantIds = array_column($variants, 'variant_id');
        $placeholders = str_repeat('?,', count($variantIds) - 1) . '?';

        $sqlBatch = "
            SELECT batch_id, variant_id, quantity, expiration_date
            FROM product_batch
            WHERE variant_id IN ($placeholders) AND quantity > 0
            ORDER BY expiration_date ASC, batch_id ASC
        ";

        $stmtBatch = $db->prepare($sqlBatch);
        $stmtBatch->execute($variantIds);
        $allBatches = $stmtBatch->fetchAll(PDO::FETCH_ASSOC);

        $bestBatches = [];
        foreach ($allBatches as $batch) {
            if (!isset($bestBatches[$batch['variant_id']])) {
                $bestBatches[$batch['variant_id']] = $batch;
            }
        }

        foreach ($variants as &$variant) {
            $vId = $variant['variant_id'];
            if (isset($bestBatches[$vId])) {
                $variant['batch_id'] = $bestBatches[$vId]['batch_id'];
                $variant['batch_quantity'] = $bestBatches[$vId]['quantity'];
                $variant['batch_expiration'] = $bestBatches[$vId]['expiration_date'];
            } else {
                $variant['batch_id'] = null;
                $variant['batch_quantity'] = 0;
                $variant['batch_expiration'] = null;
            }
        }

        $product['variants'] = $variants;
        return $product;
    }

    /* =====================================================
     * 3. META – DỮ LIỆU PHỤC VỤ FILTER
     * ===================================================== */

    public static function getAllBrands()
    {
        $db = Connection::get();
        $sql = "
            SELECT DISTINCT brand_name 
            FROM product_variant 
            WHERE brand_name IS NOT NULL 
            AND brand_name != '' 
            ORDER BY brand_name ASC
        ";

        return $db->query($sql)->fetchAll(PDO::FETCH_ASSOC);
    }

    public static function getAllVolumes()
    {
        $db = Connection::get();
        $sql = "
            SELECT DISTINCT volume 
            FROM product_variant 
            WHERE volume IS NOT NULL 
            AND volume != '' 
            ORDER BY volume ASC
        ";

        return $db->query($sql)->fetchAll(PDO::FETCH_ASSOC);
    }

    /* =====================================================
     * 4. STOCK / INVENTORY – QUẢN LÝ TỒN KHO
     * ===================================================== */

    public static function increaseStock($variant_id, $quantity, $batch_id)
    {
        $db = Connection::get();

        $db->prepare("
            UPDATE product_batch
            SET quantity = quantity + :quantity
            WHERE batch_id = :batch_id
        ")->execute([
            'quantity' => $quantity,
            'batch_id' => $batch_id
        ]);

        return $db->prepare("
            UPDATE product_variant
            SET stock_quantity = stock_quantity + :quantity
            WHERE variant_id = :variant_id
        ")->execute([
            'quantity' => $quantity,
            'variant_id' => $variant_id
        ]);
    }

    public static function decreaseStock($variant_id, $quantity)
    {
        $db = Connection::get();

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
                'deduct' => $deduct,
                'batch_id' => $batch['batch_id']
            ]);

            $remain -= $deduct;
        }

        if ($remain > 0) return false;

        $db->prepare("
            UPDATE product_variant
            SET stock_quantity = stock_quantity - :quantity
            WHERE variant_id = :variant_id
        ")->execute([
            'quantity' => $quantity,
            'variant_id' => $variant_id
        ]);

        return true;
    }

    public static function updateStockQuantity($variant_id, $quantity)
    {
        $db = Connection::get();
        $db->prepare("
            UPDATE product_variant 
            SET stock_quantity = stock_quantity + ? 
            WHERE variant_id = ?
        ")->execute([$quantity, $variant_id]);
    }

    public static function addProductBatch($data)
    {
        $db = Connection::get();
        $stmt = $db->prepare("
            INSERT INTO product_batch 
            (variant_id, quantity, manufacturing_date, expiration_date)
            VALUES (?, ?, ?, ?)
        ");
        $stmt->execute([
            $data['variant_id'],
            $data['quantity'],
            $data['manufacturing_date'] ?? null,
            $data['expiration_date']
        ]);

        return $db->lastInsertId();
    }

    /* =====================================================
     * 5. CREATE – TẠO SẢN PHẨM
     * ===================================================== */

    public static function create($data)
    {
        $db = Connection::get();
        $db->beginTransaction();

        try {
            $stmt = $db->prepare("
                INSERT INTO product 
                (product_name, category_id, manufacturer_id, image_url, description, is_hot)
                VALUES (?, ?, ?, ?, ?, ?)
            ");

            $stmt->execute([
                $data['product_name'],
                $data['category_id'],
                $data['manufacturer_id'] ?? null,
                $data['image_url'] ?? null,
                $data['description'] ?? null,
                $data['is_hot'] ?? 0
            ]);

            $productId = $db->lastInsertId();
            $detail = $data['detail'] ?? [];

            $stmtDetail = $db->prepare("
                INSERT INTO product_detail
                (product_id, origin, ingredients, `usage`, storage, calories, protein, fat, carbohydrates, sugar, vitamins, minerals, other_nutrients)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ");

            $stmtDetail->execute([
                $productId,
                $detail['origin'] ?? null,
                $detail['ingredients'] ?? null,
                $detail['usage'] ?? null,
                $detail['storage'] ?? null,
                $detail['calories'] ?? 0,
                $detail['protein'] ?? 0,
                $detail['fat'] ?? 0,
                $detail['carbohydrates'] ?? 0,
                $detail['sugar'] ?? 0,
                isset($detail['vitamins']) ? json_encode($detail['vitamins']) : null,
                isset($detail['minerals']) ? json_encode($detail['minerals']) : null,
                $detail['other_nutrients'] ?? null
            ]);

            $db->commit();
            return $productId;
        } catch (Exception $e) {
            $db->rollBack();
            throw $e;
        }
    }
}
