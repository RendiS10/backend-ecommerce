const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { body } = require("express-validator");
const { isAuthenticated, isAdmin } = require("../middlewares/auth");
const upload = require("../middlewares/upload");

// GET user orders
router.get("/", isAuthenticated, orderController.getUserOrders);

// CREATE new order
router.post(
  "/",
  isAuthenticated,
  [
    body("shipping_address").isObject(),
    body("payment_method").isIn(["transfer", "cod"]),
    body("cart_items").isArray({ min: 1 }),
  ],
  orderController.createOrder
);

// UPLOAD payment proof for transfer orders
router.post(
  "/payment-proof",
  isAuthenticated,
  upload.single("payment_proof"),
  orderController.uploadPaymentProof
);

// CONFIRM COD order
router.put(
  "/:order_id/confirm-cod",
  isAuthenticated,
  orderController.confirmCODOrder
);

// UPDATE order status (admin only)
router.put(
  "/:order_id/status",
  isAdmin,
  [
    body("order_status").isIn([
      "pending_payment",
      "payment_uploaded",
      "processing",
      "shipped",
      "delivered",
      "completed",
      "cancelled",
    ]),
  ],
  orderController.updateOrderStatus
);

module.exports = router;
