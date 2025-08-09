// Mengimpor konfigurasi database Sequelize untuk koneksi ke MySQL
const sequelize = require("./config/database");

// Mengimpor Express.js - framework web untuk Node.js yang menyediakan fitur server HTTP
const express = require("express");

// Mengimpor CORS - middleware untuk mengatur Cross-Origin Resource Sharing
// Memungkinkan frontend (localhost:5173) mengakses backend (localhost:5000)
const cors = require("cors");

// Mengimpor Morgan - middleware untuk logging HTTP requests (mencatat setiap request masuk)
const morgan = require("morgan");

// Mengimpor Helmet - middleware keamanan yang menambahkan security headers
const helmet = require("helmet");

// Mengimpor Body Parser - middleware untuk parsing request body dari JSON ke JavaScript object
const bodyParser = require("body-parser");

// Mengimpor Path - utility Node.js untuk mengelola dan manipulasi path file/folder
const path = require("path");

// Memuat environment variables dari file .env (seperti DB_NAME, JWT_SECRET, dll)
require("dotenv").config();

// Membuat instance aplikasi Express yang akan menjadi server utama
const app = express();

// Middleware CORS - Mengatur Cross-Origin Resource Sharing
// Mengizinkan frontend dari domain berbeda untuk mengakses API backend
app.use(
  cors({
    // Daftar URL frontend yang diizinkan mengakses backend
    origin: [
      "http://localhost:5173", // Vite development server (port utama)
      "http://localhost:5174", // Vite development server (port alternatif)
      "http://localhost:3000", // React/Next.js development server
      "http://127.0.0.1:5173", // IP address version untuk Vite
      "http://127.0.0.1:5174", // IP address version untuk Vite alternatif
    ],
    // Mengizinkan pengiriman cookies dan header authentication
    credentials: true,
  })
);

// Middleware Helmet - Menambahkan security headers untuk melindungi dari serangan web
// (XSS protection, content type sniffing protection, clickjacking protection, dll)
app.use(helmet());

// Middleware Morgan - Logging setiap HTTP request yang masuk ke server
// Format "dev" memberikan output berwarna untuk development
app.use(morgan("dev"));

// Middleware Body Parser - Mengparse JSON request body menjadi JavaScript object
// Memungkinkan kita mengakses data JSON via req.body
app.use(bodyParser.json());
// =============================================================================
// STATIC FILES CONFIGURATION - Konfigurasi untuk melayani file statis
// =============================================================================

// Melayani file statis dari folder "public" (CSS, JS, HTML)
// File dapat diakses langsung via URL tanpa prefix (contoh: /style.css)
app.use(express.static(path.join(__dirname, "public")));

// Melayani file statis dari folder "public" dengan prefix "/public"
// File dapat diakses via URL: /public/filename (contoh: /public/style.css)
app.use("/public", express.static("public"));

// =============================================================================
// UPLOADS FOLDER CONFIGURATION - Konfigurasi khusus untuk folder uploads
// =============================================================================

// Middleware khusus untuk folder uploads (gambar produk, avatar user, dll)
app.use("/uploads", (req, res, next) => {
  // Mengatur header CORS untuk mengizinkan akses gambar dari semua origin
  // Diperlukan karena gambar di-load dari frontend yang berbeda domain
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Mengatur policy untuk resource sharing lintas origin
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");

  // Handle preflight OPTIONS request untuk CORS
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next(); // Lanjutkan ke middleware berikutnya
  }
});

// Melayani file statis dari folder "uploads" dengan prefix "/uploads"
// File gambar dapat diakses via: /uploads/filename.jpg
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// =============================================================================
// ROUTES REGISTRATION - Mendaftarkan semua routes/endpoint API
// =============================================================================

// Authentication Routes - Endpoint untuk login, register, logout
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes); // /api/auth/login, /api/auth/register

// Product Routes - Endpoint untuk CRUD produk (photocard, album, merchandise)
const productRoutes = require("./routes/productRoutes");
app.use("/api/products", productRoutes); // /api/products, /api/products/:id

// Category Routes - Endpoint untuk CRUD kategori produk
const categoryRoutes = require("./routes/categoryRoutes");
app.use("/api/categories", categoryRoutes); // /api/categories, /api/categories/:id

// News Routes - Endpoint untuk CRUD berita/pengumuman JKT48
const newsRoutes = require("./routes/newsRoutes");
app.use("/api/news", newsRoutes); // /api/news, /api/news/:id

// Review Routes - Endpoint untuk CRUD review/rating produk
const reviewRoutes = require("./routes/reviewRoutes");
app.use("/api/reviews", reviewRoutes); // /api/reviews, /api/reviews/:id

// Complaint Routes - Endpoint untuk CRUD keluhan pelanggan
const complaintRoutes = require("./routes/complaintRoutes");
app.use("/api/complaints", complaintRoutes); // /api/complaints, /api/complaints/:id

// Cart Routes - Endpoint untuk keranjang belanja (add, remove, view)
const cartRoutes = require("./routes/cartRoutes");
app.use("/api/cart", cartRoutes); // /api/cart, /api/cart/add, /api/cart/remove

// Order Routes - Endpoint untuk pesanan (create, view, update status)
const orderRoutes = require("./routes/orderRoutes");
app.use("/api/orders", orderRoutes); // /api/orders, /api/orders/:id

// Transaction Routes - Endpoint untuk transaksi pembayaran
const transactionRoutes = require("./routes/transactionRoutes");
app.use("/api/transactions", transactionRoutes); // /api/transactions, /api/transactions/:id

// Message Routes - Endpoint untuk live chat/komunikasi customer service
const messageRoutes = require("./routes/messageRoutes");
app.use("/api/messages", messageRoutes); // /api/messages, /api/messages/send

// Variants Routes - Endpoint untuk varian produk (size, color, dll)
const variantsRoutes = require("./routes/variantsRoutes");
app.use("/api/variants", variantsRoutes); // /api/variants, /api/variants/:id

// Product Image Routes - Endpoint untuk CRUD gambar produk
const productImageRoutes = require("./routes/productImageRoutes");
app.use("/api/product-images", productImageRoutes); // /api/product-images, /api/product-images/:id

// User Routes - Endpoint untuk CRUD users
const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes); // /api/users, /api/users/:id

// =============================================================================
// DATABASE CONNECTION & SERVER STARTUP - Koneksi database dan start server
// =============================================================================

// Melakukan sinkronisasi database dengan model Sequelize
// Membuat/update tabel sesuai dengan definisi model yang ada
sequelize.sync().then(() => {
  // Menjalankan server Express pada port 5000 setelah database berhasil tersambung
  // Server akan siap menerima request HTTP dari frontend
  app.listen(5000, () => console.log("Server Berjalan di port 5000"));
});
