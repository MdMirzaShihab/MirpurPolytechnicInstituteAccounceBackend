const Category = require('../models/Category');
const asyncHandler = require('express-async-handler');

// @desc Create a new category
// @route POST /api/categories
// @access Public
const createCategory = asyncHandler(async (req, res) => {
  const { type, name } = req.body;

  if (!type || !name) {
    res.status(400);
    throw new Error('Please provide all required fields.');
  }

  const category = await Category.create({ type, name });
  res.status(201).json(category);
});

// @desc Get all categories
// @route GET /api/categories
// @access Public
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find();
  res.json(categories);
});

module.exports = {
  createCategory,
  getCategories,
};