const ExpenseGroup = require('../models/ExpenseGroup');
const { calculateGroupSettlements } = require('../utils/debtSimplifier');

// @desc   Get all expense groups for the user
// @route  GET /api/splitter
const getGroups = async (req, res) => {
  try {
    const groups = await ExpenseGroup.find({ user: req.user._id }).sort('-createdAt');

    const enrichedGroups = groups.map((g) => {
      const calculation = calculateGroupSettlements(g.members, g.expenses);
      return {
        _id: g._id,
        name: g.name,
        description: g.description,
        membersCount: g.members.length,
        expensesCount: g.expenses.length,
        totalSpend: calculation.totalGroupSpend,
        members: g.members,
        settlementsCount: calculation.settlements.length,
        createdAt: g.createdAt,
      };
    });

    res.json({
      success: true,
      count: enrichedGroups.length,
      groups: enrichedGroups,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Get single group with full calculations
// @route  GET /api/splitter/:id
const getGroupById = async (req, res) => {
  try {
    const group = await ExpenseGroup.findOne({ _id: req.params.id, user: req.user._id });

    if (!group) {
      return res.status(404).json({ success: false, message: 'Expense group not found' });
    }

    const calculation = calculateGroupSettlements(group.members, group.expenses);

    // Merge manual settlements with calculated debts
    const settledPairs = new Set(
      group.settlements.filter((s) => s.settled).map((s) => `${s.from}->${s.to}`)
    );

    const settlementsWithStatus = calculation.settlements.map((s) => ({
      ...s,
      isSettled: settledPairs.has(`${s.from}->${s.to}`),
    }));

    res.json({
      success: true,
      group: {
        _id: group._id,
        name: group.name,
        description: group.description,
        members: group.members,
        expenses: group.expenses,
        settlementsHistory: group.settlements,
        totalSpend: calculation.totalGroupSpend,
        memberSummary: calculation.memberSummary,
        settlements: settlementsWithStatus,
        createdAt: group.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Create new expense group
// @route  POST /api/splitter
const createGroup = async (req, res) => {
  try {
    const { name, description, members } = req.body;

    if (!name || !members || !Array.isArray(members) || members.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a group name and at least 2 members',
      });
    }

    // Clean and deduplicate members
    const cleanMembers = [...new Set(members.map((m) => m.trim()).filter((m) => m.length > 0))];

    if (cleanMembers.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Group must have at least 2 unique members',
      });
    }

    const group = await ExpenseGroup.create({
      user: req.user._id,
      name,
      description: description || '',
      members: cleanMembers,
      expenses: [],
      settlements: [],
    });

    res.status(201).json({
      success: true,
      message: 'Group created successfully',
      group,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Add expense to group
// @route  POST /api/splitter/:id/expenses
const addGroupExpense = async (req, res) => {
  try {
    const group = await ExpenseGroup.findOne({ _id: req.params.id, user: req.user._id });

    if (!group) {
      return res.status(404).json({ success: false, message: 'Expense group not found' });
    }

    const { description, amount, paidBy, splitAmong, date } = req.body;

    if (!description || !amount || !paidBy) {
      return res.status(400).json({
        success: false,
        message: 'Please provide description, amount, and payer',
      });
    }

    const participants = splitAmong && splitAmong.length > 0 ? splitAmong : group.members;

    group.expenses.unshift({
      description,
      amount: Number(amount),
      paidBy,
      splitAmong: participants,
      date: date ? new Date(date) : new Date(),
    });

    await group.save();

    res.status(201).json({
      success: true,
      message: 'Shared expense added to group',
      group,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Delete expense from group
// @route  DELETE /api/splitter/:id/expenses/:expenseId
const deleteGroupExpense = async (req, res) => {
  try {
    const group = await ExpenseGroup.findOne({ _id: req.params.id, user: req.user._id });

    if (!group) {
      return res.status(404).json({ success: false, message: 'Expense group not found' });
    }

    group.expenses = group.expenses.filter((e) => e._id.toString() !== req.params.expenseId);
    await group.save();

    res.json({
      success: true,
      message: 'Group expense removed',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Toggle settlement status between members
// @route  POST /api/splitter/:id/settle
const toggleSettlement = async (req, res) => {
  try {
    const group = await ExpenseGroup.findOne({ _id: req.params.id, user: req.user._id });

    if (!group) {
      return res.status(404).json({ success: false, message: 'Expense group not found' });
    }

    const { from, to, amount } = req.body;

    const existingIdx = group.settlements.findIndex((s) => s.from === from && s.to === to);

    if (existingIdx >= 0) {
      group.settlements[existingIdx].settled = !group.settlements[existingIdx].settled;
      group.settlements[existingIdx].settledAt = group.settlements[existingIdx].settled ? new Date() : null;
    } else {
      group.settlements.push({
        from,
        to,
        amount: Number(amount) || 0,
        settled: true,
        settledAt: new Date(),
      });
    }

    await group.save();

    res.json({
      success: true,
      message: 'Settlement state updated',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Delete entire group
// @route  DELETE /api/splitter/:id
const deleteGroup = async (req, res) => {
  try {
    const group = await ExpenseGroup.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }

    res.json({
      success: true,
      message: 'Expense group deleted',
      id: req.params.id,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getGroups,
  getGroupById,
  createGroup,
  addGroupExpense,
  deleteGroupExpense,
  toggleSettlement,
  deleteGroup,
};
