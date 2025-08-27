// =============================================================================
// VARIANT CONTROLLER - Controller untuk mengelola varian produk
// =============================================================================

// Mengimpor model yang dibutuhkan untuk operasi varian produk
const { ProductVariant, Product } = require("../models");

// =============================================================================
// HELPER FUNCTION - Update total stok produk berdasarkan varian
// =============================================================================
async function updateProductStock(product_id) {
  // Hitung total stok dari semua varian untuk produk ini
  const variants = await ProductVariant.findAll({ where: { product_id } });

  // Jumlahkan stok dari semua varian (contoh: Size S=10, Size M=15, Size L=5 → Total=30)
  const totalStock = variants.reduce(
    (sum, v) => sum + (v.variant_stock || 0),
    0
  );

  // Update stok di tabel Product dengan total dari semua varian
  await Product.update({ stock: totalStock }, { where: { product_id } });
}

// =============================================================================
// GET ALL VARIANTS - Mengambil semua varian produk (Admin only)
// =============================================================================
exports.getAllVariants = async (req, res) => {
  try {
    // Ambil semua varian dari database dengan relasi Product untuk mendapatkan nama produk
    const variants = await ProductVariant.findAll({
      include: [
        {
          model: Product,
          attributes: ["product_id", "product_name"],
        },
      ],
    });

    // Kirim response dengan daftar varian
    res.json(variants);
  } catch (err) {
    // Handle error database
    res.status(500).json({ message: err.message });
  }
};

// =============================================================================
// CREATE VARIANT - Membuat varian baru untuk produk (Admin only)
// =============================================================================
exports.createVariant = async (req, res) => {
  try {
    // Ambil data varian dari request body
    const { product_id, color, size, variant_stock } = req.body;

    // Buat varian baru di database
    const variant = await ProductVariant.create({
      product_id, // ID produk yang punya varian ini
      color, // Warna varian (contoh: "Black", "White")
      size, // Ukuran varian (contoh: "S", "M", "L", "XL")
      variant_stock, // Stok untuk varian ini
    });
    await updateProductStock(product_id);
    res.status(201).json(variant);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateVariant = async (req, res) => {
  try {
    const { id } = req.params;
    const { product_id, color, size, variant_stock } = req.body;
    const variant = await ProductVariant.findByPk(id);
    if (!variant) return res.status(404).json({ message: "Variant not found" });
    variant.product_id = product_id;
    variant.color = color;
    variant.size = size;
    variant.variant_stock = variant_stock;
    await variant.save();
    await updateProductStock(product_id);
    res.json(variant);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteVariant = async (req, res) => {
  try {
    const { id } = req.params;
    const variant = await ProductVariant.findByPk(id);
    if (!variant) return res.status(404).json({ message: "Variant not found" });
    const product_id = variant.product_id;
    await variant.destroy();
    await updateProductStock(product_id);
    res.json({ message: "Variant deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
