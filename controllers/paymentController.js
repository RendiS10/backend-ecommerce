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
  Cart,
  CartItem,
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

    if (payment.payment_status !== "Menunggu Konfirmasi") {
      return res
        .status(400)
        .json({ message: "Status pembayaran tidak valid untuk persetujuan" });
    }

    // Start transaction untuk memastikan konsistensi data
    const transaction = await Payment.sequelize.transaction();

    try {
      // Update payment status
      await payment.update(
        {
          payment_status: "Disetujui",
          admin_notes,
        },
        { transaction }
      );

      // Update order status
      await payment.Order.update(
        {
          order_status: "Disetujui",
        },
        { transaction }
      );

      // Kurangi stock dan hapus cart items
      for (const orderItem of payment.Order.OrderItems) {
        // 1. Kurangi stock product variant jika ada
        if (orderItem.variant_id) {
          const variant = await ProductVariant.findByPk(orderItem.variant_id, {
            transaction,
          });

          if (variant) {
            if (variant.variant_stock < orderItem.quantity) {
              throw new Error(
                `Stock variant ${variant.color || ""} ${
                  variant.size || ""
                } tidak mencukupi. Stock tersedia: ${
                  variant.variant_stock
                }, diminta: ${orderItem.quantity}`
              );
            }

            await variant.update(
              {
                variant_stock: variant.variant_stock - orderItem.quantity,
              },
              { transaction }
            );

            console.log(
              `Stock variant ID ${orderItem.variant_id} dikurangi ${
                orderItem.quantity
              }. Stock sekarang: ${variant.variant_stock - orderItem.quantity}`
            );
          }
        } else {
          // 2. Kurangi stock produk utama jika tidak ada variant
          const product = await Product.findByPk(orderItem.product_id, {
            transaction,
          });

          if (product) {
            if (product.stock < orderItem.quantity) {
              throw new Error(
                `Stock produk ${product.product_name} tidak mencukupi. Stock tersedia: ${product.stock}, diminta: ${orderItem.quantity}`
              );
            }

            await product.update(
              {
                stock: product.stock - orderItem.quantity,
              },
              { transaction }
            );

            console.log(
              `Stock produk ID ${orderItem.product_id} dikurangi ${
                orderItem.quantity
              }. Stock sekarang: ${product.stock - orderItem.quantity}`
            );
          }
        }

        // 3. Hapus item dari keranjang user
        const userCart = await Cart.findOne({
          where: { user_id: payment.Order.user_id },
          transaction,
        });

        if (userCart) {
          // Hapus cart item yang sesuai dengan order item
          const cartItemFilter = {
            cart_id: userCart.cart_id,
            product_id: orderItem.product_id,
          };

          // Tambahkan variant_id ke filter jika ada
          if (orderItem.variant_id) {
            cartItemFilter.variant_id = orderItem.variant_id;
          }

          const deletedCount = await CartItem.destroy({
            where: cartItemFilter,
            transaction,
          });

          console.log(
            `Menghapus ${deletedCount} cart item untuk produk ID ${
              orderItem.product_id
            }${
              orderItem.variant_id ? ` variant ID ${orderItem.variant_id}` : ""
            }`
          );
        }
      }

      // Commit transaction jika semua berhasil
      await transaction.commit();

      res.json({
        message:
          "Pembayaran berhasil disetujui, stock dikurangi, dan keranjang dibersihkan",
        payment,
        stockUpdates: payment.Order.OrderItems.map((item) => ({
          product_id: item.product_id,
          variant_id: item.variant_id,
          quantity_reduced: item.quantity,
        })),
      });
    } catch (error) {
      // Rollback transaction jika ada error
      await transaction.rollback();
      throw error;
    }
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
