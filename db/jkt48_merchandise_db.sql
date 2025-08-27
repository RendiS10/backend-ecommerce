-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Aug 23, 2025 at 05:20 AM
-- Server version: 8.0.30
-- PHP Version: 8.3.15

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
DROP TABLE IF EXISTS cart_items;
DROP TABLE IF EXISTS cart;
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS complaints;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS product_images;
DROP TABLE IF EXISTS product_variants;
DROP TABLE IF EXISTS product_news;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS product_categories;
DROP TABLE IF EXISTS users;

SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `jkt48_merchandise_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `cart`
--

CREATE TABLE `cart` (
  `cart_id` int NOT NULL,
  `user_id` int NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `cart`
--

INSERT INTO `cart` (`cart_id`, `user_id`, `created_at`, `updated_at`) VALUES
(10, 1, '2025-08-22 06:17:39', '2025-08-22 06:17:39'),
(11, 5, '2025-08-22 06:47:02', '2025-08-22 06:47:02');

-- --------------------------------------------------------

--
-- Table structure for table `cart_items`
--

CREATE TABLE `cart_items` (
  `cart_item_id` int NOT NULL,
  `cart_id` int NOT NULL,
  `product_id` int NOT NULL,
  `variant_id` int DEFAULT NULL,
  `quantity` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `complaints`
--

CREATE TABLE `complaints` (
  `complaint_id` int NOT NULL,
  `user_id` int NOT NULL,
  `order_id` int DEFAULT NULL,
  `subject` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `complaint_status` enum('open','in_progress','resolved','closed') NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `message_id` int NOT NULL,
  `sender_id` int NOT NULL,
  `is_read` tinyint(1) DEFAULT '0' COMMENT 'Status apakah pesan sudah dibaca',
  `recipient_id` int DEFAULT NULL COMMENT 'ID penerima pesan, null untuk broadcast',
  `message` text NOT NULL COMMENT 'Isi pesan chat',
  `sender_type` enum('customer','admin') NOT NULL DEFAULT 'customer' COMMENT 'Tipe pengirim: customer atau admin',
  `created_at` datetime DEFAULT NULL COMMENT 'Waktu pesan dikirim',
  `updated_at` datetime DEFAULT NULL COMMENT 'Waktu terakhir diupdate'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `order_id` int NOT NULL,
  `user_id` int NOT NULL,
  `order_date` datetime DEFAULT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `order_status` enum('Menunggu Konfirmasi','Disetujui','Akan Dikirimkan','Dikirim','Selesai','Dibatalkan') NOT NULL DEFAULT 'Menunggu Konfirmasi',
  `payment_method` enum('transfer') NOT NULL DEFAULT 'transfer',
  `shipping_address` text,
  `shipping_city` varchar(100) DEFAULT NULL,
  `shipping_postal_code` varchar(10) DEFAULT NULL,
  `tracking_number` varchar(100) DEFAULT NULL,
  `notes` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`order_id`, `user_id`, `order_date`, `total_amount`, `order_status`, `payment_method`, `shipping_address`, `shipping_city`, `shipping_postal_code`, `tracking_number`, `notes`) VALUES
(38, 1, '2025-08-22 06:41:08', '295000.00', 'Selesai', 'transfer', 'Rendi Sutendi, 085721451615, Jalan Arjuna Simpang, Bandung, 40182', 'Bandung', '40182', 'JKT48-250822-4676', ''),
(39, 1, '2025-08-22 07:54:46', '225000.00', 'Dibatalkan', 'transfer', 'Rendi Sutendi, 085721451615, Jalan Arjuna Simpang, Bandung, 40182', 'Bandung', '40182', 'JKT48-250822-5267', ''),
(40, 1, '2025-08-22 08:13:39', '225000.00', 'Dikirim', 'transfer', 'Rendi Sutendi, 085721451615, Jalan Arjuna Simpang, Bandung, 40182', 'Bandung', '40182', 'JKT48-250822-0545', ''),
(41, 1, '2025-08-22 11:42:52', '225000.00', 'Menunggu Konfirmasi', 'transfer', 'Rendi Sutendi, 085721451615, Jalan Arjuna Simpang, Bandung, 40182', 'Bandung', '40182', 'JKT48-250822-6109', '');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `order_item_id` int NOT NULL,
  `order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `variant_id` int DEFAULT NULL,
  `quantity` int NOT NULL,
  `price_at_purchase` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`order_item_id`, `order_id`, `product_id`, `variant_id`, `quantity`, `price_at_purchase`) VALUES
