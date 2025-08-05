const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController");
const { body } = require("express-validator");
const { isAuthenticated, isAdmin } = require("../middlewares/auth");

router.get(
  "/:order_id",
  isAuthenticated,
  transactionController.getOrderTransactions
);
router.post(
  "/",
  isAuthenticated,
  [
    body("order_id").isNumeric(),
    body("payment_gateway_ref").notEmpty(),
    body("amount").isNumeric(),
    body("currency").notEmpty(),
    body("transaction_status").isIn([
      "pending",
      "success",
      "failed",
      "refunded",
    ]),
  ],
  transactionController.createTransaction
);

module.exports = router;
