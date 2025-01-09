const Transaction = require("../models/Transaction");
const Category = require('../models/Category');

const getMonthlyAnalytics = async (req, res) => {
  try {
    const startOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    );
    const endOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      0
    );

    // Total debits and credits
    const totalDebits = await Transaction.aggregate([
      {
        $match: {
          type: "debit",
          date: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const totalCredits = await Transaction.aggregate([
      {
        $match: {
          type: "credit",
          date: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    // Total transactions
    const totalTransactions = await Transaction.countDocuments({
      date: { $gte: startOfMonth, $lte: endOfMonth },
    });

    // Totals by category for both debit and credit
    const totalsByCategory = await Transaction.aggregate([
      { $match: { date: { $gte: startOfMonth, $lte: endOfMonth } } },
      {
        $group: {
          _id: { category: "$category", type: "$type" },
          total: { $sum: "$amount" },
        },
      },
    ]);

    // Populate category names
    const populatedTotals = await Promise.all(
      totalsByCategory.map(async (item) => {
        try {
          const category = await Category.findById(item._id.category);
          return {
            category: category ? category.name : "Unknown",
            type: item._id.type,
            total: item.total,
          };
        } catch (err) {
          console.error(
            `Error finding category for ID ${item._id.category}:`,
            err
          );
          return null;
        }
      })
    );

    // Filter out null results from failed lookups
    const validTotals = populatedTotals.filter((item) => item !== null);

    // Separate totals into credit and debit categories
    const debitByCategory = validTotals.filter((item) => item.type === "debit");
    const creditByCategory = validTotals.filter(
      (item) => item.type === "credit"
    );

    res.status(200).json({
      totalDebits: totalDebits[0]?.total || 0,
      totalCredits: totalCredits[0]?.total || 0,
      totalTransactions,
      debitByCategory,
      creditByCategory,
    });
  } catch (error) {
    console.error("Error fetching monthly analytics:", error);
    res
      .status(500)
      .json({ message: "Error fetching monthly analytics", error });
  }
};

module.exports = {
  getMonthlyAnalytics,
};
