// =============================================================================
// COMPLAINT CONTROLLER - Controller untuk mengelola keluhan customer
// =============================================================================

// Mengimpor model yang dibutuhkan untuk operasi keluhan
const { Complaint, User, Order } = require("../models");

// =============================================================================
// GET ALL COMPLAINTS - Mengambil semua keluhan (Admin only)
// =============================================================================
exports.getAllComplaints = async (req, res) => {
  try {
    // Ambil semua keluhan dengan info user dan order terkait (untuk admin dashboard)
    const complaints = await Complaint.findAll({ include: [User, Order] });

    // Kirim response dengan daftar keluhan
    res.json(complaints);
  } catch (err) {
    // Handle error database
    res.status(500).json({ message: err.message });
  }
};

// =============================================================================
// CREATE COMPLAINT - Membuat keluhan baru (Customer only)
// =============================================================================
exports.createComplaint = async (req, res) => {
  try {
    // Ambil data keluhan dari request body
    const { order_id, subject, description } = req.body;

    // Ambil user_id dari token JWT (customer yang membuat keluhan)
    const user_id = req.user.user_id;

    // Buat keluhan baru dengan status "open"
    const complaint = await Complaint.create({
      user_id, // ID customer yang komplain
      order_id, // ID pesanan yang bermasalah (optional)
      subject, // Subjek keluhan
      description, // Deskripsi detail masalah
      complaint_status: "open", // Status awal: open (belum ditangani)
    });

    // Kirim response dengan keluhan yang baru dibuat
    res.status(201).json(complaint);
  } catch (err) {
    // Handle error (validation error, foreign key constraint, dll)
    res.status(500).json({ message: err.message });
  }
};

// =============================================================================
// UPDATE COMPLAINT STATUS - Mengupdate status keluhan (Admin only)
// =============================================================================
exports.updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { complaint_status } = req.body;
    const complaint = await Complaint.findByPk(id);
    if (!complaint)
      return res.status(404).json({ message: "Complaint not found" });
    complaint.complaint_status = complaint_status;
    await complaint.save();
    res.json(complaint);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
