const {
  Order,
  OrderItem,
  Product,
  ProductVariant,
  User,
} = require("../models");

exports.getUserOrders = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const orders = await Order.findAll({
      where: { user_id },
      include: [{ model: OrderItem, include: [Product, ProductVariant] }],
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const {
      items,
      total_amount,
      payment_method,
      shipping_address,
      shipping_city,
      shipping_postal_code,
      notes,
    } = req.body;
    const order = await Order.create({
      user_id,
      total_amount,
      order_status: "pending_payment",
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
