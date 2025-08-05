const { Transaction, Order } = require("../models");

exports.getOrderTransactions = async (req, res) => {
  try {
    const { order_id } = req.params;
    const transactions = await Transaction.findAll({ where: { order_id } });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createTransaction = async (req, res) => {
  try {
    const {
      order_id,
      payment_gateway_ref,
      amount,
      currency,
      transaction_status,
    } = req.body;
    const transaction = await Transaction.create({
      order_id,
      payment_gateway_ref,
      amount,
      currency,
      transaction_status,
    });
    res.status(201).json(transaction);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
