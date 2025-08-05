const express = require("express");
const router = express.Router();
const newsController = require("../controllers/newsController");
const { body } = require("express-validator");
const { isAdmin } = require("../middlewares/auth");

router.get("/", newsController.getAllNews);
router.post(
  "/",
  isAdmin,
  [
    body("product_id").isNumeric(),
    body("image_highlight").notEmpty(),
    body("highlight_link").notEmpty(),
    body("alt_text").notEmpty(),
  ],
  newsController.createNews
);
router.put("/:id", isAdmin, newsController.updateNews);
router.delete("/:id", isAdmin, newsController.deleteNews);

module.exports = router;
