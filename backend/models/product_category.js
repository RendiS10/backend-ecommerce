const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ProductCategory = sequelize.define(
  "ProductCategory",
  {
    category_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    category_name: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: false,
    },
    slug: { type: DataTypes.STRING(100), unique: true, allowNull: false },
  },
  {
    tableName: "product_categories",
    timestamps: false,
  }
);

module.exports = ProductCategory;
