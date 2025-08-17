// =============================================================================
// MESSAGE CONTROLLER - Controller untuk mengelola live chat/pesan real-time
// =============================================================================

// Mengimpor model yang dibutuhkan untuk operasi pesan
const { Message, User, Op } = require("../models");

// =============================================================================
// GET MESSAGES - Mengambil riwayat chat antara user dan admin
// =============================================================================
exports.getMessages = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const user_role = req.user.role;
    const { with_user } = req.query; // Optional: specific user untuk admin

    let whereClause = {};

    if (user_role === "admin") {
      // Admin bisa melihat chat dengan customer tertentu atau semua chat
      if (with_user) {
        whereClause = {
          [Op.or]: [
            {
              sender_id: user_id,
              recipient_id: parseInt(with_user),
            },
            {
              sender_id: parseInt(with_user),
              recipient_id: user_id,
            },
            {
              sender_id: parseInt(with_user),
              recipient_id: null,
            },
          ],
        };
      } else {
        // Semua pesan ke admin atau dari admin
        whereClause = {
          [Op.or]: [
            { recipient_id: user_id },
            { sender_id: user_id },
            {
              recipient_id: null,
              sender_type: "customer",
            },
          ],
        };
      }
    } else {
      // Customer hanya melihat chat dengan admin
      whereClause = {
        [Op.or]: [
          { sender_id: user_id },
          { recipient_id: user_id },
          {
            sender_id: user_id,
            recipient_id: null,
          },
        ],
      };
    }

    const messages = await Message.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: "Sender",
          attributes: ["user_id", "full_name", "role"],
        },
        {
          model: User,
          as: "Recipient",
          attributes: ["user_id", "full_name", "role"],
          required: false,
        },
      ],
      order: [["created_at", "ASC"]],
    });

    res.json(messages);
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ message: err.message });
  }
};

// =============================================================================
// GET CHAT USERS - Admin mendapat daftar customer yang pernah chat
// =============================================================================
exports.getChatUsers = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const user_role = req.user.role;

    if (user_role !== "admin") {
      return res.status(403).json({ message: "Only admin can access this" });
    }

    // Get all messages from customers to avoid GROUP BY issues
    const customerMessages = await Message.findAll({
      where: {
        sender_type: "customer",
      },
      include: [
        {
          model: User,
          as: "Sender",
          attributes: ["user_id", "full_name", "email"],
          where: { role: "customer" },
        },
      ],
      order: [["created_at", "DESC"]],
    });

    // Process unique customers manually
    const uniqueUsers = [];
    const seenUserIds = new Set();

    for (const message of customerMessages) {
      if (!seenUserIds.has(message.sender_id)) {
        seenUserIds.add(message.sender_id);

        // Get latest message for this user
        const latestMessage = await Message.findOne({
          where: {
            [Op.or]: [
              { sender_id: message.sender_id },
              { recipient_id: message.sender_id },
            ],
          },
          order: [["created_at", "DESC"]],
        });

        // Get unread message count from this user
        const unreadCount = await Message.count({
          where: {
            sender_id: message.sender_id,
            recipient_id: user_id,
            is_read: false,
          },
        });

        uniqueUsers.push({
          user: message.Sender,
          latestMessage: latestMessage,
          unreadCount: unreadCount,
        });
      }
    }

    // Sort by latest message date
    uniqueUsers.sort((a, b) => {
      if (!a.latestMessage || !b.latestMessage) return 0;
      return (
        new Date(b.latestMessage.created_at) -
        new Date(a.latestMessage.created_at)
      );
    });

    res.json(uniqueUsers);
  } catch (err) {
    console.error("Error fetching chat users:", err);
    res.status(500).json({ message: err.message });
  }
};

// =============================================================================
// SEND MESSAGE - Mengirim pesan (via HTTP untuk fallback)
// =============================================================================
exports.sendMessage = async (req, res) => {
  try {
    const sender_id = req.user.user_id;
    const sender_role = req.user.role;
    const { recipient_id, message } = req.body;

    // Validasi
    if (!message || message.trim().length === 0) {
      return res.status(400).json({ message: "Message cannot be empty" });
    }

    // Buat pesan baru
    const newMessage = await Message.create({
      sender_id,
      recipient_id: recipient_id || null,
      message: message.trim(),
      sender_type: sender_role,
      is_read: false,
    });

    // Include sender info dalam response
    const messageWithSender = await Message.findByPk(newMessage.message_id, {
      include: [
        {
          model: User,
          as: "Sender",
          attributes: ["user_id", "full_name", "role"],
        },
      ],
    });

    res.status(201).json({
      message: "Message sent successfully",
      data: messageWithSender,
    });
  } catch (err) {
    console.error("Error sending message:", err);
    res.status(500).json({ message: err.message });
  }
};

// =============================================================================
// MARK MESSAGES AS READ - Menandai pesan sebagai dibaca
// =============================================================================
exports.markAsRead = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const { message_ids } = req.body;

    if (!message_ids || !Array.isArray(message_ids)) {
      return res.status(400).json({ message: "Invalid message_ids" });
    }

    // Update status baca hanya untuk pesan yang diterima user ini
    await Message.update(
      { is_read: true },
      {
        where: {
          message_id: message_ids,
          [Op.or]: [
            { recipient_id: user_id },
            {
              recipient_id: null,
              sender_type: { [Op.ne]: req.user.role },
            },
          ],
        },
      }
    );

    res.json({ message: "Messages marked as read" });
  } catch (err) {
    console.error("Error marking messages as read:", err);
    res.status(500).json({ message: err.message });
  }
};

// =============================================================================
// END CHAT SESSION - Admin mengakhiri dan menghapus riwayat chat
// =============================================================================
exports.endChatSession = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const user_role = req.user.role;
    const { customer_id } = req.body;

    // Validasi: hanya admin yang bisa mengakhiri sesi
    if (user_role !== "admin") {
      return res
        .status(403)
        .json({ message: "Only admin can end chat sessions" });
    }

    // Validasi: customer_id harus ada
    if (!customer_id) {
      return res.status(400).json({ message: "Customer ID is required" });
    }

    // Hapus semua pesan antara admin dan customer ini
    const deletedCount = await Message.destroy({
      where: {
        [Op.or]: [
          {
            sender_id: user_id,
            recipient_id: parseInt(customer_id),
          },
          {
            sender_id: parseInt(customer_id),
            recipient_id: user_id,
          },
          {
            sender_id: parseInt(customer_id),
            recipient_id: null,
            sender_type: "customer",
          },
        ],
      },
    });

    // Cek apakah customer masih ada
    const customer = await User.findByPk(customer_id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json({
      message: "Chat session ended successfully",
      deletedMessages: deletedCount,
      customer: {
        user_id: customer.user_id,
        full_name: customer.full_name,
        email: customer.email,
      },
    });
  } catch (err) {
    console.error("Error ending chat session:", err);
    res.status(500).json({ message: err.message });
  }
};
