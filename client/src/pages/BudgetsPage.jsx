import React, { useState, useEffect } from 'react';
import {
  Plus,
  PieChart,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Edit2,
  AlertCircle,
  TrendingDown,
  ShieldAlert,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { budgetApi } from '../services/api';
import { formatCurrency } from '../utils/currency';
import { StatusBadge } from '../components/common/Badge';
import Modal from '../components/common/Modal';
import ConfirmModal from '../components/common/ConfirmModal';
import { SkeletonCard } from '../components/common/SkeletonLoader';
import EmptyState from '../components/common/EmptyState';

const categoryOptions = [
  'Food',
  'Shopping',
  'Transport',
  'Bills',
  'Entertainment',
  'Education',
  'Health',
  'Other',
];

const BudgetsPage = () => {
  const { currencySymbol, currencyCode } = useAuth();
  const { success, error } = useToast();

  const [budgets, setBudgets] = useState([]);
  const [totalBudget, setTotalBudget] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [overallRemaining, setOverallRemaining] = useState(0);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Form
  const [category, setCategory] = useState('Food');
  const [monthlyLimit, setMonthlyLimit] = useState('');

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const res = await budgetApi.getBudgets();
      if (res.data.success) {
        setBudgets(res.data.budgets);
        setTotalBudget(res.data.totalBudget);
        setTotalSpent(res.data.totalSpent);
        setOverallRemaining(res.data.overallRemaining);
      }
    } catch (err) {
      error('Failed to load budgets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const handleOpenAddModal = () => {
    setEditingBudget(null);
    setCategory('Food');
    setMonthlyLimit('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (b) => {
    setEditingBudget(b);
    setCategory(b.category);
    setMonthlyLimit(b.monthlyLimit);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!category || !monthlyLimit) return;
    setSubmitting(true);

    try {
      if (editingBudget) {
        await budgetApi.updateBudget(editingBudget._id, { monthlyLimit });
        success('Budget updated successfully');
      } else {
        await budgetApi.createBudget({ category, monthlyLimit });
        success('Budget created successfully');
      }
      setIsModalOpen(false);
      fetchBudgets();
    } catch (err) {
      error(err.response?.data?.message || 'Failed to save budget');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await budgetApi.deleteBudget(deleteTarget._id);
      success('Budget removed');
      setDeleteTarget(null);
      fetchBudgets();
    } catch (err) {
      error('Failed to delete budget');
    } finally {
      setDeleting(false);
    }
  };

  const overBudgetItems = budgets.filter((b) => b.percentage > 100);
  const nearLimitItems = budgets.filter((b) => b.percentage >= 75 && b.percentage <= 100);

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-card">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600">
            Spending Guardrails
          </span>
          <h2 className="text-2xl font-black text-navy-900 mt-0.5">Budget Management</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Keep your category outflows bounded with real-time alerts
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right sm:border-r sm:pr-6 sm:border-slate-100">
            <span className="text-xs text-slate-500 font-semibold block">Total Allocation</span>
            <span className="text-2xl font-black text-navy-900">
              {formatCurrency(totalBudget, currencySymbol, currencyCode)}
            </span>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold shadow-md transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>Create Budget</span>
          </button>
        </div>
      </div>

      {/* Warning Banners if Any Budget is Near or Over Limit */}
      {overBudgetItems.length > 0 && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed">
            <span className="font-bold">Over Budget Alert:</span> You have exceeded your budget in{' '}
            {overBudgetItems.map((b) => `${b.category} (${b.percentage}%)`).join(', ')}. Pause
            discretionary expenses in these categories.
          </div>
        </div>
      )}

      {nearLimitItems.length > 0 && overBudgetItems.length === 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed">
            <span className="font-bold">Caution:</span> Spending is approaching limits for{' '}
            {nearLimitItems.map((b) => `${b.category} (${b.percentage}%)`).join(', ')}.
          </div>
        </div>
      )}

      {/* Budget Summary Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-card">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Total Allocated
          </span>
          <p className="text-2xl font-extrabold text-navy-900 mt-1">
            {formatCurrency(totalBudget, currencySymbol, currencyCode)}
          </p>
          <span className="text-xs text-slate-500 mt-1 block">Active across {budgets.length} categories</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-card">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Total Consumed
          </span>
          <p className="text-2xl font-extrabold text-rose-600 mt-1">
            {formatCurrency(totalSpent, currencySymbol, currencyCode)}
          </p>
          <span className="text-xs text-slate-500 mt-1 block">
            {totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0}% of overall budget
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-card">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Safe Remaining
          </span>
          <p className="text-2xl font-extrabold text-emerald-600 mt-1">
            {formatCurrency(overallRemaining, currencySymbol, currencyCode)}
          </p>
          <span className="text-xs text-slate-500 mt-1 block">Available unspent cushion</span>
        </div>
      </div>

      {/* Budgets Grid Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : budgets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {budgets.map((b) => {
            const pct = b.percentage || 0;
            const isOver = pct > 100;
            const isNear = pct >= 75 && !isOver;

            return (
              <div
                key={b._id}
                className="bg-white rounded-3xl p-5 border border-slate-100 shadow-card card-interactive flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base font-extrabold text-navy-900">{b.category}</h3>
                    <StatusBadge status={b.status} />
                  </div>

                  <div className="space-y-1 mb-4">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-500">Spent:</span>
                      <span className={isOver ? 'text-rose-600 font-bold' : 'text-slate-900'}>
                        {formatCurrency(b.spent, currencySymbol, currencyCode)}
                      </span>
                    </div>

                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-500">Budget Limit:</span>
                      <span className="text-navy-900 font-bold">
                        {formatCurrency(b.monthlyLimit, currencySymbol, currencyCode)}
                      </span>
                    </div>

                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-500">Remaining:</span>
                      <span className={isOver ? 'text-rose-600' : 'text-emerald-600 font-bold'}>
                        {isOver
                          ? `Exceeded by ${formatCurrency(b.spent - b.monthlyLimit, currencySymbol, currencyCode)}`
                          : formatCurrency(b.remaining, currencySymbol, currencyCode)}
                      </span>
                    </div>
                  </div>

                  {/* Visual Progress Bar */}
                  <div className="space-y-1 mb-4">
                    <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isOver ? 'bg-rose-500' : isNear ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(100, pct)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] font-semibold text-slate-400">
                      <span>0%</span>
                      <span>{pct}% Used</span>
                      <span>100%</span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => handleOpenEditModal(b)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-navy-900 hover:bg-slate-100 transition-colors"
                    title="Edit budget"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(b)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Delete budget"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={PieChart}
          title="No Budgets Created"
          description="Create spending limits for categories like Food, Transport, and Shopping to automatically prevent overspending."
          actionText="Create First Budget"
          onAction={handleOpenAddModal}
        />
      )}

      {/* Add / Edit Budget Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingBudget ? `Edit ${editingBudget.category} Budget` : 'Create Category Budget'}
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {!editingBudget && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
              >
                {categoryOptions.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Monthly Limit ({currencySymbol})
            </label>
            <input
              type="number"
              required
              min="1"
              value={monthlyLimit}
              onChange={(e) => setMonthlyLimit(e.target.value)}
              placeholder="e.g. 5000"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-sm font-bold shadow-sm"
            >
              {submitting ? 'Saving...' : editingBudget ? 'Save Changes' : 'Create Budget'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Budget"
        message={`Are you sure you want to remove the ${deleteTarget?.category} budget limit (${formatCurrency(
          deleteTarget?.monthlyLimit,
          currencySymbol,
          currencyCode
        )})?`}
        confirmText="Delete Budget"
        loading={deleting}
      />
    </div>
  );
};

export default BudgetsPage;
