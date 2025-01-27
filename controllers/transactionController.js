const Transaction = require("../models/Transaction");
const asyncHandler = require("express-async-handler");
const { sanitizeInput } = require("../utils/sanitizeInput");

// @desc Create a new transaction
// @route POST /api/transactions
// @access Public
const createTransaction = asyncHandler(async (req, res) => {
  const { type, category, amount, paymentMethod, remarks, date } =
    sanitizeInput(req.body);

  if (!type || !category || !amount || !paymentMethod) {
    res.status(400);
    throw new Error("Please provide all required fields.");
  }

  const transaction = await Transaction.create({
    type,
    category,
    amount,
    paymentMethod,
    remarks,
    date,
  });

  res.status(201).json(transaction);
});

// @desc Get all transactions
// @route GET /api/transactions
// @access Public
const getTransactions = asyncHandler(async (req, res) => {
  const transactions = await Transaction.find()
    .populate("category")
    .populate("paymentMethod");
  res.json(transactions);
});

// @desc Edit a transaction
// @route PUT /api/transactions/:id
// @access Public
const editTransaction = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { type, category, amount, paymentMethod, remarks, date } =
    sanitizeInput(req.body);

  const transaction = await Transaction.findById(id);

  if (!transaction) {
    res.status(404);
    throw new Error("Transaction not found");
  }

  transaction.type = type || transaction.type;
  transaction.category = category || transaction.category;
  transaction.amount = amount || transaction.amount;
  transaction.paymentMethod = paymentMethod || transaction.paymentMethod;
  transaction.remarks = remarks || transaction.remarks;
  transaction.date = date || transaction.date;

  const updatedTransaction = await transaction.save();
  res.json(updatedTransaction);
});

// @desc Delete a transaction
// @route DELETE /api/transactions/:id
// @access Public
const deleteTransaction = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const transaction = await Transaction.findByIdAndDelete(id);

  if (!transaction) {
    res.status(404);
    throw new Error("Transaction not found");
  }
  res.json({ message: "Transaction deleted successfully" });
});

module.exports = {
  createTransaction,
  getTransactions,
  editTransaction,
  deleteTransaction,
};
