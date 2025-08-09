/**
 * Database Migration Script: Update order_status to ENUM
 * This script updates the order_status column to use ENUM type with Indonesian status values
 */

const mysql = require("mysql2/promise");
require("dotenv").config();

const DB_CONFIG = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "ecommerce_jkt48",
};

async function migrateOrderStatus() {
  let connection;

  try {
    console.log("🔄 Starting order_status migration...");

    // Create database connection
    connection = await mysql.createConnection(DB_CONFIG);
    console.log("✅ Connected to database");

    // Step 1: Check current status values
    console.log("\n📊 Current order_status values:");
    const [currentStatuses] = await connection.execute(
      "SELECT DISTINCT order_status, COUNT(*) as count FROM orders GROUP BY order_status"
    );
    console.table(currentStatuses);

    // Step 2: Update existing data to new status values
    console.log("\n🔄 Updating existing order status values...");
    const updateQuery = `
      UPDATE orders 
      SET order_status = CASE 
          WHEN order_status IN ('1', 'pending', 'pending_payment', 'new') THEN 'Menunggu Konfirmasi'
          WHEN order_status IN ('2', 'confirmed', 'paid') THEN 'Diproses'
          WHEN order_status IN ('3', 'processing', 'process') THEN 'Diproses'
          WHEN order_status IN ('4', 'shipped', 'ship') THEN 'Dikirim'
          WHEN order_status IN ('5', 'delivered', 'done', 'completed') THEN 'Selesai'
          WHEN order_status IN ('9', 'cancelled', 'canceled') THEN 'Dibatalkan'
          ELSE 'Menunggu Konfirmasi'
      END
    `;

    const [updateResult] = await connection.execute(updateQuery);
    console.log(`✅ Updated ${updateResult.affectedRows} records`);

    // Step 3: Modify column to ENUM type
    console.log("\n🔄 Modifying column to ENUM type...");
    const alterQuery = `
      ALTER TABLE orders 
      MODIFY COLUMN order_status 
      ENUM('Menunggu Konfirmasi', 'Diproses', 'Dikirim', 'Selesai', 'Dibatalkan') 
      NOT NULL 
      DEFAULT 'Menunggu Konfirmasi'
    `;

    await connection.execute(alterQuery);
    console.log("✅ Column modified to ENUM type");

    // Step 4: Verify the changes
    console.log("\n📊 Updated order_status values:");
    const [newStatuses] = await connection.execute(
      "SELECT DISTINCT order_status, COUNT(*) as count FROM orders GROUP BY order_status"
    );
    console.table(newStatuses);

    // Step 5: Show table structure
    console.log("\n📋 Updated table structure for order_status:");
    const [tableInfo] = await connection.execute("DESCRIBE orders");
    const orderStatusInfo = tableInfo.find(
      (col) => col.Field === "order_status"
    );
    console.log("order_status column:", orderStatusInfo);

    console.log("\n🎉 Migration completed successfully!");
    console.log("\n📌 Next steps:");
    console.log("1. Restart your backend server");
    console.log("2. Test order creation and status updates");
    console.log("3. Verify frontend displays new status values correctly");
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log("🔌 Database connection closed");
    }
  }
}

// Run migration
if (require.main === module) {
  migrateOrderStatus();
}

module.exports = migrateOrderStatus;
