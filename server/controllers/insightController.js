const Expense = require('../models/Expense');
const Income = require('../models/Income');
const Budget = require('../models/Budget');
const SavingsGoal = require('../models/SavingsGoal');
const { generateFinancialInsights } = require('../utils/insightEngine');

// @desc   Get comprehensive AI insights for the user
// @route  GET /api/insights
const getInsights = async (req, res) => {
  try {
    const userId = req.user._id;
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    const startOfCurrentMonth = new Date(currentYear, currentMonth, 1);
    const endOfCurrentMonth = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59, 999);

    const startOfLastMonth = new Date(currentYear, currentMonth - 1, 1);
    const endOfLastMonth = new Date(currentYear, currentMonth, 0, 23, 59, 59, 999);

    const [
      currentMonthExpenses,
      lastMonthExpenses,
      currentMonthIncomeList,
      budgets,
      savingsGoals,
    ] = await Promise.all([
      Expense.find({ user: userId, date: { $gte: startOfCurrentMonth, $lte: endOfCurrentMonth } }),
      Expense.find({ user: userId, date: { $gte: startOfLastMonth, $lte: endOfLastMonth } }),
      Income.find({ user: userId, date: { $gte: startOfCurrentMonth, $lte: endOfCurrentMonth } }),
      Budget.find({ user: userId, month: currentMonth + 1, year: currentYear }),
      SavingsGoal.find({ user: userId }),
    ]);

    const currentIncomeSum = currentMonthIncomeList.reduce((sum, i) => sum + i.amount, 0);

    const insights = generateFinancialInsights({
      currentMonthExpenses,
      lastMonthExpenses,
      currentMonthIncome: currentIncomeSum,
      budgets,
      savingsGoals,
      currencySymbol: req.user.preferences?.currencySymbol || '₹',
    });

    // Group insights by type for tabbed or card display
    const grouped = {
      all: insights,
      spending: insights.filter((i) => i.type === 'Spending'),
      savings: insights.filter((i) => i.type === 'Savings'),
      budget: insights.filter((i) => i.type === 'Budget'),
      habits: insights.filter((i) => i.type === 'Habits'),
    };

    res.json({
      success: true,
      count: insights.length,
      insights,
      grouped,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getInsights };
