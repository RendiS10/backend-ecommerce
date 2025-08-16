// =============================================================================
// PAYMENT ROUTES - Routes untuk mengelola pembayaran transfer
// =============================================================================

const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const { isAuthenticated } = require("../middlewares/auth");

// =============================================================================
// CUSTOMER ROUTES
// =============================================================================

// POST /api/payments/:order_id - Membuat payment untuk order
router.post("/:order_id", isAuthenticated, paymentController.createPayment);

// PUT /api/payments/:payment_id/confirm - Konfirmasi pembayaran oleh customer
router.put(
  "/:payment_id/confirm",
  isAuthenticated,
  paymentController.confirmPayment
);

// GET /api/payments/user - Mengambil payment user yang login
router.get("/user", isAuthenticated, paymentController.getUserPayments);

// GET /api/payments/order/:order_id - Mengambil payment berdasarkan order_id
router.get(
  "/order/:order_id",
  isAuthenticated,
  paymentController.getPaymentByOrder
);

// =============================================================================
// ADMIN ROUTES
// =============================================================================

// GET /api/payments/all - Admin mengambil semua payment
router.get("/all", isAuthenticated, paymentController.getAllPayments);

// PUT /api/payments/:payment_id/approve - Admin menyetujui payment
router.put(
  "/:payment_id/approve",
  isAuthenticated,
  paymentController.approvePayment
);

// PUT /api/payments/:payment_id/reject - Admin menolak payment
router.put(
  "/:payment_id/reject",
  isAuthenticated,
  paymentController.rejectPayment
);

module.exports = router;
