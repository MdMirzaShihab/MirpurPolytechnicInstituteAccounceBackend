const Transaction = require('../models/Transaction');
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

  // Calculate total debit and credit amounts
  const totals = await Transaction.aggregate([
    { $match: filter }, // Apply the same filters
    {
      $group: {
        _id: "$type",
        totalAmount: { $sum: "$amount" },
      },
    },
  ]);

  // Format totals as an object with debit and credit
  const totalSummary = totals.reduce(
    (acc, curr) => {
      acc[curr._id] = curr.totalAmount;
      return acc;
    },
    { debit: 0, credit: 0 } // Default to 0 if no transactions exist for a type
  );

  // Send the response
  res.json({
    transactions,
    totalDebit: totalSummary.debit,
    totalCredit: totalSummary.credit,
  });
});

module.exports = {
  getReport,
};
