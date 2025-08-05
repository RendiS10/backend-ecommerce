const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const { body } = require("express-validator");
const { isAuthenticated } = require("../middlewares/auth");

router.get("/:product_id", reviewController.getProductReviews);
router.post(
  "/:product_id",
  isAuthenticated,
  [body("rating").isInt({ min: 1, max: 5 })],
  reviewController.createReview
);

module.exports = router;
