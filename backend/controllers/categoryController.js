// =============================================================================
// CATEGORY CONTROLLER - Controller untuk mengelola kategori produk
// =============================================================================

// Mengimpor model ProductCategory untuk operasi CRUD kategori
const { ProductCategory } = require("../models");

// =============================================================================
// GET ALL CATEGORIES - Mengambil semua kategori produk
// =============================================================================
exports.getAllCategories = async (req, res) => {
  try {
    // Ambil semua kategori dari database (untuk dropdown, menu navigasi, dll)
    const categories = await ProductCategory.findAll();

    // Kirim response dengan daftar kategori
    res.json(categories);
  } catch (err) {
    // Handle error database
    res.status(500).json({ message: err.message });
  }
};

// =============================================================================
// CREATE CATEGORY - Membuat kategori baru (Admin only)
// =============================================================================
exports.createCategory = async (req, res) => {
  try {
    // Ambil data kategori dari request body
    const { category_name, slug } = req.body;

    // Buat kategori baru di database
    const category = await ProductCategory.create({ category_name, slug });

    // Kirim response dengan kategori yang baru dibuat
    res.status(201).json(category);
  } catch (err) {
    // Handle error (unique constraint violation, validation error, dll)
    res.status(500).json({ message: err.message });
  }
};

// =============================================================================
// UPDATE CATEGORY - Mengupdate kategori yang sudah ada (Admin only)
// =============================================================================
exports.updateCategory = async (req, res) => {
  try {
    // Ambil category ID dari URL parameter
    const { id } = req.params;

    // Ambil data baru dari request body
    const { category_name, slug } = req.body;

    // Cari kategori berdasarkan ID
    const category = await ProductCategory.findByPk(id);
    if (!category)
      return res.status(404).json({ message: "Category not found" });

    // Update data kategori
    category.category_name = category_name;
    category.slug = slug;
    await category.save();
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await ProductCategory.findByPk(id);
    if (!category)
      return res.status(404).json({ message: "Category not found" });
    await category.destroy();
    res.json({ message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
