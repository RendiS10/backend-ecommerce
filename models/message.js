const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Message = sequelize.define(
  "Message",
  {
    message_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    sender_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "ID pengirim pesan",
    },
    recipient_id: {
      type: DataTypes.INTEGER,
      allowNull: true, // null berarti broadcast ke semua admin
      comment: "ID penerima pesan, null untuk broadcast",
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: "Isi pesan chat",
    },
    sender_type: {
      type: DataTypes.ENUM("customer", "admin"),
      allowNull: false,
      defaultValue: "customer",
      comment: "Tipe pengirim: customer atau admin",
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: "Status apakah pesan sudah dibaca",
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      comment: "Waktu pesan dikirim",
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      comment: "Waktu terakhir diupdate",
    },
  },
  {
    tableName: "messages",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// Force sync the model schema on startup (only in development)
if (process.env.NODE_ENV !== "production") {
  Message.sync({ alter: true })
    .then(() => {
      console.log("✅ Message model schema synced successfully");
    })
    .catch((err) => {
      console.error("❌ Error syncing Message model:", err.message);
    });
}

module.exports = Message;
