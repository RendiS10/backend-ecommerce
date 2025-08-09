// =============================================================================
// NEWS CONTROLLER - Controller untuk mengelola berita/highlight produk JKT48
// =============================================================================

// Mengimpor model yang dibutuhkan untuk operasi berita produk
const { ProductNews, Product } = require("../models");

// =============================================================================
// GET ALL NEWS - Mengambil semua berita/highlight produk
// =============================================================================
exports.getAllNews = async (req, res) => {
  try {
    // Ambil parameter query untuk filter jika ada
    const { product_id, is_active } = req.query;
    const where = {};

    // Filter berdasarkan product_id jika ada
    if (product_id) {
      where.product_id = product_id;
    }

    // Filter berdasarkan status aktif jika ada
    if (is_active !== undefined) {
      where.is_active = is_active === "true";
    }

    // Ambil semua berita dengan info produk terkait
    const news = await ProductNews.findAll({
      where,
      include: [
        {
          model: Product,
          attributes: ["product_id", "product_name"],
        },
      ],
      order: [
        ["display_order", "ASC"],
        ["news_id", "DESC"],
      ],
    });

    // Kirim response dengan daftar berita
    res.json(news);
  } catch (err) {
    // Handle error database
    res.status(500).json({ message: err.message });
  }
};

// =============================================================================
// GET NEWS BY ID - Mengambil satu berita berdasarkan ID
// =============================================================================
exports.getNewsById = async (req, res) => {
  try {
    const { id } = req.params;
    const news = await ProductNews.findByPk(id, {
      include: [
        {
          model: Product,
          attributes: ["product_id", "product_name"],
        },
      ],
    });

    if (!news) {
      return res.status(404).json({ message: "News not found" });
    }

    res.json(news);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =============================================================================
// CREATE NEWS - Membuat berita/highlight baru (Admin only)
// =============================================================================
exports.createNews = async (req, res) => {
  try {
    // Ambil data berita dari request body
    const {
      product_id, // ID produk yang dihighlight (optional)
      highlight_link, // Link tujuan saat banner diklik
      alt_text, // Text alternatif untuk accessibility
      display_order, // Urutan tampil banner (1, 2, 3, ...)
      is_active, // Status aktif/nonaktif banner
    } = req.body;

    // Validasi apakah produk ada jika product_id diberikan
    if (product_id) {
      const product = await Product.findByPk(product_id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
    }

    let image_highlight = null;
    if (req.file) {
      // Simpan path relatif dari folder uploads
      let relPath = req.file.path.replace(/\\/g, "/");
      relPath = relPath.replace(/^backend\//, ""); // hilangkan prefix backend/ jika ada
      image_highlight = relPath;
    }

    // Buat berita baru di database
    const news = await ProductNews.create({
      product_id: product_id || null,
      image_highlight,
      highlight_link,
      alt_text,
      display_order: display_order || 1,
      is_active: is_active !== undefined ? is_active : true,
    });

    // Ambil data lengkap dengan relasi
    const newNews = await ProductNews.findByPk(news.news_id, {
      include: [
        {
          model: Product,
          attributes: ["product_id", "product_name"],
        },
      ],
    });

    // Kirim response dengan berita yang baru dibuat
    res.status(201).json(newNews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateNews = async (req, res) => {
  try {
    const { id } = req.params;
    const news = await ProductNews.findByPk(id);

    if (!news) {
      return res.status(404).json({ message: "News not found" });
    }

    const { product_id, highlight_link, alt_text, display_order, is_active } =
      req.body;

    // Validasi apakah produk ada jika product_id diubah
    if (product_id && product_id !== news.product_id) {
      const product = await Product.findByPk(product_id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
    }

    // Update image_highlight jika ada file baru
    let image_highlight = news.image_highlight;
    if (req.file) {
      // Hapus file lama jika ada
      if (news.image_highlight) {
        const path = require("path");
        const fs = require("fs");
        const oldFilePath = path.join(__dirname, "..", news.image_highlight);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }

      // Simpan path file baru
      let relPath = req.file.path.replace(/\\/g, "/");
      relPath = relPath.replace(/^backend\//, "");
      image_highlight = relPath;
    }

    // Update data
    await news.update({
      product_id: product_id !== undefined ? product_id : news.product_id,
      image_highlight,
      highlight_link:
        highlight_link !== undefined ? highlight_link : news.highlight_link,
      alt_text: alt_text !== undefined ? alt_text : news.alt_text,
      display_order:
        display_order !== undefined ? display_order : news.display_order,
      is_active: is_active !== undefined ? is_active : news.is_active,
    });

    // Ambil data lengkap dengan relasi
    const updatedNews = await ProductNews.findByPk(id, {
      include: [
        {
          model: Product,
          attributes: ["product_id", "product_name"],
        },
      ],
    });

    res.json(updatedNews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteNews = async (req, res) => {
  try {
    const { id } = req.params;
    const news = await ProductNews.findByPk(id);

    if (!news) {
      return res.status(404).json({ message: "News not found" });
    }

    // Hapus file dari sistem jika ada
    if (news.image_highlight) {
      const path = require("path");
      const fs = require("fs");
      const filePath = path.join(__dirname, "..", news.image_highlight);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // Hapus dari database
    await news.destroy();

    res.json({ message: "News deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
