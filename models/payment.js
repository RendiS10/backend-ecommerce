const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Payment = sequelize.define(
  "Payment",
  {
    payment_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "orders",
        key: "order_id",
      },
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "user_id",
      },
    },
    payment_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    payment_status: {
      type: DataTypes.ENUM(
        "Menunggu Pembayaran",
        "Menunggu Konfirmasi",
        "Disetujui",
        "Ditolak"
      ),
      allowNull: false,
      defaultValue: "Menunggu Pembayaran",
    },
    payment_method: {
      type: DataTypes.ENUM("transfer"),
      allowNull: false,
      defaultValue: "transfer",
    },
    payment_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    confirmation_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    bank_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    account_number: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    account_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    transfer_proof: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    admin_notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "payments",
    timestamps: true,
    updatedAt: "updated_at",
    createdAt: "created_at",
  }
);

// Force sync the model schema on startup (only in development)
if (process.env.NODE_ENV !== "production") {
  Payment.sync({ alter: true })
    .then(() => {
      console.log("✅ Payment model schema synced successfully");
    })
    .catch((err) => {
      console.error("❌ Error syncing Payment model:", err.message);
    });
}

module.exports = Payment;
