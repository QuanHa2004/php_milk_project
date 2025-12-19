<?php

namespace Models;

use Database\Connection;
use PDO;
use Exception;

class Review
{

    public static function create($data)
    {
        $db = Connection::get();


        $sql = "
            INSERT INTO review
            (variant_id, user_id, rating, comment)
            VALUES (:variant_id, :user_id, :rating, :comment)
        ";

        $stmt = $db->prepare($sql);
        $stmt->bindParam(':variant_id', $data['variant_id'], PDO::PARAM_INT);
        $stmt->bindParam(':user_id', $data['user_id'], PDO::PARAM_INT);
        $stmt->bindParam(':rating', $data['rating'], PDO::PARAM_INT);
        $stmt->bindParam(':comment', $data['comment']);

        $stmt->execute();

        return $db->lastInsertId();
    }

    public static function all()
    {
        $db = Connection::get();

        $sql = "
        SELECT
            r.review_id,
            r.rating,
            r.comment,
            r.created_at,
            u.full_name,
            p.product_name,
            pv.variant_name,
            pv.volume,
            pv.packaging_type
        FROM review r
        JOIN user u ON r.user_id = u.user_id
        JOIN product_variant pv ON r.variant_id = pv.variant_id
        JOIN product p ON pv.product_id = p.product_id
        WHERE r.is_deleted = 0
        ORDER BY r.created_at DESC
    ";

        $stmt = $db->query($sql);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public static function getReviews($product_id, $variant_id)
    {
        $db = Connection::get();

        $sql = "
        SELECT
            r.review_id,
            r.rating,
            r.comment,
            r.created_at,
            u.full_name,
            pv.variant_name,
            pv.volume,
            pv.packaging_type
        FROM review r
        JOIN user u ON r.user_id = u.user_id
        JOIN product_variant pv ON r.variant_id = pv.variant_id
        WHERE r.is_deleted = 0
          AND pv.product_id = :product_id
          AND r.variant_id = :variant_id
        ORDER BY r.created_at DESC
    ";

        $stmt = $db->prepare($sql);
        $stmt->bindParam(':product_id', $product_id, PDO::PARAM_INT);
        $stmt->bindParam(':variant_id', $variant_id, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
