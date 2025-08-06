const { ProductVariant } = require("../models");

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
    await variant.destroy();
    res.json({ message: "Variant deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
