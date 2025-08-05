const { ProductCategory } = require("../models");

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await ProductCategory.findAll();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { category_name, slug } = req.body;
    const category = await ProductCategory.create({ category_name, slug });
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { category_name, slug } = req.body;
    const category = await ProductCategory.findByPk(id);
    if (!category)
      return res.status(404).json({ message: "Category not found" });
    category.category_name = category_name;
    category.slug = slug;
    await category.save();
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await ProductCategory.findByPk(id);
    if (!category)
      return res.status(404).json({ message: "Category not found" });
    await category.destroy();
    res.json({ message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
