/**
 * Create Admin User Script
 * This script creates an admin user for the e-commerce system
 */

const bcrypt = require("bcryptjs");
const { User } = require("./models");
require("dotenv").config();

async function createAdminUser() {
  try {
    console.log("🔍 Checking for existing admin user...");

    // Check if admin user already exists
    const existingAdmin = await User.findOne({
      where: { role: "admin" },
    });

    if (existingAdmin) {
      console.log("✅ Admin user already exists:");
      console.log(`   Email: ${existingAdmin.email}`);
      console.log(`   Name: ${existingAdmin.full_name}`);
      console.log(`   Role: ${existingAdmin.role}`);
      return;
    }

    console.log("📝 Creating new admin user...");

    // Admin user data
    const adminData = {
      full_name: "Administrator",
      email: "admin@jkt48.com",
      password: "admin123", // Change this to a strong password
      role: "admin",
    };

    // Hash password
    const password_hash = await bcrypt.hash(adminData.password, 10);

    // Create admin user
    const adminUser = await User.create({
      full_name: adminData.full_name,
      email: adminData.email,
      password_hash: password_hash,
      role: adminData.role,
    });

    console.log("✅ Admin user created successfully!");
    console.log(`   User ID: ${adminUser.user_id}`);
    console.log(`   Email: ${adminUser.email}`);
    console.log(`   Name: ${adminUser.full_name}`);
    console.log(`   Role: ${adminUser.role}`);
    console.log(`   Password: ${adminData.password} (Please change this!)`);

    console.log("\n🔑 Login credentials for admin panel:");
    console.log(`   Email: ${adminUser.email}`);
    console.log(`   Password: ${adminData.password}`);
  } catch (error) {
    console.error("❌ Error creating admin user:", error.message);
    if (error.name === "SequelizeUniqueConstraintError") {
      console.log("💡 Admin user with this email already exists");
    }
  }
}

// Run the script
if (require.main === module) {
  createAdminUser()
    .then(() => {
      console.log("\n✅ Script completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Script failed:", error);
      process.exit(1);
    });
}

module.exports = createAdminUser;
