// =============================================================================
// TRANSACTION CONTROLLER - Controller untuk mengelola transaksi pembayaran
// =============================================================================

// Mengimpor model yang dibutuhkan untuk operasi transaksi
const { Transaction, Order } = require("../models");

// =============================================================================
// GET ORDER TRANSACTIONS - Mengambil semua transaksi untuk pesanan tertentu
// =============================================================================
exports.getOrderTransactions = async (req, res) => {
  try {
    // Ambil order_id dari URL parameter (/api/transactions/order/:order_id)
    const { order_id } = req.params;

    // Cari semua transaksi untuk pesanan tersebut (bisa ada multiple attempts)
    const transactions = await Transaction.findAll({ where: { order_id } });

    // Kirim response dengan daftar transaksi
    res.json(transactions);
  } catch (err) {
    // Handle error database
    res.status(500).json({ message: err.message });
  }
};

// =============================================================================
// CREATE TRANSACTION - Membuat record transaksi baru (dari payment gateway)
// =============================================================================
exports.createTransaction = async (req, res) => {
  try {
    // Ambil data transaksi dari request body (biasanya dari payment gateway callback)
    const {
      order_id, // ID pesanan yang dibayar
      payment_gateway_ref, // Referensi dari payment gateway (QRIS, GoPay, dll)
      amount, // Jumlah yang dibayar
      currency, // Mata uang (IDR, USD, dll)
      transaction_status, // Status: pending, success, failed, refunded
    } = req.body;

    // Buat record transaksi baru di database
    const transaction = await Transaction.create({
      order_id,
      payment_gateway_ref,
      amount,
      currency,
      transaction_status,
    });

    // Kirim response dengan transaksi yang baru dibuat
    res.status(201).json(transaction);
  } catch (err) {
    // Handle error (validation error, foreign key constraint, dll)
    res.status(500).json({ message: err.message });
  }
};
