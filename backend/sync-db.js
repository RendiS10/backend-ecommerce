const sequelize = require("./config/database");

// Sync database dengan alter: true untuk menambahkan kolom baru
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Database synced successfully");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Sync error:", err);
    process.exit(1);
  });
