// =============================================================================
// CART CONTROLLER - Controller untuk mengelola keranjang belanja user
// =============================================================================

// Mengimpor model yang dibutuhkan untuk operasi keranjang belanja
const { Cart, CartItem, Product, ProductVariant } = require("../models");

// =============================================================================
// GET CART - Mengambil isi keranjang belanja user
// =============================================================================
exports.getCart = async (req, res) => {
  try {
    // Ambil user_id dari token JWT yang sudah didecode di middleware auth
    const user_id = req.user.user_id;

    // Cari keranjang user dengan semua item dan detail produk
    let cart = await Cart.findOne({
      where: { user_id },
      include: [
        {
          model: CartItem,
          include: [Product, ProductVariant], // Join untuk detail produk dan varian
        },
      ],
    });

    // Jika user belum punya keranjang, buat keranjang baru
    if (!cart) {
      cart = await Cart.create({ user_id });
    }

    // Kirim response dengan data keranjang
    res.json(cart);
  } catch (err) {
    // Handle error database
    res.status(500).json({ message: err.message });
  }
};

// =============================================================================
// ADD TO CART - Menambahkan produk ke keranjang belanja
// =============================================================================
exports.addToCart = async (req, res) => {
  try {
    // Ambil user_id dari token JWT
    const user_id = req.user.user_id;

    // Ambil data produk yang akan ditambahkan dari request body
    const { product_id, variant_id, quantity } = req.body;

    // Cari atau buat keranjang user
    let cart = await Cart.findOne({ where: { user_id } });
    if (!cart) cart = await Cart.create({ user_id });

    // Cek apakah produk (dengan varian yang sama) sudah ada di keranjang
    let item = await CartItem.findOne({
      where: { cart_id: cart.cart_id, product_id, variant_id },
    });

    if (item) {
      // Jika produk sudah ada, tambahkan quantity
      item.quantity += quantity;
      await item.save();
    } else {
      // Jika produk belum ada, buat cart item baru
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
