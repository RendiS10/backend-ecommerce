// =============================================================================
// MESSAGE CONTROLLER - Controller untuk mengelola live chat/pesan
// =============================================================================

// Mengimpor model yang dibutuhkan untuk operasi pesan
const { Message, User } = require("../models");

// =============================================================================
// GET MESSAGES - Mengambil semua pesan yang diterima user
// =============================================================================
exports.getMessages = async (req, res) => {
  try {
    // Ambil user_id dari token JWT (user yang sedang login)
    const user_id = req.user.user_id;

    // Ambil semua pesan yang diterima user dengan info pengirim
    const messages = await Message.findAll({
      where: { receiver_id: user_id }, // Filter pesan yang diterima user
      include: [
        {
          model: User,
          as: "Sender", // Alias untuk pengirim pesan
          attributes: ["user_id", "full_name", "role"], // Hanya ambil field tertentu
        },
      ],
      order: [["sent_at", "ASC"]], // Urutkan berdasarkan waktu kirim (lama ke baru)
    });

    // Kirim response dengan daftar pesan
    res.json(messages);
  } catch (err) {
    // Handle error database
    res.status(500).json({ message: err.message });
  }
};

// =============================================================================
// SEND MESSAGE - Mengirim pesan baru (Customer <-> Admin)
// =============================================================================
exports.sendMessage = async (req, res) => {
  try {
    // Ambil sender_id dari token JWT (user yang mengirim)
    const sender_id = req.user.user_id;

    // Ambil data pesan dari request body
    const { receiver_id, message_text } = req.body;

    // Buat pesan baru di database
    const message = await Message.create({
      sender_id, // ID pengirim pesan
      receiver_id, // ID penerima pesan
      message_text, // Isi pesan
    });
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { message_id } = req.params;
    const message = await Message.findByPk(message_id);
    if (!message) return res.status(404).json({ message: "Message not found" });
    message.is_read = true;
    await message.save();
    res.json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
