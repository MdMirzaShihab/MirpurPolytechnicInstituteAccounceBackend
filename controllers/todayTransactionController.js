const mongoose = require('mongoose');
const Category = require('../models/Category');
const PaymentMethod = require('../models/PaymentMethod');
const Transaction = require('../models/Transaction');

// Fetch all debits for the current date
const getDebitsForToday = async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const debits = await Transaction.find({
      type: 'debit',
      date: { $gte: startOfDay, $lte: endOfDay },
    }).populate('category paymentMethod');

    // Calculate total sum
    const totalDebit = await Transaction.aggregate([
      {
        $match: {
          type: 'debit',
          date: { $gte: startOfDay, $lte: endOfDay },
        },
      },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    res.status(200).json({
      totalDebit: totalDebit[0]?.total || 0,
      transactions: debits,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching debits for today', error });
  }
};

// Fetch all credits for the current date
const getCreditsForToday = async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const credits = await Transaction.find({
      type: 'credit',
      date: { $gte: startOfDay, $lte: endOfDay },
    }).populate('category paymentMethod');

    // Calculate total sum
    const totalCredit = await Transaction.aggregate([
      {
        $match: {
          type: 'credit',
          date: { $gte: startOfDay, $lte: endOfDay },
        },
      },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    res.status(200).json({
      totalCredit: totalCredit[0]?.total || 0,
      transactions: credits,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching credits for today', error });
  }
};

// Edit a debit transaction for today
const editDebitForToday = async (req, res) => {
  try {
    const { id } = req.params;
    const { category, amount, paymentMethod, remarks, date } = req.body;

    // Validate input data
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid transaction ID' });
    }

    if (category && !mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({ message: 'Invalid category ID' });
    }

    if (paymentMethod && !mongoose.Types.ObjectId.isValid(paymentMethod)) {
      return res.status(400).json({ message: 'Invalid payment method ID' });
    }

    // Check if the category exists
    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(404).json({ message: 'Category not found' });
      }
    }

    // Check if the payment method exists
    if (paymentMethod) {
      const paymentMethodExists = await PaymentMethod.findById(paymentMethod);
      if (!paymentMethodExists) {
        return res.status(404).json({ message: 'Payment method not found' });
      }
    }

    // Prepare the updated data object
    const updatedData = {};
    if (category) updatedData.category = category;
    if (amount) updatedData.amount = amount;
    if (paymentMethod) updatedData.paymentMethod = paymentMethod;
    if (remarks) updatedData.remarks = remarks;
    if (date) updatedData.date = date;

    // Find and update the transaction
    const updatedTransaction = await Transaction.findOneAndUpdate(
      { _id: id, type: 'debit' },
      updatedData,
      { new: true, runValidators: true } // Run validators and return the updated document
    );

    if (!updatedTransaction) {
      return res.status(404).json({ message: 'Debit transaction not found' });
    }

    res.status(200).json({
      message: 'Debit transaction updated successfully',
      transaction: updatedTransaction,
    });
  } catch (error) {
    console.error('Error updating debit transaction:', error);
    res.status(500).json({ message: 'Error updating debit transaction', error: error.message });
  }
};

// Edit a credit transaction for today
const editCreditForToday = async (req, res) => {
  try {
    const { id } = req.params;
    const { category, amount, paymentMethod, remarks, date } = req.body;

    // Validate input data
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid transaction ID' });
    }

    if (category && !mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({ message: 'Invalid category ID' });
    }

    if (paymentMethod && !mongoose.Types.ObjectId.isValid(paymentMethod)) {
      return res.status(400).json({ message: 'Invalid payment method ID' });
    }

    // Check if the category exists
    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(404).json({ message: 'Category not found' });
      }
    }

    // Check if the payment method exists
    if (paymentMethod) {
      const paymentMethodExists = await PaymentMethod.findById(paymentMethod);
      if (!paymentMethodExists) {
        return res.status(404).json({ message: 'Payment method not found' });
      }
    }

    // Prepare the updated data object
    const updatedData = {};
    if (category) updatedData.category = category;
    if (amount) updatedData.amount = amount;
    if (paymentMethod) updatedData.paymentMethod = paymentMethod;
    if (remarks) updatedData.remarks = remarks;
    if (date) updatedData.date = date;

    // Find and update the transaction
    const updatedTransaction = await Transaction.findOneAndUpdate(
      { _id: id, type: 'credit' },
      updatedData,
      { new: true, runValidators: true } // Run validators and return the updated document
    );

    if (!updatedTransaction) {
      return res.status(404).json({ message: 'Credit transaction not found' });
    }

    res.status(200).json({
      message: 'Credit transaction updated successfully',
      transaction: updatedTransaction,
    });
  } catch (error) {
    console.error('Error updating credit transaction:', error);
    res.status(500).json({ message: 'Error updating credit transaction', error: error.message });
  }
};

// Delete a debit transaction for today
const deleteDebitForToday = async (req, res) => {
  try {
    const { id } = req.params;

    const debit = await Transaction.findOneAndDelete({
      _id: id,
      type: 'debit',
    });

    if (!debit) {
      return res.status(404).json({ message: 'Debit transaction not found' });
    }

    res.status(200).json({ message: 'Debit transaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting debit transaction', error });
  }
};

// Delete a credit transaction for today
const deleteCreditForToday = async (req, res) => {
  try {
    const { id } = req.params;

    const credit = await Transaction.findOneAndDelete({
      _id: id,
      type: 'credit',
    });

    if (!credit) {
      return res.status(404).json({ message: 'Credit transaction not found' });
    }

    res.status(200).json({ message: 'Credit transaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting credit transaction', error });
  }
};

module.exports = {
  getDebitsForToday,
  getCreditsForToday,
  editDebitForToday,
  editCreditForToday,
  deleteDebitForToday,
  deleteCreditForToday,
};
