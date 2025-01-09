const express = require('express');
const { createPaymentMethod, getPaymentMethods } = require('../controllers/paymentMethodController');

const router = express.Router();

// Routes
router.post('/', createPaymentMethod);
router.get('/', getPaymentMethods);

module.exports = router;
