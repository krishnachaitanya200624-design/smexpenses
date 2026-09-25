const SavingsGoal = require('../models/SavingsGoal');

// @desc   Get all savings goals with progress calculations
// @route  GET /api/goals
const getGoals = async (req, res) => {
  try {
    const goals = await SavingsGoal.find({ user: req.user._id }).sort('targetDate');

    const enrichedGoals = goals.map((g) => {
      const percentage = Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100));
      const remainingAmount = Math.max(0, g.targetAmount - g.currentAmount);

      // Days remaining calculation
      const today = new Date();
      const target = new Date(g.targetDate);
      const diffTime = target - today;
      const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return {
        _id: g._id,
        goalName: g.goalName,
        targetAmount: g.targetAmount,
        currentAmount: g.currentAmount,
        targetDate: g.targetDate,
        description: g.description,
        category: g.category,
        isCompleted: g.isCompleted || percentage >= 100,
        percentage,
        remainingAmount,
        daysRemaining,
        createdAt: g.createdAt,
      };
    });

    const totalTarget = enrichedGoals.reduce((sum, g) => sum + g.targetAmount, 0);
    const totalSaved = enrichedGoals.reduce((sum, g) => sum + g.currentAmount, 0);
    const overallProgress = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;

    res.json({
      success: true,
      count: enrichedGoals.length,
      totalTarget,
      totalSaved,
      overallProgress,
      goals: enrichedGoals,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Create savings goal
// @route  POST /api/goals
const createGoal = async (req, res) => {
  try {
    const { goalName, targetAmount, currentAmount = 0, targetDate, description, category } = req.body;

    if (!goalName || !targetAmount || !targetDate) {
      return res.status(400).json({ success: false, message: 'Please provide goal name, target amount, and target date' });
    }

    const goal = await SavingsGoal.create({
      user: req.user._id,
      goalName,
      targetAmount: Number(targetAmount),
      currentAmount: Number(currentAmount) || 0,
      targetDate: new Date(targetDate),
      description: description || '',
      category: category || 'Gadget',
    });

    res.status(201).json({
      success: true,
      message: 'Savings goal created successfully',
      goal,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Update savings goal
// @route  PUT /api/goals/:id
const updateGoal = async (req, res) => {
  try {
    let goal = await SavingsGoal.findOne({ _id: req.params.id, user: req.user._id });

    if (!goal) {
      return res.status(404).json({ success: false, message: 'Goal not found' });
    }

    const { goalName, targetAmount, currentAmount, targetDate, description, category, isCompleted } = req.body;

    if (goalName) goal.goalName = goalName;
    if (targetAmount !== undefined) goal.targetAmount = Number(targetAmount);
    if (currentAmount !== undefined) goal.currentAmount = Number(currentAmount);
    if (targetDate) goal.targetDate = new Date(targetDate);
    if (description !== undefined) goal.description = description;
    if (category) goal.category = category;
    if (isCompleted !== undefined) goal.isCompleted = isCompleted;

    if (goal.currentAmount >= goal.targetAmount) {
      goal.isCompleted = true;
    }

    await goal.save();

    res.json({
      success: true,
      message: 'Goal updated successfully',
      goal,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Add money to savings goal
// @route  POST /api/goals/:id/add-funds
const addFunds = async (req, res) => {
  try {
    const { amount } = req.body;
    const depositAmount = Number(amount);

    if (!depositAmount || depositAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Please enter a valid positive amount to deposit' });
    }

    const goal = await SavingsGoal.findOne({ _id: req.params.id, user: req.user._id });

    if (!goal) {
      return res.status(404).json({ success: false, message: 'Goal not found' });
    }

    goal.currentAmount += depositAmount;
    if (goal.currentAmount >= goal.targetAmount) {
      goal.isCompleted = true;
    }

    await goal.save();

    res.json({
      success: true,
      message: `Added ₹${depositAmount.toLocaleString('en-IN')} to ${goal.goalName}!`,
      goal,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Delete savings goal
// @route  DELETE /api/goals/:id
const deleteGoal = async (req, res) => {
  try {
    const goal = await SavingsGoal.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!goal) {
      return res.status(404).json({ success: false, message: 'Goal not found' });
    }

    res.json({
      success: true,
      message: 'Goal deleted successfully',
      id: req.params.id,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getGoals,
  createGoal,
  updateGoal,
  addFunds,
  deleteGoal,
};
