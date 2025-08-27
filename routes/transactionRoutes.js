const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController");
const { body } = require("express-validator");
const { isAuthenticated, isAdmin } = require("../middlewares/auth");

// Route untuk admin - mengambil semua transaksi berdasarkan penjualan
router.get(
  "/",
  isAuthenticated,
  isAdmin,
  transactionController.getAllTransactions
);

// Route untuk admin - mengambil statistik transaksi
router.get(
  "/stats",
  isAuthenticated,
  isAdmin,
  transactionController.getTransactionStats
);

module.exports = router;
