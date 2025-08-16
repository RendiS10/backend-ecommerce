const {
  Payment,
  Order,
  OrderItem,
  Product,
  ProductVariant,
  Cart,
  CartItem,
  User,
} = require("./models");

async function checkApprovalResult() {
  try {
    console.log("🔍 Checking approval results...");

    // 1. Cek payment yang sudah disetujui
    const approvedPayment = await Payment.findOne({
      where: { payment_status: "Disetujui" },
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
      order: [["updated_at", "DESC"]],
    });

    if (!approvedPayment) {
      console.log("❌ Tidak ada payment yang disetujui");
      return;
    }

    console.log("✅ Found approved payment:", {
      payment_id: approvedPayment.payment_id,
      order_id: approvedPayment.order_id,
      status: approvedPayment.payment_status,
      user_id: approvedPayment.Order.user_id,
    });

    // 2. Cek stock setelah approval
    console.log("📦 Stock setelah approval:");
    for (const item of approvedPayment.Order.OrderItems) {
      console.log(
        `Order item: product_id=${item.product_id}, variant_id=${item.variant_id}, quantity=${item.quantity}`
      );

      if (item.variant_id) {
        const variant = await ProductVariant.findByPk(item.variant_id);
        console.log(
          `  ✅ Variant ID ${item.variant_id}: current stock = ${variant?.variant_stock}`
        );
      } else {
        const product = await Product.findByPk(item.product_id);
        console.log(
          `  ✅ Product ID ${item.product_id}: current stock = ${product?.stock}`
        );
      }
    }

    // 3. Cek cart items setelah approval
    const userCart = await Cart.findOne({
      where: { user_id: approvedPayment.Order.user_id },
      include: [CartItem],
    });

    if (userCart) {
      console.log("🛒 Cart items setelah approval:", userCart.CartItems.length);
      if (userCart.CartItems.length > 0) {
        userCart.CartItems.forEach((item) => {
          console.log(
            `  Cart item: product_id=${item.product_id}, variant_id=${item.variant_id}, qty=${item.quantity}`
          );
        });
      } else {
        console.log("  ✅ Cart kosong - items telah dihapus");
      }
    } else {
      console.log("🛒 User tidak memiliki cart");
    }

    // 4. Test manual approval untuk payment yang pending
    const pendingPayments = await Payment.findAll({
      where: { payment_status: "Menunggu Konfirmasi" },
      limit: 1,
    });

    if (pendingPayments.length > 0) {
      console.log("📋 Ada payment pending untuk test manual approval");
    } else {
      console.log("📋 Tidak ada payment pending");
    }
  } catch (error) {
    console.error("❌ Error checking:", error);
  } finally {
    process.exit(0);
  }
}

checkApprovalResult();
