import React, { useState, useEffect } from 'react';
import { Link } from 'lucide-react';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Plus,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Receipt,
  Calendar,
  AlertTriangle,
  Target,
  PieChart as PieChartIcon,
  ChevronRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { dashboardApi, expenseApi, incomeApi, seedApi } from '../services/api';
import { formatCurrency } from '../utils/currency';
import { formatDate, getCategoryColor } from '../utils/formatters';
import StatCard from '../components/common/StatCard';
import Modal from '../components/common/Modal';
import { SkeletonCard, SkeletonTable } from '../components/common/SkeletonLoader';
import EmptyState from '../components/common/EmptyState';

const DashboardPage = () => {
  const { user, currencySymbol, currencyCode } = useAuth();
  const { success, error } = useToast();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Quick modals state
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showAddIncome, setShowAddIncome] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Expense form
  const [expAmount, setExpAmount] = useState('');
  const [expDesc, setExpDesc] = useState('');
  const [expCategory, setExpCategory] = useState('Food');
  const [expPayment, setExpPayment] = useState('UPI');
  const [expDate, setExpDate] = useState(new Date().toISOString().split('T')[0]);

  // Income form
  const [incAmount, setIncAmount] = useState('');
  const [incDesc, setIncDesc] = useState('');
  const [incSource, setIncSource] = useState('Salary');
  const [incDate, setIncDate] = useState(new Date().toISOString().split('T')[0]);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await dashboardApi.getDashboardData();
      if (res.data.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error(err);
      error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleAddExpenseSubmit = async (e) => {
    e.preventDefault();
    if (!expAmount || !expDesc) return;
    setSubmitting(true);
    try {
      await expenseApi.createExpense({
        amount: expAmount,
        description: expDesc,
        category: expCategory,
        paymentMethod: expPayment,
        date: expDate,
      });
      success('Expense added!');
      setShowAddExpense(false);
      setExpAmount('');
      setExpDesc('');
      fetchDashboard();
    } catch (err) {
      error(err.response?.data?.message || 'Failed to add expense');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddIncomeSubmit = async (e) => {
    e.preventDefault();
    if (!incAmount || !incDesc) return;
    setSubmitting(true);
    try {
      await incomeApi.createIncome({
        amount: incAmount,
        description: incDesc,
        source: incSource,
        date: incDate,
      });
      success('Income added!');
      setShowAddIncome(false);
      setIncAmount('');
      setIncDesc('');
      fetchDashboard();
    } catch (err) {
      error(err.response?.data?.message || 'Failed to add income');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSeedData = async () => {
    try {
      setLoading(true);
      await seedApi.seedDemoData();
      success('Loaded sample Indian financial data!');
      await fetchDashboard();
    } catch (err) {
      error('Failed to seed demo data');
      setLoading(false);
    }
  };

  if (loading && !data) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SkeletonTable rows={4} />
          </div>
          <div>
            <SkeletonTable rows={4} />
          </div>
        </div>
      </div>
    );
  }

  const {
    summary = {},
    charts = {},
    recentTransactions = [],
    budgets = [],
    savingsGoals = [],
    topInsight,
  } = data || {};

  const hasAnyData =
    summary.allTimeIncome > 0 || summary.allTimeExpenses > 0 || recentTransactions.length > 0;

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome & Quick Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-100 shadow-card">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
            Financial Health Overview
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-navy-900 mt-0.5">
            Welcome, {user?.name} 👋
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time balance, category spending, and intelligent insights.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowAddExpense(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold shadow-sm transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>Add Expense</span>
          </button>
          <button
            onClick={() => setShowAddIncome(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Income</span>
          </button>
          {!hasAnyData && (
            <button
              onClick={handleSeedData}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold border border-amber-200 transition-all active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Seed Demo Data</span>
            </button>
          )}
        </div>
      </div>

      {/* Section F: AI Financial Insight Card */}
      {topInsight && (
        <div className="bg-gradient-to-r from-emerald-600 via-teal-700 to-navy-900 rounded-3xl p-5 sm:p-6 text-white shadow-lg shadow-emerald-900/10 relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-36 h-36 bg-emerald-400/10 rounded-full blur-2xl"></div>
          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-emerald-300 shrink-0 border border-white/20">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] uppercase tracking-wider font-extrabold bg-emerald-400 text-navy-950 px-2 py-0.5 rounded-md">
                    SmartWealth AI Insight
                  </span>
                  <span className="text-xs text-emerald-200 font-medium">{topInsight.type}</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
                  {topInsight.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-200 mt-1 leading-relaxed max-w-2xl">
                  {topInsight.message}
                </p>
                {topInsight.action && (
                  <p className="text-xs text-emerald-300 font-semibold mt-2 flex items-center gap-1">
                    💡 Tip: {topInsight.action}
                  </p>
                )}
              </div>
            </div>

            <a
              href="/insights"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-colors shrink-0"
            >
              <span>View All Insights</span>
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Balance"
          amount={formatCurrency(summary.totalBalance, currencySymbol, currencyCode)}
          trend={summary.savingsTrend}
          trendLabel="cashflow index"
          icon={Wallet}
          colorScheme="navy"
        />
        <StatCard
          title="Monthly Income"
          amount={formatCurrency(summary.totalIncome, currencySymbol, currencyCode)}
          trend={summary.incomeTrend}
          trendLabel="vs last month"
          icon={TrendingUp}
          colorScheme="emerald"
        />
        <StatCard
          title="Monthly Expenses"
          amount={formatCurrency(summary.totalExpenses, currencySymbol, currencyCode)}
          trend={summary.expenseTrend}
          trendLabel="vs last month"
          icon={TrendingDown}
          colorScheme="rose"
        />
        <StatCard
          title="Savings & Rate"
          amount={`${summary.savingsRate || 0}%`}
          trend={summary.savingsRate >= 20 ? 10 : -10}
          trendLabel={`${formatCurrency(summary.savings, currencySymbol, currencyCode)} saved`}
          icon={PiggyBank}
          colorScheme="blue"
        />
      </div>

      {/* Empty State Banner if no records exist */}
      {!hasAnyData && (
        <EmptyState
          icon={Sparkles}
          title="Your SmartWealth Dashboard is Empty"
          description="Log your income and expenses, or click 'Seed Demo Indian Data' to instantly populate the application with realistic transactions, budgets, goals, and charts."
          actionText="Seed Demo Indian Data"
          onAction={handleSeedData}
          secondaryActionText="+ Add First Expense"
          onSecondaryAction={() => setShowAddExpense(true)}
        />
      )}

      {/* Main Grid: Section A (Expense Overview) + Section B (Spending by Category) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Section A: Expense Overview (Line/Area Chart) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-card">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-bold text-navy-900">Expense & Cash Flow Overview</h3>
              <p className="text-xs text-slate-500">6-Month historical comparison of inflows and outflows</p>
            </div>
            <span className="text-xs font-bold text-slate-400">Monthly</span>
          </div>

          <div className="h-72 w-full">
            {charts.monthlyOverview && charts.monthlyOverview.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={charts.monthlyOverview}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorInc" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EF4444" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                  <Tooltip
                    formatter={(value) => [formatCurrency(value, currencySymbol, currencyCode), '']}
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      color: '#fff',
                      borderRadius: '12px',
                      border: 'none',
                      fontSize: '12px',
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="income"
                    name="Income"
                    stroke="#10B981"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorInc)"
                  />
                  <Area
                    type="monotone"
                    dataKey="expenses"
                    name="Expenses"
                    stroke="#EF4444"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorExp)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                No monthly data available yet
              </div>
            )}
          </div>
        </div>

        {/* Section B: Spending by Category (Donut Chart) */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-base font-bold text-navy-900">Spending by Category</h3>
              <p className="text-xs text-slate-500">Distribution of expenditures</p>
            </div>
          </div>

          <div className="h-56 w-full relative">
            {charts.categoryBreakdown && charts.categoryBreakdown.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={charts.categoryBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {charts.categoryBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [formatCurrency(value, currencySymbol, currencyCode), '']}
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      color: '#fff',
                      borderRadius: '12px',
                      border: 'none',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                No categorized expenses yet
              </div>
            )}
          </div>

          {/* Category Legend */}
          <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-100 max-h-36 overflow-y-auto">
            {charts.categoryBreakdown &&
              charts.categoryBreakdown.map((c) => (
                <div key={c.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                    <span className="text-slate-600 truncate">{c.name}</span>
                  </div>
                  <span className="font-semibold text-navy-900">
                    {formatCurrency(c.value, currencySymbol, currencyCode)}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Grid 2: Section C (Recent Transactions), Section D (Budget Overview), Section E (Savings Goals) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Section C: Recent Transactions */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-navy-900">Recent Transactions</h3>
              <p className="text-xs text-slate-500">Latest expenses and income activities</p>
            </div>
            <a
              href="/expenses"
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              View All <ChevronRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {recentTransactions.length > 0 ? (
            <div className="divide-y divide-slate-50">
              {recentTransactions.map((tx) => {
                const isInc = tx.type === 'income';
                return (
                  <div key={tx._id} className="py-3 flex items-center justify-between hover:bg-slate-50/50 px-2 rounded-xl transition-colors">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                          isInc
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                            : 'bg-rose-50 text-rose-600 border border-rose-100'
                        }`}
                      >
                        {isInc ? <ArrowDownRight className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-navy-900 truncate max-w-xs">{tx.title}</p>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <span>{tx.category}</span>
                          <span>•</span>
                          <span>{formatDate(tx.date)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span
                        className={`text-sm font-extrabold ${
                          isInc ? 'text-emerald-600' : 'text-slate-900'
                        }`}
                      >
                        {isInc ? '+' : '-'}
                        {formatCurrency(tx.amount, currencySymbol, currencyCode)}
                      </span>
                      <p className="text-[10px] text-slate-400 uppercase font-medium">
                        {tx.paymentMethod}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-slate-400">
              No recent transactions recorded
            </div>
          )}
        </div>

        {/* Right Column: Section D (Budget Overview) & Section E (Savings Goals) */}
        <div className="space-y-6">
          {/* Section D: Budget Overview */}
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <PieChartIcon className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-navy-900">Budget Progress</h3>
              </div>
              <a href="/budgets" className="text-xs font-bold text-emerald-600 hover:text-emerald-700">
                Manage
              </a>
            </div>

            {budgets.length > 0 ? (
              <div className="space-y-4">
                {budgets.slice(0, 4).map((b) => {
                  const pct = b.percentage || 0;
                  const isOver = pct > 100;
                  const isNear = pct >= 75 && !isOver;

                  return (
                    <div key={b._id} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-700">{b.category}</span>
                        <span className={isOver ? 'text-rose-600 font-bold' : isNear ? 'text-amber-600' : 'text-slate-500'}>
                          {formatCurrency(b.spent, currencySymbol, currencyCode)} /{' '}
                          {formatCurrency(b.monthlyLimit, currencySymbol, currencyCode)} ({pct}%)
                        </span>
                      </div>
                      {/* Progress Bar */}
                      <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isOver ? 'bg-rose-500' : isNear ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.min(100, pct)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-slate-400">
                No budgets configured for this month.{' '}
                <a href="/budgets" className="text-emerald-600 font-bold underline">
                  Create one
                </a>
              </div>
            )}
          </div>

          {/* Section E: Savings Goals */}
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-navy-900">Savings Goals</h3>
              </div>
              <a href="/goals" className="text-xs font-bold text-emerald-600 hover:text-emerald-700">
                View All
              </a>
            </div>

            {savingsGoals.length > 0 ? (
              <div className="space-y-3">
                {savingsGoals.map((g) => (
                  <div key={g._id} className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="text-xs font-bold text-navy-900 truncate">{g.goalName}</h4>
                      <span className="text-[11px] font-extrabold text-emerald-600">
                        {g.percentage}%
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mb-2">
                      {formatCurrency(g.currentAmount, currencySymbol, currencyCode)} of{' '}
                      {formatCurrency(g.targetAmount, currencySymbol, currencyCode)}
                    </p>
                    <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${Math.min(100, g.percentage)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-slate-400">
                No savings goals yet.{' '}
                <a href="/goals" className="text-emerald-600 font-bold underline">
                  Set a goal
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal: Add Expense */}
      <Modal isOpen={showAddExpense} onClose={() => setShowAddExpense(false)} title="Record New Expense">
        <form onSubmit={handleAddExpenseSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Amount ({currencySymbol})
            </label>
            <input
              type="number"
              step="0.01"
              required
              min="1"
              value={expAmount}
              onChange={(e) => setExpAmount(e.target.value)}
              placeholder="e.g. 350"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Description
            </label>
            <input
              type="text"
              required
              value={expDesc}
              onChange={(e) => setExpDesc(e.target.value)}
              placeholder="e.g. Grocery store items"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Category
              </label>
              <select
                value={expCategory}
                onChange={(e) => setExpCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
              >
                <option value="Food">Food</option>
                <option value="Shopping">Shopping</option>
                <option value="Transport">Transport</option>
                <option value="Bills">Bills</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Education">Education</option>
                <option value="Health">Health</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Payment Method
              </label>
              <select
                value={expPayment}
                onChange={(e) => setExpPayment(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
              >
                <option value="UPI">UPI</option>
                <option value="Cash">Cash</option>
                <option value="Debit Card">Debit Card</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Date
            </label>
            <input
              type="date"
              value={expDate}
              onChange={(e) => setExpDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowAddExpense(false)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-sm font-bold shadow-sm"
            >
              {submitting ? 'Saving...' : 'Add Expense'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Add Income */}
      <Modal isOpen={showAddIncome} onClose={() => setShowAddIncome(false)} title="Record New Income">
        <form onSubmit={handleAddIncomeSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Amount ({currencySymbol})
            </label>
            <input
              type="number"
              step="0.01"
              required
              min="1"
              value={incAmount}
              onChange={(e) => setIncAmount(e.target.value)}
              placeholder="e.g. 35000"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Description
            </label>
            <input
              type="text"
              required
              value={incDesc}
              onChange={(e) => setIncDesc(e.target.value)}
              placeholder="e.g. Monthly Salary or Freelance Contract"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Source
              </label>
              <select
                value={incSource}
                onChange={(e) => setIncSource(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
              >
                <option value="Salary">Salary</option>
                <option value="Freelance">Freelance</option>
                <option value="Business">Business</option>
                <option value="Scholarship">Scholarship</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Date
              </label>
              <input
                type="date"
                value={incDate}
                onChange={(e) => setIncDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowAddIncome(false)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-sm"
            >
              {submitting ? 'Saving...' : 'Add Income'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default DashboardPage;