(40, 38, 12, 7, 1, '280000.00'),
(41, 39, 18, 22, 1, '210000.00'),
(42, 40, 18, 22, 1, '210000.00'),
(43, 41, 18, 22, 1, '210000.00');

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `payment_id` int NOT NULL,
  `order_id` int NOT NULL,
  `user_id` int NOT NULL,
  `payment_amount` decimal(10,2) NOT NULL,
  `payment_status` enum('Menunggu Pembayaran','Menunggu Konfirmasi','Disetujui','Ditolak') NOT NULL DEFAULT 'Menunggu Pembayaran',
  `payment_method` enum('transfer') NOT NULL DEFAULT 'transfer',
  `payment_date` datetime DEFAULT NULL,
  `confirmation_date` datetime DEFAULT NULL,
  `bank_name` varchar(100) DEFAULT NULL,
  `account_number` varchar(50) DEFAULT NULL,
  `account_name` varchar(100) DEFAULT NULL,
  `transfer_proof` varchar(255) DEFAULT NULL,
  `admin_notes` text,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`payment_id`, `order_id`, `user_id`, `payment_amount`, `payment_status`, `payment_method`, `payment_date`, `confirmation_date`, `bank_name`, `account_number`, `account_name`, `transfer_proof`, `admin_notes`, `created_at`, `updated_at`) VALUES
(18, 38, 1, '295000.00', 'Disetujui', 'transfer', '2025-08-22 06:46:00', '2025-08-22 06:46:05', 'tes', 'dasdas', 'asdasdas', NULL, '', '2025-08-22 06:41:08', '2025-08-22 06:47:21'),
(19, 39, 1, '225000.00', 'Menunggu Pembayaran', 'transfer', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-08-22 07:54:46', '2025-08-22 07:54:46'),
(20, 40, 1, '225000.00', 'Disetujui', 'transfer', '2025-08-22 08:13:00', '2025-08-22 08:14:03', 'BRI', '44512', 'Rendi Sutendi', NULL, 'tunggu ya', '2025-08-22 08:13:39', '2025-08-22 08:16:48'),
(21, 41, 1, '225000.00', 'Menunggu Konfirmasi', 'transfer', '2025-08-22 12:07:00', '2025-08-22 12:07:18', 'BRI', '4151231', 'Rendi Sutendi', NULL, NULL, '2025-08-22 11:42:52', '2025-08-22 12:07:18');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `product_id` int NOT NULL,
  `category_id` int NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `description` text,
  `price` int NOT NULL,
  `stock` int NOT NULL,
  `sold_quantity` int DEFAULT '0',
  `average_rating` decimal(2,1) DEFAULT '0.0',
  `total_reviews` int DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`product_id`, `category_id`, `product_name`, `description`, `price`, `stock`, `sold_quantity`, `average_rating`, `total_reviews`, `created_at`, `updated_at`, `image_url`) VALUES
