const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");
const { body } = require("express-validator");
const { isAuthenticated } = require("../middlewares/auth");

// GET /api/messages - Ambil riwayat chat
router.get("/", isAuthenticated, messageController.getMessages);

// GET /api/messages/chat-users - Admin mendapat daftar customer yang pernah chat
router.get("/chat-users", isAuthenticated, messageController.getChatUsers);

// POST /api/messages - Kirim pesan (HTTP fallback)
router.post(
  "/",
  isAuthenticated,
  [
    body("message").notEmpty().withMessage("Message cannot be empty"),
    body("recipient_id")
      .optional()
      .isNumeric()
      .withMessage("Invalid recipient ID"),
  ],
  messageController.sendMessage
);

// PUT /api/messages/mark-read - Tandai pesan sebagai dibaca
router.put(
  "/mark-read",
  isAuthenticated,
  [body("message_ids").isArray().withMessage("message_ids must be an array")],
  messageController.markAsRead
);

module.exports = router;
