// =============================================================================
// AUTH MIDDLEWARE - Middleware untuk autentikasi dan autorisasi user
// =============================================================================

// Mengimpor jsonwebtoken untuk verifikasi JWT token
const jwt = require("jsonwebtoken");

// Memuat environment variables (JWT_SECRET)
require("dotenv").config();

// =============================================================================
// AUTHENTICATION MIDDLEWARE - Cek apakah user sudah login (ada token valid)
// =============================================================================
exports.isAuthenticated = (req, res, next) => {
  // 1. Ambil token dari header Authorization (format: "Bearer <token>")
  const token = req.headers["authorization"]?.split(" ")[1];

  // 2. Cek apakah token ada, jika tidak ada maka user belum login
  if (!token) return res.status(401).json({ message: "No token provided" });

  // 3. Verifikasi token menggunakan JWT secret
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    // Jika token tidak valid (expired, manipulated, wrong secret)
    if (err) return res.status(401).json({ message: "Invalid token" });

    // 4. Simpan data user dari token ke req.user untuk digunakan di controller
    req.user = decoded; // { user_id, role, iat, exp }

    // 5. Lanjutkan ke middleware/controller berikutnya
    next();
  });
};

// =============================================================================
// ADMIN AUTHORIZATION MIDDLEWARE - Cek apakah user adalah admin
// =============================================================================
exports.isAdmin = (req, res, next) => {
  // Cek apakah role user adalah "admin" (harus dipanggil setelah isAuthenticated)
  if (req.user?.role !== "admin")
    return res.status(403).json({ message: "Admin only" });

  // Jika user adalah admin, lanjutkan ke controller
  next();
};
