const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ProductVariant = sequelize.define(
  "ProductVariant",
  {
    variant_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    product_id: { type: DataTypes.INTEGER, allowNull: false },
    color: { type: DataTypes.STRING(50), allowNull: true },
    size: { type: DataTypes.STRING(50), allowNull: true },
    variant_stock: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    tableName: "product_variants",
    timestamps: false,
  }
);

module.exports = ProductVariant;
