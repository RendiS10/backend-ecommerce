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
        "Menunggu Konfirmasi",
        "Disetujui",
        "Akan Dikirimkan",
        "Dikirim",
        "Selesai",
        "Dibatalkan"
      ),
      allowNull: false,
      defaultValue: "Menunggu Konfirmasi",
    },
    payment_method: {
      type: DataTypes.ENUM("transfer"),
      allowNull: false,
      defaultValue: "transfer",
    },
    shipping_address: { type: DataTypes.TEXT },
    shipping_city: { type: DataTypes.STRING(100) },
    shipping_postal_code: { type: DataTypes.STRING(10) },
    tracking_number: { type: DataTypes.STRING(100) },
    notes: { type: DataTypes.TEXT },
  },
  {
    tableName: "orders",
    timestamps: false,
  }
);

// Force sync the model schema on startup (only in development)
if (process.env.NODE_ENV !== "production") {
  Order.sync({ alter: true })
    .then(() => {
      console.log("✅ Order model schema synced successfully");
    })
    .catch((err) => {
      console.error("❌ Error syncing Order model:", err.message);
    });
}

module.exports = Order;
