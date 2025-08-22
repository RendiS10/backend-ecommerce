// =============================================================================
// TRANSACTION CONTROLLER - Controller untuk mengelola laporan penjualan dan transaksi
// =============================================================================

// Mengimpor model yang dibutuhkan untuk operasi transaksi
const { Transaction, Order, OrderItem, Product, User } = require("../models");
const { Op } = require("sequelize");

// =============================================================================
// GET ALL TRANSACTIONS - Mengambil semua transaksi berdasarkan order yang completed
// =============================================================================
exports.getAllTransactions = async (req, res) => {
  try {
    // Ambil semua order yang sudah completed/delivered
    const completedOrders = await Order.findAll({
      where: {
        order_status: ["Selesai", "Dikirim"], // Order yang sudah selesai
      },
      include: [
        {
          model: OrderItem,
          include: [
            {
              model: Product,
              attributes: ["product_name", "price"],
            },
          ],
        },
        {
          model: User,
          attributes: ["full_name", "email"],
        },
      ],
      order: [["order_date", "DESC"]],
    });

    // Transform data untuk format transaction report
    const transactions = [];

    completedOrders.forEach((order) => {
      order.OrderItems.forEach((item) => {
        const revenue = parseFloat(item.Product.price) * item.quantity;

        transactions.push({
          transaction_id: `ORD-${order.order_id}-${item.order_item_id}`,
          order_id: order.order_id,
          tracking_number: order.tracking_number,
          product_name: item.Product.product_name,
          product_price: parseFloat(item.Product.price),
          quantity: item.quantity,
          revenue: revenue,
          customer_name: order.User.full_name,
          customer_email: order.User.email,
          order_status: order.order_status,
          payment_method: order.payment_method,
          transaction_date: order.order_date,
          completed_date: order.order_date,
        });
      });
    });

    // Kirim response dengan daftar transaksi
    res.json(transactions);
  } catch (err) {
    console.error("Error fetching transactions:", err);
    res.status(500).json({ message: err.message });
  }
};

// =============================================================================
// GET TRANSACTION STATS - Mengambil statistik penjualan
// =============================================================================
exports.getTransactionStats = async (req, res) => {
  try {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const yearStart = new Date(now.getFullYear(), 0, 1);

    // Ambil semua order yang sudah completed
    const completedOrders = await Order.findAll({
      where: {
        order_status: ["Selesai", "Dikirim"],
      },
      include: [
        {
          model: OrderItem,
          include: [
            {
              model: Product,
              attributes: ["price"],
            },
          ],
        },
      ],
    });

    // Hitung statistik
    let totalRevenue = 0;
    let todayRevenue = 0;
    let monthlyRevenue = 0;
    let yearlyRevenue = 0;
    let totalTransactions = 0;
    let totalProductsSold = 0;

    completedOrders.forEach((order) => {
      const orderDate = new Date(order.order_date);

      order.OrderItems.forEach((item) => {
        const revenue = parseFloat(item.Product.price) * item.quantity;
        totalRevenue += revenue;
        totalTransactions += 1;
        totalProductsSold += item.quantity;

        // Revenue hari ini
        if (orderDate >= today) {
          todayRevenue += revenue;
        }

        // Revenue bulan ini
        if (orderDate >= monthStart) {
          monthlyRevenue += revenue;
        }

        // Revenue tahun ini
        if (orderDate >= yearStart) {
          yearlyRevenue += revenue;
        }
      });
    });

    res.json({
      totalRevenue,
      todayRevenue,
      monthlyRevenue,
      yearlyRevenue,
      transactionCount: totalTransactions,
      totalOrders: completedOrders.length,
      totalProductsSold,
    });
  } catch (err) {
    console.error("Error fetching transaction stats:", err);
    res.status(500).json({ message: err.message });
  }
};
