// =============================================================================
// PRODUCT CONTROLLER - Controller untuk mengelola data produk JKT48 merchandise
// =============================================================================

// Mengimpor semua model yang dibutuhkan untuk operasi produk
const {
  Product, // Model utama produk
  ProductCategory, // Model kategori produk (photocard, album, dll)
  ProductImage, // Model gambar-gambar produk
  ProductVariant, // Model varian produk (size, color, dll)
} = require("../models");

// =============================================================================
// GET ALL PRODUCTS - Mengambil semua produk dengan optional filter kategori
// =============================================================================
exports.getAllProducts = async (req, res) => {
  try {
    // Ambil parameter query "category" dari URL (?category=photocard)
    const { category } = req.query;
    const where = {}; // Object untuk filter query

    // Jika ada filter kategori, cari kategori tersebut di database
    if (category) {
      // Cari kategori berdasarkan nama (case-insensitive)
      const cat = await ProductCategory.findOne({
        where: { category_name: category },
      });

      if (cat) {
        // Jika kategori ditemukan, filter produk berdasarkan category_id
        where.category_id = cat.category_id;
      } else {
        // Jika kategori tidak ditemukan, return array kosong
        return res.json([]);
      }
    }

    // Ambil semua produk dengan relasi (join) ke tabel terkait
    const products = await Product.findAll({
      where, // Filter berdasarkan kategori (jika ada)
      include: [ProductCategory, ProductImage, ProductVariant], // Join dengan tabel relasi
    });

    // Kirim response dengan data produk
    res.json(products);
  } catch (err) {
    // Handle error jika terjadi kesalahan database
    res.status(500).json({ message: err.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    // Log for debugging
    console.log("req.body:", req.body);
    const { category_id, product_name, description, price, stock, image_url } =
      req.body;

    const product = await Product.create({
      category_id,
      product_name,
      description,
      price,
      stock,
      image_url,
    });
    res.status(201).json(product);
  } catch (err) {
    console.error("Create product error:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    await product.destroy();
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Ambil data dari body
    const { product_name, description, price, category_id, stock, image_url } =
      req.body;

    // Update field jika ada perubahan
    if (product_name !== undefined) product.product_name = product_name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (category_id !== undefined) product.category_id = category_id;
    if (stock !== undefined) product.stock = stock;
    if (image_url !== undefined) product.image_url = image_url;

    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id, {
      include: [ProductCategory, ProductImage, ProductVariant],
    });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
