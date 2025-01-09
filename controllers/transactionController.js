const Transaction = require('../models/Transaction');
const asyncHandler = require('express-async-handler');
const { sanitizeInput } = require('../utils/sanitizeInput');

// @desc Create a new transaction
// @route POST /api/transactions
// @access Public
const createTransaction = asyncHandler(async (req, res) => {
  const { type, category, amount, paymentMethod, remarks } = sanitizeInput(req.body);

  if (!type || !category || !amount || !paymentMethod) {
    res.status(400);
    throw new Error('Please provide all required fields.');
  }

  const transaction = await Transaction.create({
    type,
    category,
    amount,
    paymentMethod,
    remarks,
  });

  res.status(201).json(transaction);
});

// @desc Get all transactions
// @route GET /api/transactions
// @access Public
const getTransactions = asyncHandler(async (req, res) => {
  const transactions = await Transaction.find().populate('category').populate('paymentMethod');
  res.json(transactions);
});

module.exports = {
  createTransaction,
  getTransactions,
};