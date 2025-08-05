const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { body } = require("express-validator");
const { isAdmin } = require("../middlewares/auth");

router.get("/", productController.getAllProducts);
router.post(
  "/",
  isAdmin,
  [
    body("product_name").notEmpty(),
    body("price").isNumeric(),
    body("category_id").isNumeric(),
    body("stock").isNumeric(),
  ],
  productController.createProduct
);

module.exports = router;
