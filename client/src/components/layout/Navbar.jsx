import React from 'react';
import { Menu, Plus, Sparkles, Moon, Sun, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { seedApi } from '../../services/api';

const Navbar = ({ onOpenSidebar, pageTitle, onQuickAddExpense, onQuickAddIncome }) => {
  const { user, currencySymbol, currencyCode, updateProfile } = useAuth();
  const { success, error } = useToast();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const handleToggleTheme = () => {
    const nextTheme = user?.preferences?.theme === 'dark' ? 'light' : 'dark';
    updateProfile({ preferences: { theme: nextTheme } });
  };

  const handleQuickSeed = async () => {
    try {
      await seedApi.seedDemoData();
      success('Loaded demo Indian financial data! Refreshing dashboard...');
      window.location.reload();
    } catch (err) {
      error(err.response?.data?.message || 'Failed to seed demo data');
    }
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 sm:px-6 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
      {/* Left: Mobile Menu & Greeting */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-bold text-navy-900 leading-tight">
            {pageTitle || `${getGreeting()}, ${user?.name?.split(' ')[0] || 'Member'} 👋`}
          </h1>
          <p className="text-xs text-slate-500 hidden sm:block">
            Smart Expense Tracker & Personal Wealth Management
          </p>
        </div>
      </div>

      {/* Right: Actions & Preferences */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Currency Badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>{currencySymbol} {currencyCode}</span>
        </div>

        {/* One-click Demo Seeder button */}
        <button
          onClick={handleQuickSeed}
          title="Populate account with sample Indian financial records"
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 text-xs font-semibold transition-all active:scale-95"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Demo Data</span>
        </button>

        {/* Quick Add Buttons */}
        {onQuickAddExpense && (
          <button
            onClick={onQuickAddExpense}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold shadow-sm transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Expense</span>
          </button>
        )}

        {onQuickAddIncome && (
          <button
            onClick={onQuickAddIncome}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 text-white" />
            <span className="hidden sm:inline">Income</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default Navbar;
