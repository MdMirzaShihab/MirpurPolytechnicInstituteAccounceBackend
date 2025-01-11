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



console.log(totalSummary.total, totalSummary.debit, totalSummary.credit);
  // Send the response
  res.json({
    transactions,
    totalDebit: totalSummary.debit,
    totalCredit: totalSummary.credit,
    totalBalance: totalSummary.total,
  });
});

module.exports = {
  getReport,
};
