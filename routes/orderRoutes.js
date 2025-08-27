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

// GET pending notifications (admin only)
router.get(
  "/notifications",
  isAuthenticated,
  isAdmin,
  orderController.getPendingNotifications
);

// CREATE new order
router.post(
  "/",
  isAuthenticated,
  [
    body("shipping_address").isObject(),
    body("payment_method").isIn(["transfer"]),
    body("cart_items").isArray({ min: 1 }),
  ],
  orderController.createOrder
);

// CANCEL order (customer)
router.patch("/:order_id/cancel", isAuthenticated, orderController.cancelOrder);

// CONFIRM order received (customer)
router.patch(
  "/:order_id/confirm-received",
  isAuthenticated,
  orderController.confirmOrderReceived
);

// UPDATE order status (admin only)
router.patch(
  "/:order_id/status",
  isAuthenticated,
  isAdmin,
  [
    body("order_status").isIn([
      "Menunggu Konfirmasi",
      "Disetujui",
      "Akan Dikirimkan",
      "Dikirim",
      "Selesai",
      "Dibatalkan",
    ]),
  ],
  orderController.updateOrderStatus
);

module.exports = router;
