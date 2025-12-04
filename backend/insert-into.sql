-- -----------------------------------------------------
-- 1. Insert dữ liệu bảng ROLE (Quyền hạn)
-- -----------------------------------------------------
INSERT INTO `role` (`role_id`, `role_name`) VALUES
(1, 'Admin'),      -- Quản trị viên
(2, 'Customer');   -- Khách hàng

-- -----------------------------------------------------
-- 2. Insert dữ liệu bảng CATEGORY (Danh mục)
-- -----------------------------------------------------
INSERT INTO `category` (`category_id`, `category_name`) VALUES
(1, 'Sữa Bột'),
(2, 'Sữa Tươi'),
(3, 'Sữa Hạt'),
(4, 'Sữa Dinh Dưỡng Người Lớn'),
(5, 'Sữa Chua Uống');

-- -----------------------------------------------------
-- 3. Insert dữ liệu bảng PRODUCT (Sản phẩm)
-- Lưu ý: category_id phải khớp với ID ở bảng category bên trên
-- -----------------------------------------------------
INSERT INTO `product` (`product_id`, `product_name`, `category_id`, `price`, `quantity`, `discount_percent`, `image_url`, `description`, `is_hot`, `is_deleted`) VALUES
-- Sản phẩm 1: Sữa Bột (Category 1)
(1, 'Sữa Bột Dielac Alpha Gold IQ 4', 1, 350000.00, 30, 10, 'https://cdn.tgdd.vn/Products/Images/2386/79532/bhx/sua-bot-dielac-alpha-gold-iq-4-hop-900g-202102021447029583.jpg', 'Sữa bột Dielac Alpha Gold IQ 4 hỗ trợ phát triển trí não và chiều cao cho trẻ từ 2-6 tuổi.', 1, 0),

-- Sản phẩm 2: Sữa Tươi (Category 2)
(2, 'Thùng 48 Hộp Sữa Tươi Tiệt Trùng TH True Milk 180ml', 2, 380000.00, 30, 5, 'https://cdn.tgdd.vn/Products/Images/2386/76537/bhx/thung-48-hop-sua-tuoi-tiet-trung-nguyen-chat-th-true-milk-180ml-201912191544258925.jpg', 'Sữa tươi sạch TH True Milk nguyên chất, không đường, đảm bảo dinh dưỡng tự nhiên.', 0, 0),

-- Sản phẩm 3: Sữa Hạt (Category 3)
(3, 'Lốc 4 Hộp Sữa Hạt Óc Chó TH True Nut 180ml', 3, 55000.00, 30, 0, 'https://cdn.tgdd.vn/Products/Images/2386/166008/bhx/loc-4-hop-sua-hat-oc-cho-th-true-nut-180ml-202104232252197779.jpg', 'Sự kết hợp hoàn hảo giữa sữa tươi sạch và hạt óc chó giàu dinh dưỡng, tốt cho tim mạch.', 1, 0),

-- Sản phẩm 4: Sữa Người Lớn (Category 4)
(4, 'Sữa Bột Ensure Gold Hương Vani 850g', 4, 790000.00, 30, 15, 'https://cdn.tgdd.vn/Products/Images/2386/81229/bhx/sua-bot-ensure-gold-huong-vani-hop-850g-202104161109033282.jpg', 'Ensure Gold cung cấp nguồn dinh dưỡng đầy đủ và cân đối, giúp phục hồi sức khỏe nhanh chóng.', 1, 0),

-- Sản phẩm 5: Sữa Chua Uống (Category 5)
(5, 'Lốc 4 Chai Sữa Chua Uống Probi 130ml', 5, 28000.00, 30, 0, 'https://cdn.tgdd.vn/Products/Images/2386/76483/bhx/loc-4-chai-sua-chua-uong-men-song-vinamilk-probi-it-duong-130ml-202212061413524948.jpg', 'Bổ sung 13 tỷ lợi khuẩn, giúp hệ tiêu hóa khỏe mạnh và tăng cường đề kháng.', 0, 0);

-- -----------------------------------------------------
-- 4. Insert dữ liệu bảng PRODUCT_DETAIL (Chi tiết sản phẩm)
-- Lưu ý: product_id phải khớp với ID ở bảng product bên trên
-- -----------------------------------------------------
INSERT INTO `product_detail` (`product_id`, `ingredients`, `usage`, `storage`, `nutrition_info`, `origin`) VALUES
-- Chi tiết cho Sản phẩm 1 (Dielac)
(1, 
 'Sữa bột, Dầu thực vật, Đường tinh luyện, Chất xơ hòa tan, Các khoáng chất...', 
 'Pha 7 muỗng gạt với 210ml nước ấm (khoảng 50 độ C). Uống 2-3 ly mỗi ngày.', 
 'Đậy kín sau mỗi lần sử dụng. Để nơi thoáng mát và khô ráo. Không bảo quản trong tủ lạnh.', 
 'Năng lượng: 460 kcal/100g, Protein: 16g, DHA: 100mg...', 
 'Việt Nam'
),

-- Chi tiết cho Sản phẩm 2 (TH True Milk)
(2, 
 'Sữa hoàn toàn từ sữa bò tươi (96%), đường (3.8%), hỗn hợp chất nhũ hóa...', 
 'Sử dụng ngay sau khi mở hộp. Ngon hơn khi uống lạnh.', 
 'Bảo quản nơi khô ráo, thoáng mát, tránh ánh nắng trực tiếp.', 
 'Năng lượng: 70 kcal/100ml, Chất béo: 3.2g, Canxi: 104mg...', 
 'Việt Nam'
),

-- Chi tiết cho Sản phẩm 3 (TH True Nut)
(3, 
 'Dịch hạt óc chó (60%), sữa bò tươi (30%), chà là, yến mạch...', 
 'Lắc đều trước khi uống. Nên dùng hết sau khi mở hộp.', 
 'Nơi khô ráo, thoáng mát.', 
 'Năng lượng: 45 kcal/100ml, Omega-3, Chất chống oxy hóa.', 
 'Việt Nam'
),

-- Chi tiết cho Sản phẩm 4 (Ensure)
(4, 
 'Tinh bột bắp thủy phân, Dầu thực vật, Natri Caseinat, Đạm đậu nành tinh chế...', 
 'Để pha 230ml, cho 195ml nước chín nguội vào ly, thêm 6 muỗng gạt ngang bột.', 
 'Hộp đã mở phải được đậy kín và bảo quản ở nơi khô mát, nhưng không cho vào tủ lạnh.', 
 'HMB, Hỗn hợp Protein 3 nguồn phức hợp, Giàu Canxi và Vitamin D.', 
 'Singapore'
),

-- Chi tiết cho Sản phẩm 5 (Probi)
(5, 
 'Nước, đường, sữa bột, xirô fructose, chất ổn định, hương liệu tổng hợp...', 
 'Dùng trực tiếp. Khuyên dùng 2 chai mỗi ngày sau bữa ăn.', 
 'Bảo quản lạnh ở nhiệt độ 6-8 độ C.', 
 'Chứa khoảng 13 tỷ lợi khuẩn L.Casei 431.', 
 'Việt Nam'
);