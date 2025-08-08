// =============================================================================
// REVIEW CONTROLLER - Controller untuk mengelola review/rating produk
// =============================================================================

// Mengimpor model yang dibutuhkan untuk operasi review
const { Review, Product, User } = require("../models");

// =============================================================================
// GET PRODUCT REVIEWS - Mengambil semua review untuk produk tertentu
// =============================================================================
exports.getProductReviews = async (req, res) => {
  try {
    // Ambil product_id dari URL parameter (/api/reviews/product/:product_id)
    const { product_id } = req.params;

    // Cari semua review untuk produk tersebut dengan info user
    const reviews = await Review.findAll({
      where: { product_id }, // Filter berdasarkan product_id
      include: [User], // Join dengan tabel User untuk nama reviewer
    });

    // Kirim response dengan daftar review
    res.json(reviews);
  } catch (err) {
    // Handle error database
    res.status(500).json({ message: err.message });
  }
};

// =============================================================================
// CREATE REVIEW - Membuat review baru untuk produk (Customer only)
// =============================================================================
exports.createReview = async (req, res) => {
  try {
    // Ambil product_id dari URL parameter
    const { product_id } = req.params;

    // Ambil rating dan komentar dari request body
    const { rating, comment } = req.body;

    // Ambil user_id dari token JWT (user yang sedang login)
    const user_id = req.user.user_id;

    // Buat review baru di database
    const review = await Review.create({
      product_id, // ID produk yang direview
      user_id, // ID user yang memberikan review
      rating, // Rating 1-5 bintang
      comment, // Komentar/ulasan customer
    });

    // Kirim response dengan review yang baru dibuat
    res.status(201).json(review);
  } catch (err) {
    // Handle error (validation error, duplicate review, dll)
    res.status(500).json({ message: err.message });
  }
};
