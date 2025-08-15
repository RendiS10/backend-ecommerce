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
    image_url: { type: DataTypes.STRING(255), allowNull: true },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    tableName: "products",
    timestamps: false,
  }
);

// Force sync the model schema on startup (only in development)
if (process.env.NODE_ENV !== "production") {
  Product.sync({ alter: true })
    .then(() => {
      console.log("✅ Product model schema synced successfully");
    })
    .catch((err) => {
      console.error("❌ Error syncing Product model:", err.message);
    });
}

module.exports = Product;
