const express = require("express");
const router = express.Router();
const newsController = require("../controllers/newsController");
const { body } = require("express-validator");
const { isAuthenticated, isAdmin } = require("../middlewares/auth");
const upload = require("../middlewares/upload");

// GET /api/news - Ambil semua berita
router.get("/", newsController.getAllNews);

// GET /api/news/:id - Ambil berita berdasarkan ID
router.get("/:id", newsController.getNewsById);

// POST /api/news - Tambah berita baru (dengan auth dan upload)
router.post(
  "/",
  isAuthenticated,
  upload.single("image_highlight"),
  [body("highlight_link").notEmpty(), body("alt_text").notEmpty()],
  newsController.createNews
);

// PUT /api/news/:id - Update berita (dengan auth dan upload)
router.put(
  "/:id",
  isAuthenticated,
  upload.single("image_highlight"),
  newsController.updateNews
);

// DELETE /api/news/:id - Hapus berita (dengan auth)
router.delete("/:id", isAuthenticated, newsController.deleteNews);

module.exports = router;
