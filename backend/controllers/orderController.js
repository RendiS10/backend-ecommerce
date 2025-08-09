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
// GET ALL ORDERS - Mengambil semua pesanan untuk admin
// =============================================================================
exports.getAllOrders = async (req, res) => {
  try {
    // Cari semua pesanan dengan detail item, produk, dan user
    const orders = await Order.findAll({
      include: [
        {
          model: OrderItem,
          include: [Product, ProductVariant], // Join untuk detail produk dan varian
        },
        {
          model: User,
          attributes: ["user_id", "full_name", "email"], // Hanya ambil field yang diperlukan
        },
      ],
      order: [["order_date", "DESC"]], // Urutkan berdasarkan tanggal terbaru
    });

    // Kirim response dengan daftar semua pesanan
    res.json(orders);
  } catch (err) {
    // Handle error database
    console.error("Error fetching all orders:", err);
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

    // Debug logging
    console.log("Creating order for user:", user_id);
    console.log("Request body:", req.body);
    console.log("Cart items:", cart_items);

    // Validasi data yang diperlukan
    if (
      !shipping_address ||
      !payment_method ||
      !cart_items ||
      cart_items.length === 0
    ) {
      return res.status(400).json({ message: "Data pesanan tidak lengkap" });
    }

    // Validasi payment_method hanya COD
    if (payment_method !== "cod") {
      console.log("Invalid payment method:", payment_method);
      return res
        .status(400)
        .json({ message: "Hanya metode pembayaran COD yang tersedia" });
    }

    // Validasi cart_items tidak kosong dan memiliki data yang diperlukan
    if (!Array.isArray(cart_items) || cart_items.length === 0) {
      console.log("Invalid cart_items:", cart_items);
      return res.status(400).json({ message: "Cart items tidak valid" });
    }

    // Validasi setiap cart item memiliki data yang diperlukan
    for (const item of cart_items) {
      if (!item.product_id || !item.quantity || !item.price) {
        console.log("Invalid cart item:", item);
        return res.status(400).json({
          message: "Data cart item tidak lengkap",
          missing_fields: {
            product_id: !item.product_id,
            quantity: !item.quantity,
            price: !item.price,
          },
        });
      }
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

    // Generate tracking number otomatis
    const generateTrackingNumber = () => {
      const date = new Date();
      const year = date.getFullYear().toString().substring(2);
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      const random = Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, "0");
      return `JKT48-${year}${month}${day}-${random}`;
    };

    // Buat pesanan baru dengan status default
    const order_status = "Menunggu Konfirmasi"; // Status default untuk pesanan baru
    const tracking_number = generateTrackingNumber();

    console.log("Creating order with data:", {
      user_id,
      total_amount,
      order_status,
      payment_method,
      tracking_number,
    });

    const order = await Order.create({
      user_id,
      total_amount,
      order_status: "Menunggu Konfirmasi", // Status default
      payment_method,
      shipping_address: full_address,
      shipping_city: shipping_address.city,
      shipping_postal_code: shipping_address.postal_code,
      tracking_number: tracking_number,
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

    // ❌ HAPUS AUTO-UPDATE STATUS - Biarkan pesanan tetap status "Menunggu Konfirmasi"
    // Semua pesanan (termasuk COD) harus menunggu konfirmasi admin dulu

    console.log("Order created successfully:", order.order_id);

    // Status tetap "Menunggu Konfirmasi" untuk semua pesanan
    const finalStatus = "Menunggu Konfirmasi";

    // Response dengan data order yang baru dibuat
    res.status(201).json({
      message: "Pesanan berhasil dibuat, menunggu konfirmasi admin",
      order_id: order.order_id,
      total_amount: order.total_amount,
      order_status: finalStatus,
      payment_method: order.payment_method,
      shipping_address: order.shipping_address,
      tracking_number: order.tracking_number,
      created_at: order.order_date,
    });
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).json({
      message: "Gagal membuat pesanan",
      error: err.message,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
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
    order.order_status = "Diproses";
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

// =============================================================================
// CANCEL ORDER - Membatalkan pesanan customer
// =============================================================================
exports.cancelOrder = async (req, res) => {
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

    // Validasi status pesanan - hanya bisa dibatalkan jika masih dalam status tertentu
    const cancellableStatuses = [
      "Menunggu Konfirmasi", // Status awal yang bisa dibatalkan
    ];
    console.log(`Checking cancellation for order ${order_id}:`, {
      current_status: order.order_status,
      status_type: typeof order.order_status,
      cancellable_statuses: cancellableStatuses,
      can_cancel: cancellableStatuses.includes(order.order_status),
    });

    if (!cancellableStatuses.includes(order.order_status)) {
      return res.status(400).json({
        message: `Pesanan tidak dapat dibatalkan karena sudah diproses atau dikirim (Current status: ${order.order_status})`,
      });
    }

    // Update status menjadi "Dibatalkan"
    await order.update({ order_status: "Dibatalkan" });

    console.log(`Order ${order_id} cancelled by user ${user_id}`);

    res.json({
      message: "Pesanan berhasil dibatalkan",
      order: {
        order_id: order.order_id,
        order_status: order.order_status,
        total_amount: order.total_amount,
      },
    });
  } catch (err) {
    console.error("Error cancelling order:", err);
    res.status(500).json({ message: err.message });
  }
};
