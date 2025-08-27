// =============================================================================
// PRODUCT IMAGE ROUTES - Routing untuk operasi CRUD gambar produk
// =============================================================================

const express = require("express");
const router = express.Router();
const productImageController = require("../controllers/productImageController");
const upload = require("../middlewares/upload");
const { isAuthenticated, isAdmin } = require("../middlewares/auth");

// =============================================================================
// PRODUCT IMAGE ROUTES
// =============================================================================

// GET /api/product-images - Ambil semua gambar produk
router.get("/", productImageController.getAllProductImages);

// GET /api/product-images/:id - Ambil gambar produk berdasarkan ID
router.get("/:id", productImageController.getProductImageById);

// POST /api/product-images - Tambah gambar produk baru (dengan auth dan upload)
router.post(
  "/",
  isAuthenticated,
  upload.single("image"),
  productImageController.createProductImage
);

// PUT /api/product-images/:id - Update gambar produk (dengan auth dan upload)
router.put(
  "/:id",
  isAuthenticated,
  upload.single("image"),
  productImageController.updateProductImage
);

// DELETE /api/product-images/:id - Hapus gambar produk (dengan auth)
router.delete(
  "/:id",
  isAuthenticated,
  productImageController.deleteProductImage
);

module.exports = router;
