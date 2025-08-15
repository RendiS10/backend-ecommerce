const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { body } = require("express-validator");
const { isAuthenticated, isAdmin } = require("../middlewares/auth");

router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);
router.post(
  "/",
  isAuthenticated,
  isAdmin,
  [
    body("product_name").notEmpty(),
    body("price").isNumeric(),
    body("category_id").isNumeric(),
    body("stock").isNumeric(),
    body("image_url").optional().isURL(),
  ],
  productController.createProduct
);
router.put(
  "/:id",
  isAuthenticated,
  isAdmin,
  [
    body("product_name").optional().notEmpty(),
    body("price").optional().isNumeric(),
    body("category_id").optional().isNumeric(),
    body("stock").optional().isNumeric(),
    body("image_url").optional().isURL(),
  ],
  productController.updateProduct
);
router.delete(
  "/:id",
  isAuthenticated,
  isAdmin,
  productController.deleteProduct
);

module.exports = router;
