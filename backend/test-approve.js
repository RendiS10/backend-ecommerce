const {
  Payment,
  Order,
  OrderItem,
  Product,
  ProductVariant,
  Cart,
  CartItem,
} = require("./models");

async function testApprovePayment() {
  try {
    console.log("🔍 Testing approve payment functionality...");

    // 1. Cek data payment yang ada
    const payments = await Payment.findAll({
      where: { payment_status: "Menunggu Konfirmasi" },
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
      limit: 1,
    });

    if (payments.length === 0) {
      console.log('❌ Tidak ada payment dengan status "Menunggu Konfirmasi"');

      // Cek semua payment
      const allPayments = await Payment.findAll({ limit: 5 });
      console.log(
        "📊 Sample payments:",
        allPayments.map((p) => ({
          id: p.payment_id,
          status: p.payment_status,
          order_id: p.order_id,
        }))
      );
      return;
    }

    const payment = payments[0];
    console.log("✅ Found payment:", {
      payment_id: payment.payment_id,
      order_id: payment.order_id,
      status: payment.payment_status,
      user_id: payment.Order.user_id,
      orderItems: payment.Order.OrderItems.length,
    });

    // 2. Cek stock sebelum approve
    console.log("📦 Stock sebelum approve:");
    for (const item of payment.Order.OrderItems) {
      if (item.variant_id) {
        const variant = await ProductVariant.findByPk(item.variant_id);
        console.log(
          `  Variant ID ${item.variant_id}: stock = ${variant?.variant_stock}, akan dikurangi = ${item.quantity}`
        );
      } else {
        const product = await Product.findByPk(item.product_id);
        console.log(
          `  Product ID ${item.product_id}: stock = ${product?.stock}, akan dikurangi = ${item.quantity}`
        );
      }
    }

    // 3. Cek cart items sebelum approve
    const userCart = await Cart.findOne({
      where: { user_id: payment.Order.user_id },
      include: [CartItem],
    });

    if (userCart) {
      console.log("🛒 Cart items sebelum approve:", userCart.CartItems.length);
      userCart.CartItems.forEach((item) => {
        console.log(
          `  Cart item: product_id=${item.product_id}, variant_id=${item.variant_id}, qty=${item.quantity}`
        );
      });
    } else {
      console.log("🛒 User tidak memiliki cart");
    }

    console.log(
      "✅ Test data ready - manual approval dapat dilakukan melalui admin panel"
    );
  } catch (error) {
    console.error("❌ Error testing:", error);
  } finally {
    process.exit(0);
  }
}

testApprovePayment();
