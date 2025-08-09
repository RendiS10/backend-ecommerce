// =============================================================================
// ORDER CONTROLLER - Controller untuk mengelola pesanan customer
// =============================================================================

// Mengimpor model yang dibutuhkan untuk operasi pesanan
const {
  Order, // Model utama pesanan
  OrderItem, // Model detail item dalam pesanan
  Product, // Model produk untuk detail item
  ProductVariant, // Model varian produk (size, color, dll)
  User, // Model user untuk info customer
} = require("../models");

// =============================================================================
// GET USER ORDERS - Mengambil semua pesanan milik user yang sedang login
// =============================================================================
exports.getUserOrders = async (req, res) => {
  try {
    // Ambil user_id dari token JWT yang sudah didecode di middleware auth
    const user_id = req.user.user_id;

    // Cari semua pesanan user dengan detail item dan produk
    const orders = await Order.findAll({
      where: { user_id }, // Filter berdasarkan user yang sedang login
      include: [
        {
          model: OrderItem,
          include: [Product, ProductVariant], // Join untuk detail produk dan varian
        },
      ],
    });

    // Kirim response dengan daftar pesanan
    res.json(orders);
  } catch (err) {
    // Handle error database
    res.status(500).json({ message: err.message });
  }
};

// =============================================================================
// CREATE ORDER - Membuat pesanan baru dari keranjang belanja
// =============================================================================
exports.createOrder = async (req, res) => {
  try {
    // Ambil user_id dari token JWT
    const user_id = req.user.user_id;

    // Ambil data pesanan dari request body
    const {
      shipping_address, // Object dengan data alamat lengkap
      payment_method, // Metode pembayaran (transfer atau cod)
      notes, // Catatan khusus untuk pesanan
      cart_items, // Array item dari keranjang
    } = req.body;

    // Validasi data yang diperlukan
    if (
      !shipping_address ||
      !payment_method ||
      !cart_items ||
      cart_items.length === 0
    ) {
      return res.status(400).json({ message: "Data pesanan tidak lengkap" });
    }

    // Hitung total amount dari cart_items
    let total_amount = 0;
    for (const item of cart_items) {
      total_amount += item.price * item.quantity;
    }

    // Tambah ongkos kirim (fixed 15000)
    const shipping_cost = 15000;
    total_amount += shipping_cost;

    // Format alamat pengiriman menjadi string
    const full_address = `${shipping_address.full_name}, ${shipping_address.phone_number}, ${shipping_address.address}, ${shipping_address.city}, ${shipping_address.postal_code}`;

    // Buat pesanan baru dengan status sesuai payment method
    const order_status =
      payment_method === "cod" ? "confirmed" : "pending_payment";

    const order = await Order.create({
      user_id,
      total_amount,
      order_status,
      payment_method,
      shipping_address: full_address,
      shipping_city: shipping_address.city,
      shipping_postal_code: shipping_address.postal_code,
      notes: notes || "",
    });

    // Buat order items
    for (const item of cart_items) {
      await OrderItem.create({
        order_id: order.order_id,
        product_id: item.product_id,
        variant_id: item.variant_id || null,
        quantity: item.quantity,
        price_at_purchase: item.price,
      });
    }

    // Response dengan data order yang baru dibuat
    res.status(201).json({
      order_id: order.order_id,
      total_amount: order.total_amount,
      status: order.order_status,
      payment_method: order.payment_method,
      shipping_address: order.shipping_address,
      created_at: order.created_at,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =============================================================================
// UPLOAD PAYMENT PROOF - Upload bukti pembayaran untuk transfer
// =============================================================================
exports.uploadPaymentProof = async (req, res) => {
  try {
    const { order_id } = req.body;
    const user_id = req.user.user_id;

    // Cari order berdasarkan ID dan pastikan milik user yang login
    const order = await Order.findOne({
      where: { order_id, user_id },
    });

    if (!order) {
      return res.status(404).json({ message: "Pesanan tidak ditemukan" });
    }

    if (order.payment_method !== "transfer") {
      return res
        .status(400)
        .json({ message: "Upload bukti hanya untuk pembayaran transfer" });
    }

    // Update order dengan bukti pembayaran
    if (req.file) {
      order.payment_proof = req.file.filename;
      order.order_status = "payment_uploaded";
      await order.save();
    }

    res.json({ message: "Bukti pembayaran berhasil diupload", order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =============================================================================
// CONFIRM COD ORDER - Konfirmasi pesanan COD
// =============================================================================
exports.confirmCODOrder = async (req, res) => {
  try {
    const { order_id } = req.params;
    const user_id = req.user.user_id;

    // Cari order berdasarkan ID dan pastikan milik user yang login
    const order = await Order.findOne({
      where: { order_id, user_id },
    });

    if (!order) {
      return res.status(404).json({ message: "Pesanan tidak ditemukan" });
    }

    if (order.payment_method !== "cod") {
      return res
        .status(400)
        .json({ message: "Konfirmasi hanya untuk pesanan COD" });
    }

    // Update status order COD
    order.order_status = "processing";
    await order.save();

    res.json({ message: "Pesanan COD berhasil dikonfirmasi", order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { order_id } = req.params;
    const { order_status, tracking_number } = req.body;
    const order = await Order.findByPk(order_id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    order.order_status = order_status;
    if (tracking_number) order.tracking_number = tracking_number;
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
