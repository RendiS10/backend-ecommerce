const sequelize = require("./config/database");

// Tambahkan kolom admin_reply secara manual
sequelize
  .query("ALTER TABLE reviews ADD COLUMN admin_reply TEXT NULL")
  .then(() => {
    console.log("Column admin_reply added successfully");

    // Verify kolom sudah ditambahkan
    return sequelize.query("DESCRIBE reviews");
  })
  .then(([results, metadata]) => {
    console.log("Updated table structure:");
    console.log(results);
    process.exit(0);
  })
  .catch((err) => {
    console.error("Error:", err);
    // Mungkin kolom sudah ada
    if (err.message.includes("Duplicate column name")) {
      console.log("Column admin_reply already exists");
      process.exit(0);
    } else {
      process.exit(1);
    }
  });
