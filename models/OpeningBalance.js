const mongoose = require('mongoose');

const openingBalanceSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('OpeningBalance', openingBalanceSchema);
