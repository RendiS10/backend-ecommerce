// =============================================================================
// USER ROUTES - Routing untuk operasi CRUD users
// =============================================================================

const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { body } = require("express-validator");
const { isAuthenticated, isAdmin } = require("../middlewares/auth");

// =============================================================================
// USER ROUTES
// =============================================================================

// GET /api/users - Ambil semua users (admin only)
router.get("/", isAuthenticated, isAdmin, userController.getAllUsers);

// GET /api/users/:id - Ambil user berdasarkan ID (admin only)
router.get("/:id", isAuthenticated, isAdmin, userController.getUserById);

// POST /api/users - Tambah user baru (admin only)
router.post(
  "/",
  isAuthenticated,
  isAdmin,
  [
    body("full_name").notEmpty().withMessage("Full name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("role")
      .isIn(["admin", "customer"])
      .withMessage("Role must be admin or customer"),
  ],
  userController.createUser
);

// PUT /api/users/:id - Update user (admin only)
router.put(
  "/:id",
  isAuthenticated,
  isAdmin,
  [
    body("full_name")
      .optional()
      .notEmpty()
      .withMessage("Full name cannot be empty"),
    body("email").optional().isEmail().withMessage("Valid email is required"),
    body("password")
      .optional()
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("role")
      .optional()
      .isIn(["admin", "customer"])
      .withMessage("Role must be admin or customer"),
  ],
  userController.updateUser
);

// DELETE /api/users/:id - Hapus user (admin only)
router.delete("/:id", isAuthenticated, isAdmin, userController.deleteUser);

// PATCH /api/users/:id/role - Update role user (admin only, untuk quick toggle)
router.patch(
  "/:id/role",
  isAuthenticated,
  isAdmin,
  [
    body("role")
      .isIn(["admin", "customer"])
      .withMessage("Role must be admin or customer"),
  ],
  userController.updateUserRole
);

module.exports = router;
