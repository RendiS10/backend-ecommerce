const express = require("express");
require("dotenv").config();

console.log("Testing backend imports...");

try {
  console.log("1. Testing orderController...");
  const orderController = require("./controllers/orderController");
  console.log("✅ orderController loaded:", Object.keys(orderController));

  console.log("2. Testing paymentController...");
  const paymentController = require("./controllers/paymentController");
  console.log("✅ paymentController loaded:", Object.keys(paymentController));

  console.log("3. Testing orderRoutes...");
  const orderRoutes = require("./routes/orderRoutes");
  console.log("✅ orderRoutes loaded successfully");

  console.log("4. Testing paymentRoutes...");
  const paymentRoutes = require("./routes/paymentRoutes");
  console.log("✅ paymentRoutes loaded successfully");

  console.log("5. Testing auth middleware...");
  const { isAuthenticated } = require("./middlewares/auth");
  console.log("✅ isAuthenticated loaded:", typeof isAuthenticated);

  console.log("\n🎉 All imports successful! Backend is ready to start.");
} catch (error) {
  console.error("❌ Error during testing:", error.message);
  console.error("Stack:", error.stack);
}
