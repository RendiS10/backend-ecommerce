const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Order = sequelize.define(
  "Order",
  {
    order_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    order_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    total_amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    order_status: {
      type: DataTypes.ENUM(
        "pending_payment",
        "payment_uploaded",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "completed",
        "cancelled"
      ),
      allowNull: false,
    },
    payment_method: { type: DataTypes.STRING(50) },
    payment_proof: { type: DataTypes.STRING(255) }, // File path untuk bukti pembayaran
    shipping_address: { type: DataTypes.TEXT },
    shipping_city: { type: DataTypes.STRING(100) },
    shipping_postal_code: { type: DataTypes.STRING(10) },
    tracking_number: { type: DataTypes.STRING(100) },
    notes: { type: DataTypes.TEXT },
  },
  {
    tableName: "orders",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = Order;
