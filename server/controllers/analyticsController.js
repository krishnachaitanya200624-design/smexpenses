const Expense = require('../models/Expense');
const Income = require('../models/Income');

// @desc   Get comprehensive analytics with date filtering and rich chart series
// @route  GET /api/analytics
const getAnalyticsData = async (req, res) => {
  try {
    const userId = req.user._id;
    const { period = 'This Month' } = req.query;

    const now = new Date();
    let startDate = new Date();

    if (period === 'This Week') {
      const day = now.getDay();
      const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Monday
      startDate = new Date(now.setDate(diff));
      startDate.setHours(0, 0, 0, 0);
    } else if (period === 'This Month') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (period === 'Last 3 Months') {
      startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1);
    } else if (period === 'This Year') {
      startDate = new Date(now.getFullYear(), 0, 1);
    } else {
      // Default This Month
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    const [expenses, income] = await Promise.all([
      Expense.find({ user: userId, date: { $gte: startDate } }).sort('date'),
      Income.find({ user: userId, date: { $gte: startDate } }).sort('date'),
    ]);

    const totalIncome = income.reduce((sum, i) => sum + i.amount, 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const netSavings = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100) : 0;

    // Category-wise spending
    const categoryTotals = {};
    expenses.forEach((e) => {
      categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
    });

    const categoryColors = {
      Food: '#10B981',
      Shopping: '#3B82F6',
      Transport: '#F59E0B',
      Bills: '#EF4444',
      Entertainment: '#8B5CF6',
      Education: '#06B6D4',
      Health: '#EC4899',
      Other: '#64748B',
    };

    const categoryBreakdown = Object.entries(categoryTotals)
      .map(([name, value]) => ({
        name,
        value,
        percentage: totalExpenses > 0 ? Math.round((value / totalExpenses) * 100) : 0,
        color: categoryColors[name] || '#64748B',
      }))
      .sort((a, b) => b.value - a.value);

    const highestCategory = categoryBreakdown[0] || { name: 'None', value: 0, percentage: 0 };

    // Daily / Monthly series for Line, Bar, and Area charts
    const timelineMap = {};

    expenses.forEach((e) => {
      const dStr = new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (!timelineMap[dStr]) {
        timelineMap[dStr] = { date: dStr, expenses: 0, income: 0, savings: 0 };
      }
      timelineMap[dStr].expenses += e.amount;
    });

    income.forEach((i) => {
      const dStr = new Date(i.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (!timelineMap[dStr]) {
        timelineMap[dStr] = { date: dStr, expenses: 0, income: 0, savings: 0 };
      }
      timelineMap[dStr].income += i.amount;
    });

    let cumulativeSavings = 0;
    const timeSeries = Object.values(timelineMap).map((item) => {
      cumulativeSavings += item.income - item.expenses;
      return {
        ...item,
        netCashFlow: item.income - item.expenses,
        cumulativeSavings,
      };
    });

    // Payment Method Breakdown
    const paymentMethodMap = {};
    expenses.forEach((e) => {
      paymentMethodMap[e.paymentMethod] = (paymentMethodMap[e.paymentMethod] || 0) + e.amount;
    });

    const paymentMethodBreakdown = Object.entries(paymentMethodMap).map(([name, value]) => ({
      name,
      value,
      percentage: totalExpenses > 0 ? Math.round((value / totalExpenses) * 100) : 0,
    }));

    // Average spending metric
    const daysInPeriod = Math.max(1, Math.ceil((new Date() - startDate) / (1000 * 60 * 60 * 24)));
    const averageDailySpending = Math.round(totalExpenses / daysInPeriod);
    const averageMonthlySpending = Math.round((totalExpenses / daysInPeriod) * 30);

    res.json({
      success: true,
      period,
      summary: {
        totalIncome,
        totalExpenses,
        netSavings,
        savingsRate,
        highestCategory,
        averageDailySpending,
        averageMonthlySpending,
        transactionsCount: expenses.length + income.length,
      },
      charts: {
        categoryBreakdown,
        timeSeries,
        paymentMethodBreakdown,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAnalyticsData };
