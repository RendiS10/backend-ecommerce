const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const { body } = require("express-validator");
const { isAuthenticated } = require("../middlewares/auth");

// GET reviews untuk produk tertentu
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

// GET produk yang bisa direview dari order tertentu
router.get(
  "/order/:order_id/reviewable",
  isAuthenticated,
  reviewController.getReviewableProducts
);

// GET review milik user yang login
router.get(
  "/user/my-reviews",
  isAuthenticated,
  reviewController.getUserReviews
);

module.exports = router;