(12, 15, 'Lightstick JKT48 Newera 2.0', 'Official Lightstick JKT48 kini hadir dengan fitur baru loh! Sekarang Lightstick JKT48 dapat kami operasikan variasi warnanya secara jarak jauh. Tersedia 15 warna yang bisa disesuaikan dengan mood lagu JKT48. Meriahkan events JKT48 dengan lautan cahaya warna-warni dari Lightstick JKT48 Newera 2.0!\n\n\n* Produk sudah termasuk batu baterai AAA\n* Lightstick JKT48 Newera 2.0 ini tidak dilengkapi sekrup agar mempermudah penggantian batu baterai\n* Disarankan untuk mencopot batu baterai apabila sedang tidak digunakan', 280000, 100, 0, '5.0', 1, '2025-08-15 18:47:54', '2025-08-15 18:47:54', 'https://images.tokopedia.net/img/cache/700/VqbcmM/2024/10/3/44db5d8e-194e-4473-b740-2635f235a1e2.jpg'),
(13, 15, 'JKT48 #KuSangatSuka Lanyard', 'JKT48 #KuSangatSuka Lanyard\n\n#KuSangatSuka merupakan single ke-26 dari JKT48 yang sangat berkesan karena telah mengukir berbagai kisah, cerita dan kerja keras perjuangan yang sudah dilalui oleh para member serta seluruh fans hingga akhirnya single ini tercipta dan sudah dapat dinikmati.\nUntuk merayakan dirilisnya #KuSangatSuka yang berharga ini, JKT48 telah merilis merchandise spesial.\n\nJKT48 #KuSangatSuka Lanyard tersedia 2 pilhan warna keren: Biru dan Cream', 45000, 100, 0, '0.0', 0, '2025-08-15 18:50:13', '2025-08-15 18:50:13', 'https://images.tokopedia.net/img/cache/700/aphluv/1997/1/1/a413b24330964cefb609f18f50f5e2c8~.jpeg'),
(14, 15, 'JKT48 Photocard Holder Collection', 'JKT48 Photocard Holder\n\n\nSimpan koleksi photocard kamu di Photocard Holder ini! Dengan 6 disain keren yang cocok untuk dibawa ke event JKT48!\n\n\n\nLengkapi koleksi merchandise JKT48 kamu ya!\n\n\n**PRODUK TIDAK TERMASUK PHOTOCARD. HANYA PHOTOCARD HOLDER-NYA SAJA**', 40000, 150, 0, '0.0', 0, '2025-08-15 18:52:55', '2025-08-15 18:52:55', 'https://images.tokopedia.net/img/cache/700/aphluv/1997/1/1/1ab98d5d48424cb68d3957b11b1e9863~.jpeg'),
(15, 20, 'JKT48 Official T-shirt - NEWERA (Black)', 'Terima kasih atas dukungannya untuk JKT48\n\nDesain T-Shirt yang simpel dan keren untuk menambah koleksi merchandise JKT48!\n\nJKT48 Newera Official T-shirt hadir dengan 4 pilihan warna: Hitam, Sage, Khaki dan Putih.\n\nYuk buruan beli, jangan sampai kehabisan ya!', 165000, 200, 0, '0.0', 0, '2025-08-16 04:06:01', '2025-08-16 04:06:01', 'https://images.tokopedia.net/img/cache/700/aphluv/1997/1/1/f7854efc40f04a83959c019393792244~.jpeg'),
(16, 20, 'JKT48 Wonderland Rainbow T-Shirt ', 'JKT48 Wonderland Rainbow T-Shirt\n\nDemi merayakan dan menambah semarak Wonderland JKT48 13th Anniversary Concert, JKT48 telah merilis beberapa t-shirt exclusive yang kini tersedia di Tokopedia! Dapatkan sekarang karena stock terbatas.\n', 180000, 170, 0, '0.0', 0, '2025-08-16 04:15:33', '2025-08-16 04:15:33', 'https://images.tokopedia.net/img/cache/700/VqbcmM/2024/12/18/7832ee9d-3d10-4c32-bfb5-86082975cd68.jpg'),
(17, 20, 'JKT48 T-Shirt Theater Surabaya 2024', 'JKT48 T-Shirt Theater Surabaya 2024\n\nLengkapi koleksi merchandise JKT48 kamu dengan membeli merchandise special Theater Sementara Surabaya dan Yogyakarta 2024!\n\n\n\n\n* Toleransi ukuran T-Shirt 2-3cm\n* Produk yang diterima kemungkinan ada perbedaan warna karena terpengaruh oleh lighting dan kondisi saat pengambilan gambar.', 180000, 100, 0, '0.0', 0, '2025-08-16 04:16:18', '2025-08-16 04:16:18', 'https://images.tokopedia.net/img/cache/700/VqbcmM/2025/1/14/6359acb6-a8c4-4942-acc2-1dfb753e8c35.jpg'),
(18, 7, 'Birthday T-Shirt Fritzy Rosmerian 2025', 'Mari rayakan ulang tahun oshi kamu dengan memakai T-Shirt yang didesain sendiri oleh membernya! Periode pemesanan akan dimulai hari Jumat, 04 Juli 2025. Kamu bisa order produk ini di official Tokopedia JKT48. Pasti seru bisa kembaran baju dengan Fritzy!', 210000, 30, 0, '0.0', 0, '2025-08-22 07:30:57', '2025-08-22 07:30:57', 'https://ik.imagekit.io/yq7zp5yam/Tugas%20E-Commerce/bdts.jpg?updatedAt=1755847758055'),
(19, 7, 'JKT48 Birthday T-Shirt Gabriela Abigail 2025', 'Mari rayakan ulang tahun oshi kamu dengan memakai T-Shirt yang didesain sendiri oleh membernya! Periode pemesanan akan dimulai hari Rabu, 09 Juli 2025. Kamu bisa order produk ini di official Tokopedia JKT48. Pasti seru bisa kembaran baju dengan Ella!', 210000, 0, 0, '0.0', 0, '2025-08-22 07:37:02', '2025-08-22 07:37:02', 'https://ik.imagekit.io/yq7zp5yam/Tugas%20E-Commerce/bdts-ella.jpg?updatedAt=1755848165941');

