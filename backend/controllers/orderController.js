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
      items, // Array item yang dibeli
      total_amount, // Total harga pesanan
      payment_method, // Metode pembayaran (QRIS, Transfer, dll)
      shipping_address, // Alamat pengiriman lengkap
      shipping_city, // Kota tujuan
      shipping_postal_code, // Kode pos
      notes, // Catatan khusus untuk pesanan
    } = req.body;

    // Buat pesanan baru dengan status "pending_payment"
    const order = await Order.create({
      user_id,
      total_amount,
      order_status: "pending_payment", // Status awal: menunggu pembayaran
      payment_method,
      shipping_address,
      shipping_city,
      shipping_postal_code,
      notes,
    });
    for (const item of items) {
      await OrderItem.create({
        order_id: order.order_id,
        product_id: item.product_id,
        variant_id: item.variant_id,
        quantity: item.quantity,
        price_at_purchase: item.price_at_purchase,
      });
    }
    res.status(201).json(order);
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
