const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const { body } = require("express-validator");
const { isAuthenticated } = require("../middlewares/auth");

// GET all reviews (untuk admin)
router.get("/", reviewController.getAllReviews);

// TEST ROUTE SIMPLE
router.get("/test", (req, res) => {
  res.json({ message: "Test route works!" });
});

// POST create review untuk admin (harus di atas /:review_id)
router.post("/admin", reviewController.createReviewAdmin);

// PUT reply to review (untuk admin) - Pattern: /reply/:review_id (harus di atas /:review_id)
router.put(
  "/reply/:review_id",
  (req, res, next) => {
    console.log("🔥 Reply route called! Review ID:", req.params.review_id);
    console.log("📝 Request body:", req.body);
    next();
  },
  reviewController.replyToReview
);

// GET produk yang bisa direview dari order tertentu (harus di atas /:review_id)
router.get(
  "/order/:order_id/reviewable",
  isAuthenticated,
  reviewController.getReviewableProducts
);

// GET review milik user yang login (harus di atas /:review_id)
router.get(
  "/user/my-reviews",
  isAuthenticated,
  reviewController.getUserReviews
);

// GET reviews untuk produk tertentu (harus di atas /:review_id)
router.get("/product/:product_id", reviewController.getProductReviews);

// POST create review baru (setelah order selesai)
router.post(
  "/",
  isAuthenticated,
  [
    body("order_id").isInt(),
    body("product_id").isInt(),
    body("rating").isInt({ min: 1, max: 5 }),
  ],
  reviewController.createReview
);

// PUT update review (untuk admin) - Ini harus di bawah semua routes spesifik
router.put("/:review_id", reviewController.updateReview);

// DELETE review (untuk admin) - Ini harus di bawah semua routes spesifik
router.delete("/:review_id", reviewController.deleteReview);

module.exports = router;
