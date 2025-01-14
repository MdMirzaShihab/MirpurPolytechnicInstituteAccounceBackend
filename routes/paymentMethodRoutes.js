const express = require('express');
const {
  createPaymentMethod,
  getPaymentMethods,
  updatePaymentMethod,
  deletePaymentMethod,
} = require('../controllers/paymentMethodController');

const router = express.Router();

// Routes
router.post('/', createPaymentMethod);
router.get('/', getPaymentMethods);
router.put('/:id', updatePaymentMethod);
router.delete('/:id', deletePaymentMethod);

module.exports = router;
