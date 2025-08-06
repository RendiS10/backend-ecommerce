const {
  Product,
  ProductCategory,
  ProductImage,
  ProductVariant,
} = require("../models");

exports.getAllProducts = async (req, res) => {
  try {
    const { category } = req.query;
    const where = {};
    if (category) {
      // Cari kategori berdasarkan nama (case-insensitive)
      const cat = await ProductCategory.findOne({
        where: { category_name: category },
      });
      if (cat) {
        where.category_id = cat.category_id;
      } else {
        // Jika kategori tidak ditemukan, return array kosong
        return res.json([]);
      }
    }
    const products = await Product.findAll({
      where,
      include: [ProductCategory, ProductImage, ProductVariant],
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    // Log for debugging
    console.log("req.body:", req.body);
    console.log("req.file:", req.file);
    const { category_id, product_name, description, price, stock } = req.body;
    let main_image = null;
    if (req.file) {
      // Simpan hanya path relatif dari folder uploads
      let relPath = req.file.path.replace(/\\/g, "/");
      relPath = relPath.replace(/^backend\//, ""); // hilangkan prefix backend/ jika ada
      main_image = relPath;
    }
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
    const { product_name, description, price, category_id, stock } = req.body;
    let main_image = product.main_image;
    if (req.file) {
      let relPath = req.file.path.replace(/\\/g, "/");
      relPath = relPath.replace(/^backend\//, "");
      main_image = relPath;
    }

    // Update field jika ada perubahan
    if (product_name !== undefined) product.product_name = product_name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (category_id !== undefined) product.category_id = category_id;
    if (stock !== undefined) product.stock = stock;
    if (main_image !== undefined) product.main_image = main_image;

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
