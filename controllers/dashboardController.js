const Transaction = require('../models/Transaction');

const getMonthlyAnalytics = async (req, res) => {
  try {
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

    const totalDebits = await Transaction.aggregate([
      {
        $match: {
          type: 'debit',
          date: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    const totalCredits = await Transaction.aggregate([
      {
        $match: {
          type: 'credit',
          date: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    const totalTransactions = await Transaction.countDocuments({
      date: { $gte: startOfMonth, $lte: endOfMonth },
    });

    res.status(200).json({
      totalDebits: totalDebits[0]?.total || 0,
      totalCredits: totalCredits[0]?.total || 0,
      totalTransactions,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching monthly analytics', error });
  }
};


module.exports = {
    getMonthlyAnalytics
  };