const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Transaction = sequelize.define(
  "Transaction",
  {
    transaction_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    order_id: { type: DataTypes.INTEGER, allowNull: false },
    payment_gateway_ref: { type: DataTypes.STRING(255) },
    amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    currency: { type: DataTypes.STRING(5), allowNull: false },
    transaction_status: {
      type: DataTypes.ENUM("pending", "success", "failed", "refunded"),
      allowNull: false,
    },
    transaction_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    tableName: "transactions",
    timestamps: false,
  }
);

module.exports = Transaction;
