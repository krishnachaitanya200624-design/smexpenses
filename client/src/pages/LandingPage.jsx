import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Wallet,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  PieChart,
  Target,
  Sparkles,
  Users,
  CheckCircle2,
  ChevronRight,
  BarChart3,
  CreditCard,
  Lock,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const { isAuthenticated, demoLogin } = useAuth();
  const navigate = useNavigate();

  const handleDemoClick = async () => {
    await demoLogin();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-md shadow-emerald-500/20">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-navy-900 flex items-center">
                Smart<span className="text-emerald-600">Wealth</span>
              </span>
              <p className="text-[10px] tracking-wider text-slate-400 font-semibold uppercase">
                Fintech & Wealth
              </p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#why" className="hover:text-navy-900 transition-colors">Why SmartWealth</a>
            <a href="#features" className="hover:text-navy-900 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-navy-900 transition-colors">How It Works</a>
            <a href="#insights" className="hover:text-navy-900 transition-colors">AI Insights</a>
          </nav>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-sm font-semibold shadow-sm transition-all active:scale-95"
              >
                Go to Dashboard
                <ArrowRight className="w-4 h-4 text-emerald-400" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-navy-900 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-md shadow-emerald-600/20 transition-all active:scale-95"
                >
                  Get Started Free
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold mb-6 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Next-Gen Personal Finance & Smart Wealth Management</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-navy-900 tracking-tight leading-[1.15] mb-6">
              Take Control of <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-navy-800">
                Your Money & Future
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 font-normal leading-relaxed mb-8 max-w-2xl mx-auto">
              Track expenses, manage budgets, build savings, split shared costs, and understand your financial habits — all in one unified, intelligent platform.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-lg shadow-emerald-600/25 transition-all active:scale-95"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={handleDemoClick}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-semibold text-base shadow-md transition-all active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-emerald-400" />
                Try Interactive Demo
              </button>
            </div>

            <div className="flex items-center justify-center gap-6 mt-8 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Bank-grade JWT Security
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 100% Free & Open Source
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Local & Cloud Ready
              </span>
            </div>
          </div>

          {/* Interactive Modern Financial Dashboard Mockup Illustration */}
          <div className="relative max-w-5xl mx-auto">
            <div className="absolute -inset-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl blur-xl opacity-20 transform -rotate-1"></div>
            <div className="relative bg-white rounded-3xl border border-slate-200/80 shadow-2xl p-4 sm:p-7 overflow-hidden">
              {/* Fake Dashboard Top Bar */}
              <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                  <span className="ml-2 text-xs font-semibold text-slate-400">
                    SmartWealth Financial Portal
                  </span>
                </div>
                <div className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
                  ₹ INR Active
                </div>
              </div>

              {/* Sample 4 Grid Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Total Balance</span>
                  <div className="text-xl sm:text-2xl font-black text-navy-900 mt-1">₹28,500</div>
                  <span className="text-[11px] font-semibold text-emerald-600 mt-2 block">+14% vs last month</span>
                </div>
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Monthly Income</span>
                  <div className="text-xl sm:text-2xl font-black text-navy-900 mt-1">₹40,000</div>
                  <span className="text-[11px] font-semibold text-emerald-600 mt-2 block">Salary + Freelance</span>
                </div>
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Monthly Expenses</span>
                  <div className="text-xl sm:text-2xl font-black text-navy-900 mt-1">₹11,500</div>
                  <span className="text-[11px] font-semibold text-rose-600 mt-2 block">Within Safe Limit</span>
                </div>
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Savings Rate</span>
                  <div className="text-xl sm:text-2xl font-black text-navy-900 mt-1">71%</div>
                  <span className="text-[11px] font-semibold text-emerald-600 mt-2 block">Excellent Health</span>
                </div>
              </div>

              {/* AI Banner Preview */}
              <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-transparent border border-emerald-200/60 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-navy-900">SmartWealth AI Insight</h4>
                    <p className="text-xs text-slate-600">
                      "Your food spending increased by 18% this month. Consider setting a weekly food budget."
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-700 hidden sm:block">Actionable Alert</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 1: Why SmartWealth */}
      <section id="why" className="py-20 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-black text-navy-900 tracking-tight mb-4">
              Why SmartWealth?
            </h2>
            <p className="text-base text-slate-600">
              Built specifically for modern students, working professionals, and smart savers who demand clarity over their cash flow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-all card-interactive">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-6">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-navy-900 mb-2">Total Financial Clarity</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Connect income sources and daily outflows. Instant dynamic calculation of real balance, net savings, and burn rates.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-all card-interactive">
              <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mb-6">
                <PieChart className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-navy-900 mb-2">Proactive Budgeting</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Set monthly category budgets. Receive automatic color-coded alerts (Safe, Near Limit, Over Budget) before you overspend.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-all card-interactive">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-6">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-navy-900 mb-2">Zero-Cost AI Recommendations</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                An intelligent local analysis engine audits your month-over-month habits and provides tailored tips without costly API subscriptions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2-6: Features Grid */}
      <section id="features" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
              Comprehensive Suite
            </span>
            <h2 className="text-3xl font-black text-navy-900 tracking-tight mt-2 mb-4">
              Everything You Need to Grow Your Wealth
            </h2>
            <p className="text-base text-slate-600">
              From day-to-day UPI logs to multi-year wealth projection calculators.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1: Expense Tracking */}
            <div className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-card card-interactive">
              <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-5">
                <CreditCard className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-navy-900 mb-2">1. Expense Tracking</h3>
              <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                Log purchases with categories (Food, Shopping, Bills, Transport), dates, and payment methods (Cash, UPI, Cards, Bank). Search and filter effortlessly.
              </p>
              <div className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                Full CRUD + Instant Totals <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Feature 2: Smart Budgeting */}
            <div className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-card card-interactive">
              <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-5">
                <PieChart className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-navy-900 mb-2">2. Smart Budgeting</h3>
              <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                Establish spending caps per category. Live progress bars track consumed percentages and remaining allowances in real-time.
              </p>
              <div className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                Safe / Near / Over Status <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Feature 3: Savings Goals */}
            <div className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-card card-interactive">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-navy-900 mb-2">3. Savings Goals</h3>
              <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                Save for a new laptop, vehicle, emergency fund, or trip. Deposit money directly to your goals and celebrate milestone completions.
              </p>
              <div className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                Countdown & Deposit Modal <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Feature 4: Financial Analytics */}
            <div className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-card card-interactive">
              <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-5">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-navy-900 mb-2">4. Financial Analytics</h3>
              <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                Interactive Recharts: Line charts, monthly comparison bars, donut category distributions, and cumulative area curves across multiple time frames.
              </p>
              <div className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                Week / Month / 3M / Year <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Feature 5: Expense Splitter */}
            <div className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-card card-interactive">
              <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-5">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-navy-900 mb-2">5. Expense Splitter</h3>
              <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                Split shared bills for trips, roommates, or team dinners. Our greedy algorithm calculates the minimum debt transfers ("Rahul should receive ₹500").
              </p>
              <div className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                Fair Debt Minimization <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Feature 6: AI-Powered Insights */}
            <div className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-card card-interactive">
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-navy-900 mb-2">6. AI-Powered Insights</h3>
              <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                Detect anomalous category spikes, benchmark your savings against the 50/30/20 standard, and pinpoint exact spending cuts that yield immediate wealth.
              </p>
              <div className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                Automated Financial Audit <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 7: How It Works */}
      <section id="how-it-works" className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
              Simple 3-Step Process
            </span>
            <h2 className="text-3xl font-black text-navy-900 tracking-tight mt-2 mb-4">
              How SmartWealth Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center relative">
            <div className="p-6">
              <div className="w-14 h-14 rounded-2xl bg-navy-900 text-white font-black text-xl flex items-center justify-center mx-auto mb-5 shadow-md">
                1
              </div>
              <h3 className="text-lg font-bold text-navy-900 mb-2">Log Daily Records</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Add incomes and daily expenses in seconds with flexible payment methods like UPI, Cards, and Cash.
              </p>
            </div>

            <div className="p-6">
              <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white font-black text-xl flex items-center justify-center mx-auto mb-5 shadow-md shadow-emerald-500/20">
                2
              </div>
              <h3 className="text-lg font-bold text-navy-900 mb-2">Auto-Track & Categorize</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Budgets, balances, and savings rates update instantaneously without manual spreadsheets.
              </p>
            </div>

            <div className="p-6">
              <div className="w-14 h-14 rounded-2xl bg-teal-600 text-white font-black text-xl flex items-center justify-center mx-auto mb-5 shadow-md shadow-teal-500/20">
                3
              </div>
              <h3 className="text-lg font-bold text-navy-900 mb-2">Grow Your Net Worth</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Execute AI-recommended savings adjustments, hit your goal milestones, and build lasting financial freedom.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 8: Call To Action */}
      <section className="py-20 bg-gradient-to-br from-navy-950 via-navy-900 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-4 text-white">
            Ready to Take Control of Your Financial Life?
          </h2>
          <p className="text-base sm:text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
            Join SmartWealth today and experience the smartest way to track, budget, and grow your personal wealth.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-navy-950 font-bold text-base shadow-lg shadow-emerald-500/25 transition-all active:scale-95"
            >
              Create Free Account
              <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              onClick={handleDemoClick}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-navy-800 hover:bg-navy-700 text-white font-semibold text-base border border-navy-700 transition-all active:scale-95"
            >
              Open Live Demo
            </button>
          </div>
        </div>
      </section>

      {/* Section 9: Footer */}
      <footer className="bg-navy-950 text-slate-400 py-12 border-t border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
              <Wallet className="w-4 h-4" />
            </div>
            <span className="text-base font-extrabold text-white">
              Smart<span className="text-emerald-400">Wealth</span>
            </span>
          </div>

          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} SmartWealth. Track. Analyze. Plan. Grow. Full-Stack Production System.
          </p>

          <div className="flex items-center gap-4 text-xs font-medium">
            <span className="text-slate-400">React + Vite</span>
            <span>•</span>
            <span className="text-slate-400">Node.js + Express</span>
            <span>•</span>
            <span className="text-slate-400">MongoDB</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
