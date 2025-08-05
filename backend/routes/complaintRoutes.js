const express = require("express");
const router = express.Router();
const complaintController = require("../controllers/complaintController");
const { body } = require("express-validator");
const { isAuthenticated, isAdmin } = require("../middlewares/auth");

router.get("/", isAdmin, complaintController.getAllComplaints);
router.post(
  "/",
  isAuthenticated,
  [body("subject").notEmpty(), body("description").notEmpty()],
  complaintController.createComplaint
);
router.put(
  "/:id/status",
  isAdmin,
  [
    body("complaint_status").isIn([
      "open",
      "in_progress",
      "resolved",
      "closed",
    ]),
  ],
  complaintController.updateComplaintStatus
);

module.exports = router;
