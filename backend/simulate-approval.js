const {
  Payment,
  Order,
  OrderItem,
  Product,
  ProductVariant,
  Cart,
  CartItem,
} = require("./models");

async function simulateApproval() {
  try {
    console.log("🧪 Simulating approval process...");

    // Test case: Simulasi approve payment ID 11
    const payment_id = 11;

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
      console.log("❌ Payment tidak ditemukan");
      return;
    }

    console.log("📋 Payment data:", {
      payment_id: payment.payment_id,
      status: payment.payment_status,
      order_id: payment.order_id,
      user_id: payment.Order.user_id,
      orderItems: payment.Order.OrderItems.length,
    });

    // Reset payment status untuk test ulang
    if (payment.payment_status === "Disetujui") {
      console.log("🔄 Resetting payment status untuk test...");
      await payment.update({
        payment_status: "Menunggu Konfirmasi",
      });
    }

    // Start simulation
    console.log("🚀 Starting approval simulation...");

    // Start transaction
    const transaction = await Payment.sequelize.transaction();

    try {
      // Update payment status
      await payment.update(
        {
          payment_status: "Disetujui",
          admin_notes: "Test approval",
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

      console.log("✅ Payment dan order status updated");

      // Process each order item
      for (const orderItem of payment.Order.OrderItems) {
        console.log(`📦 Processing order item:`, {
          product_id: orderItem.product_id,
          variant_id: orderItem.variant_id,
          quantity: orderItem.quantity,
        });

        // 1. Update stock
        if (orderItem.variant_id) {
          const variant = await ProductVariant.findByPk(orderItem.variant_id, {
            transaction,
          });
          if (variant) {
            console.log(`  📊 Current variant stock: ${variant.variant_stock}`);
            if (variant.variant_stock < orderItem.quantity) {
              throw new Error(
                `Stock tidak mencukupi: ${variant.variant_stock} < ${orderItem.quantity}`
              );
            }

            await variant.update(
              {
                variant_stock: variant.variant_stock - orderItem.quantity,
              },
              { transaction }
            );

            console.log(
              `  ✅ Variant stock updated: ${variant.variant_stock} -> ${
                variant.variant_stock - orderItem.quantity
              }`
            );
          }
        } else {
          const product = await Product.findByPk(orderItem.product_id, {
            transaction,
          });
          if (product) {
            console.log(`  📊 Current product stock: ${product.stock}`);
            if (product.stock < orderItem.quantity) {
              throw new Error(
                `Stock tidak mencukupi: ${product.stock} < ${orderItem.quantity}`
              );
            }

            await product.update(
              {
                stock: product.stock - orderItem.quantity,
              },
              { transaction }
            );

            console.log(
              `  ✅ Product stock updated: ${product.stock} -> ${
                product.stock - orderItem.quantity
              }`
            );
          }
        }

        // 2. Delete cart items
        const userCart = await Cart.findOne({
          where: { user_id: payment.Order.user_id },
          transaction,
        });

        if (userCart) {
          const cartItemFilter = {
            cart_id: userCart.cart_id,
            product_id: orderItem.product_id,
          };

          if (orderItem.variant_id) {
            cartItemFilter.variant_id = orderItem.variant_id;
          }

          const deletedCount = await CartItem.destroy({
            where: cartItemFilter,
            transaction,
          });

          console.log(`  🗑️ Deleted ${deletedCount} cart items`);
        }
      }

      // Commit transaction
      await transaction.commit();
      console.log("✅ Transaction committed successfully");

      // Verify results
      console.log("🔍 Verifying results...");
      for (const orderItem of payment.Order.OrderItems) {
        if (orderItem.variant_id) {
          const variant = await ProductVariant.findByPk(orderItem.variant_id);
          console.log(`  📊 Final variant stock: ${variant?.variant_stock}`);
        } else {
          const product = await Product.findByPk(orderItem.product_id);
          console.log(`  📊 Final product stock: ${product?.stock}`);
        }
      }
    } catch (error) {
      await transaction.rollback();
      console.error("❌ Transaction rolled back:", error.message);
    }
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    process.exit(0);
  }
}

simulateApproval();
