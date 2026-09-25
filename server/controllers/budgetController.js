const Budget = require('../models/Budget');
const Expense = require('../models/Expense');

// @desc   Get all budgets with dynamic calculations (spent, remaining, percentage, status)
// @route  GET /api/budgets
const getBudgets = async (req, res) => {
  try {
    const now = new Date();
    const month = req.query.month ? Number(req.query.month) : now.getMonth() + 1;
    const year = req.query.year ? Number(req.query.year) : now.getFullYear();

    const budgets = await Budget.find({ user: req.user._id, month, year });

    // Date range for the given month/year
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

    // Fetch user's expenses for this month to compute category spent
    const expenses = await Expense.find({
      user: req.user._id,
      date: { $gte: startOfMonth, $lte: endOfMonth },
    });

    const categorySpentMap = {};
    expenses.forEach((e) => {
      categorySpentMap[e.category] = (categorySpentMap[e.category] || 0) + e.amount;
    });

    const enrichedBudgets = budgets.map((b) => {
      const spent = categorySpentMap[b.category] || 0;
      const remaining = Math.max(0, b.monthlyLimit - spent);
      const percentage = Math.round((spent / b.monthlyLimit) * 100);

      let status = 'Safe';
      if (percentage > 100) {
        status = 'Over Budget';
      } else if (percentage >= 75) {
        status = 'Near Limit';
      }

      return {
        _id: b._id,
        category: b.category,
        monthlyLimit: b.monthlyLimit,
        month: b.month,
        year: b.year,
        spent,
        remaining,
        percentage,
        status,
        createdAt: b.createdAt,
      };
    });

    const totalBudget = enrichedBudgets.reduce((sum, b) => sum + b.monthlyLimit, 0);
    const totalSpent = enrichedBudgets.reduce((sum, b) => sum + b.spent, 0);
    const overallRemaining = Math.max(0, totalBudget - totalSpent);

    res.json({
      success: true,
      month,
      year,
      totalBudget,
      totalSpent,
      overallRemaining,
      budgets: enrichedBudgets,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Create new budget
// @route  POST /api/budgets
const createBudget = async (req, res) => {
  try {
    const { category, monthlyLimit, month, year } = req.body;

    if (!category || !monthlyLimit) {
      return res.status(400).json({ success: false, message: 'Please provide category and monthly limit' });
    }

    const now = new Date();
    const budgetMonth = month ? Number(month) : now.getMonth() + 1;
    const budgetYear = year ? Number(year) : now.getFullYear();

    // Check if budget already exists for this category/month/year
    const existing = await Budget.findOne({
      user: req.user._id,
      category,
      month: budgetMonth,
      year: budgetYear,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: `A budget for ${category} already exists for this month. You can edit it instead.`,
      });
    }

    const budget = await Budget.create({
      user: req.user._id,
      category,
      monthlyLimit: Number(monthlyLimit),
      month: budgetMonth,
      year: budgetYear,
    });

    res.status(201).json({
      success: true,
      message: 'Budget created successfully',
      budget,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Update budget
// @route  PUT /api/budgets/:id
const updateBudget = async (req, res) => {
  try {
    let budget = await Budget.findOne({ _id: req.params.id, user: req.user._id });

    if (!budget) {
      return res.status(404).json({ success: false, message: 'Budget not found' });
    }

    if (req.body.monthlyLimit !== undefined) {
      budget.monthlyLimit = Number(req.body.monthlyLimit);
    }
    if (req.body.category) {
      budget.category = req.body.category;
    }

    await budget.save();

    res.json({
      success: true,
      message: 'Budget updated successfully',
      budget,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Delete budget
// @route  DELETE /api/budgets/:id
const deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!budget) {
      return res.status(404).json({ success: false, message: 'Budget not found' });
    }

    res.json({
      success: true,
      message: 'Budget deleted successfully',
      id: req.params.id,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
};
