const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { body } = require("express-validator");
const { isAuthenticated, isAdmin } = require("../middlewares/auth");
const upload = require("../middlewares/upload");

// GET user orders
router.get("/", isAuthenticated, orderController.getUserOrders);

// GET all orders (admin only)
router.get("/all", isAuthenticated, isAdmin, orderController.getAllOrders);

// CREATE new order
router.post(
  "/",
  isAuthenticated,
  [
    body("shipping_address").isObject(),
    body("payment_method").isIn(["cod"]),
    body("cart_items").isArray({ min: 1 }),
  ],
  orderController.createOrder
);

// CONFIRM COD order
router.patch(
  "/:order_id/confirm-cod",
  isAuthenticated,
  orderController.confirmCODOrder
);

// CANCEL order (customer)
router.patch("/:order_id/cancel", isAuthenticated, orderController.cancelOrder);

// UPDATE order status (admin only)
router.patch(
  "/:order_id/status",
  isAuthenticated,
  isAdmin,
  [
    body("order_status").isIn([
      "Menunggu Konfirmasi",
      "Diproses",
      "Dikirim",
      "Selesai",
      "Dibatalkan",
    ]),
  ],
  orderController.updateOrderStatus
);

module.exports = router;
