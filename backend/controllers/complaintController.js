const { Complaint, User, Order } = require("../models");

exports.getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.findAll({ include: [User, Order] });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createComplaint = async (req, res) => {
  try {
    const { order_id, subject, description } = req.body;
    const user_id = req.user.user_id;
    const complaint = await Complaint.create({
      user_id,
      order_id,
      subject,
      description,
      complaint_status: "open",
    });
    res.status(201).json(complaint);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

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
