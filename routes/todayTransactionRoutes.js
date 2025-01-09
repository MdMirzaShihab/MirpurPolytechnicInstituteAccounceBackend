const express = require('express');
const { getDebitsForToday, getCreditsForToday } = require('../controllers/todayTransactionController');

const router = express.Router();

// Routes for today's debits and credits
router.get('/debits/today', getDebitsForToday);
router.get('/credits/today', getCreditsForToday);

module.exports = router;
