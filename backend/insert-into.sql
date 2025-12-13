INSERT INTO `role` (`role_id`, `role_name`) VALUES (1, 'Admin'), (2, 'Customer');


INSERT INTO `category` (`category_id`, `category_name`) VALUES
(1, 'Sữa Tươi'), 
(2, 'Sữa Chua'), 
(3, 'Sữa Đặc'), 
(4, 'Sữa Hạt & Ngũ Cốc');


INSERT INTO `product` 
(`product_id`, `product_name`, `category_id`, `manufacturer_id`, `image_url`, `description`, `is_hot`, `created_at`) 
VALUES
(1, 'Sữa Tươi Vinamilk 100% Có Đường', 1, NULL, 'https://d8um25gjecm9v.cloudfront.net/cms/ST_Tiet_trung_FM_100_CD_1_Lvuong_01_953c2b8712_3e7a11b654.png', 'Sữa tươi tiệt trùng Vinamilk 100%, hương vị thơm ngon truyền thống.', 1, NOW()),
(2, 'Sữa Tươi Vinamilk 100% Không Đường', 1, NULL, 'https://d8um25gjecm9v.cloudfront.net/cms/ST_Tiet_trung_FM_100_KD_1_Lvuong_01_e0fae7da0b_3d1c38cd1e.png', 'Hương vị nguyên bản, không đường, tốt cho sức khỏe.', 0, NOW()),
(3, 'Sữa Tươi Green Farm', 1, NULL, 'https://d8um25gjecm9v.cloudfront.net/cms/ST_Thanh_trung_GF_KD_900_01_434a72db30_f1de224378.png', 'Nguồn sữa từ trang trại sinh thái Green Farm, thuần khiết.', 1, NOW()),
(4, 'Sữa Dinh Dưỡng Vinamilk ADM', 1, NULL, 'https://d8um25gjecm9v.cloudfront.net/cms/SDD_GC_Cf_Latte_300_01_1_49a23fce0b_be94df6489.png', 'Bổ sung vi chất giúp bé mắt sáng, dáng cao.', 0, NOW()),
(5, 'Sữa Chua Ăn Vinamilk Nha Đam', 2, NULL, 'https://d8um25gjecm9v.cloudfront.net/cms/SCA_VNM_Nhadam_CD_1_250320_9f867f3746_e62e96c9e9.png', 'Sữa chua nha đam giòn dai, thanh mát.', 1, NOW()),
(6, 'Sữa Chua Uống Men Sống Probi', 2, NULL, 'https://d8um25gjecm9v.cloudfront.net/cms/PROBI_Nghe_Matong_130_1_moi_af86f0f384_dbf38b8a85.png', 'Bổ sung 13 tỷ lợi khuẩn, tăng sức đề kháng.', 1, NOW()),
(7, 'Sữa Chua Uống SuSu Trái Cây', 2, NULL, 'https://d8um25gjecm9v.cloudfront.net/cms/SCA_SUSU_Dau_Chuoi_01_2_5811068381.png', 'Vị trái cây thơm ngon, năng lượng cho bé.', 0, NOW()),
(8, 'Sữa Đặc Ông Thọ', 3, NULL, 'https://d8um25gjecm9v.cloudfront.net/cms/SD_Ong_Tho_Xanhla_380_1_718fd5ef2e_dcd11dbcac.png', 'Ngọt đậm đà, béo ngậy, bí quyết món ngon.', 1, NOW()),
(9, 'Sữa Đậu Nành Tươi Vinamilk', 4, NULL, 'https://d8um25gjecm9v.cloudfront.net/cms/SDN_KD_1_L_01_50f3f1f9e8_48e7f3b3fb.png', 'Gấp đôi Canxi, hạt đậu nành không biến đổi gen.', 0, NOW()),
(10, 'Sữa Hạt Óc Chó Vinamilk', 4, NULL, 'https://d8um25gjecm9v.cloudfront.net/cms/Thumbs_10_25_STV_06_274871573e.png', 'Giàu Omega-3 từ hạt óc chó Mỹ, tốt cho trí não.', 1, NOW());


