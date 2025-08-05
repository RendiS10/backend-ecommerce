const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ProductImage = sequelize.define(
  "ProductImage",
  {
    image_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    product_id: { type: DataTypes.INTEGER, allowNull: false },
    image_path: { type: DataTypes.STRING(255), allowNull: false },
    alt_text: { type: DataTypes.STRING(255) },
  },
  {
    tableName: "product_images",
    timestamps: false,
  }
);

module.exports = ProductImage;
