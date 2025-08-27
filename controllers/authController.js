// =============================================================================
// AUTH CONTROLLER - Controller untuk menangani autentikasi user
// =============================================================================

// Mengimpor bcryptjs untuk enkripsi dan verifikasi password
const bcrypt = require("bcryptjs");

// Mengimpor jsonwebtoken untuk membuat dan memverifikasi JWT token
const jwt = require("jsonwebtoken");

// Mengimpor model User untuk akses database user
const { User } = require("../models");

// Memuat environment variables (JWT_SECRET, dll)
require("dotenv").config();
// =============================================================================
// REGISTER FUNCTION - Fungsi untuk mendaftarkan user baru
// =============================================================================
exports.register = async (req, res) => {
  try {
    // 1. Ambil data dari form pendaftaran (destructuring dari request body)
    const { full_name, email, password, role } = req.body;

    // 2. Cek apakah email sudah pernah terdaftar sebelumnya
    const existing = await User.findOne({ where: { email } });
    if (existing)
      return res.status(400).json({ message: "Email already registered" });

    // 3. Enkripsi password menggunakan bcrypt untuk keamanan (salt rounds: 10)
    const password_hash = await bcrypt.hash(password, 10);

    // 4. Simpan user baru ke database dengan password yang sudah dienkripsi
    const user = await User.create({ full_name, email, password_hash, role });

    // 5. Kirim response sukses dengan data user (TANPA password untuk keamanan!)
    res.status(201).json({
      message: "User registered",
      user: { user_id: user.user_id, full_name, email, role },
    });
  } catch (err) {
    // Handle error jika terjadi kesalahan (database error, validation error, dll)
    res.status(500).json({ message: err.message });
  }
};
// =============================================================================
// LOGIN FUNCTION - Fungsi untuk masuk/login user yang sudah terdaftar
// =============================================================================
exports.login = async (req, res) => {
  try {
    // 1. Ambil email & password dari form login (destructuring dari request body)
    const { email, password } = req.body;

    // 2. Cari user di database berdasarkan email yang diinput
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // 3. Cocokkan password yang diinput dengan password hash di database
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    // 4. Buat JWT token untuk autentikasi session user
    const token = jwt.sign(
      { user_id: user.user_id, role: user.role }, // Payload: data user yang disimpan dalam token
      process.env.JWT_SECRET, // Secret key dari environment variable
      { expiresIn: "1d" } // Token berlaku selama 1 hari
    );

    // 5. Kirim response berhasil dengan token dan data user (TANPA password!)
    res.json({
      token,
      user: {
        user_id: user.user_id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    // Handle error jika terjadi kesalahan (database error, network error, dll)
    res.status(500).json({ message: err.message });
  }
};

// =============================================================================
// GET USER PROFILE - Mengambil data profile user yang sedang login
// =============================================================================
exports.getUserProfile = async (req, res) => {
  try {
    // Ambil user_id dari token JWT yang sudah didecode di middleware auth
    const user_id = req.user.user_id;

    // Cari user di database berdasarkan user_id
    const user = await User.findByPk(user_id, {
      attributes: { exclude: ["password_hash"] }, // Jangan kirim password hash
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Kirim data user profile
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =============================================================================
// UPDATE USER PROFILE - Memperbarui data profile user
// =============================================================================
exports.updateUserProfile = async (req, res) => {
  try {
    // Ambil user_id dari token JWT
    const user_id = req.user.user_id;

    // Ambil data yang akan diupdate dari request body
    const { full_name, phone_number, address, city, postal_code } = req.body;

    // Cari user di database
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update data user (hanya field yang diizinkan)
    await user.update({
      full_name: full_name || user.full_name,
      phone_number: phone_number || user.phone_number,
      address: address || user.address,
      city: city || user.city,
      postal_code: postal_code || user.postal_code,
    });

    // Kirim response dengan data user yang sudah diupdate (tanpa password)
    const updatedUser = await User.findByPk(user_id, {
      attributes: { exclude: ["password_hash"] },
    });

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
