const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Review = sequelize.define(
  "Review",
  {
    review_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    product_id: { type: DataTypes.INTEGER, allowNull: false },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    order_id: { type: DataTypes.INTEGER, allowNull: true }, // Menambahkan order_id
    rating: { type: DataTypes.TINYINT, allowNull: false },
    comment: { type: DataTypes.TEXT, allowNull: true },
    admin_reply: { type: DataTypes.TEXT, allowNull: true }, // Tambahan kolom untuk balasan admin
    review_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    tableName: "reviews",
    timestamps: false,
  }
);

module.exports = Review;
