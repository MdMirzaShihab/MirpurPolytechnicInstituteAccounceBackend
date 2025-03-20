const express = require('express');
const { seedOpeningBalance } = require('../controllers/seedController');

const router = express.Router();

router.post('/seed-opening-balance', seedOpeningBalance);

module.exports = router;
