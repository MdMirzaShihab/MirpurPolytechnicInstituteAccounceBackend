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

// @desc Update a payment method
// @route PUT /api/payment-methods/:id
// @access Public
const updatePaymentMethod = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const paymentMethod = await PaymentMethod.findById(id);

  if (!paymentMethod) {
    res.status(404);
    throw new Error('Payment method not found');
  }

  if (!name) {
    res.status(400);
    throw new Error('Please provide a name.');
  }

  paymentMethod.name = name;
  const updatedPaymentMethod = await paymentMethod.save();
  res.json(updatedPaymentMethod);
});

// @desc Delete a payment method
// @route DELETE /api/payment-methods/:id
// @access Public
const deletePaymentMethod = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const paymentMethod = await PaymentMethod.findById(id);

  if (!paymentMethod) {
    res.status(404);
    throw new Error('Payment method not found');
  }

  await paymentMethod.remove();
  res.json({ message: 'Payment method deleted successfully' });
});

module.exports = {
  createPaymentMethod,
  getPaymentMethods,
  updatePaymentMethod,
  deletePaymentMethod,
};
