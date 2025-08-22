const { User } = require("./models");
const bcrypt = require("bcryptjs");

async function testLogin() {
  try {
    console.log("Testing login process...");

    // Get user data
    const user = await User.findOne({
      where: { email: "hilmanfatu@gmail.com" },
    });

    if (!user) {
      console.log("User not found");
      return;
    }

    console.log("User found:", user.full_name);
    console.log("Password hash exists:", !!user.password_hash);
    console.log(
      "Password hash length:",
      user.password_hash ? user.password_hash.length : 0
    );

    // Test different passwords
    const passwords = ["admin123", "password", "123456", "admin", "hilman123"];

    for (const password of passwords) {
      try {
        const match = await bcrypt.compare(password, user.password_hash);
        console.log(`Password "${password}": ${match ? "MATCH" : "NO MATCH"}`);
        if (match) {
          console.log("✅ Correct password found:", password);
          break;
        }
      } catch (error) {
        console.log(`Error testing password "${password}":`, error.message);
      }
    }

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

testLogin();
