// Simple diagnostic script to test database connection and models
const { Order, OrderItem, Product, ProductVariant, User } = require("./models");

async function testDatabase() {
  try {
    console.log("Testing database connection...");

    // Test simple query without includes first
    const orders = await Order.findAll({
      limit: 1,
      attributes: [
        "order_id",
        "user_id",
        "order_date",
        "total_amount",
        "order_status",
      ],
    });

    console.log("✅ Basic Order query successful");
    console.log(
      "Sample order:",
      orders[0] ? orders[0].toJSON() : "No orders found"
    );

    // Test with includes
    const ordersWithIncludes = await Order.findAll({
      limit: 1,
      include: [
        {
          model: OrderItem,
          include: [Product, ProductVariant],
        },
      ],
    });

    console.log("✅ Order query with includes successful");
  } catch (error) {
    console.error("❌ Database test failed:", error.message);
    console.error("Full error:", error);
  }
}

testDatabase();
