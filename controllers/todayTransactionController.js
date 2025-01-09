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

    res.status(200).json(debits);
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

    res.status(200).json(credits);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching credits for today', error });
  }
};

module.exports = {
    getDebitsForToday, getCreditsForToday
  };