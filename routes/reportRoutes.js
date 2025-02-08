const express = require('express');
const { getReport, getTotalBalance } = require('../controllers/reportController');

const router = express.Router();

// Routes
router.get('/', getReport);
router.get('/total-balance', getTotalBalance); 

module.exports = router;
