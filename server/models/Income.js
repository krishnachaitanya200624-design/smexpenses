const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: [true, 'Please enter an income amount'],
      min: [0.01, 'Amount must be greater than zero'],
    },
    source: {
      type: String,
      required: [true, 'Please select an income source'],
      enum: ['Salary', 'Freelance', 'Business', 'Scholarship', 'Other'],
      default: 'Salary',
      index: true,
    },
    date: {
      type: Date,
      default: Date.now,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Please enter an income description'],
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Income', incomeSchema);
