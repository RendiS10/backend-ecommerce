const sequelize = require("./config/database");

// Test query langsung ke database
sequelize
  .query("DESCRIBE reviews")
  .then(([results, metadata]) => {
    console.log("Table structure:");
    console.log(results);

    // Test select sederhana
    return sequelize.query("SELECT * FROM reviews LIMIT 1");
  })
  .then(([results, metadata]) => {
    console.log("Sample data:");
    console.log(results);
    process.exit(0);
  })
  .catch((err) => {
    console.error("Error:", err);
    process.exit(1);
  });
