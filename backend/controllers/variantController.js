const { ProductVariant, Product } = require("../models");

async function updateProductStock(product_id) {
  // Hitung total stok dari semua varian untuk produk ini
  const variants = await ProductVariant.findAll({ where: { product_id } });
  const totalStock = variants.reduce(
    (sum, v) => sum + (v.variant_stock || 0),
    0
  );
  await Product.update({ stock: totalStock }, { where: { product_id } });
}

exports.getAllVariants = async (req, res) => {
  try {
    const variants = await ProductVariant.findAll();
    res.json(variants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createVariant = async (req, res) => {
  try {
    const { product_id, color, size, variant_stock } = req.body;
    const variant = await ProductVariant.create({
      product_id,
      color,
      size,
      variant_stock,
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
