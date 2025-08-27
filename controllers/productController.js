// =============================================================================
// PRODUCT CONTROLLER - Controller untuk mengelola data produk JKT48 merchandise
// =============================================================================

// Mengimpor semua model yang dibutuhkan untuk operasi produk
const {
  Product, // Model utama produk
  ProductCategory, // Model kategori produk (photocard, album, dll)
  ProductImage, // Model gambar-gambar produk
  ProductVariant, // Model varian produk (size, color, dll)
  Review, // Model review untuk menghitung rating
} = require("../models");
const { Op } = require("sequelize");
const sequelize = require("../config/database");

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
    const { category_id, product_name, description, price, image_url } =
      req.body;

    // Set stock default ke 0, karena stock akan dikelola melalui ProductVariant
    const product = await Product.create({
      category_id,
      product_name,
      description,
      price,
      stock: 0, // Default stock adalah 0
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

    // Ambil data dari body (stock dihilangkan karena dikelola melalui ProductVariant)
    const { product_name, description, price, category_id, image_url } =
      req.body;

    // Update field jika ada perubahan
    if (product_name !== undefined) product.product_name = product_name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (category_id !== undefined) product.category_id = category_id;
    if (image_url !== undefined) product.image_url = image_url;
    // Stock tidak diupdate manual, akan dihitung dari ProductVariant

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

// =============================================================================
// SEARCH PRODUCTS - Mencari produk berdasarkan nama
// =============================================================================
exports.searchProducts = async (req, res) => {
  try {
    const { q } = req.query; // Query parameter untuk pencarian

    if (!q || q.trim() === "") {
      return res.json([]);
    }

    const searchTerm = q.trim().toLowerCase();

    // Cari produk berdasarkan nama dengan pencarian sederhana tapi akurat
    const products = await Product.findAll({
      where: {
        product_name: {
          [Op.like]: `%${searchTerm}%`,
        },
      },
      include: [ProductCategory, ProductImage, ProductVariant],
      limit: 50, // Tingkatkan limit untuk filtering
    });

    // Filter hasil untuk memastikan relevansi yang lebih baik
    const filteredProducts = products.filter((product) => {
      const productName = product.product_name.toLowerCase();
      const searchWords = searchTerm
        .split(" ")
        .filter((word) => word.length > 1);

      // Jika pencarian hanya 1-2 karakter, harus exact match atau di awal kata
      if (searchTerm.length <= 2) {
        return (
          productName.includes(searchTerm) &&
          (productName.startsWith(searchTerm) ||
            productName.includes(" " + searchTerm))
        );
      }

      // Untuk pencarian lebih panjang, cek apakah minimal ada 1 kata yang cocok
      if (searchWords.length === 1) {
        return productName.includes(searchWords[0]);
      }

      // Untuk multiple words, minimal 70% kata harus ada di nama produk
      const matchedWords = searchWords.filter((word) =>
        productName.includes(word)
      );

      return matchedWords.length >= Math.ceil(searchWords.length * 0.7);
    });

    // Sort berdasarkan relevansi
    const sortedProducts = filteredProducts.sort((a, b) => {
      const aName = a.product_name.toLowerCase();
      const bName = b.product_name.toLowerCase();

      // Prioritaskan yang dimulai dengan search term
      if (aName.startsWith(searchTerm) && !bName.startsWith(searchTerm))
        return -1;
      if (!aName.startsWith(searchTerm) && bName.startsWith(searchTerm))
        return 1;

      // Lalu yang mengandung search term utuh
      if (aName.includes(searchTerm) && !bName.includes(searchTerm)) return -1;
      if (!aName.includes(searchTerm) && bName.includes(searchTerm)) return 1;

      return 0;
    });

    res.json(sortedProducts.slice(0, 20)); // Batasi hasil akhir ke 20
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =============================================================================
// UPDATE PRODUCT RATINGS - Menghitung ulang rating dan total review produk
// =============================================================================
exports.updateProductRatings = async (productId) => {
  try {
    // Hitung rata-rata rating dan total review dari tabel Review
    const reviews = await Review.findAll({
      where: { product_id: productId },
      attributes: ["rating"],
    });

    const totalReviews = reviews.length;
    const averageRating =
      totalReviews > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
        : 0;

    // Update produk dengan data rating terbaru
    await Product.update(
      {
        average_rating: Math.round(averageRating * 10) / 10, // Bulatkan ke 1 desimal
        total_reviews: totalReviews,
      },
      {
        where: { product_id: productId },
      }
    );

    return { averageRating, totalReviews };
  } catch (err) {
    console.error("Error updating product ratings:", err);
    throw err;
  }
};

// =============================================================================
// RESET RATINGS - Reset rating untuk produk tertentu (DEV ONLY)
// =============================================================================
exports.resetProductRating = async (req, res) => {
  try {
    const { productId } = req.params;

    // Update rating produk berdasarkan review yang ada
    const result = await exports.updateProductRatings(productId);

    res.json({
      message: "Product rating updated successfully",
      productId: productId,
      averageRating: result.averageRating,
      totalReviews: result.totalReviews,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
