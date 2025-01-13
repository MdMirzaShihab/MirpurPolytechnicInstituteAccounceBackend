const express = require('express');
const {
  getDebitsForToday,
  getCreditsForToday,
  editDebitForToday,
  editCreditForToday,
  deleteDebitForToday,
  deleteCreditForToday,
} = require('../controllers/todayTransactionController');

const router = express.Router();


// Edit and Delete routes for debits
router.get('/debits/today', getDebitsForToday); // Get debits
router.put('/debits/today/:id', editDebitForToday); // Edit debit
router.delete('/debits/today/:id', deleteDebitForToday); // Delete debit

// Edit and Delete routes for credits
router.get('/credits/today', getCreditsForToday); // Get credits
router.put('/credits/today/:id', editCreditForToday); // Edit credit
router.delete('/credits/today/:id', deleteCreditForToday); // Delete credit

module.exports = router;
