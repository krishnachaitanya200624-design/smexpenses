const Expense = require('../models/Expense');
const Income = require('../models/Income');
const Budget = require('../models/Budget');
const SavingsGoal = require('../models/SavingsGoal');
const { generateFinancialInsights } = require('../utils/insightEngine');

// @desc   Get consolidated dashboard metrics and charts data
// @route  GET /api/dashboard
const getDashboardData = async (req, res) => {
  try {
    const userId = req.user._id;
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-11

    // Current month date boundaries
    const startOfCurrentMonth = new Date(currentYear, currentMonth, 1);
    const endOfCurrentMonth = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59, 999);

    // Last month date boundaries (for trends)
    const startOfLastMonth = new Date(currentYear, currentMonth - 1, 1);
    const endOfLastMonth = new Date(currentYear, currentMonth, 0, 23, 59, 59, 999);

    // 1. Fetch all data in parallel for speed
    const [
      allIncome,
      allExpenses,
      currentMonthExpenses,
      lastMonthExpenses,
      currentMonthIncome,
      lastMonthIncome,
      budgets,
      savingsGoals,
    ] = await Promise.all([
      Income.find({ user: userId }),
      Expense.find({ user: userId }).sort('-date'),
      Expense.find({ user: userId, date: { $gte: startOfCurrentMonth, $lte: endOfCurrentMonth } }),
      Expense.find({ user: userId, date: { $gte: startOfLastMonth, $lte: endOfLastMonth } }),
      Income.find({ user: userId, date: { $gte: startOfCurrentMonth, $lte: endOfCurrentMonth } }),
      Income.find({ user: userId, date: { $gte: startOfLastMonth, $lte: endOfLastMonth } }),
      Budget.find({ user: userId, month: currentMonth + 1, year: currentYear }),
      SavingsGoal.find({ user: userId }),
    ]);

    // Totals calculations
    const totalIncomeAllTime = allIncome.reduce((sum, i) => sum + i.amount, 0);
    const totalExpenseAllTime = allExpenses.reduce((sum, e) => sum + e.amount, 0);
    const currentBalance = totalIncomeAllTime - totalExpenseAllTime;

    const currentIncomeSum = currentMonthIncome.reduce((sum, i) => sum + i.amount, 0);
    const lastIncomeSum = lastMonthIncome.reduce((sum, i) => sum + i.amount, 0);

    const currentExpenseSum = currentMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
    const lastExpenseSum = lastMonthExpenses.reduce((sum, e) => sum + e.amount, 0);

    const currentNetSavings = currentIncomeSum - currentExpenseSum;
    const lastNetSavings = lastIncomeSum - lastExpenseSum;

    // Savings Rate = ((Income - Expenses) / Income) * 100
    const savingsRate =
      currentIncomeSum > 0
        ? Math.round(((currentIncomeSum - currentExpenseSum) / currentIncomeSum) * 100)
        : 0;

    // Trend percentage calculations
    const calcTrend = (curr, prev) => {
      if (prev === 0) return curr > 0 ? 100 : 0;
      return Math.round(((curr - prev) / prev) * 100);
    };

    const incomeTrend = calcTrend(currentIncomeSum, lastIncomeSum);
    const expenseTrend = calcTrend(currentExpenseSum, lastExpenseSum);
    const savingsTrend = calcTrend(currentNetSavings, lastNetSavings);

    // 2. Spending by Category (Current month or all-time if current month is empty)
    const activeExpenseList = currentMonthExpenses.length > 0 ? currentMonthExpenses : allExpenses;
    const categoryTotals = {};
    activeExpenseList.forEach((e) => {
      categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
    });

    const categoryColors = {
      Food: '#10B981', // emerald
      Shopping: '#3B82F6', // blue
      Transport: '#F59E0B', // amber
      Bills: '#EF4444', // red
      Entertainment: '#8B5CF6', // purple
      Education: '#06B6D4', // cyan
      Health: '#EC4899', // pink
      Other: '#64748B', // slate
    };

    const categoryBreakdown = Object.entries(categoryTotals).map(([name, value]) => ({
      name,
      value,
      color: categoryColors[name] || '#64748B',
    }));

    // 3. Monthly Expense & Income Trend for the past 6 months
    const monthlyOverview = [];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    for (let i = 5; i >= 0; i--) {
      const d = new Date(currentYear, currentMonth - i, 1);
      const mIdx = d.getMonth();
      const y = d.getFullYear();
      const start = new Date(y, mIdx, 1);
      const end = new Date(y, mIdx + 1, 0, 23, 59, 59, 999);

      const mExp = allExpenses
        .filter((e) => e.date >= start && e.date <= end)
        .reduce((sum, e) => sum + e.amount, 0);

      const mInc = allIncome
        .filter((item) => item.date >= start && item.date <= end)
        .reduce((sum, item) => sum + item.amount, 0);

      monthlyOverview.push({
        month: monthNames[mIdx],
        year: y,
        expenses: mExp,
        income: mInc,
        savings: Math.max(0, mInc - mExp),
      });
    }

    // 4. Enriched Budgets for dashboard
    const enrichedBudgets = budgets.map((b) => {
      const spent = categoryTotals[b.category] || 0;
      const remaining = Math.max(0, b.monthlyLimit - spent);
      const percentage = Math.round((spent / b.monthlyLimit) * 100);

      return {
        _id: b._id,
        category: b.category,
        monthlyLimit: b.monthlyLimit,
        spent,
        remaining,
        percentage,
        status: percentage > 100 ? 'Over Budget' : percentage >= 75 ? 'Near Limit' : 'Safe',
      };
    });

    // 5. Enriched Savings Goals for dashboard
    const enrichedGoals = savingsGoals.slice(0, 4).map((g) => ({
      _id: g._id,
      goalName: g.goalName,
      targetAmount: g.targetAmount,
      currentAmount: g.currentAmount,
      percentage: Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100)),
      category: g.category,
      targetDate: g.targetDate,
      isCompleted: g.isCompleted,
    }));

    // 6. Recent Transactions (latest 6 expenses + income merged)
    const recentExpenses = allExpenses.slice(0, 6).map((e) => ({
      _id: e._id,
      type: 'expense',
      title: e.description,
      category: e.category,
      amount: e.amount,
      date: e.date,
      paymentMethod: e.paymentMethod,
    }));

    const recentIncome = allIncome.slice(0, 6).map((i) => ({
      _id: i._id,
      type: 'income',
      title: i.description,
      category: i.source,
      amount: i.amount,
      date: i.date,
      paymentMethod: 'Bank',
    }));

    const recentTransactions = [...recentExpenses, ...recentIncome]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 8);

    // 7. AI Financial Insights
    const insights = generateFinancialInsights({
      currentMonthExpenses,
      lastMonthExpenses,
      currentMonthIncome: currentIncomeSum,
      budgets,
      savingsGoals,
      currencySymbol: req.user.preferences?.currencySymbol || '₹',
    });

    res.json({
      success: true,
      summary: {
        totalBalance: currentBalance,
        totalIncome: currentIncomeSum || totalIncomeAllTime,
        totalExpenses: currentExpenseSum || totalExpenseAllTime,
        savings: currentNetSavings,
        savingsRate,
        incomeTrend,
        expenseTrend,
        savingsTrend,
        allTimeIncome: totalIncomeAllTime,
        allTimeExpenses: totalExpenseAllTime,
      },
      charts: {
        monthlyOverview,
        categoryBreakdown,
      },
      recentTransactions,
      budgets: enrichedBudgets,
      savingsGoals: enrichedGoals,
      topInsight: insights[0] || null,
      allInsightsCount: insights.length,
    });
  } catch (error) {
    console.error('[Dashboard Error]', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getDashboardData };
