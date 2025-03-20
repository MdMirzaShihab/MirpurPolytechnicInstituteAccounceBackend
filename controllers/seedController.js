const OpeningBalance = require('../models/OpeningBalance');

exports.seedOpeningBalance = async (req, res) => {
  try {
    const defaultAmount = 11030;

    const formattedDate = new Date(2024, 10, 2);

    // Delete existing opening balance
    await OpeningBalance.deleteMany({});

    // Create new opening balance
    const openingBalance = new OpeningBalance({
      amount: defaultAmount,
      date: formattedDate,
    });

    await openingBalance.save();

    res.status(201).json({ 
      message: "Opening balance seeded successfully!", 
      data: {
        amount: openingBalance.amount,
        date: openingBalance.date.toISOString().split('T')[0],
      }
    });

  } catch (error) {
    console.error("Seeding error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
