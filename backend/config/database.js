// Konfigurasi koneksi database menggunakan Sequelize
const { Sequelize } = require("sequelize");
// Menggunakan dotenv untuk mengelola variabel lingkungan
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME, // Nama database
  process.env.DB_USER, // Username database
  process.env.DB_PASS, // Password database
  {
    host: process.env.DB_HOST, // Host database
    dialect: "mysql", // Jenis database yang digunakan
    logging: false, // Menonaktifkan log SQL queries
  }
);

module.exports = sequelize;
