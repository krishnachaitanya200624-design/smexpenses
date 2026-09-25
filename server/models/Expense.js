const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: [true, 'Please enter an expense amount'],
      min: [0.01, 'Amount must be greater than zero'],
    },
    description: {
      type: String,
      required: [true, 'Please enter a description'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: [
        'Food',
        'Shopping',
        'Transport',
        'Bills',
        'Entertainment',
        'Education',
        'Health',
        'Other',
      ],
      default: 'Food',
      index: true,
    },
    date: {
      type: Date,
      default: Date.now,
      index: true,
    },
    paymentMethod: {
      type: String,
      required: [true, 'Please select a payment method'],
      enum: ['Cash', 'UPI', 'Debit Card', 'Credit Card', 'Bank Transfer'],
      default: 'UPI',
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Expense', expenseSchema);
