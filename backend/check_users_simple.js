const { User } = require("./models");

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

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

checkUsers();