-- --------------------------------------------------------

--
-- Table structure for table `product_categories`
--

CREATE TABLE `product_categories` (
  `category_id` int NOT NULL,
  `category_name` varchar(100) NOT NULL,
  `slug` varchar(100) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `product_categories`
--

INSERT INTO `product_categories` (`category_id`, `category_name`, `slug`, `image_url`) VALUES
(7, 'JKT48 Official Birthday T-Shirts', 'official-t-shirt-bdts', 'https://images.tokopedia.net/img/cache/200-square/aphluv/1997/1/1/6fd1d9cb7e3847aa898e7b6da00a0d01~.jpeg'),
(15, 'JKT48 Accessories', 'official-accesoris', 'https://images.tokopedia.net/img/cache/700/aphluv/1997/1/1/1ab98d5d48424cb68d3957b11b1e9863~.jpeg'),
(20, 'JKT48 Official T-Shirt', 'jkt48-official-t-shirt', 'https://images.tokopedia.net/img/cache/700/aphluv/1997/1/1/f7854efc40f04a83959c019393792244~.jpeg');

-- --------------------------------------------------------

--
-- Table structure for table `product_images`
--

CREATE TABLE `product_images` (
  `image_id` int NOT NULL,
  `product_id` int NOT NULL,
  `image_path` varchar(255) NOT NULL,
  `alt_text` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `product_images`
--

INSERT INTO `product_images` (`image_id`, `product_id`, `image_path`, `alt_text`) VALUES
(2, 14, 'https://images.tokopedia.net/img/cache/700/aphluv/1997/1/1/5d1912d8e72b41049351463d3ef3a35c~.jpeg', 'JKT48 Photocard Holder Collection - Cara Meminum Ramune'),
(3, 14, 'https://images.tokopedia.net/img/cache/700/aphluv/1997/1/1/df440e3f628d489ea7622b9402a4ecf9~.jpeg', 'Card Holder Pajama Drive'),
(4, 14, 'https://images.tokopedia.net/img/cache/700/aphluv/1997/1/1/2d4e22e25a4a4abc942144395e9114b1~.jpeg', 'Card Holder Black'),
(5, 13, 'https://images.tokopedia.net/img/cache/700/aphluv/1997/1/1/28de573e152c4cbd8f4cde1bdb785a8f~.jpeg', 'Lanyard Kusangatsuka Biru'),
(6, 13, 'https://images.tokopedia.net/img/cache/700/aphluv/1997/1/1/e3e4316e4d39466dbdc78a272a1341ca~.jpeg', 'Lanyard Kusangatsuka Cream'),
(7, 18, 'https://ik.imagekit.io/yq7zp5yam/Tugas%20E-Commerce/BDTS%20Fritzy/JKT48%20Birthday%20T-Shirt%20Fritzy%20Rosmerian%202025Mari%20rayakan%20ulang%20tahun%20oshi%20kamu%20dengan%20memakai%20T-.jpg?updatedAt=1755849623389', 'Menghadap Depan'),
(8, 18, 'https://ik.imagekit.io/yq7zp5yam/Tugas%20E-Commerce/BDTS%20Fritzy/JKT48%20Birthday%20T-Shirt%20Fritzy%20Rosmerian%202025Mari%20rayakan%20ulang%20tahun%20oshi%20kamu%20dengan%20memakai%20T-%20(1).jpg?updatedAt=1755849623124', 'Samping'),
(9, 18, 'https://ik.imagekit.io/yq7zp5yam/Tugas%20E-Commerce/BDTS%20Fritzy/JKT48%20Birthday%20T-Shirt%20Fritzy%20Rosmerian%202025Mari%20rayakan%20ulang%20tahun%20oshi%20kamu%20dengan%20memakai%20T-%20(2).jpg?updatedAt=1755849623033', 'Belakang'),
(11, 19, 'https://ik.imagekit.io/yq7zp5yam/Tugas%20E-Commerce/BDTS%20Ella/JKT48%20Birthday%20T-Shirt%20Gabriela%20Abigail%202025Mari%20rayakan%20ulang%20tahun%20oshi%20kamu%20dengan%20memakai%20T-.jpg?updatedAt=1755849844348', 'Ella Depan'),
(12, 19, 'https://ik.imagekit.io/yq7zp5yam/Tugas%20E-Commerce/BDTS%20Ella/JKT48%20Birthday%20T-Shirt%20Gabriela%20Abigail%202025Mari%20rayakan%20ulang%20tahun%20oshi%20kamu%20dengan%20memakai%20T-%20(1).jpg?updatedAt=1755849844227', 'Ella Samping'),
(13, 19, 'https://ik.imagekit.io/yq7zp5yam/Tugas%20E-Commerce/BDTS%20Ella/JKT48%20Birthday%20T-Shirt%20Gabriela%20Abigail%202025Mari%20rayakan%20ulang%20tahun%20oshi%20kamu%20dengan%20memakai%20T-%20(2).jpg?updatedAt=1755849844376', 'Ella Pose');

-- --------------------------------------------------------

--
-- Table structure for table `product_news`
--

CREATE TABLE `product_news` (
  `news_id` int NOT NULL,
  `product_id` int NOT NULL,
  `image_highlight` varchar(255) DEFAULT NULL,
  `highlight_link` varchar(255) DEFAULT NULL,
  `alt_text` varchar(255) DEFAULT NULL,
  `display_order` int DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `product_news`
--

INSERT INTO `product_news` (`news_id`, `product_id`, `image_highlight`, `highlight_link`, `alt_text`, `display_order`, `is_active`) VALUES
(5, 15, 'https://images.tokopedia.net/img/cache/700/aphluv/1997/1/1/f7854efc40f04a83959c019393792244~.jpeg', 'http://localhost:5173/detail/15', 'News highlight for JKT48 Official T-shirt - NEWERA (Black)', 1, 1),
(6, 18, 'https://ik.imagekit.io/yq7zp5yam/Tugas%20E-Commerce/BDTS%20Fritzy/JKT48%20Birthday%20T-Shirt%20Fritzy%20Rosmerian%202025Mari%20rayakan%20ulang%20tahun%20oshi%20kamu%20dengan%20memakai%20T-%20(1).jpg?updatedAt=1755849623124', 'http://localhost:5173/detail/18', 'News highlight for Birthday T-Shirt Fritzy Rosmerian 2025', 2, 1),
(8, 19, 'https://ik.imagekit.io/yq7zp5yam/Tugas%20E-Commerce/BDTS%20Ella/JKT48%20Birthday%20T-Shirt%20Gabriela%20Abigail%202025Mari%20rayakan%20ulang%20tahun%20oshi%20kamu%20dengan%20memakai%20T-%20(2).jpg?updatedAt=1755849844376', 'http://localhost:5173/detail/19', 'News highlight for JKT48 Birthday T-Shirt Gabriela Abigail 2025', 3, 1);

-- --------------------------------------------------------

--
-- Table structure for table `product_variants`
--

CREATE TABLE `product_variants` (
  `variant_id` int NOT NULL,
  `product_id` int NOT NULL,
  `color` varchar(50) DEFAULT NULL,
  `size` varchar(50) DEFAULT NULL,
  `variant_stock` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `product_variants`
--

INSERT INTO `product_variants` (`variant_id`, `product_id`, `color`, `size`, `variant_stock`) VALUES
(7, 12, 'All', 'All Size', 98),
(8, 13, 'Biru', 'All Size', 50),
(9, 13, 'Cream', 'All Size', 50),
(10, 14, 'Cara Meminum Ramune', 'All Size', 50),
(11, 14, 'Pajama Drive', 'All Size', 50),
(12, 14, 'Black', 'All Size', 50),
(13, 15, 'Black', 'S', 50),
(14, 15, 'Black', 'M', 50),
(15, 15, 'Black', 'L', 50),
(16, 15, 'Black', 'XL', 50),
(17, 16, 'Wonderland', 'S', 20),
(18, 16, 'Wonderland', 'M', 50),
(19, 16, 'Wonderland', 'L', 50),
(20, 16, 'Wonderland', 'XL', 50),
(21, 17, 'Yellow', 'L', 97),
(22, 18, 'Cream', 'L', 9),
(23, 18, 'Cream', 'M', 20);

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `review_id` int NOT NULL,
  `product_id` int NOT NULL,
  `user_id` int NOT NULL,
  `rating` tinyint NOT NULL,
  `comment` text,
  `review_date` datetime DEFAULT NULL,
  `order_id` int DEFAULT NULL,
  `admin_reply` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`review_id`, `product_id`, `user_id`, `rating`, `comment`, `review_date`, `order_id`, `admin_reply`) VALUES
(10, 12, 1, 5, 'bagus juga', '2025-08-22 07:20:24', 38, 'terimakasih');

-- --------------------------------------------------------

--
-- Table structure for table `review_replies`
--

CREATE TABLE `review_replies` (
  `reply_id` int NOT NULL,
  `review_id` int NOT NULL,
  `admin_id` int NOT NULL,
  `reply_date` datetime DEFAULT NULL,
  `reply_text` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `transaction_id` int NOT NULL,
  `order_id` int NOT NULL,
  `payment_gateway_ref` varchar(255) DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `currency` varchar(5) NOT NULL,
  `transaction_status` enum('pending','success','failed','refunded') NOT NULL,
  `transaction_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `address` text,
  `city` varchar(100) DEFAULT NULL,
  `postal_code` varchar(10) DEFAULT NULL,
  `role` enum('admin','customer') NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `full_name`, `email`, `password_hash`, `phone_number`, `address`, `city`, `postal_code`, `role`, `created_at`, `updated_at`) VALUES
(1, 'Rendi Sutendi', 'rendisutendi10@gmail.com', '$2b$10$u.YhgHX.cwJNq9WecUkgYuwtVNS7ZVKiMfCsKCgAUT1SoBQbJzxM2', '085721451615', 'Jalan Arjuna Simpang', 'Bandung', '40182', 'customer', '2025-08-03 17:40:30', '2025-08-15 17:51:27'),
(5, 'Hilman', 'hilmanfatu@gmail.com', '$2b$10$4wnmdfbboD6os8rnJycA7uPPlXUdARtfwd10stSDfbyxuWToTucIq', NULL, NULL, NULL, NULL, 'admin', '2025-08-05 17:49:27', '2025-08-05 17:49:27');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`cart_id`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- Indexes for table `cart_items`
--
ALTER TABLE `cart_items`
  ADD PRIMARY KEY (`cart_item_id`),
  ADD KEY `cart_id` (`cart_id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `variant_id` (`variant_id`);

--
-- Indexes for table `complaints`
--
ALTER TABLE `complaints`
  ADD PRIMARY KEY (`complaint_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `order_id` (`order_id`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`message_id`),
  ADD KEY `sender_id` (`sender_id`),
  ADD KEY `recipient_id` (`recipient_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`order_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`order_item_id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `variant_id` (`variant_id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`payment_id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`product_id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `product_categories`
--
ALTER TABLE `product_categories`
  ADD PRIMARY KEY (`category_id`),
  ADD UNIQUE KEY `category_name` (`category_name`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD UNIQUE KEY `category_name_2` (`category_name`),
  ADD UNIQUE KEY `slug_2` (`slug`),
  ADD UNIQUE KEY `category_name_3` (`category_name`),
  ADD UNIQUE KEY `slug_3` (`slug`),
  ADD UNIQUE KEY `category_name_4` (`category_name`),
  ADD UNIQUE KEY `slug_4` (`slug`),
  ADD UNIQUE KEY `category_name_5` (`category_name`),
  ADD UNIQUE KEY `slug_5` (`slug`),
  ADD UNIQUE KEY `category_name_6` (`category_name`),
  ADD UNIQUE KEY `slug_6` (`slug`),
  ADD UNIQUE KEY `category_name_7` (`category_name`),
  ADD UNIQUE KEY `slug_7` (`slug`),
  ADD UNIQUE KEY `category_name_8` (`category_name`),
  ADD UNIQUE KEY `slug_8` (`slug`),
  ADD UNIQUE KEY `category_name_9` (`category_name`),
  ADD UNIQUE KEY `slug_9` (`slug`),
  ADD UNIQUE KEY `category_name_10` (`category_name`),
  ADD UNIQUE KEY `slug_10` (`slug`),
  ADD UNIQUE KEY `category_name_11` (`category_name`),
  ADD UNIQUE KEY `slug_11` (`slug`),
  ADD UNIQUE KEY `category_name_12` (`category_name`),
  ADD UNIQUE KEY `slug_12` (`slug`),
  ADD UNIQUE KEY `category_name_13` (`category_name`),
  ADD UNIQUE KEY `slug_13` (`slug`),
  ADD UNIQUE KEY `category_name_14` (`category_name`),
  ADD UNIQUE KEY `slug_14` (`slug`),
  ADD UNIQUE KEY `category_name_15` (`category_name`),
  ADD UNIQUE KEY `slug_15` (`slug`),
  ADD UNIQUE KEY `category_name_16` (`category_name`),
  ADD UNIQUE KEY `slug_16` (`slug`),
  ADD UNIQUE KEY `category_name_17` (`category_name`),
  ADD UNIQUE KEY `slug_17` (`slug`),
  ADD UNIQUE KEY `category_name_18` (`category_name`),
  ADD UNIQUE KEY `slug_18` (`slug`),
  ADD UNIQUE KEY `category_name_19` (`category_name`),
  ADD UNIQUE KEY `slug_19` (`slug`),
  ADD UNIQUE KEY `category_name_20` (`category_name`),
  ADD UNIQUE KEY `slug_20` (`slug`),
  ADD UNIQUE KEY `category_name_21` (`category_name`),
  ADD UNIQUE KEY `slug_21` (`slug`),
  ADD UNIQUE KEY `category_name_22` (`category_name`),
  ADD UNIQUE KEY `slug_22` (`slug`),
  ADD UNIQUE KEY `category_name_23` (`category_name`),
  ADD UNIQUE KEY `slug_23` (`slug`),
  ADD UNIQUE KEY `category_name_24` (`category_name`),
  ADD UNIQUE KEY `slug_24` (`slug`),
  ADD UNIQUE KEY `category_name_25` (`category_name`),
  ADD UNIQUE KEY `slug_25` (`slug`),
  ADD UNIQUE KEY `category_name_26` (`category_name`),
  ADD UNIQUE KEY `slug_26` (`slug`),
  ADD UNIQUE KEY `category_name_27` (`category_name`),
  ADD UNIQUE KEY `slug_27` (`slug`),
  ADD UNIQUE KEY `category_name_28` (`category_name`),
  ADD UNIQUE KEY `slug_28` (`slug`),
  ADD UNIQUE KEY `category_name_29` (`category_name`),
  ADD UNIQUE KEY `slug_29` (`slug`),
  ADD UNIQUE KEY `category_name_30` (`category_name`),
  ADD UNIQUE KEY `slug_30` (`slug`),
  ADD UNIQUE KEY `category_name_31` (`category_name`),
  ADD UNIQUE KEY `slug_31` (`slug`),
  ADD UNIQUE KEY `category_name_32` (`category_name`);

--
-- Indexes for table `product_images`
--
ALTER TABLE `product_images`
  ADD PRIMARY KEY (`image_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `product_news`
--
ALTER TABLE `product_news`
  ADD PRIMARY KEY (`news_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `product_variants`
--
ALTER TABLE `product_variants`
  ADD PRIMARY KEY (`variant_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`review_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `review_replies`
--
ALTER TABLE `review_replies`
  ADD PRIMARY KEY (`reply_id`),
  ADD KEY `review_id` (`review_id`),
  ADD KEY `admin_id` (`admin_id`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`transaction_id`),
  ADD KEY `order_id` (`order_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cart`
--
ALTER TABLE `cart`
  MODIFY `cart_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `cart_items`
--
ALTER TABLE `cart_items`
  MODIFY `cart_item_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

--
-- AUTO_INCREMENT for table `complaints`
--
ALTER TABLE `complaints`
  MODIFY `complaint_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `message_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `order_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `order_item_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `payment_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `product_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `product_categories`
--
ALTER TABLE `product_categories`
  MODIFY `category_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `product_images`
--
ALTER TABLE `product_images`
  MODIFY `image_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `product_news`
--
ALTER TABLE `product_news`
  MODIFY `news_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `product_variants`
--
ALTER TABLE `product_variants`
  MODIFY `variant_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `review_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `review_replies`
--
ALTER TABLE `review_replies`
  MODIFY `reply_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `transaction_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cart`
--
ALTER TABLE `cart`
  ADD CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `cart_items`
--
ALTER TABLE `cart_items`
  ADD CONSTRAINT `cart_items_ibfk_1` FOREIGN KEY (`cart_id`) REFERENCES `cart` (`cart_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `cart_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `cart_items_ibfk_3` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`variant_id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `complaints`
--
ALTER TABLE `complaints`
  ADD CONSTRAINT `complaints_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `complaints_ibfk_2` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`sender_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`recipient_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_3` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`variant_id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_7` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `payments_ibfk_8` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `product_categories` (`category_id`) ON UPDATE CASCADE;

--
-- Constraints for table `product_images`
--
ALTER TABLE `product_images`
  ADD CONSTRAINT `product_images_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `product_news`
--
ALTER TABLE `product_news`
  ADD CONSTRAINT `product_news_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `product_variants`
--
ALTER TABLE `product_variants`
  ADD CONSTRAINT `product_variants_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_18` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `reviews_ibfk_19` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `reviews_ibfk_20` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `review_replies`
--
ALTER TABLE `review_replies`
  ADD CONSTRAINT `review_replies_ibfk_73` FOREIGN KEY (`review_id`) REFERENCES `reviews` (`review_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `review_replies_ibfk_74` FOREIGN KEY (`admin_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
