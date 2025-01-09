const PaymentMethod = require('../models/PaymentMethod');
const asyncHandler = require('express-async-handler');

// @desc Create a new payment method
// @route POST /api/payment-methods
// @access Public
const createPaymentMethod = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name) {
    res.status(400);
    throw new Error('Please provide a name.');
  }

  const paymentMethod = await PaymentMethod.create({ name });
  res.status(201).json(paymentMethod);
});

// @desc Get all payment methods
// @route GET /api/payment-methods
// @access Public
const getPaymentMethods = asyncHandler(async (req, res) => {
  const paymentMethods = await PaymentMethod.find();
  res.json(paymentMethods);
});

module.exports = {
  createPaymentMethod,
  getPaymentMethods,
};