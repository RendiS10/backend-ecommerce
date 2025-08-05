const { Cart, CartItem, Product, ProductVariant } = require("../models");

exports.getCart = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    let cart = await Cart.findOne({
      where: { user_id },
      include: [{ model: CartItem, include: [Product, ProductVariant] }],
    });
    if (!cart) {
      cart = await Cart.create({ user_id });
    }
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const { product_id, variant_id, quantity } = req.body;
    let cart = await Cart.findOne({ where: { user_id } });
    if (!cart) cart = await Cart.create({ user_id });
    let item = await CartItem.findOne({
      where: { cart_id: cart.cart_id, product_id, variant_id },
    });
    if (item) {
      item.quantity += quantity;
      await item.save();
    } else {
      item = await CartItem.create({
        cart_id: cart.cart_id,
        product_id,
        variant_id,
        quantity,
      });
    }
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const { cart_item_id } = req.params;
    const { quantity } = req.body;
    const item = await CartItem.findByPk(cart_item_id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    item.quantity = quantity;
    await item.save();
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.removeCartItem = async (req, res) => {
  try {
    const { cart_item_id } = req.params;
    const item = await CartItem.findByPk(cart_item_id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    await item.destroy();
    res.json({ message: "Item removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
