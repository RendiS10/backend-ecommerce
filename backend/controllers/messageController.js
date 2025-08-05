const { Message, User } = require("../models");

exports.getMessages = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const messages = await Message.findAll({
      where: { receiver_id: user_id },
      include: [
        {
          model: User,
          as: "Sender",
          attributes: ["user_id", "full_name", "role"],
        },
      ],
      order: [["sent_at", "ASC"]],
    });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const sender_id = req.user.user_id;
    const { receiver_id, message_text } = req.body;
    const message = await Message.create({
      sender_id,
      receiver_id,
      message_text,
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
