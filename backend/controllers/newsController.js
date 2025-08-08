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
    // Ambil semua berita dengan info produk terkait (untuk homepage/banner)
    const news = await ProductNews.findAll({ include: [Product] });

    // Kirim response dengan daftar berita
    res.json(news);
  } catch (err) {
    // Handle error database
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
      image_highlight, // Gambar banner/highlight
      highlight_link, // Link tujuan saat banner diklik
      alt_text, // Text alternatif untuk accessibility
      display_order, // Urutan tampil banner (1, 2, 3, ...)
      is_active, // Status aktif/nonaktif banner
    } = req.body;

    // Buat berita baru di database
    const news = await ProductNews.create({
      product_id,
      image_highlight,
      highlight_link,
      alt_text,
      display_order,
      is_active,
    });

    // Kirim response dengan berita yang baru dibuat
    res.status(201).json(news);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateNews = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      product_id,
      image_highlight,
      highlight_link,
      alt_text,
      display_order,
      is_active,
    } = req.body;
    const news = await ProductNews.findByPk(id);
    if (!news) return res.status(404).json({ message: "News not found" });
    Object.assign(news, {
      product_id,
      image_highlight,
      highlight_link,
      alt_text,
      display_order,
      is_active,
    });
    await news.save();
    res.json(news);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteNews = async (req, res) => {
  try {
    const { id } = req.params;
    const news = await ProductNews.findByPk(id);
    if (!news) return res.status(404).json({ message: "News not found" });
    await news.destroy();
    res.json({ message: "News deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
