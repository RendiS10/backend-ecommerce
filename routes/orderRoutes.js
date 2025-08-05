const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { body } = require("express-validator");
const { isAuthenticated, isAdmin } = require("../middlewares/auth");

router.get("/", isAuthenticated, orderController.getUserOrders);
router.post(
  "/",
  isAuthenticated,
  [
    body("items").isArray({ min: 1 }),
    body("total_amount").isNumeric(),
    body("payment_method").notEmpty(),
    body("shipping_address").notEmpty(),
    body("shipping_city").notEmpty(),
    body("shipping_postal_code").notEmpty(),
  ],
  orderController.createOrder
);
router.put(
  "/:order_id/status",
  isAdmin,
  [
    body("order_status").isIn([
      "pending_payment",
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