INSERT INTO `product_variant` 
(`variant_id`, `product_id`, `variant_name`, `volume`, `packaging_type`, `price`, `stock_quantity`) 
VALUES
(1, 1, 'Thùng 48 hộp 180ml', '180ml', 'Thùng', 385000, 100),
(2, 1, 'Lốc 4 hộp 180ml', '180ml', 'Lốc', 33000, 500),
(3, 1, 'Thùng 48 hộp 110ml', '110ml', 'Thùng', 265000, 80),
(4, 1, 'Lốc 4 hộp 110ml', '110ml', 'Lốc', 23000, 600),
(5, 2, 'Thùng 48 hộp 180ml', '180ml', 'Thùng', 385000, 120),
(6, 2, 'Lốc 4 hộp 180ml', '180ml', 'Lốc', 33000, 400),
(7, 2, 'Thùng 48 hộp 110ml', '110ml', 'Thùng', 265000, 90),
(8, 2, 'Lốc 4 hộp 110ml', '110ml', 'Lốc', 23000, 300),
(9, 3, 'Thùng 48 hộp 180ml', '180ml', 'Thùng', 432000, 50),
(10, 3, 'Lốc 4 hộp 180ml', '180ml', 'Lốc', 37000, 200),
(11, 3, 'Thùng 48 hộp 110ml', '110ml', 'Thùng', 290000, 60),
(12, 3, 'Lốc 4 hộp 110ml', '110ml', 'Lốc', 25000, 250),
(13, 4, 'Thùng 48 hộp 180ml', '180ml', 'Thùng', 340000, 150),
(14, 4, 'Lốc 4 hộp 180ml', '180ml', 'Lốc', 29000, 300),
(15, 4, 'Thùng 48 hộp 110ml', '110ml', 'Thùng', 230000, 120),
(16, 4, 'Lốc 4 hộp 110ml', '110ml', 'Lốc', 20000, 400),
(17, 5, 'Thùng 48 hộp 100g', '100g', 'Thùng', 336000, 50),
(18, 5, 'Lốc 4 hộp 100g', '100g', 'Lốc', 29000, 100),
(19, 6, 'Thùng 50 chai 65ml', '65ml', 'Thùng', 250000, 200),
(20, 6, 'Lốc 5 chai 65ml', '65ml', 'Lốc', 26000, 500),
(21, 6, 'Thùng 24 chai 130ml', '130ml', 'Thùng', 480000, 100),
(22, 6, 'Lốc 4 chai 130ml', '130ml', 'Lốc', 42000, 300),
(23, 7, 'Thùng 48 chai 80ml', '80ml', 'Thùng', 280000, 90),
(24, 7, 'Lốc 6 chai 80ml', '80ml', 'Lốc', 36000, 300),
(25, 7, 'Thùng 48 chai 110ml', '110ml', 'Thùng', 320000, 50),
(26, 7, 'Lốc 4 chai 110ml', '110ml', 'Lốc', 28000, 200),
(27, 8, 'Thùng 24 lon 380g', '380g', 'Thùng', 580000, 60),
(28, 8, 'Lon lẻ 380g', '380g', 'Lon', 25000, 500),
(29, 9, 'Thùng 48 hộp 200ml', '200ml', 'Thùng', 215000, 120),
(30, 9, 'Lốc 4 hộp 200ml', '200ml', 'Lốc', 19000, 400),
(31, 10, 'Thùng 48 hộp 180ml', '180ml', 'Thùng', 460000, 70),
(32, 10, 'Lốc 4 hộp 180ml', '180ml', 'Lốc', 40000, 200),
(33, 10, 'Thùng 48 hộp 110ml', '110ml', 'Thùng', 310000, 50),
(34, 10, 'Lốc 4 hộp 110ml', '110ml', 'Lốc', 27000, 150);


