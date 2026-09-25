import React, { useState } from 'react';
import {
  Calculator,
  TrendingUp,
  Target,
  Sparkles,
  PieChart as PieChartIcon,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/currency';

const PlanningPage = () => {
  const { currencySymbol, currencyCode } = useAuth();

  // Inputs
  const [monthlyIncome, setMonthlyIncome] = useState(40000);
  const [monthlyExpenses, setMonthlyExpenses] = useState(25000);
  const [currentSavings, setCurrentSavings] = useState(15000);
  const [goalName, setGoalName] = useState('New Home Downpayment / Car');
  const [targetAmount, setTargetAmount] = useState(150000);
  const [targetMonths, setTargetMonths] = useState(12);

  // Calculations
  const savingsCapacity = Math.max(0, monthlyIncome - monthlyExpenses);
  const savingsRate = monthlyIncome > 0 ? Math.round((savingsCapacity / monthlyIncome) * 100) : 0;
  const expenseRatio = monthlyIncome > 0 ? Math.round((monthlyExpenses / monthlyIncome) * 100) : 0;

  const neededSavings = Math.max(0, targetAmount - currentSavings);
  const estimatedMonths = savingsCapacity > 0 ? Math.ceil(neededSavings / savingsCapacity) : 999;
  const isAchievableWithinTarget = estimatedMonths <= targetMonths;

  // 50/30/20 Rule Comparison
  const idealNeeds = Math.round(monthlyIncome * 0.5);
  const idealWants = Math.round(monthlyIncome * 0.3);
  const idealSavings = Math.round(monthlyIncome * 0.2);

  // Growth trajectory chart projection (next 12 to 24 months)
  const projectionMonths = Math.max(targetMonths, Math.min(36, estimatedMonths + 3));
  const projectionData = [];
  let accumulated = currentSavings;

  for (let m = 0; m <= projectionMonths; m++) {
    projectionData.push({
      month: `M${m}`,
      projectedSavings: Math.round(accumulated),
      target: targetAmount,
    });
    accumulated += savingsCapacity;
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-card">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-600">
          Wealth Simulator
        </span>
        <h2 className="text-2xl font-black text-navy-900 mt-0.5">Financial Planning & Projections</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Model your cash flow capacity, benchmark against the 50/30/20 rule, and forecast goal milestone dates
        </p>
      </div>

      {/* Main Grid: Left Controls + Right Real-time Calculations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Input Form Simulator (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-100 shadow-card space-y-4">
          <h3 className="text-base font-extrabold text-navy-900 flex items-center gap-2 mb-2">
            <Calculator className="w-5 h-5 text-emerald-600" />
            <span>Monthly Cash Flow Parameters</span>
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Monthly Income ({currencySymbol})
            </label>
            <input
              type="number"
              min="0"
              step="1000"
              value={monthlyIncome}
              onChange={(e) => setMonthlyIncome(Number(e.target.value) || 0)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Monthly Expenses ({currencySymbol})
            </label>
            <input
              type="number"
              min="0"
              step="500"
              value={monthlyExpenses}
              onChange={(e) => setMonthlyExpenses(Number(e.target.value) || 0)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-700 uppercase mb-3">Goal Details</h4>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Goal Name</label>
                <input
                  type="text"
                  value={goalName}
                  onChange={(e) => setGoalName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">
                    Target Amount ({currencySymbol})
                  </label>
                  <input
                    type="number"
                    min="1000"
                    step="5000"
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(Number(e.target.value) || 0)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">
                    Already Saved ({currencySymbol})
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={currentSavings}
                    onChange={(e) => setCurrentSavings(Number(e.target.value) || 0)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  Target Timeframe (Months): {targetMonths} months
                </label>
                <input
                  type="range"
                  min="3"
                  max="60"
                  value={targetMonths}
                  onChange={(e) => setTargetMonths(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Calculated Results & Projection Chart (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Key Calculated Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-card">
              <span className="text-[10px] uppercase font-bold text-slate-400">Savings Capacity</span>
              <p className="text-xl font-extrabold text-emerald-600 mt-1">
                {formatCurrency(savingsCapacity, currencySymbol, currencyCode)}/mo
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-card">
              <span className="text-[10px] uppercase font-bold text-slate-400">Savings Margin</span>
              <p className="text-xl font-extrabold text-navy-900 mt-1">{savingsRate}%</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-card">
              <span className="text-[10px] uppercase font-bold text-slate-400">Expense-to-Income</span>
              <p className="text-xl font-extrabold text-rose-600 mt-1">{expenseRatio}%</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-card">
              <span className="text-[10px] uppercase font-bold text-slate-400">Months to Goal</span>
              <p className="text-xl font-extrabold text-teal-600 mt-1">
                {estimatedMonths === 999 ? '∞' : `${estimatedMonths} mos`}
              </p>
            </div>
          </div>

          {/* Feasibility Alert Card */}
          <div
            className={`p-5 rounded-2xl border flex items-start gap-4 ${
              isAchievableWithinTarget
                ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                : 'bg-amber-50/70 border-amber-200 text-amber-900'
            }`}
          >
            {isAchievableWithinTarget ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div>
              <h4 className="text-sm font-bold">
                {isAchievableWithinTarget
                  ? `Goal "${goalName}" is achievable in ~${estimatedMonths} months!`
                  : `Target timeframe (${targetMonths} months) is ambitious.`}
              </h4>
              <p className="text-xs mt-1 leading-relaxed opacity-90">
                {isAchievableWithinTarget
                  ? `At your current monthly savings capacity of ${formatCurrency(
                      savingsCapacity,
                      currencySymbol,
                      currencyCode
                    )}, you will hit ${formatCurrency(
                      targetAmount,
                      currencySymbol,
                      currencyCode
                    )} comfortably before your ${targetMonths}-month target.`
                  : `To hit ${formatCurrency(
                      targetAmount,
                      currencySymbol,
                      currencyCode
                    )} in ${targetMonths} months, you need to save approximately ${formatCurrency(
                      Math.ceil(neededSavings / targetMonths),
                      currencySymbol,
                      currencyCode
                    )}/month (currently saving ${formatCurrency(
                      savingsCapacity,
                      currencySymbol,
                      currencyCode
                    )}/month).`}
              </p>
            </div>
          </div>

          {/* Projection Chart */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-base font-extrabold text-navy-900">
                  Projected Wealth Accumulation Curve
                </h4>
                <p className="text-xs text-slate-500">Savings growth trajectory over upcoming months</p>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={projectionData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorProj" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0D9488" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#0D9488" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
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
                    dataKey="projectedSavings"
                    name="Projected Savings"
                    stroke="#0D9488"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorProj)"
                  />
                  <Line
                    type="monotone"
                    dataKey="target"
                    name="Target Goal"
                    stroke="#EF4444"
                    strokeDasharray="4 4"
                    strokeWidth={2}
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 50/30/20 Standard Rule Comparison */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-card">
            <h4 className="text-base font-extrabold text-navy-900 mb-3">
              50/30/20 Recommended Budget Guideline
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100">
                <span className="text-[11px] font-bold text-blue-700 uppercase">50% Needs</span>
                <p className="text-lg font-extrabold text-navy-900 mt-1">
                  {formatCurrency(idealNeeds, currencySymbol, currencyCode)}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">Rent, groceries, utilities</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-100">
                <span className="text-[11px] font-bold text-purple-700 uppercase">30% Wants</span>
                <p className="text-lg font-extrabold text-navy-900 mt-1">
                  {formatCurrency(idealWants, currencySymbol, currencyCode)}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">Dining, entertainment, shopping</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100">
                <span className="text-[11px] font-bold text-emerald-700 uppercase">20% Savings</span>
                <p className="text-lg font-extrabold text-navy-900 mt-1">
                  {formatCurrency(idealSavings, currencySymbol, currencyCode)}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">Emergency, investments, goals</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanningPage;
