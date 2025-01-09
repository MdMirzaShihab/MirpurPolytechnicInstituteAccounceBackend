const express = require('express');
const { getMonthlyAnalytics } = require('../controllers/dashboardController');

const router = express.Router();

// Route for monthly analytics
router.get('/analytics/monthly', getMonthlyAnalytics);

module.exports = router;
