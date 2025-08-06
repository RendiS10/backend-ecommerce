const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const { body } = require("express-validator");
const { isAuthenticated, isAdmin } = require("../middlewares/auth");

router.get("/", categoryController.getAllCategories);
router.post(
  "/",
  isAuthenticated,
  isAdmin,
  [body("category_name").notEmpty(), body("slug").notEmpty()],
  categoryController.createCategory
);
router.put(
  "/:id",
  isAuthenticated,
  isAdmin,
  [body("category_name").notEmpty(), body("slug").notEmpty()],
  categoryController.updateCategory
);
router.delete(
  "/:id",
  isAuthenticated,
  isAdmin,
  categoryController.deleteCategory
);

module.exports = router;
