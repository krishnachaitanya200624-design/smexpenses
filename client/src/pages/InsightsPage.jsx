import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  ShieldAlert,
  ArrowRight,
  TrendingDown,
  PieChart,
  RefreshCw,
  Zap,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { insightApi } from '../services/api';
import { formatCurrency } from '../utils/currency';
import { SkeletonCard } from '../components/common/SkeletonLoader';
import EmptyState from '../components/common/EmptyState';

const tabs = ['All', 'Spending', 'Savings', 'Budget', 'Habits'];

const InsightsPage = () => {
  const { currencySymbol, currencyCode } = useAuth();
  const { error, success } = useToast();

  const [activeTab, setActiveTab] = useState('All');
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      const res = await insightApi.getInsights();
      if (res.data.success) {
        setInsights(res.data.insights);
      }
    } catch (err) {
      error('Failed to analyze financial data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  const filteredInsights =
    activeTab === 'All'
      ? insights
      : insights.filter((i) => i.type.toLowerCase() === activeTab.toLowerCase());

  const getImpactBadge = (impact) => {
    if (impact.includes('Positive') || impact.includes('Stellar') || impact.includes('Milestone')) {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
    if (impact.includes('Critical') || impact.includes('Alert')) {
      return 'bg-rose-50 text-rose-700 border-rose-200';
    }
    if (impact.includes('Warning')) {
      return 'bg-amber-50 text-amber-700 border-amber-200';
    }
    return 'bg-blue-50 text-blue-700 border-blue-200';
  };

  const getCardIcon = (type, category) => {
    if (category === 'danger') return <ShieldAlert className="w-5 h-5 text-rose-600" />;
    if (category === 'warning') return <AlertTriangle className="w-5 h-5 text-amber-600" />;
    if (category === 'success') return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
    return <Sparkles className="w-5 h-5 text-teal-600" />;
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-navy-900 via-slate-900 to-navy-950 p-6 sm:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="relative max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/15 border border-emerald-400/30 text-emerald-300 text-xs font-extrabold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Autonomous Intelligence Engine</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            AI-Powered Financial Insights
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            SmartWealth continuously audits your cash flows, analyzes category changes
            month-over-month, compares your savings rate against healthy financial benchmarks, and
            surfaces tailored optimization recommendations.
          </p>

          <div className="mt-5 flex items-center gap-3">
            <button
              onClick={() => {
                fetchInsights();
                success('Re-analyzed your latest transactions!');
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all active:scale-95"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Re-analyze Financial Data</span>
            </button>
            <span className="text-xs text-slate-400 font-medium">
              100% Offline Rule Engine (No Paid API required)
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 ${
              activeTab === tab
                ? 'bg-navy-900 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab === 'All' ? `All Insights (${insights.length})` : tab}
          </button>
        ))}
      </div>

      {/* Insights Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : filteredInsights.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredInsights.map((insight) => (
            <div
              key={insight.id}
              className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card card-interactive flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                      {getCardIcon(insight.type, insight.category)}
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-navy-900 leading-snug">
                        {insight.title}
                      </h3>
                      <span className="text-[11px] font-semibold text-slate-400">
                        {insight.type} Analysis
                      </span>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold border shrink-0 ${getImpactBadge(
                      insight.impact
                    )}`}
                  >
                    {insight.impact}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                  {insight.message}
                </p>
              </div>

              {insight.action && (
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                  <Lightbulb className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-slate-700 font-medium leading-relaxed">
                    <span className="font-bold text-navy-900">Recommendation: </span>
                    {insight.action}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Sparkles}
          title="No Insights for this Category"
          description="Log more transactions across varied categories to unlock personalized spending intelligence."
        />
      )}
    </div>
  );
};

export default InsightsPage;
