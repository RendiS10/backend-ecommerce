const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");
const { body } = require("express-validator");
const { isAuthenticated } = require("../middlewares/auth");

router.get("/", isAuthenticated, messageController.getMessages);
router.post(
  "/",
  isAuthenticated,
  [body("receiver_id").isNumeric(), body("message_text").notEmpty()],
  messageController.sendMessage
);
router.put("/:message_id/read", isAuthenticated, messageController.markAsRead);

module.exports = router;
