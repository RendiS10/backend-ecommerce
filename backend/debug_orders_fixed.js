const { Order, OrderItem, Product, User } = require("./models");

async function checkOrders() {
  try {
    console.log("Checking all orders...");
    const allOrders = await Order.findAll({
      attributes: ["order_id", "order_status", "order_date", "tracking_number"],
      order: [["order_date", "DESC"]],
      limit: 10,
    });

    console.log("Total orders found:", allOrders.length);
    allOrders.forEach((order) => {
      console.log(
        `Order ${order.order_id}: status=${order.order_status}, created=${order.order_date}, tracking=${order.tracking_number}`
      );
    });

    console.log("\n--- Checking completed/delivered orders ---");
    const completedOrders = await Order.findAll({
      where: {
        order_status: ["Selesai", "Dikirim"],
      },
      attributes: ["order_id", "order_status", "order_date", "tracking_number"],
    });

    console.log("Completed/delivered orders:", completedOrders.length);
    completedOrders.forEach((order) => {
      console.log(
        `Completed Order ${order.order_id}: status=${order.order_status}, created=${order.order_date}`
      );
    });

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

checkOrders();
