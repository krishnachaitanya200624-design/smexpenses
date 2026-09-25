import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Calendar,
  PieChart as PieChartIcon,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { analyticsApi } from '../services/api';
import { formatCurrency } from '../utils/currency';
import StatCard from '../components/common/StatCard';
import { SkeletonCard, SkeletonTable } from '../components/common/SkeletonLoader';

const periods = ['This Week', 'This Month', 'Last 3 Months', 'This Year'];

const AnalyticsPage = () => {
  const { currencySymbol, currencyCode } = useAuth();
  const { error } = useToast();

  const [selectedPeriod, setSelectedPeriod] = useState('This Month');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await analyticsApi.getAnalyticsData(selectedPeriod);
      if (res.data.success) {
        setData(res.data);
      }
    } catch (err) {
      error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [selectedPeriod]);

  const { summary = {}, charts = {} } = data || {};
  const { categoryBreakdown = [], timeSeries = [], paymentMethodBreakdown = [] } = charts;

  return (
    <div className="space-y-6">
      {/* Top Banner Header & Time Period Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-card">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600">
            Performance Metrics
          </span>
          <h2 className="text-2xl font-black text-navy-900 mt-0.5">Financial Analytics</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Deep dive into spending distributions, timeline cash flows, and savings velocity
          </p>
        </div>

        {/* Date Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 border border-slate-200">
          {periods.map((p) => (
            <button
              key={p}
              onClick={() => setSelectedPeriod(p)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedPeriod === p
                  ? 'bg-white text-navy-900 shadow-sm'
                  : 'text-slate-500 hover:text-navy-900'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Period Income"
          amount={formatCurrency(summary.totalIncome, currencySymbol, currencyCode)}
          icon={TrendingUp}
          colorScheme="emerald"
        />
        <StatCard
          title="Period Expenses"
          amount={formatCurrency(summary.totalExpenses, currencySymbol, currencyCode)}
          icon={TrendingDown}
          colorScheme="rose"
        />
        <StatCard
          title="Net Savings"
          amount={formatCurrency(summary.netSavings, currencySymbol, currencyCode)}
          trend={summary.savingsRate}
          trendLabel="savings rate"
          icon={PiggyBank}
          colorScheme="navy"
        />
        <StatCard
          title="Highest Outflow"
          amount={summary.highestCategory?.name || 'None'}
          trendLabel={formatCurrency(summary.highestCategory?.value, currencySymbol, currencyCode)}
          icon={BarChart3}
          colorScheme="amber"
        />
      </div>

      {/* Secondary Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-card">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Average Daily Burn
          </span>
          <p className="text-2xl font-extrabold text-navy-900 mt-1">
            {formatCurrency(summary.averageDailySpending, currencySymbol, currencyCode)}/day
          </p>
          <span className="text-xs text-slate-500 mt-1 block">Based on active period duration</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-card">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Projected Monthly Burn
          </span>
          <p className="text-2xl font-extrabold text-rose-600 mt-1">
            {formatCurrency(summary.averageMonthlySpending, currencySymbol, currencyCode)}/mo
          </p>
          <span className="text-xs text-slate-500 mt-1 block">Expected 30-day run rate</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-card">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Total Transactions
          </span>
          <p className="text-2xl font-extrabold text-emerald-600 mt-1">
            {summary.transactionsCount || 0} entries
          </p>
          <span className="text-xs text-slate-500 mt-1 block">Logged in this timeframe</span>
        </div>
      </div>

      {/* Chart Row 1: Line Chart (Income vs Expense Trends) & Donut Chart (Category Distribution) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-100 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-extrabold text-navy-900">
                Cash Flow Timeline (Line Chart)
              </h3>
              <p className="text-xs text-slate-500">Inflows vs outflows across {selectedPeriod}</p>
            </div>
          </div>

          <div className="h-72 w-full">
            {timeSeries.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeSeries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
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
                  <Line
                    type="monotone"
                    dataKey="income"
                    name="Income"
                    stroke="#10B981"
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="expenses"
                    name="Expenses"
                    stroke="#EF4444"
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                No timeline data logged in this period
              </div>
            )}
          </div>
        </div>

        {/* Donut Chart: Category Spending */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-base font-extrabold text-navy-900">Category Share (Donut)</h3>
              <p className="text-xs text-slate-500">Expenditure proportions</p>
            </div>
          </div>

          <div className="h-56 w-full relative">
            {categoryBreakdown.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {categoryBreakdown.map((entry, index) => (
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
                No category data available
              </div>
            )}
          </div>

          <div className="space-y-2 max-h-36 overflow-y-auto mt-2 pt-2 border-t border-slate-100 text-xs">
            {categoryBreakdown.map((c) => (
              <div key={c.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                  <span className="text-slate-600 font-medium">{c.name}</span>
                </div>
                <span className="font-bold text-navy-900">
                  {formatCurrency(c.value, currencySymbol, currencyCode)} ({c.percentage}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chart Row 2: Bar Chart (Net Daily/Monthly Difference) & Area Chart (Cumulative Savings Curve) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-extrabold text-navy-900">Net Flow Comparison (Bar Chart)</h3>
              <p className="text-xs text-slate-500">Income vs Expenses bars across intervals</p>
            </div>
          </div>

          <div className="h-64 w-full">
            {timeSeries.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={timeSeries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
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
                  <Bar dataKey="income" name="Income" fill="#10B981" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="expenses" name="Expenses" fill="#EF4444" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                No comparison intervals
              </div>
            )}
          </div>
        </div>

        {/* Area Chart: Cumulative Savings / Net Cash Flow */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-extrabold text-navy-900">
                Cumulative Savings Velocity (Area Chart)
              </h3>
              <p className="text-xs text-slate-500">Accumulated surplus trajectory over time</p>
            </div>
          </div>

          <div className="h-64 w-full">
            {timeSeries.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timeSeries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAreaSavings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0D9488" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#0D9488" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
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
                    dataKey="cumulativeSavings"
                    name="Cumulative Surplus"
                    stroke="#0D9488"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorAreaSavings)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                No cumulative series available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
