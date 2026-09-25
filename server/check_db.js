require('dotenv').config();
const mongoose = require('mongoose');

async function check() {
  await mongoose.connect(process.env.MONGO_URI);
  const User = require('./models/User');
  const Expense = require('./models/Expense');
  const Income = require('./models/Income');
  const Budget = require('./models/Budget');

  const users = await User.find({}, 'name email');
  console.log('USERS IN DB:');
  for (const u of users) {
    const expCount = await Expense.countDocuments({ user: u._id });
    const incCount = await Income.countDocuments({ user: u._id });
    const bCount = await Budget.countDocuments({ user: u._id });
    console.log(`User: ${u.email} [${u.name}] ID: ${u._id} -> Expenses: ${expCount}, Incomes: ${incCount}, Budgets: ${bCount}`);
  }
  process.exit(0);
}

check().catch(console.error);
