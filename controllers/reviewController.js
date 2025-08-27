// =============================================================================
// REVIEW CONTROLLER - Controller untuk mengelola review/rating produk
// =============================================================================

// Mengimpor model yang dibutuhkan untuk operasi review
const { Review, Product, User, Order, OrderItem } = require("../models");
const { updateProductRatings } = require("./productController");

// =============================================================================
// GET ALL REVIEWS - Mengambil semua review (untuk admin)
// =============================================================================
exports.getAllReviews = async (req, res) => {
  try {
    // Cari semua review dengan info product dan user
    const reviews = await Review.findAll({
      include: [
        {
          model: Product,
          attributes: ["product_id", "product_name"],
        },
        {
          model: User,
          attributes: ["user_id", "full_name", "email"],
        },
      ],
      order: [["review_date", "DESC"]], // Urutkan berdasarkan tanggal terbaru
    });

    // Kirim response dengan daftar semua review
    res.json(reviews);
  } catch (err) {
    // Handle error database
    console.error("Error fetching all reviews:", err);
    res.status(500).json({ message: err.message });
  }
};

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

    // Update rating dan total review pada produk
    await updateProductRatings(product_id);

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

// =============================================================================
// UPDATE REVIEW - Update review (untuk admin)
// =============================================================================
exports.updateReview = async (req, res) => {
  try {
    const { review_id } = req.params;
    const { product_id, user_id, rating, comment } = req.body;

    // Validasi input
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        message: "Rating harus antara 1-5",
      });
    }

    // Cari review yang akan diupdate
    const review = await Review.findByPk(review_id);
    if (!review) {
      return res.status(404).json({
        message: "Review tidak ditemukan",
      });
    }

    // Update review
    await review.update({
      product_id,
      user_id,
      rating,
      comment,
    });

    // Ambil review yang sudah diupdate dengan include
    const updatedReview = await Review.findByPk(review_id, {
      include: [
        {
          model: Product,
          attributes: ["product_id", "product_name"],
        },
        {
          model: User,
          attributes: ["user_id", "full_name", "email"],
        },
      ],
    });

    res.json({
      message: "Review berhasil diupdate",
      review: updatedReview,
    });
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({ message: error.message });
  }
};

// =============================================================================
// DELETE REVIEW - Hapus review (untuk admin)
// =============================================================================
exports.deleteReview = async (req, res) => {
  try {
    const { review_id } = req.params;

    // Cari review yang akan dihapus
    const review = await Review.findByPk(review_id);
    if (!review) {
      return res.status(404).json({
        message: "Review tidak ditemukan",
      });
    }

    // Hapus review
    await review.destroy();

    res.json({
      message: "Review berhasil dihapus",
    });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ message: error.message });
  }
};

// =============================================================================
// CREATE REVIEW FOR ADMIN - Membuat review baru (untuk admin)
// =============================================================================
exports.createReviewAdmin = async (req, res) => {
  try {
    const { product_id, user_id, rating, comment } = req.body;

    // Validasi input
    if (!product_id || !user_id || !rating) {
      return res.status(400).json({
        message: "Product ID, User ID, dan rating harus diisi",
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        message: "Rating harus antara 1-5",
      });
    }

    // Cek apakah product dan user exist
    const product = await Product.findByPk(product_id);
    const user = await User.findByPk(user_id);

    if (!product) {
      return res.status(404).json({
        message: "Produk tidak ditemukan",
      });
    }

    if (!user) {
      return res.status(404).json({
        message: "User tidak ditemukan",
      });
    }

    // Buat review baru
    const newReview = await Review.create({
      product_id,
      user_id,
      rating,
      comment: comment || "",
      review_date: new Date(),
    });

    // Ambil review yang baru dibuat dengan include
    const createdReview = await Review.findByPk(newReview.review_id, {
      include: [
        {
          model: Product,
          attributes: ["product_id", "product_name"],
        },
        {
          model: User,
          attributes: ["user_id", "full_name", "email"],
        },
      ],
    });

    res.status(201).json({
      message: "Review berhasil dibuat",
      review: createdReview,
    });
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ message: error.message });
  }
};

// =============================================================================
// REPLY TO REVIEW - Admin membalas review customer
// =============================================================================
exports.replyToReview = async (req, res) => {
  try {
    console.log("🎯 ReplyToReview controller called!");
    console.log("📋 Params:", req.params);
    console.log("📝 Body:", req.body);

    const { review_id } = req.params;
    const { admin_reply } = req.body;

    // Validasi input
    if (!admin_reply || admin_reply.trim() === "") {
      console.log("❌ Validation failed: admin_reply is empty");
      return res.status(400).json({
        message: "Admin reply tidak boleh kosong",
      });
    }

    // Cari review yang akan dibalas
    const review = await Review.findByPk(review_id);
    if (!review) {
      return res.status(404).json({
        message: "Review tidak ditemukan",
      });
    }

    // Update review dengan admin reply
    await review.update({
      admin_reply: admin_reply.trim(),
    });

    // Ambil review yang sudah diupdate dengan include
    const updatedReview = await Review.findByPk(review_id, {
      include: [
        {
          model: Product,
          attributes: ["product_id", "product_name"],
        },
        {
          model: User,
          attributes: ["user_id", "full_name", "email"],
        },
      ],
    });

    res.json({
      message: "Reply berhasil disimpan",
      review: updatedReview,
    });
  } catch (error) {
    console.error("Error replying to review:", error);
    res.status(500).json({ message: error.message });
  }
};
