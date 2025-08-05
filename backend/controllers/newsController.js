const { ProductNews, Product } = require("../models");

exports.getAllNews = async (req, res) => {
  try {
    const news = await ProductNews.findAll({ include: [Product] });
    res.json(news);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createNews = async (req, res) => {
  try {
    const {
      product_id,
      image_highlight,
      highlight_link,
      alt_text,
      display_order,
      is_active,
    } = req.body;
    const news = await ProductNews.create({
      product_id,
      image_highlight,
      highlight_link,
      alt_text,
      display_order,
      is_active,
    });
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
