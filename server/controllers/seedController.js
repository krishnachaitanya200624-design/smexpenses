const Expense = require('../models/Expense');
const Income = require('../models/Income');
const Budget = require('../models/Budget');
const SavingsGoal = require('../models/SavingsGoal');
const ExpenseGroup = require('../models/ExpenseGroup');

// @desc   Seed realistic Indian financial demo data for the current user
// @route  POST /api/seed
const seedDemoData = async (req, res) => {
  try {
    const userId = req.user._id;
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-11

    // 1. Clear existing demo data for clean state
    await Promise.all([
      Expense.deleteMany({ user: userId }),
      Income.deleteMany({ user: userId }),
      Budget.deleteMany({ user: userId }),
      SavingsGoal.deleteMany({ user: userId }),
      ExpenseGroup.deleteMany({ user: userId }),
    ]);

    // 2. Sample Incomes (Indian Context)
    const incomeData = [
      {
        user: userId,
        amount: 35000,
        source: 'Salary',
        description: 'Monthly Tech Salary - Infosys Technologies',
        date: new Date(currentYear, currentMonth, 1),
      },
      {
        user: userId,
        amount: 5000,
        source: 'Freelance',
        description: 'React UI Design Project - Client Work',
        date: new Date(currentYear, currentMonth, 5),
      },
      // Previous month income for comparison
      {
        user: userId,
        amount: 35000,
        source: 'Salary',
        description: 'Previous Month Tech Salary',
        date: new Date(currentYear, currentMonth - 1, 1),
      },
      {
        user: userId,
        amount: 4000,
        source: 'Freelance',
        description: 'Consulting Project',
        date: new Date(currentYear, currentMonth - 1, 7),
      },
    ];
    await Income.insertMany(incomeData);

    // 3. Sample Expenses (Current Month & Last Month)
    const expenseData = [
      // Current Month
      {
        user: userId,
        amount: 3500,
        description: 'Groceries & Zepto / Blinkit essentials',
        category: 'Food',
        date: new Date(currentYear, currentMonth, 3),
        paymentMethod: 'UPI',
        notes: 'Monthly grocery refill',
      },
      {
        user: userId,
        amount: 1500,
        description: 'Metro smartcard recharge & Uber commutes',
        category: 'Transport',
        date: new Date(currentYear, currentMonth, 6),
        paymentMethod: 'UPI',
        notes: 'Office travel pass',
      },
      {
        user: userId,
        amount: 4000,
        description: 'Myntra & Zara clothing sale haul',
        category: 'Shopping',
        date: new Date(currentYear, currentMonth, 8),
        paymentMethod: 'Credit Card',
        notes: 'Summer festival outfits',
      },
      {
        user: userId,
        amount: 2500,
        description: 'Electricity & High-speed broadband fiber',
        category: 'Bills',
        date: new Date(currentYear, currentMonth, 10),
        paymentMethod: 'UPI',
        notes: 'Airtel & BESCOM bill',
      },
      {
        user: userId,
        amount: 2000,
        description: 'Full-stack course subscription & certification',
        category: 'Education',
        date: new Date(currentYear, currentMonth, 12),
        paymentMethod: 'Debit Card',
        notes: 'Udemy & Coursera tech materials',
      },
      {
        user: userId,
        amount: 1200,
        description: 'PVR Cinema tickets & weekend snacks',
        category: 'Entertainment',
        date: new Date(currentYear, currentMonth, 15),
        paymentMethod: 'UPI',
        notes: 'Movie with friends',
      },
      {
        user: userId,
        amount: 1800,
        description: 'Dining out at Social with colleagues',
        category: 'Food',
        date: new Date(currentYear, currentMonth, 18),
        paymentMethod: 'Credit Card',
        notes: 'Team dinner share',
      },
      {
        user: userId,
        amount: 850,
        description: 'Pharmacy vitamins & Apollo health checkup',
        category: 'Health',
        date: new Date(currentYear, currentMonth, 20),
        paymentMethod: 'Cash',
        notes: 'Daily health supplements',
      },
      // Previous Month Expenses (for trend analysis)
      {
        user: userId,
        amount: 3200,
        description: 'Previous month groceries',
        category: 'Food',
        date: new Date(currentYear, currentMonth - 1, 4),
        paymentMethod: 'UPI',
      },
      {
        user: userId,
        amount: 1100,
        description: 'Previous month fuel & metro',
        category: 'Transport',
        date: new Date(currentYear, currentMonth - 1, 9),
        paymentMethod: 'UPI',
      },
      {
        user: userId,
        amount: 2500,
        description: 'Previous month Amazon shopping',
        category: 'Shopping',
        date: new Date(currentYear, currentMonth - 1, 14),
        paymentMethod: 'Credit Card',
      },
      {
        user: userId,
        amount: 2400,
        description: 'Previous month utilities',
        category: 'Bills',
        date: new Date(currentYear, currentMonth - 1, 16),
        paymentMethod: 'UPI',
      },
    ];
    await Expense.insertMany(expenseData);

    // 4. Sample Budgets
    const budgetData = [
      {
        user: userId,
        category: 'Food',
        monthlyLimit: 7000,
        month: currentMonth + 1,
        year: currentYear,
      },
      {
        user: userId,
        category: 'Shopping',
        monthlyLimit: 5000,
        month: currentMonth + 1,
        year: currentYear,
      },
      {
        user: userId,
        category: 'Bills',
        monthlyLimit: 3000,
        month: currentMonth + 1,
        year: currentYear,
      },
      {
        user: userId,
        category: 'Transport',
        monthlyLimit: 2500,
        month: currentMonth + 1,
        year: currentYear,
      },
      {
        user: userId,
        category: 'Entertainment',
        monthlyLimit: 2000,
        month: currentMonth + 1,
        year: currentYear,
      },
    ];
    await Budget.insertMany(budgetData);

    // 5. Sample Savings Goals
    const targetDate1 = new Date();
    targetDate1.setMonth(targetDate1.getMonth() + 4);

    const targetDate2 = new Date();
    targetDate2.setMonth(targetDate2.getMonth() + 8);

    const goalsData = [
      {
        user: userId,
        goalName: 'MacBook Pro M3 for Coding',
        targetAmount: 60000,
        currentAmount: 35000,
        targetDate: targetDate1,
        category: 'Gadget',
        description: 'High-performance laptop for software engineering and college capstone project.',
        isCompleted: false,
      },
      {
        user: userId,
        goalName: 'Emergency Reserve Fund (6 Months)',
        targetAmount: 50000,
        currentAmount: 28000,
        targetDate: targetDate2,
        category: 'Emergency',
        description: 'Safe rainy day liquid savings in high-interest fixed deposit.',
        isCompleted: false,
      },
    ];
    await SavingsGoal.insertMany(goalsData);

    // 6. Sample Expense Splitter Group
    const groupData = {
      user: userId,
      name: 'Goa Weekend Roadtrip 🏖️',
      description: 'Shared fuel, resort stay, beach shacks, and scooter rentals.',
      members: ['Rahul', 'Krishna', 'Priya', 'Vivek'],
      expenses: [
        {
          description: 'Beach Villa Stay (2 Nights)',
          amount: 8000,
          paidBy: 'Rahul',
          splitAmong: ['Rahul', 'Krishna', 'Priya', 'Vivek'],
          date: new Date(currentYear, currentMonth, 12),
        },
        {
          description: 'SUV Highway Fuel & Tolls',
          amount: 3200,
          paidBy: 'Krishna',
          splitAmong: ['Rahul', 'Krishna', 'Priya', 'Vivek'],
          date: new Date(currentYear, currentMonth, 13),
        },
        {
          description: 'Seafood Shack Dinner & Mocktails',
          amount: 2800,
          paidBy: 'Priya',
          splitAmong: ['Rahul', 'Krishna', 'Priya', 'Vivek'],
          date: new Date(currentYear, currentMonth, 13),
        },
        {
          description: 'Water Sports & Scooters',
          amount: 2000,
          paidBy: 'Vivek',
          splitAmong: ['Rahul', 'Krishna', 'Priya', 'Vivek'],
          date: new Date(currentYear, currentMonth, 14),
        },
      ],
      settlements: [],
    };
    await ExpenseGroup.create(groupData);

    res.json({
      success: true,
      message: 'Demo Indian financial data successfully loaded into your SmartWealth account!',
    });
  } catch (error) {
    console.error('[Seed Error]', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Clear all user financial data
// @route  POST /api/seed/clear
const clearUserData = async (req, res) => {
  try {
    const userId = req.user._id;
    await Promise.all([
      Expense.deleteMany({ user: userId }),
      Income.deleteMany({ user: userId }),
      Budget.deleteMany({ user: userId }),
      SavingsGoal.deleteMany({ user: userId }),
      ExpenseGroup.deleteMany({ user: userId }),
    ]);

    res.json({
      success: true,
      message: 'All your financial transactions, budgets, and goals have been cleared.',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { seedDemoData, clearUserData };
