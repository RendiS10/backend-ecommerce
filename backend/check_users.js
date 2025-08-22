const { User } = require("./models");
const bcrypt = require("bcrypt");

async function checkUsers() {
  try {
    console.log("Checking users in database...");
    const users = await User.findAll({
      attributes: ["user_id", "email", "full_name", "role"],
      limit: 10,
    });

    console.log("Found users:", users.length);
    users.forEach((user) => {
      console.log(
        `User ${user.user_id}: ${user.email} (${user.full_name}) - Role: ${user.role}`
      );
    });

    // Create admin user if doesn't exist
    const adminUser = await User.findOne({
      where: { email: "rendisutendi10@gmail.com" },
    });

    if (!adminUser) {
      console.log("Creating admin user...");
      const hashedPassword = await bcrypt.hash("admin123", 10);
      await User.create({
        email: "rendisutendi10@gmail.com",
        password: hashedPassword,
        full_name: "Admin User",
        role: "admin",
      });
      console.log("Admin user created");
    } else {
      console.log("Admin user exists:", adminUser.full_name);
    }

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

checkUsers();
