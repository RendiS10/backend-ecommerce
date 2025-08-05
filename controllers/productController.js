const {
  Product,
  ProductCategory,
  ProductImage,
  ProductVariant,
} = require("../models");

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [ProductCategory, ProductImage, ProductVariant],
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { category_id, product_name, description, price, stock, main_image } =
      req.body;
    const product = await Product.create({
      category_id,
      product_name,
      description,
      price,
      stock,
      main_image,
    });
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
