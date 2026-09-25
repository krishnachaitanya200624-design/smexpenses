const Expense = require('../models/Expense');

// @desc   Get all expenses with filtering, search, and sorting
// @route  GET /api/expenses
const getExpenses = async (req, res) => {
  try {
    const { category, paymentMethod, startDate, endDate, search, sort = '-date' } = req.query;

    const filter = { user: req.user._id };

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (paymentMethod && paymentMethod !== 'All') {
      filter.paymentMethod = paymentMethod;
    }

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.date.$lte = end;
      }
    }

    if (search) {
      filter.$or = [
        { description: { $regex: search, $options: 'i' } },
        { notes: { $regex: search, $options: 'i' } },
      ];
    }

    const expenses = await Expense.find(filter).sort(sort);

    // Calculate total amount for filtered query
    const totalAmount = expenses.reduce((sum, item) => sum + item.amount, 0);

    res.json({
      success: true,
      count: expenses.length,
      totalAmount,
      expenses,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Create new expense
// @route  POST /api/expenses
const createExpense = async (req, res) => {
  try {
    const { amount, description, category, date, paymentMethod, notes } = req.body;

    if (!amount || !description || !category) {
      return res.status(400).json({ success: false, message: 'Please provide amount, description, and category' });
    }

    const expense = await Expense.create({
      user: req.user._id,
      amount: Number(amount),
      description,
      category,
      date: date ? new Date(date) : new Date(),
      paymentMethod: paymentMethod || 'UPI',
      notes: notes || '',
    });

    res.status(201).json({
      success: true,
      message: 'Expense added successfully',
      expense,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Update expense
// @route  PUT /api/expenses/:id
const updateExpense = async (req, res) => {
  try {
    let expense = await Expense.findOne({ _id: req.params.id, user: req.user._id });

    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }

    const { amount, description, category, date, paymentMethod, notes } = req.body;

    if (amount !== undefined) expense.amount = Number(amount);
    if (description) expense.description = description;
    if (category) expense.category = category;
    if (date) expense.date = new Date(date);
    if (paymentMethod) expense.paymentMethod = paymentMethod;
    if (notes !== undefined) expense.notes = notes;

    await expense.save();

    res.json({
      success: true,
      message: 'Expense updated successfully',
      expense,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Delete expense
// @route  DELETE /api/expenses/:id
const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }

    res.json({
      success: true,
      message: 'Expense deleted successfully',
      id: req.params.id,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
};
