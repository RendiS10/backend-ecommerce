const { ProductImage, Product } = require("../models");
const path = require("path");
const fs = require("fs");

exports.getAllProductImages = async (req, res) => {
  try {
    const { product_id } = req.query;
    const where = {};

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

exports.createProductImage = async (req, res) => {
  try {
    const { product_id, alt_text, image_path } = req.body;

    const product = await Product.findByPk(product_id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let finalImagePath = null;

    if (req.file) {
      let relPath = req.file.path.replace(/\\/g, "/");
      relPath = relPath.replace(/^backend\//, "");
      finalImagePath = relPath;
    } else if (image_path) {
      finalImagePath = image_path;
    } else {
      return res
        .status(400)
        .json({ message: "Image file or image URL is required" });
    }

    const productImage = await ProductImage.create({
      product_id,
      image_path: finalImagePath,
      alt_text,
    });

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

exports.updateProductImage = async (req, res) => {
  try {
    const { id } = req.params;
    const productImage = await ProductImage.findByPk(id);

    if (!productImage) {
      return res.status(404).json({ message: "Product image not found" });
    }

    const { product_id, alt_text, image_path } = req.body;

    if (product_id && product_id !== productImage.product_id) {
      const product = await Product.findByPk(product_id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
    }

    let finalImagePath = productImage.image_path;
    if (req.file) {
      let relPath = req.file.path.replace(/\\/g, "/");
      relPath = relPath.replace(/^backend\//, "");
      finalImagePath = relPath;
    } else if (image_path && image_path !== productImage.image_path) {
      finalImagePath = image_path;
    }

    await productImage.update({
      product_id: product_id || productImage.product_id,
      image_path: finalImagePath,
      alt_text: alt_text !== undefined ? alt_text : productImage.alt_text,
    });

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

exports.deleteProductImage = async (req, res) => {
  try {
    const { id } = req.params;
    const productImage = await ProductImage.findByPk(id);

    if (!productImage) {
      return res.status(404).json({ message: "Product image not found" });
    }

    await productImage.destroy();

    res.json({ message: "Product image deleted successfully" });
  } catch (err) {
    console.error("Delete product image error:", err);
    res.status(500).json({ message: err.message });
  }
};
