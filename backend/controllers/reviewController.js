// =============================================================================
// REVIEW CONTROLLER - Controller untuk mengelola review/rating produk
// =============================================================================

// Mengimpor model yang dibutuhkan untuk operasi review
const { Review, Product, User, Order, OrderItem } = require("../models");

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
    // Ambil data dari request
    const user_id = req.user.user_id;
    const { order_id, product_id, rating, comment } = req.body;

    // Validasi input
    if (!order_id || !product_id || !rating) {
      return res.status(400).json({
        message: "Order ID, Product ID, dan rating harus diisi",
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        message: "Rating harus antara 1-5",
      });
    }

    // Cek apakah order exists dan milik user
    const order = await Order.findOne({
      where: { order_id, user_id },
      include: [
        {
          model: OrderItem,
          where: { product_id },
        },
      ],
    });

    if (!order) {
      return res.status(404).json({
        message:
          "Pesanan tidak ditemukan atau produk tidak ada dalam pesanan Anda",
      });
    }

    // Cek apakah order sudah selesai
    if (order.order_status !== "Selesai") {
      return res.status(400).json({
        message: "Review hanya dapat dibuat setelah pesanan selesai",
      });
    }

    // Cek apakah review sudah ada
    const existingReview = await Review.findOne({
      where: { order_id, product_id, user_id },
    });

    if (existingReview) {
      return res.status(400).json({
        message: "Anda sudah memberikan review untuk produk ini",
      });
    }

    // Buat review baru di database
    const review = await Review.create({
      order_id,
      product_id, // ID produk yang direview
      user_id, // ID user yang memberikan review
      rating, // Rating 1-5 bintang
      comment: comment || "", // Komentar/ulasan customer
    });

    // Kirim response dengan review yang baru dibuat
    res.status(201).json({
      message: "Review berhasil dibuat",
      review,
    });
  } catch (err) {
    // Handle error (validation error, duplicate review, dll)
    console.error("Error creating review:", err);
    res.status(500).json({ message: err.message });
  }
};

// =============================================================================
// GET REVIEWABLE PRODUCTS - Mengambil produk yang bisa direview dari order yang selesai
// =============================================================================
exports.getReviewableProducts = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const { order_id } = req.params;

    // Cari order yang selesai
    const order = await Order.findOne({
      where: {
        order_id,
        user_id,
        order_status: "Selesai",
      },
      include: [
        {
          model: OrderItem,
          include: [
            {
              model: Product,
              attributes: ["product_id", "product_name", "image_url"],
            },
          ],
        },
      ],
    });

    if (!order) {
      return res.status(404).json({
        message: "Pesanan tidak ditemukan atau belum selesai",
      });
    }

    // Ambil produk yang sudah direview
    const existingReviews = await Review.findAll({
      where: { order_id, user_id },
      attributes: ["product_id"],
    });

    const reviewedProductIds = existingReviews.map((r) => r.product_id);

    // Filter produk yang belum direview
    const reviewableProducts = order.OrderItems.map((item) => ({
      ...item.toJSON(),
      already_reviewed: reviewedProductIds.includes(item.product_id),
    }));

    res.json({
      order_id: order.order_id,
      products: reviewableProducts,
    });
  } catch (error) {
    console.error("Error fetching reviewable products:", error);
    res.status(500).json({ message: error.message });
  }
};

// =============================================================================
// GET USER REVIEWS - Mengambil semua review milik user
// =============================================================================
exports.getUserReviews = async (req, res) => {
  try {
    const user_id = req.user.user_id;

    const reviews = await Review.findAll({
      where: { user_id },
      include: [
        {
          model: Product,
          attributes: ["product_id", "product_name", "image_url"],
        },
      ],
      order: [["review_date", "DESC"]],
    });

    res.json(reviews);
  } catch (error) {
    console.error("Error fetching user reviews:", error);
    res.status(500).json({ message: error.message });
  }
};
