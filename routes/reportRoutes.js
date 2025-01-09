const express = require('express');
const { getReport } = require('../controllers/reportController');

const router = express.Router();

// Routes
router.get('/', getReport);

module.exports = router;
