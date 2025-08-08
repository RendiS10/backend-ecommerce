const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Product = sequelize.define(
  "Product",
  {
    product_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    category_id: { type: DataTypes.INTEGER, allowNull: false },
    product_name: { type: DataTypes.STRING(255), allowNull: false },
    description: { type: DataTypes.TEXT },
    price: { type: DataTypes.INTEGER, allowNull: false },
    stock: { type: DataTypes.INTEGER, allowNull: false },
    sold_quantity: { type: DataTypes.INTEGER, defaultValue: 0 },
    average_rating: { type: DataTypes.DECIMAL(2, 1), defaultValue: 0.0 },
    total_reviews: { type: DataTypes.INTEGER, defaultValue: 0 },
    main_image: { type: DataTypes.STRING(255) },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    tableName: "products",
    timestamps: false,
  }
);

module.exports = Product;
