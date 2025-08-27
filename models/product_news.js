const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ProductNews = sequelize.define(
  "ProductNews",
  {
    news_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    product_id: { type: DataTypes.INTEGER, allowNull: false },
    image_highlight: { type: DataTypes.STRING(255) },
    highlight_link: { type: DataTypes.STRING(255) },
    alt_text: { type: DataTypes.STRING(255) },
    display_order: { type: DataTypes.INTEGER },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
  {
    tableName: "product_news",
    timestamps: false,
  }
);

module.exports = ProductNews;
