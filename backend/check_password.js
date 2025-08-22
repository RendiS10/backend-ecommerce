const { User } = require("./models");

async function checkPassword() {
  try {
    const user = await User.findOne({
      where: { email: "hilmanfatu@gmail.com" },
      attributes: ["user_id", "email", "password", "full_name", "role"],
    });

    if (user) {
      console.log("User found:", user.email);
      console.log("Password hash:", user.password);
      console.log("Password length:", user.password.length);
      console.log("Starts with $2b$:", user.password.startsWith("$2b$"));
    } else {
      console.log("User not found");
    }

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

checkPassword();
