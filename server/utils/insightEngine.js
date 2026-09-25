/**
 * Rule-based Intelligent Financial Insights Generator
 * Analyzes transaction histories, category trends, budgets, and savings rates
 */

function generateFinancialInsights({
  currentMonthExpenses = [],
  lastMonthExpenses = [],
  currentMonthIncome = 0,
  budgets = [],
  savingsGoals = [],
  currencySymbol = '₹',
}) {
  const insights = [];

  const currentTotalExpense = currentMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
  const lastTotalExpense = lastMonthExpenses.reduce((sum, e) => sum + e.amount, 0);

  // 1. Savings Rate Analysis
  if (currentMonthIncome > 0) {
    const netSavings = currentMonthIncome - currentTotalExpense;
    const savingsRate = Math.round((netSavings / currentMonthIncome) * 100);

    if (savingsRate >= 30) {
      insights.push({
        id: 'savings-rate-stellar',
        type: 'Savings',
        category: 'success',
        title: 'Outstanding Savings Rate',
        message: `You are currently saving ${savingsRate}% of your income (${currencySymbol}${netSavings.toLocaleString('en-IN')}). You are well above the 50/30/20 standard!`,
        action: 'Consider allocating surplus into your highest priority savings goal or emergency fund.',
        impact: 'High Positive',
      });
    } else if (savingsRate >= 20) {
      insights.push({
        id: 'savings-rate-healthy',
        type: 'Savings',
        category: 'success',
        title: 'Healthy Savings Rate',
        message: `You are currently saving ${savingsRate}% of your income. You are meeting the healthy financial benchmark of saving at least 20%.`,
        action: 'Keep up the momentum to maintain at least 3-6 months of essential living expenses.',
        impact: 'Positive',
      });
    } else if (savingsRate > 0) {
      insights.push({
        id: 'savings-rate-low',
        type: 'Savings',
        category: 'warning',
        title: 'Below Recommended Savings Rate',
        message: `Your current savings rate is ${savingsRate}%. Financial experts recommend setting aside at least 20% of your earnings.`,
        action: 'Review discretionary spending (Shopping, Entertainment) to elevate your savings margin.',
        impact: 'Moderate Warning',
      });
    } else {
      insights.push({
        id: 'savings-rate-deficit',
        type: 'Savings',
        category: 'danger',
        title: 'Spending Exceeds Income (Deficit)',
        message: `Your monthly expenses (${currencySymbol}${currentTotalExpense.toLocaleString('en-IN')}) exceed your monthly income (${currencySymbol}${currentMonthIncome.toLocaleString('en-IN')}).`,
        action: 'Immediate action required: cut non-essential expenses and check open budget alerts to avoid debt.',
        impact: 'Critical Alert',
      });
    }
  }

  // 2. Category Breakdown & Top Spending
  const categoryTotals = {};
  currentMonthExpenses.forEach((exp) => {
    categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
  });

  const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);

  if (sortedCategories.length > 0) {
    const [topCategory, topAmount] = sortedCategories[0];
    const topPct = currentTotalExpense > 0 ? Math.round((topAmount / currentTotalExpense) * 100) : 0;

    insights.push({
      id: 'top-spending-category',
      type: 'Spending',
      category: 'info',
      title: `Highest Spending on ${topCategory}`,
      message: `You spend the most on ${topCategory}, accounting for ${currencySymbol}${topAmount.toLocaleString('en-IN')} (${topPct}% of your total outflow this month).`,
      action: topPct > 40
        ? `Since ${topCategory} takes over 40% of your budget, explore ways to optimize recurring purchases or set a stricter limit.`
        : `Track individual ${topCategory} receipts to keep this category well within bounds.`,
      impact: 'Informational',
    });
  }

  // 3. Month-over-Month Comparison
  const lastCategoryTotals = {};
  lastMonthExpenses.forEach((exp) => {
    lastCategoryTotals[exp.category] = (lastCategoryTotals[exp.category] || 0) + exp.amount;
  });

  sortedCategories.forEach(([cat, currAmt]) => {
    const prevAmt = lastCategoryTotals[cat] || 0;
    if (prevAmt > 0 && currAmt > prevAmt) {
      const pctIncrease = Math.round(((currAmt - prevAmt) / prevAmt) * 100);
      if (pctIncrease >= 15) {
        insights.push({
          id: `increase-${cat.toLowerCase()}`,
          type: 'Spending',
          category: 'warning',
          title: `${cat} Spending Surge (+${pctIncrease}%)`,
          message: `Your ${cat} expenses increased by ${pctIncrease}% this month (${currencySymbol}${currAmt.toLocaleString('en-IN')} vs ${currencySymbol}${prevAmt.toLocaleString('en-IN')} last month).`,
          action: `Consider setting a weekly ${cat.toLowerCase()} limit or monitoring impulse transactions.`,
          impact: 'Moderate Warning',
        });
      }
    }
  });

  // Overall Month-over-Month Expense Trend
  if (lastTotalExpense > 0 && currentTotalExpense > 0) {
    const overallDiff = currentTotalExpense - lastTotalExpense;
    const diffPct = Math.round((Math.abs(overallDiff) / lastTotalExpense) * 100);

    if (overallDiff > 0 && diffPct >= 10) {
      insights.push({
        id: 'overall-expense-surge',
        type: 'Habits',
        category: 'warning',
        title: 'Higher Overall Spending This Month',
        message: `Your overall monthly spending is ${diffPct}% higher than last month (+${currencySymbol}${overallDiff.toLocaleString('en-IN')}).`,
        action: 'Inspect recent one-off transactions to ensure you are staying on track with your long-term goals.',
        impact: 'Advisory',
      });
    } else if (overallDiff < 0 && diffPct >= 10) {
      insights.push({
        id: 'overall-expense-drop',
        type: 'Habits',
        category: 'success',
        title: 'Disciplined Spending Habit',
        message: `Great discipline! Your spending is down ${diffPct}% (${currencySymbol}${Math.abs(overallDiff).toLocaleString('en-IN')} saved) compared to last month.`,
        action: 'Transfer these unspent savings directly to your active savings goals.',
        impact: 'High Positive',
      });
    }
  }

  // 4. Shopping Optimization Suggestion
  const shoppingSpend = categoryTotals['Shopping'] || 0;
  if (shoppingSpend >= 2000) {
    const potentialSaving = Math.min(1000, Math.round(shoppingSpend * 0.25));
    insights.push({
      id: 'shopping-cut-suggestion',
      type: 'Spending',
      category: 'info',
      title: 'Actionable Optimization Opportunity',
      message: `Reducing shopping expenses by ${currencySymbol}${potentialSaving.toLocaleString('en-IN')} could boost your monthly savings substantially.`,
      action: 'Try the 48-hour rule: wait two days before non-essential purchases to curb impulsive buying.',
      impact: 'Recommendation',
    });
  }

  // 5. Budget Utilization Warnings
  budgets.forEach((b) => {
    const spent = categoryTotals[b.category] || 0;
    const pct = Math.round((spent / b.monthlyLimit) * 100);

    if (pct > 100) {
      insights.push({
        id: `budget-exceeded-${b.category}`,
        type: 'Budget',
        category: 'danger',
        title: `${b.category} Budget Exceeded (${pct}%)`,
        message: `You have spent ${currencySymbol}${spent.toLocaleString('en-IN')} against a ${currencySymbol}${b.monthlyLimit.toLocaleString('en-IN')} limit (${pct}% consumed).`,
        action: `Pause non-critical ${b.category} transactions for the rest of the billing cycle.`,
        impact: 'Critical Alert',
      });
    } else if (pct >= 80) {
      insights.push({
        id: `budget-near-limit-${b.category}`,
        type: 'Budget',
        category: 'warning',
        title: `${b.category} Approaching Limit (${pct}%)`,
        message: `You have used ${pct}% of your ${b.category} budget with ${currencySymbol}${(b.monthlyLimit - spent).toLocaleString('en-IN')} remaining.`,
        action: 'Pace your purchases to avoid exceeding your allocation.',
        impact: 'Warning',
      });
    }
  });

  // 6. Savings Goals Progress
  savingsGoals.forEach((g) => {
    if (!g.isCompleted && g.targetAmount > 0) {
      const pct = Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100));
      const remaining = g.targetAmount - g.currentAmount;
      if (pct >= 80) {
        insights.push({
          id: `goal-almost-there-${g._id || g.goalName}`,
          type: 'Savings',
          category: 'success',
          title: `Goal Milestone: "${g.goalName}" is ${pct}% Complete!`,
          message: `Only ${currencySymbol}${remaining.toLocaleString('en-IN')} left to reach your target of ${currencySymbol}${g.targetAmount.toLocaleString('en-IN')}!`,
          action: 'A final small deposit will complete this goal ahead of schedule.',
          impact: 'Positive Milestone',
        });
      }
    }
  });

  // Default fallback insight if brand new user
  if (insights.length === 0) {
    insights.push({
      id: 'welcome-insight',
      type: 'Habits',
      category: 'info',
      title: 'Welcome to SmartWealth AI Insights',
      message: 'As you log your daily expenses and income, our intelligent financial engine will automatically surface personalized spending patterns, budget alerts, and smart savings opportunities.',
      action: 'Start by recording your first expense or click "Seed Demo Data" in Settings to see a populated live analysis!',
      impact: 'Informational',
    });
  }

  return insights;
}

module.exports = { generateFinancialInsights };
