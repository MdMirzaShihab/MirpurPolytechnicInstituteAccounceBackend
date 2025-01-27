const express = require('express');
const { createTransaction, getTransactions, editTransaction, deleteTransaction } = require('../controllers/transactionController');
const router = express.Router();

router.post('/', createTransaction);
router.get('/', getTransactions);
router.put('/:id', editTransaction);
router.delete('/:id', deleteTransaction);

module.exports = router;