INSERT INTO `product_batch` (`variant_id`, `quantity`, `manufacturing_date`, `expiration_date`, `created_at`) VALUES
(1, 50, '2025-10-01', '2026-04-01', NOW()), (1, 50, '2025-11-01', '2026-05-01', NOW()),
(2, 250, '2025-10-01', '2026-04-01', NOW()), (2, 250, '2025-11-01', '2026-05-01', NOW()),
(3, 40, '2025-10-15', '2026-04-15', NOW()), (3, 40, '2025-11-15', '2026-05-15', NOW()),
(4, 300, '2025-10-15', '2026-04-15', NOW()), (4, 300, '2025-11-15', '2026-05-15', NOW()),
(5, 60, '2025-09-20', '2026-03-20', NOW()), (5, 60, '2025-10-20', '2026-04-20', NOW()),
(6, 200, '2025-09-20', '2026-03-20', NOW()), (6, 200, '2025-10-20', '2026-04-20', NOW()),
(7, 45, '2025-11-05', '2026-05-05', NOW()), (7, 45, '2025-12-05', '2026-06-05', NOW()),
(8, 150, '2025-11-05', '2026-05-05', NOW()), (8, 150, '2025-12-05', '2026-06-05', NOW()),
(9, 25, '2025-11-20', '2026-05-20', NOW()), (9, 25, '2025-12-10', '2026-06-10', NOW()),
(10, 100, '2025-11-20', '2026-05-20', NOW()), (10, 100, '2025-12-10', '2026-06-10', NOW()),
(11, 30, '2025-12-01', '2026-06-01', NOW()), (11, 30, '2025-12-15', '2026-06-15', NOW()),
(12, 125, '2025-12-01', '2026-06-01', NOW()), (12, 125, '2025-12-15', '2026-06-15', NOW()),
(13, 75, '2025-08-01', '2026-02-01', NOW()), (13, 75, '2025-09-01', '2026-03-01', NOW()),
(14, 150, '2025-08-01', '2026-02-01', NOW()), (14, 150, '2025-09-01', '2026-03-01', NOW()),
(15, 60, '2025-10-10', '2026-04-10', NOW()), (15, 60, '2025-11-10', '2026-05-10', NOW()),
(16, 200, '2025-10-10', '2026-04-10', NOW()), (16, 200, '2025-11-10', '2026-05-10', NOW()),
(17, 25, '2025-12-01', '2026-01-15', NOW()), (17, 25, '2025-12-10', '2026-01-25', NOW()),
(18, 50, '2025-12-01', '2026-01-15', NOW()), (18, 50, '2025-12-10', '2026-01-25', NOW()),
(19, 100, '2025-11-15', '2026-01-15', NOW()), (19, 100, '2025-12-01', '2026-02-01', NOW()),
(20, 250, '2025-11-15', '2026-01-15', NOW()), (20, 250, '2025-12-01', '2026-02-01', NOW()),
(21, 50, '2025-12-05', '2026-02-05', NOW()), (21, 50, '2025-12-12', '2026-02-12', NOW()),
(22, 150, '2025-12-05', '2026-02-05', NOW()), (22, 150, '2025-12-12', '2026-02-12', NOW()),
(23, 45, '2025-10-20', '2026-04-20', NOW()), (23, 45, '2025-11-20', '2026-05-20', NOW()),
(24, 150, '2025-10-20', '2026-04-20', NOW()), (24, 150, '2025-11-20', '2026-05-20', NOW()),
(25, 25, '2025-11-01', '2026-05-01', NOW()), (25, 25, '2025-12-01', '2026-06-01', NOW()),
(26, 100, '2025-11-01', '2026-05-01', NOW()), (26, 100, '2025-12-01', '2026-06-01', NOW()),
(27, 30, '2025-06-01', '2026-06-01', NOW()), (27, 30, '2025-09-01', '2026-09-01', NOW()),
(28, 250, '2025-06-01', '2026-06-01', NOW()), (28, 250, '2025-09-01', '2026-09-01', NOW()),
(29, 60, '2025-10-10', '2026-04-10', NOW()), (29, 60, '2025-11-10', '2026-05-10', NOW()),
(30, 200, '2025-10-10', '2026-04-10', NOW()), (30, 200, '2025-11-10', '2026-05-10', NOW()),
(31, 35, '2025-09-15', '2026-03-15', NOW()), (31, 35, '2025-10-15', '2026-04-15', NOW()),
(32, 100, '2025-09-15', '2026-03-15', NOW()), (32, 100, '2025-10-15', '2026-04-15', NOW()),
(33, 25, '2025-11-01', '2026-05-01', NOW()), (33, 25, '2025-12-01', '2026-06-01', NOW()),
(34, 75, '2025-11-01', '2026-05-01', NOW()), (34, 75, '2025-12-01', '2026-06-01', NOW());


