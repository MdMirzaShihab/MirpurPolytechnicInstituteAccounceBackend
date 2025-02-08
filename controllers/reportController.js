const Transaction = require('../models/Transaction');
const OpeningBalance = require("../models/OpeningBalance");
const asyncHandler = require('express-async-handler');

// @desc Get report by filtering
// @route GET /api/reports
// @access Public
const getReport = asyncHandler(async (req, res) => {
  const { startDate, endDate, category, paymentMethod, search, type } = req.query;

  const filter = {};

  // Apply date filter
  if (startDate || endDate) {
    filter.date = {
      ...(startDate && { $gte: new Date(startDate) }),
      ...(endDate && { $lte: new Date(endDate) }),
    };
  }

  // Apply category filter
  if (category) {
    filter.category = category;
  }

  // Apply payment method filter
  if (paymentMethod) {
    filter.paymentMethod = paymentMethod;
  }

  // Apply transaction type filter
  if (type) {
    filter.type = type;
  }

  // Apply search filter
  if (search) {
    filter.remarks = { $regex: search, $options: "i" };
  }

  // Fetch filtered transactions
  const transactions = await Transaction.find(filter)
    .populate("category")
    .populate("paymentMethod");

  // Calculate total debit and credit amounts based on filtered transactions
  const totalSummary = transactions.reduce(
    (acc, transaction) => {
      if (transaction.type === "debit") {
        acc.debit += transaction.amount;
      } else if (transaction.type === "credit") {
        acc.credit += transaction.amount;
      }
      return acc;
    },
    { debit: 0, credit: 0 } // Initialize totals
  );

  // Calculate the total balance
  totalSummary.total = totalSummary.credit - totalSummary.debit;

  // Send the response
  res.json({
    transactions,
    totalDebit: totalSummary.debit,
    totalCredit: totalSummary.credit,
    totalBalance: totalSummary.total,
  });
});

// @desc Get total balance including opening balance
// @route GET /api/reports/total-balance
// @access Public
const getTotalBalance = asyncHandler(async (req, res) => {
  const { endDate } = req.query;
  
  const historicalFilter = {};
  if (endDate) {
    historicalFilter.date = { $lte: new Date(endDate) };
  }

  // Fetch all transactions from the beginning till the selected 'to' date
  const allTransactions = await Transaction.find(historicalFilter);

  // Compute total debit and credit from all historical transactions
  const historicalSummary = allTransactions.reduce(
    (acc, transaction) => {
      if (transaction.type === "debit") {
        acc.debit += transaction.amount;
      } else if (transaction.type === "credit") {
        acc.credit += transaction.amount;
      }
      return acc;
    },
    { debit: 0, credit: 0 } // Initialize totals
  );

  // Calculate the total balance from the beginning of time
  const totalBalanceFromStart = historicalSummary.credit - historicalSummary.debit;

  // Fetch opening balance
  const openingBalance = await OpeningBalance.findOne({});

  // Compute final total balance including the opening balance
  const totalBalanceIncludingOpening = openingBalance
    ? totalBalanceFromStart + openingBalance.amount
    : totalBalanceFromStart;

  res.json({
    totalBalanceIncludingOpening,
  });
});

module.exports = {
  getReport,
  getTotalBalance,
};
