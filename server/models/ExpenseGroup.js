const mongoose = require('mongoose');

const splitExpenseSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: [0.01, 'Amount must be positive'],
    },
    paidBy: {
      type: String,
      required: true,
      trim: true,
    },
    splitAmong: [
      {
        type: String,
        trim: true,
      },
    ],
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const settlementSchema = new mongoose.Schema(
  {
    from: { type: String, required: true },
    to: { type: String, required: true },
    amount: { type: Number, required: true },
    settled: { type: Boolean, default: false },
    settledAt: { type: Date },
  },
  { _id: true }
);

const expenseGroupSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Please provide a group name'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    members: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],
    expenses: [splitExpenseSchema],
    settlements: [settlementSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('ExpenseGroup', expenseGroupSchema);
