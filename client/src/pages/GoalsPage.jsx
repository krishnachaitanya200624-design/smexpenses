import React, { useState, useEffect } from 'react';
import {
  Plus,
  Target,
  PiggyBank,
  CheckCircle2,
  Calendar,
  Trash2,
  Edit2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Laptop,
  Car,
  Home,
  Shield,
  GraduationCap,
  Palmtree,
  Coins,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { goalApi } from '../services/api';
import { formatCurrency } from '../utils/currency';
import { formatDate } from '../utils/formatters';
import Modal from '../components/common/Modal';
import ConfirmModal from '../components/common/ConfirmModal';
import { SkeletonCard } from '../components/common/SkeletonLoader';
import EmptyState from '../components/common/EmptyState';

const categoryIcons = {
  Gadget: Laptop,
  Emergency: Shield,
  Vehicle: Car,
  Travel: Palmtree,
  Education: GraduationCap,
  Home: Home,
  Investment: TrendingUp,
  Other: Coins,
};

const GoalsPage = () => {
  const { currencySymbol, currencyCode } = useAuth();
  const { success, error } = useToast();

  const [goals, setGoals] = useState([]);
  const [totalTarget, setTotalTarget] = useState(0);
  const [totalSaved, setTotalSaved] = useState(0);
  const [overallProgress, setOverallProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [activeGoal, setActiveGoal] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Goal Form Fields
  const [goalName, setGoalName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [category, setCategory] = useState('Gadget');
  const [description, setDescription] = useState('');

  // Deposit Form
  const [depositAmount, setDepositAmount] = useState('');

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const res = await goalApi.getGoals();
      if (res.data.success) {
        setGoals(res.data.goals);
        setTotalTarget(res.data.totalTarget);
        setTotalSaved(res.data.totalSaved);
        setOverallProgress(res.data.overallProgress);
      }
    } catch (err) {
      error('Failed to load savings goals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleOpenCreateModal = () => {
    setActiveGoal(null);
    setGoalName('');
    setTargetAmount('');
    setCurrentAmount('');
    // Default 6 months from now
    const d = new Date();
    d.setMonth(d.getMonth() + 6);
    setTargetDate(d.toISOString().split('T')[0]);
    setCategory('Gadget');
    setDescription('');
    setIsCreateModalOpen(true);
  };

  const handleOpenEditModal = (goal) => {
    setActiveGoal(goal);
    setGoalName(goal.goalName);
    setTargetAmount(goal.targetAmount);
    setCurrentAmount(goal.currentAmount);
    setTargetDate(new Date(goal.targetDate).toISOString().split('T')[0]);
    setCategory(goal.category || 'Gadget');
    setDescription(goal.description || '');
    setIsCreateModalOpen(true);
  };

  const handleOpenDepositModal = (goal) => {
    setActiveGoal(goal);
    setDepositAmount('');
    setIsDepositModalOpen(true);
  };

  const handleGoalSubmit = async (e) => {
    e.preventDefault();
    if (!goalName || !targetAmount || !targetDate) return;
    setSubmitting(true);

    try {
      const payload = {
        goalName,
        targetAmount: Number(targetAmount),
        currentAmount: Number(currentAmount) || 0,
        targetDate,
        category,
        description,
      };

      if (activeGoal) {
        await goalApi.updateGoal(activeGoal._id, payload);
        success('Savings goal updated!');
      } else {
        await goalApi.createGoal(payload);
        success('New savings goal created!');
      }

      setIsCreateModalOpen(false);
      fetchGoals();
    } catch (err) {
      error(err.response?.data?.message || 'Failed to save goal');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDepositSubmit = async (e) => {
    e.preventDefault();
    if (!depositAmount || Number(depositAmount) <= 0) return;
    setSubmitting(true);

    try {
      await goalApi.addFunds(activeGoal._id, depositAmount);
      success(`Added ${formatCurrency(depositAmount, currencySymbol, currencyCode)} to ${activeGoal.goalName}!`);
      setIsDepositModalOpen(false);
      fetchGoals();
    } catch (err) {
      error(err.response?.data?.message || 'Failed to add funds');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await goalApi.deleteGoal(deleteTarget._id);
      success('Savings goal deleted');
      setDeleteTarget(null);
      fetchGoals();
    } catch (err) {
      error('Failed to delete goal');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-card">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
            Target Wealth Accumulation
          </span>
          <h2 className="text-2xl font-black text-navy-900 mt-0.5">Savings Goals</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Commit towards major life purchases, emergency reserves, and trips
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right sm:border-r sm:pr-6 sm:border-slate-100">
            <span className="text-xs text-slate-500 font-semibold block">Total Saved</span>
            <span className="text-2xl font-black text-emerald-600">
              {formatCurrency(totalSaved, currencySymbol, currencyCode)}
            </span>
          </div>

          <button
            onClick={handleOpenCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold shadow-md transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>Create Goal</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-card">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Cumulative Target
          </span>
          <p className="text-2xl font-extrabold text-navy-900 mt-1">
            {formatCurrency(totalTarget, currencySymbol, currencyCode)}
          </p>
          <span className="text-xs text-slate-500 mt-1 block">Goal sum across {goals.length} targets</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-card">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Funds Deposited
          </span>
          <p className="text-2xl font-extrabold text-emerald-600 mt-1">
            {formatCurrency(totalSaved, currencySymbol, currencyCode)}
          </p>
          <span className="text-xs text-slate-500 mt-1 block">{overallProgress}% funded so far</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-card">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Pending Balance
          </span>
          <p className="text-2xl font-extrabold text-amber-600 mt-1">
            {formatCurrency(Math.max(0, totalTarget - totalSaved), currencySymbol, currencyCode)}
          </p>
          <span className="text-xs text-slate-500 mt-1 block">To hit 100% financial targets</span>
        </div>
      </div>

      {/* Goals Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : goals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {goals.map((g) => {
            const Icon = categoryIcons[g.category] || Target;
            const isDone = g.isCompleted || g.percentage >= 100;

            return (
              <div
                key={g._id}
                className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card card-interactive flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shadow-sm">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-extrabold text-navy-900 leading-tight">
                          {g.goalName}
                        </h3>
                        <span className="text-xs text-slate-400 font-medium">
                          {g.category}
                        </span>
                      </div>
                    </div>

                    {isDone ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Achieved!
                      </span>
                    ) : (
                      <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                        {g.percentage}%
                      </span>
                    )}
                  </div>

                  {g.description && (
                    <p className="text-xs text-slate-500 mb-4 line-clamp-2 leading-relaxed">
                      {g.description}
                    </p>
                  )}

                  {/* Amounts */}
                  <div className="space-y-1 mb-4">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-500">Saved:</span>
                      <span className="font-extrabold text-emerald-600">
                        {formatCurrency(g.currentAmount, currencySymbol, currencyCode)}
                      </span>
                    </div>

                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-500">Target:</span>
                      <span className="text-navy-900 font-bold">
                        {formatCurrency(g.targetAmount, currencySymbol, currencyCode)}
                      </span>
                    </div>

                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-500">Deadline:</span>
                      <span className="text-slate-700">
                        {formatDate(g.targetDate)}{' '}
                        {g.daysRemaining > 0 && !isDone && (
                          <span className="text-[10px] text-slate-400">({g.daysRemaining} days left)</span>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden mb-5">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, g.percentage)}%` }}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <button
                    onClick={() => handleOpenDepositModal(g)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all active:scale-95"
                  >
                    <Coins className="w-3.5 h-3.5" />
                    <span>Add Money</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditModal(g)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-navy-900 hover:bg-slate-100 transition-colors"
                      title="Edit Goal"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(g)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete Goal"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={Target}
          title="No Savings Goals Yet"
          description="Create milestone targets like saving for a high-performance laptop, vehicle, emergency fund, or dream vacation."
          actionText="Create First Goal"
          onAction={handleOpenCreateModal}
        />
      )}

      {/* Add / Edit Goal Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title={activeGoal ? 'Edit Savings Goal' : 'Create New Savings Goal'}
      >
        <form onSubmit={handleGoalSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Goal Name
            </label>
            <input
              type="text"
              required
              value={goalName}
              onChange={(e) => setGoalName(e.target.value)}
              placeholder="e.g. MacBook Pro M3, Goa Vacation, Rainy Day Fund"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Target Amount ({currencySymbol})
              </label>
              <input
                type="number"
                required
                min="1"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                placeholder="e.g. 60000"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Current Saved ({currencySymbol})
              </label>
              <input
                type="number"
                min="0"
                value={currentAmount}
                onChange={(e) => setCurrentAmount(e.target.value)}
                placeholder="e.g. 15000"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
              >
                <option value="Gadget">Gadget</option>
                <option value="Emergency">Emergency Fund</option>
                <option value="Vehicle">Vehicle</option>
                <option value="Travel">Travel</option>
                <option value="Education">Education</option>
                <option value="Home">Home</option>
                <option value="Investment">Investment</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Target Date
              </label>
              <input
                type="date"
                required
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Description (Optional)
            </label>
            <textarea
              rows="2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Why is this goal important to you?"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            ></textarea>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-sm font-bold shadow-sm"
            >
              {submitting ? 'Saving...' : activeGoal ? 'Save Changes' : 'Create Goal'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Funds / Deposit Modal */}
      <Modal
        isOpen={isDepositModalOpen}
        onClose={() => setIsDepositModalOpen(false)}
        title={`Deposit Funds to "${activeGoal?.goalName}"`}
      >
        <form onSubmit={handleDepositSubmit} className="space-y-4">
          <p className="text-xs text-slate-500">
            Target: {formatCurrency(activeGoal?.targetAmount, currencySymbol, currencyCode)} | Currently
            Saved: {formatCurrency(activeGoal?.currentAmount, currencySymbol, currencyCode)}
          </p>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Deposit Amount ({currencySymbol})
            </label>
            <input
              type="number"
              required
              min="1"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              placeholder="e.g. 5000"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsDepositModalOpen(false)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-sm"
            >
              {submitting ? 'Adding...' : 'Confirm Deposit'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Savings Goal"
        message={`Are you sure you want to remove "${deleteTarget?.goalName}" (${formatCurrency(
          deleteTarget?.targetAmount,
          currencySymbol,
          currencyCode
        )})?`}
        confirmText="Delete Goal"
        loading={deleting}
      />
    </div>
  );
};

export default GoalsPage;
