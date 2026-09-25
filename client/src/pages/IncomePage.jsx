import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  TrendingUp,
  ArrowUpDown,
  Edit2,
  Trash2,
  Calendar,
  DollarSign,
  Briefcase,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { incomeApi } from '../services/api';
import { formatCurrency } from '../utils/currency';
import { formatDate } from '../utils/formatters';
import Modal from '../components/common/Modal';
import ConfirmModal from '../components/common/ConfirmModal';
import { SkeletonTable } from '../components/common/SkeletonLoader';
import EmptyState from '../components/common/EmptyState';

const sources = ['All', 'Salary', 'Freelance', 'Business', 'Scholarship', 'Other'];

const IncomePage = () => {
  const { currencySymbol, currencyCode } = useAuth();
  const { success, error } = useToast();

  const [incomeList, setIncomeList] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedSource, setSelectedSource] = useState('All');
  const [sort, setSort] = useState('-date');

  // Add / Edit Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Delete Modal
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Form Fields
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [source, setSource] = useState('Salary');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const fetchIncome = async () => {
    try {
      setLoading(true);
      const res = await incomeApi.getIncome({
        source: selectedSource,
        search,
        sort,
      });
      if (res.data.success) {
        setIncomeList(res.data.income);
        setTotalAmount(res.data.totalAmount);
      }
    } catch (err) {
      error('Failed to load income entries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncome();
  }, [selectedSource, sort]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchIncome();
  };

  const handleOpenAddModal = () => {
    setEditingIncome(null);
    setAmount('');
    setDescription('');
    setSource('Salary');
    setDate(new Date().toISOString().split('T')[0]);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (inc) => {
    setEditingIncome(inc);
    setAmount(inc.amount);
    setDescription(inc.description);
    setSource(inc.source);
    setDate(new Date(inc.date).toISOString().split('T')[0]);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!amount || !description) return;
    setSubmitting(true);

    try {
      const payload = { amount, description, source, date };

      if (editingIncome) {
        await incomeApi.updateIncome(editingIncome._id, payload);
        success('Income updated successfully');
      } else {
        await incomeApi.createIncome(payload);
        success('Income added successfully');
      }

      setIsModalOpen(false);
      fetchIncome();
    } catch (err) {
      error(err.response?.data?.message || 'Failed to save income');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await incomeApi.deleteIncome(deleteTarget._id);
      success('Income deleted');
      setDeleteTarget(null);
      fetchIncome();
    } catch (err) {
      error('Failed to delete income entry');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-card">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
            Inflow Management
          </span>
          <h2 className="text-2xl font-black text-navy-900 mt-0.5">Income Streams</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Track salaries, freelance retainers, businesses, and scholarships
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right sm:border-r sm:pr-6 sm:border-slate-100">
            <span className="text-xs text-slate-500 font-semibold block">Total Inflow</span>
            <span className="text-2xl font-black text-emerald-600">
              {formatCurrency(totalAmount, currencySymbol, currencyCode)}
            </span>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Income</span>
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-card space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <form onSubmit={handleSearchSubmit} className="flex-1 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search income by description or client..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </form>

          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="-date">Newest First</option>
              <option value="date">Oldest First</option>
              <option value="-amount">Highest Amount</option>
              <option value="amount">Lowest Amount</option>
            </select>
          </div>
        </div>

        {/* Source Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 font-bold uppercase text-[10px] mr-1 shrink-0">
            Source:
          </span>
          {sources.map((src) => (
            <button
              key={src}
              onClick={() => setSelectedSource(src)}
              className={`px-3 py-1.5 rounded-xl font-semibold shrink-0 transition-all ${
                selectedSource === src
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {src}
            </button>
          ))}
        </div>
      </div>

      {/* Income Table */}
      {loading ? (
        <SkeletonTable rows={5} />
      ) : incomeList.length > 0 ? (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-5">Source & Details</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 text-right">Amount</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {incomeList.map((inc) => (
                  <tr key={inc._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="font-bold text-navy-900">{inc.description}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <Briefcase className="w-3 h-3" />
                        {inc.source}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-500 font-medium">
                      {formatDate(inc.date)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-black text-emerald-600 text-base">
                      +{formatCurrency(inc.amount, currencySymbol, currencyCode)}
                    </td>
                    <td className="py-3.5 px-5 text-right space-x-1">
                      <button
                        onClick={() => handleOpenEditModal(inc)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-navy-900 hover:bg-slate-100 transition-colors"
                        title="Edit income"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(inc)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete income"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState
          icon={TrendingUp}
          title="No Income Recorded"
          description="Log your primary salary, freelance revenues, or investments to track your total cash flow."
          actionText="Add Income Entry"
          onAction={handleOpenAddModal}
        />
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingIncome ? 'Edit Income Entry' : 'Record New Income'}
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Amount ({currencySymbol})
            </label>
            <input
              type="number"
              step="0.01"
              required
              min="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
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
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Monthly Salary, Freelance Frontend Retainer"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Source
              </label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
              >
                {sources
                  .filter((s) => s !== 'All')
                  .map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Date
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
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
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-sm"
            >
              {submitting ? 'Saving...' : editingIncome ? 'Save Changes' : 'Record Income'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Income"
        message={`Are you sure you want to remove "${deleteTarget?.description}" (+${formatCurrency(
          deleteTarget?.amount,
          currencySymbol,
          currencyCode
        )})?`}
        confirmText="Delete Income"
        loading={deleting}
      />
    </div>
  );
};

export default IncomePage;
