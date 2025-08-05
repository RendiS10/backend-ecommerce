const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const { body } = require("express-validator");
const { isAuthenticated } = require("../middlewares/auth");

router.get("/", isAuthenticated, cartController.getCart);
router.post(
  "/",
  isAuthenticated,
  [body("product_id").isNumeric(), body("quantity").isInt({ min: 1 })],
  cartController.addToCart
);
router.put(
  "/:cart_item_id",
  isAuthenticated,
  [body("quantity").isInt({ min: 1 })],
  cartController.updateCartItem
);
router.delete("/:cart_item_id", isAuthenticated, cartController.removeCartItem);

module.exports = router;
