// =============================================================================
// UPLOAD MIDDLEWARE - Middleware untuk menghandle upload file (gambar produk)
// =============================================================================

// Mengimpor multer untuk handling multipart/form-data (file upload)
const multer = require("multer");

// Mengimpor path untuk manipulasi nama file dan extensi
const path = require("path");

// =============================================================================
// STORAGE CONFIGURATION - Konfigurasi penyimpanan file
// =============================================================================
const storage = multer.diskStorage({
  // Menentukan folder tujuan penyimpanan file
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Simpan di folder "uploads/" (pastikan folder ini ada)
  },

  // Menentukan nama file yang akan disimpan
  filename: function (req, file, cb) {
    // Generate nama file unik: timestamp + random number + extension asli
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
    // Contoh hasil: 1691234567890-123456789.jpg
  },
});

// =============================================================================
// FILE FILTER - Filter untuk membatasi jenis file yang boleh diupload
// =============================================================================
const fileFilter = (req, file, cb) => {
  // Hanya izinkan file dengan MIME type yang dimulai dengan "image/"
  if (file.mimetype.startsWith("image/")) {
    cb(null, true); // File diterima (image/jpeg, image/png, image/gif, dll)
  } else {
    cb(new Error("Only image files are allowed!"), false); // File ditolak
  }
};

// =============================================================================
// MULTER INSTANCE - Membuat instance multer dengan konfigurasi
// =============================================================================
const upload = multer({
  storage, // Menggunakan storage configuration di atas
  fileFilter, // Menggunakan file filter di atas
});

// Export multer instance untuk digunakan di routes
module.exports = upload;