INSERT INTO `product_detail` 
(`product_id`, `origin`, `ingredients`, `usage`, `storage`, `calories`, `protein`, `fat`, `carbohydrates`, `sugar`, `vitamins`, `minerals`, `other_nutrients`) 
VALUES
(1, 'Việt Nam', 'Sữa bò tươi (96%), đường tinh luyện.', 'Ngon hơn khi uống lạnh.', 'Bảo quản nơi khô ráo.', 75.6, 3.0, 3.5, 8.2, 8.0, '{"Vitamin A": "220 IU", "Vitamin D3": "120 IU"}', '{"Canxi": "110 mg", "Photpho": "90 mg"}', NULL),
(2, 'Việt Nam', 'Sữa bò tươi (100%).', 'Dùng trực tiếp. Thích hợp ăn kiêng.', 'Bảo quản nơi khô ráo.', 60.0, 3.1, 3.3, 4.6, 4.6, '{"Vitamin A": "180 IU", "Vitamin D3": "100 IU"}', '{"Canxi": "120 mg", "Magie": "10 mg"}', NULL),
(3, 'Việt Nam', 'Sữa bò tươi từ trang trại sinh thái Green Farm.', 'Dùng cho trẻ trên 1 tuổi.', 'Bảo quản nơi khô ráo.', 70.2, 2.9, 3.4, 7.5, 7.0, '{"Vitamin A": "200 IU", "Vitamin D3": "130 IU"}', '{"Canxi": "115 mg", "Kẽm": "0.5 mg"}', NULL),
(4, 'Việt Nam', 'Sữa, đường, dầu thực vật, vitamin.', 'Mỗi ngày dùng 3 hộp.', 'Nơi thoáng mát.', 72.0, 3.0, 3.2, 8.0, 8.0, '{"Vitamin A": "500 IU", "Vitamin D3": "150 IU"}', '{"Canxi": "140 mg", "Magie": "15 mg"}', 'Omega 3, DHA'),
(5, 'Việt Nam', 'Sữa, đường, nha đam (10%).', 'Sử dụng ngay sau khi mở nắp.', 'Bảo quản lạnh 6-8 độ C.', 105.0, 3.2, 2.8, 16.5, 16.0, '{"Vitamin B1": "50 mcg"}', '{"Canxi": "100 mg"}', 'Collagen tự nhiên'),
(6, 'Việt Nam', 'Nước, đường, men Lactobacillus Casei 431.', 'Khuyên dùng 2 chai mỗi ngày.', 'Không cần bảo quản lạnh.', 65.0, 1.2, 0.0, 15.0, 14.0, '{"Vitamin D3": "50 IU"}', '{"Canxi": "40 mg"}', '13 tỷ lợi khuẩn'),
(7, 'Việt Nam', 'Sữa, mứt trái cây, vitamin nhóm B.', 'Ăn trực tiếp.', 'Bảo quản lạnh 6-8 độ C.', 90.0, 2.8, 2.5, 14.0, 13.0, '{"Vitamin A": "250 IU"}', '{"Canxi": "90 mg"}', 'Chất xơ hòa tan'),
(8, 'Việt Nam', 'Đường, sữa, dầu thực vật.', 'Dùng pha cà phê, làm bánh.', 'Đậy nắp kỹ sau khi dùng.', 338.0, 4.6, 10.8, 56.0, 56.0, '{"Vitamin A": "200 IU"}', '{"Canxi": "260 mg"}', NULL),
(9, 'Việt Nam', 'Nước, đậu nành hạt (90%), đường.', 'Uống liền. Ngon hơn khi uống lạnh.', 'Tránh ánh nắng.', 54.0, 3.1, 1.8, 6.5, 6.0, '{"Vitamin A": "100 IU"}', '{"Canxi": "20 mg"}', 'Isoflavones'),
(10, 'Việt Nam', 'Dịch hạt óc chó, sữa bò tươi, đường.', 'Lắc đều trước khi uống.', 'Bảo quản nơi khô ráo.', 68.0, 1.5, 2.2, 10.5, 9.0, '{"Vitamin A": "250 IU"}', '{"Canxi": "80 mg"}', 'Omega-3');