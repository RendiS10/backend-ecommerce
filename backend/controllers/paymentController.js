// =============================================================================
// PAYMENT CONTROLLER - Controller untuk mengelola pembayaran transfer
// =============================================================================

const {
  Payment,
  Order,
  User,
  OrderItem,
  Product,
  ProductVariant,
} = require("../models");

// =============================================================================
// CREATE PAYMENT - Membuat pembayaran baru untuk order
// =============================================================================
exports.createPayment = async (req, res) => {
  try {
    const { order_id } = req.params;
    const user_id = req.user.user_id;

    // Cek apakah order exists dan milik user
    const order = await Order.findOne({
      where: { order_id, user_id },
    });

    if (!order) {
      return res.status(404).json({ message: "Order tidak ditemukan" });
    }

    // Cek apakah payment sudah ada
    const existingPayment = await Payment.findOne({
      where: { order_id },
    });

    if (existingPayment) {
      return res
        .status(400)
        .json({ message: "Pembayaran untuk order ini sudah ada" });
    }

    // Buat payment baru
    const payment = await Payment.create({
      order_id,
      user_id,
      payment_amount: order.total_amount,
      payment_method: "transfer",
      payment_status: "Menunggu Pembayaran",
    });

    res.status(201).json({
      message: "Pembayaran berhasil dibuat",
      payment,
    });
  } catch (error) {
    console.error("Error creating payment:", error);
    res.status(500).json({ message: error.message });
  }
};

// =============================================================================
// CONFIRM PAYMENT - Customer mengkonfirmasi pembayaran
// =============================================================================
exports.confirmPayment = async (req, res) => {
  try {
    const { payment_id } = req.params;
    const user_id = req.user.user_id;
    const { bank_name, account_number, account_name, payment_date } = req.body;

    // Cari payment
    const payment = await Payment.findOne({
      where: { payment_id, user_id },
      include: [Order],
    });

    if (!payment) {
      return res.status(404).json({ message: "Pembayaran tidak ditemukan" });
    }

    if (payment.payment_status !== "Menunggu Pembayaran") {
      return res
        .status(400)
        .json({ message: "Status pembayaran tidak valid untuk konfirmasi" });
    }

    // Update payment
    await payment.update({
      payment_status: "Menunggu Konfirmasi",
      bank_name,
      account_number,
      account_name,
      payment_date: payment_date || new Date(),
      confirmation_date: new Date(),
    });

    res.json({
      message: "Konfirmasi pembayaran berhasil",
      payment,
    });
  } catch (error) {
    console.error("Error confirming payment:", error);
    res.status(500).json({ message: error.message });
  }
};

// =============================================================================
// GET USER PAYMENTS - Mengambil pembayaran user
// =============================================================================
exports.getUserPayments = async (req, res) => {
  try {
    const user_id = req.user.user_id;

    const payments = await Payment.findAll({
      where: { user_id },
      include: [
        {
          model: Order,
          include: [
            {
              model: OrderItem,
              include: [Product, ProductVariant],
            },
          ],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    res.json(payments);
  } catch (error) {
    console.error("Error fetching user payments:", error);
    res.status(500).json({ message: error.message });
  }
};

// =============================================================================
// GET ALL PAYMENTS - Admin mengambil semua pembayaran
// =============================================================================
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.findAll({
      include: [
        {
          model: Order,
          include: [
            {
              model: OrderItem,
              include: [Product, ProductVariant],
            },
          ],
        },
        {
          model: User,
          attributes: ["user_id", "full_name", "email"],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    res.json(payments);
  } catch (error) {
    console.error("Error fetching all payments:", error);
    res.status(500).json({ message: error.message });
  }
};

// =============================================================================
// APPROVE PAYMENT - Admin menyetujui pembayaran
// =============================================================================
exports.approvePayment = async (req, res) => {
  try {
    const { payment_id } = req.params;
    const { admin_notes } = req.body;

    const payment = await Payment.findOne({
      where: { payment_id },
      include: [Order],
    });

    if (!payment) {
      return res.status(404).json({ message: "Pembayaran tidak ditemukan" });
    }

    if (payment.payment_status !== "Menunggu Konfirmasi") {
      return res
        .status(400)
        .json({ message: "Status pembayaran tidak valid untuk persetujuan" });
    }

    // Update payment status
    await payment.update({
      payment_status: "Disetujui",
      admin_notes,
    });

    // Update order status
    await payment.Order.update({
      order_status: "Disetujui",
    });

    res.json({
      message: "Pembayaran berhasil disetujui",
      payment,
    });
  } catch (error) {
    console.error("Error approving payment:", error);
    res.status(500).json({ message: error.message });
  }
};

// =============================================================================
// REJECT PAYMENT - Admin menolak pembayaran
// =============================================================================
exports.rejectPayment = async (req, res) => {
  try {
    const { payment_id } = req.params;
    const { admin_notes } = req.body;

    const payment = await Payment.findOne({
      where: { payment_id },
      include: [Order],
    });

    if (!payment) {
      return res.status(404).json({ message: "Pembayaran tidak ditemukan" });
    }

    if (payment.payment_status !== "Menunggu Konfirmasi") {
      return res
        .status(400)
        .json({ message: "Status pembayaran tidak valid untuk penolakan" });
    }

    // Update payment status
    await payment.update({
      payment_status: "Ditolak",
      admin_notes,
    });

    // Reset payment status agar customer bisa bayar ulang
    await payment.update({
      payment_status: "Menunggu Pembayaran",
      bank_name: null,
      account_number: null,
      account_name: null,
      payment_date: null,
      confirmation_date: null,
    });

    res.json({
      message: "Pembayaran ditolak, customer dapat melakukan pembayaran ulang",
      payment,
    });
  } catch (error) {
    console.error("Error rejecting payment:", error);
    res.status(500).json({ message: error.message });
  }
};

// =============================================================================
// GET PAYMENT BY ORDER - Mengambil payment berdasarkan order_id
// =============================================================================
exports.getPaymentByOrder = async (req, res) => {
  try {
    const { order_id } = req.params;
    const user_id = req.user.user_id;

    const payment = await Payment.findOne({
      where: { order_id, user_id },
      include: [
        {
          model: Order,
          include: [
            {
              model: OrderItem,
              include: [Product, ProductVariant],
            },
          ],
        },
      ],
    });

    if (!payment) {
      return res.status(404).json({ message: "Pembayaran tidak ditemukan" });
    }

    res.json(payment);
  } catch (error) {
    console.error("Error fetching payment by order:", error);
    res.status(500).json({ message: error.message });
  }
};
