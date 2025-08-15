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
    image_url: { type: DataTypes.STRING(255), allowNull: true },
  },
  {
    tableName: "product_categories",
    timestamps: false,
  }
);

// Force sync the model schema on startup (only in development)
if (process.env.NODE_ENV !== "production") {
  ProductCategory.sync({ alter: true })
    .then(() => {
      console.log("✅ ProductCategory model schema synced successfully");
    })
    .catch((err) => {
      console.error("❌ Error syncing ProductCategory model:", err.message);
    });
}

module.exports = ProductCategory;
