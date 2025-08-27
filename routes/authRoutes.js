const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const { isAuthenticated } = require("../middlewares/auth");
const authController = require("../controllers/authController");

// Debug: log what's imported
console.log("AuthController imported:", typeof authController);
console.log("getUserProfile function:", typeof authController.getUserProfile);
console.log(
  "updateUserProfile function:",
  typeof authController.updateUserProfile
);
console.log("Auth middleware fix applied - server should work now!");

router.post(
  "/register",
  [
    body("full_name").notEmpty(),
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
    body("role").isIn(["admin", "customer"]),
  ],
  authController.register
);

router.post(
  "/login",
  [body("email").isEmail(), body("password").notEmpty()],
  authController.login
);

// GET user profile (requires authentication)
router.get("/me", isAuthenticated, authController.getUserProfile);

// UPDATE user profile (requires authentication)
router.put(
  "/profile",
  isAuthenticated,
  [
    body("full_name").optional().notEmpty(),
    body("phone_number").optional().notEmpty(),
    body("address").optional().notEmpty(),
    body("city").optional().notEmpty(),
    body("postal_code").optional().notEmpty(),
  ],
  authController.updateUserProfile
);
module.exports = router;
