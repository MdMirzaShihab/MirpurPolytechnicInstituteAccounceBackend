const Transaction = require('../models/Transaction');
const asyncHandler = require('express-async-handler');

// @desc Get report by filtering
// @route GET /api/reports
// @access Public
const getReport = asyncHandler(async (req, res) => {
  const { startDate, endDate, category, paymentMethod, search, type } = req.query;

  const filter = {};

  if (startDate || endDate) {
    filter.date = {
      ...(startDate && { $gte: new Date(startDate) }),
      ...(endDate && { $lte: new Date(endDate) }),
    };
  }

  if (category) {
    filter.category = category;
  }

  if (paymentMethod) {
    filter.paymentMethod = paymentMethod;
  }

  if (type) {
    filter.type = type;
  }

  if (search) {
    filter.remarks = { $regex: search, $options: "i" };
  }

  const transactions = await Transaction.find(filter)
    .populate("category")
    .populate("paymentMethod");

  res.json(transactions);
});

module.exports = {
  getReport,
};
