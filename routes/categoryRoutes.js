const express = require('express');
const { createCategory, getCategories } = require('../controllers/categoryController');

const router = express.Router();

// Routes
router.post('/', createCategory);
router.get('/', getCategories);

module.exports = router;
