// =============================================================================
// PRODUCT IMAGE CONTROLLER - Controller untuk mengelola gambar produk
// =============================================================================

const { ProductImage, Product } = require("../models");
const path = require("path");
const fs = require("fs");

// =============================================================================
// GET ALL PRODUCT IMAGES - Mengambil semua gambar produk
// =============================================================================
exports.getAllProductImages = async (req, res) => {
  try {
    const { product_id } = req.query;
    const where = {};

    // Filter berdasarkan product_id jika ada
    if (product_id) {
      where.product_id = product_id;
    }

    const productImages = await ProductImage.findAll({
      where,
      include: [
        {
          model: Product,
          attributes: ["product_id", "product_name"],
        },
      ],
      order: [["image_id", "DESC"]],
    });

    res.json(productImages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =============================================================================
// GET SINGLE PRODUCT IMAGE - Mengambil satu gambar produk berdasarkan ID
// =============================================================================
exports.getProductImageById = async (req, res) => {
  try {
    const { id } = req.params;
    const productImage = await ProductImage.findByPk(id, {
      include: [
        {
          model: Product,
          attributes: ["product_id", "product_name"],
        },
      ],
    });

    if (!productImage) {
      return res.status(404).json({ message: "Product image not found" });
    }

    res.json(productImage);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =============================================================================
// CREATE PRODUCT IMAGE - Menambah gambar produk baru
// =============================================================================
exports.createProductImage = async (req, res) => {
  try {
    const { product_id, alt_text } = req.body;

    // Validasi apakah produk ada
    const product = await Product.findByPk(product_id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let image_path = null;
    if (req.file) {
      // Simpan path relatif dari folder uploads
      let relPath = req.file.path.replace(/\\/g, "/");
      relPath = relPath.replace(/^backend\//, ""); // hilangkan prefix backend/ jika ada
      image_path = relPath;
    } else {
      return res.status(400).json({ message: "Image file is required" });
    }

    const productImage = await ProductImage.create({
      product_id,
      image_path,
      alt_text,
    });

    // Ambil data lengkap dengan relasi
    const newProductImage = await ProductImage.findByPk(productImage.image_id, {
      include: [
        {
          model: Product,
          attributes: ["product_id", "product_name"],
        },
      ],
    });

    res.status(201).json(newProductImage);
  } catch (err) {
    console.error("Create product image error:", err);
    res.status(500).json({ message: err.message });
  }
};

// =============================================================================
// UPDATE PRODUCT IMAGE - Mengupdate gambar produk
// =============================================================================
exports.updateProductImage = async (req, res) => {
  try {
    const { id } = req.params;
    const productImage = await ProductImage.findByPk(id);

    if (!productImage) {
      return res.status(404).json({ message: "Product image not found" });
    }

    const { product_id, alt_text } = req.body;

    // Validasi apakah produk ada jika product_id diubah
    if (product_id && product_id !== productImage.product_id) {
      const product = await Product.findByPk(product_id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
    }

    // Update image_path jika ada file baru
    let image_path = productImage.image_path;
    if (req.file) {
      // Hapus file lama jika ada
      if (productImage.image_path) {
        const oldFilePath = path.join(__dirname, "..", productImage.image_path);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }

      // Simpan path file baru
      let relPath = req.file.path.replace(/\\/g, "/");
      relPath = relPath.replace(/^backend\//, "");
      image_path = relPath;
    }

    // Update data
    await productImage.update({
      product_id: product_id || productImage.product_id,
      image_path,
      alt_text: alt_text !== undefined ? alt_text : productImage.alt_text,
    });

    // Ambil data lengkap dengan relasi
    const updatedProductImage = await ProductImage.findByPk(id, {
      include: [
        {
          model: Product,
          attributes: ["product_id", "product_name"],
        },
      ],
    });

    res.json(updatedProductImage);
  } catch (err) {
    console.error("Update product image error:", err);
    res.status(500).json({ message: err.message });
  }
};

// =============================================================================
// DELETE PRODUCT IMAGE - Menghapus gambar produk
// =============================================================================
exports.deleteProductImage = async (req, res) => {
  try {
    const { id } = req.params;
    const productImage = await ProductImage.findByPk(id);

    if (!productImage) {
      return res.status(404).json({ message: "Product image not found" });
    }

    // Hapus file dari sistem
    if (productImage.image_path) {
      const filePath = path.join(__dirname, "..", productImage.image_path);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // Hapus dari database
    await productImage.destroy();

    res.json({ message: "Product image deleted successfully" });
  } catch (err) {
    console.error("Delete product image error:", err);
    res.status(500).json({ message: err.message });
  }
};
