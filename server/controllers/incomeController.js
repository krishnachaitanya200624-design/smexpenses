const Income = require('../models/Income');

// @desc   Get all income entries with filtering & search
// @route  GET /api/income
const getIncome = async (req, res) => {
  try {
    const { source, startDate, endDate, search, sort = '-date' } = req.query;

    const filter = { user: req.user._id };

    if (source && source !== 'All') {
      filter.source = source;
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
      filter.description = { $regex: search, $options: 'i' };
    }

    const incomeList = await Income.find(filter).sort(sort);
    const totalAmount = incomeList.reduce((sum, item) => sum + item.amount, 0);

    res.json({
      success: true,
      count: incomeList.length,
      totalAmount,
      income: incomeList,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Create new income
// @route  POST /api/income
const createIncome = async (req, res) => {
  try {
    const { amount, source, date, description } = req.body;

    if (!amount || !source || !description) {
      return res.status(400).json({ success: false, message: 'Please provide amount, source, and description' });
    }

    const income = await Income.create({
      user: req.user._id,
      amount: Number(amount),
      source,
      date: date ? new Date(date) : new Date(),
      description,
    });

    res.status(201).json({
      success: true,
      message: 'Income added successfully',
      income,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Update income
// @route  PUT /api/income/:id
const updateIncome = async (req, res) => {
  try {
    let income = await Income.findOne({ _id: req.params.id, user: req.user._id });

    if (!income) {
      return res.status(404).json({ success: false, message: 'Income entry not found' });
    }

    const { amount, source, date, description } = req.body;

    if (amount !== undefined) income.amount = Number(amount);
    if (source) income.source = source;
    if (date) income.date = new Date(date);
    if (description) income.description = description;

    await income.save();

    res.json({
      success: true,
      message: 'Income updated successfully',
      income,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Delete income
// @route  DELETE /api/income/:id
const deleteIncome = async (req, res) => {
  try {
    const income = await Income.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!income) {
      return res.status(404).json({ success: false, message: 'Income entry not found' });
    }

    res.json({
      success: true,
      message: 'Income deleted successfully',
      id: req.params.id,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getIncome,
  createIncome,
  updateIncome,
  deleteIncome,
};
