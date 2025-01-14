const Category = require('../models/Category');
const Transaction = require('../models/Transaction');
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

  // Check if a category with the same name and type exists (case-insensitive)
  const existingCategory = await Category.findOne({
    type,
    name: { $regex: new RegExp(`^${name}$`, 'i') }, // Case-insensitive check
  });

  if (existingCategory) {
    res.status(400);
    throw new Error(`Category with name "${name}" already exists for type "${type}".`);
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

// @desc Update a category
// @route PUT /api/categories/:id
// @access Public
const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { type, name } = req.body;

  if (!type || !name) {
    res.status(400);
    throw new Error('Please provide all required fields.');
  }

  // Check if a category with the same name and type exists (case-insensitive)
  const existingCategory = await Category.findOne({
    _id: { $ne: id }, // Exclude the current category being updated
    type,
    name: { $regex: new RegExp(`^${name}$`, 'i') }, // Case-insensitive check
  });

  if (existingCategory) {
    res.status(400);
    throw new Error(`Category with name "${name}" already exists for type "${type}".`);
  }

  const category = await Category.findByIdAndUpdate(
    id,
    { type, name },
    { new: true } // Return the updated document
  );

  if (!category) {
    res.status(404);
    throw new Error('Category not found.');
  }

  res.json(category);
});

// @desc Delete a category
// @route DELETE /api/categories/:id
// @access Public
const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check if the category is being used in any transaction
  const linkedTransactions = await Transaction.find({ category: id });

  if (linkedTransactions.length > 0) {
    res.status(400);
    throw new Error(
      'This category is associated with existing transactions and cannot be deleted.'
    );
  }

  const category = await Category.findByIdAndDelete(id);

  if (!category) {
    res.status(404);
    throw new Error('Category not found.');
  }

  res.json({ message: 'Category deleted successfully.' });
});

module.exports = {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
};
