const express = require("express");
const router = express.Router();
const variantController = require("../controllers/variantController");
const { body } = require("express-validator");
const { isAuthenticated, isAdmin } = require("../middlewares/auth");

router.get("/", variantController.getAllVariants);
router.post(
  "/",
  isAuthenticated,
  isAdmin,
  [body("product_id").isNumeric(), body("variant_stock").isNumeric()],
  variantController.createVariant
);
router.put(
  "/:id",
  isAuthenticated,
  isAdmin,
  [body("product_id").isNumeric(), body("variant_stock").isNumeric()],
  variantController.updateVariant
);
router.delete(
  "/:id",
  isAuthenticated,
  isAdmin,
  variantController.deleteVariant
);

module.exports = router;
