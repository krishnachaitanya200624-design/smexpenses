const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    category: {
      type: String,
      required: [true, 'Please specify a category for this budget'],
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
    },
    monthlyLimit: {
      type: Number,
      required: [true, 'Please set a monthly budget limit'],
      min: [1, 'Budget limit must be at least 1'],
    },
    month: {
      type: Number,
      default: () => new Date().getMonth() + 1, // 1 to 12
    },
    year: {
      type: Number,
      default: () => new Date().getFullYear(),
    },
  },
  { timestamps: true }
);

// Prevent duplicate category budget for the same user, month, and year
budgetSchema.index({ user: 1, category: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('Budget', budgetSchema);
