import React, { useState, useEffect } from 'react';
import {
  Users,
  Plus,
  Trash2,
  CheckCircle2,
  ArrowRight,
  Receipt,
  UserCheck,
  CreditCard,
  Check,
  ChevronRight,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { splitApi } from '../services/api';
import { formatCurrency } from '../utils/currency';
import { formatDate } from '../utils/formatters';
import { StatusBadge } from '../components/common/Badge';
import Modal from '../components/common/Modal';
import ConfirmModal from '../components/common/ConfirmModal';
import { SkeletonCard } from '../components/common/SkeletonLoader';
import EmptyState from '../components/common/EmptyState';

const SplitterPage = () => {
  const { currencySymbol, currencyCode } = useAuth();
  const { success, error } = useToast();

  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [selectedGroupData, setSelectedGroupData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [groupLoading, setGroupLoading] = useState(false);

  // Modals
  const [isNewGroupModalOpen, setIsNewGroupModalOpen] = useState(false);
  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false);
  const [deleteGroupTarget, setDeleteGroupTarget] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // New Group Form
  const [groupName, setGroupName] = useState('');
  const [groupDesc, setGroupDesc] = useState('');
  const [membersInput, setMembersInput] = useState('Rahul, Krishna, Priya, Vivek');

  // Add Shared Expense Form
  const [expDesc, setExpDesc] = useState('');
  const [expAmount, setExpAmount] = useState('');
  const [expPaidBy, setExpPaidBy] = useState('');
  const [expSplitAmong, setExpSplitAmong] = useState([]);

  const fetchGroups = async (selectFirst = false) => {
    try {
      setLoading(true);
      const res = await splitApi.getGroups();
      if (res.data.success) {
        setGroups(res.data.groups);
        if (res.data.groups.length > 0) {
          const targetId = selectFirst || !selectedGroupId ? res.data.groups[0]._id : selectedGroupId;
          setSelectedGroupId(targetId);
          fetchSingleGroup(targetId);
        } else {
          setSelectedGroupId(null);
          setSelectedGroupData(null);
        }
      }
    } catch (err) {
      error('Failed to load expense groups');
    } finally {
      setLoading(false);
    }
  };

  const fetchSingleGroup = async (id) => {
    if (!id) return;
    try {
      setGroupLoading(true);
      const res = await splitApi.getGroupById(id);
      if (res.data.success) {
        setSelectedGroupData(res.data.group);
        if (res.data.group.members.length > 0) {
          setExpPaidBy(res.data.group.members[0]);
          setExpSplitAmong(res.data.group.members);
        }
      }
    } catch (err) {
      error('Failed to load group details');
    } finally {
      setGroupLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups(true);
  }, []);

  const handleSelectGroup = (id) => {
    setSelectedGroupId(id);
    fetchSingleGroup(id);
  };

  const handleCreateGroupSubmit = async (e) => {
    e.preventDefault();
    const members = membersInput
      .split(',')
      .map((m) => m.trim())
      .filter(Boolean);

    if (members.length < 2) {
      error('Please enter at least 2 member names separated by commas');
      return;
    }

    setSubmitting(true);
    try {
      const res = await splitApi.createGroup({
        name: groupName,
        description: groupDesc,
        members,
      });
      success('Group created!');
      setIsNewGroupModalOpen(false);
      setGroupName('');
      setGroupDesc('');
      await fetchGroups();
      handleSelectGroup(res.data.group._id);
    } catch (err) {
      error(err.response?.data?.message || 'Failed to create group');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddExpenseSubmit = async (e) => {
    e.preventDefault();
    if (!expDesc || !expAmount || !expPaidBy) return;
    setSubmitting(true);

    try {
      await splitApi.addExpense(selectedGroupId, {
        description: expDesc,
        amount: expAmount,
        paidBy: expPaidBy,
        splitAmong: expSplitAmong.length > 0 ? expSplitAmong : selectedGroupData.members,
      });
      success('Shared expense recorded & split recalculated!');
      setIsAddExpenseModalOpen(false);
      setExpDesc('');
      setExpAmount('');
      fetchSingleGroup(selectedGroupId);
    } catch (err) {
      error(err.response?.data?.message || 'Failed to add shared expense');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleSettlement = async (settlement) => {
    try {
      await splitApi.toggleSettlement(selectedGroupId, {
        from: settlement.from,
        to: settlement.to,
        amount: settlement.amount,
      });
      success(`Updated settlement: ${settlement.from} → ${settlement.to}`);
      fetchSingleGroup(selectedGroupId);
    } catch (err) {
      error('Failed to update settlement status');
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    try {
      await splitApi.deleteExpense(selectedGroupId, expenseId);
      success('Expense removed');
      fetchSingleGroup(selectedGroupId);
    } catch (err) {
      error('Failed to remove expense');
    }
  };

  const handleDeleteGroupConfirm = async () => {
    if (!deleteGroupTarget) return;
    try {
      await splitApi.deleteGroup(deleteGroupTarget._id);
      success('Expense group deleted');
      setDeleteGroupTarget(null);
      fetchGroups(true);
    } catch (err) {
      error('Failed to delete group');
    }
  };

  const toggleParticipant = (member) => {
    setExpSplitAmong((prev) =>
      prev.includes(member) ? prev.filter((m) => m !== member) : [...prev, member]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-card">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600">
            Fair Debt Settlement
          </span>
          <h2 className="text-2xl font-black text-navy-900 mt-0.5">Expense Splitter</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Divide group bills, calculate optimal transfers, and settle debts with roommates or friends
          </p>
        </div>

        <button
          onClick={() => setIsNewGroupModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold shadow-md transition-all active:scale-95"
        >
          <Plus className="w-4 h-4 text-emerald-400" />
          <span>New Group</span>
        </button>
      </div>

      {/* Main Content Layout: Left Groups List + Right Active Group Workspace */}
      {groups.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Groups Selector */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
              Your Groups ({groups.length})
            </h3>

            <div className="space-y-2">
              {groups.map((g) => (
                <div
                  key={g._id}
                  onClick={() => handleSelectGroup(g._id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    selectedGroupId === g._id
                      ? 'bg-navy-900 text-white border-navy-800 shadow-md'
                      : 'bg-white text-slate-700 border-slate-100 hover:border-slate-300 shadow-sm'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <h4 className={`text-sm font-bold truncate ${selectedGroupId === g._id ? 'text-white' : 'text-navy-900'}`}>
                      {g.name}
                    </h4>
                    <p className={`text-xs mt-0.5 truncate ${selectedGroupId === g._id ? 'text-slate-300' : 'text-slate-500'}`}>
                      {g.membersCount} members • {formatCurrency(g.totalSpend, currencySymbol, currencyCode)} total
                    </p>
                  </div>

                  <ChevronRight className={`w-4 h-4 shrink-0 ${selectedGroupId === g._id ? 'text-emerald-400' : 'text-slate-400'}`} />
                </div>
              ))}
            </div>
          </div>

          {/* Right 2 Columns: Selected Group Calculations & Records */}
          <div className="lg:col-span-2 space-y-6">
            {selectedGroupData && (
              <>
                {/* Active Group Banner */}
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-extrabold text-navy-900 leading-tight">
                      {selectedGroupData.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Members: {selectedGroupData.members.join(', ')}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsAddExpenseModalOpen(true)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all active:scale-95"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Shared Expense</span>
                    </button>
                    <button
                      onClick={() => setDeleteGroupTarget(selectedGroupData)}
                      className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete Group"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Fair Settlement Matrix Card (Who owes whom) */}
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-card">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-emerald-600" />
                      <h4 className="text-base font-extrabold text-navy-900">
                        Fair Settlement Transfers (Who Owes Whom)
                      </h4>
                    </div>
                    <span className="text-xs font-semibold text-slate-400">
                      Optimal Minimization
                    </span>
                  </div>

                  {selectedGroupData.settlements.length > 0 ? (
                    <div className="space-y-3">
                      {selectedGroupData.settlements.map((s, idx) => (
                        <div
                          key={idx}
                          className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                            s.isSettled
                              ? 'bg-emerald-50/50 border-emerald-200/80 text-emerald-800'
                              : 'bg-slate-50 border-slate-100 text-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-navy-900">{s.from}</span>
                            <span className="text-xs text-slate-400 font-semibold">owes</span>
                            <span className="font-bold text-emerald-700">{s.to}</span>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="font-black text-sm text-navy-900">
                              {formatCurrency(s.amount, currencySymbol, currencyCode)}
                            </span>
                            <button
                              onClick={() => handleToggleSettlement(s)}
                              className={`inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                                s.isSettled
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                              }`}
                            >
                              {s.isSettled ? (
                                <>
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Settled</span>
                                </>
                              ) : (
                                <span>Mark Settled</span>
                              )}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-6 text-center text-xs text-slate-400">
                      Everyone is currently squared up! All expenses are settled equally.
                    </div>
                  )}
                </div>

                {/* Member Net Summary Table */}
                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card">
                  <h4 className="text-base font-extrabold text-navy-900 mb-4">
                    Member Balances Breakdown
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        <tr>
                          <th className="py-2.5 px-4 rounded-l-xl">Member</th>
                          <th className="py-2.5 px-4">Paid Total</th>
                          <th className="py-2.5 px-4">Fair Share</th>
                          <th className="py-2.5 px-4 text-right rounded-r-xl">Net Balance</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {selectedGroupData.memberSummary.map((m) => (
                          <tr key={m.name}>
                            <td className="py-3 px-4 font-bold text-navy-900">{m.name}</td>
                            <td className="py-3 px-4 text-slate-600">
                              {formatCurrency(m.totalPaid, currencySymbol, currencyCode)}
                            </td>
                            <td className="py-3 px-4 text-slate-600">
                              {formatCurrency(m.totalShare, currencySymbol, currencyCode)}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <StatusBadge status={m.status} />
                              <span
                                className={`ml-2 font-bold ${
                                  m.netBalance > 0
                                    ? 'text-teal-600'
                                    : m.netBalance < 0
                                    ? 'text-rose-600'
                                    : 'text-slate-400'
                                }`}
                              >
                                {m.netBalance > 0 ? '+' : ''}
                                {formatCurrency(m.netBalance, currencySymbol, currencyCode)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Group Expenses List */}
                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-base font-extrabold text-navy-900">
                      Shared Group Expenses ({selectedGroupData.expenses.length})
                    </h4>
                    <span className="text-xs text-slate-400">
                      Total: {formatCurrency(selectedGroupData.totalSpend, currencySymbol, currencyCode)}
                    </span>
                  </div>

                  {selectedGroupData.expenses.length > 0 ? (
                    <div className="divide-y divide-slate-100">
                      {selectedGroupData.expenses.map((exp) => (
                        <div key={exp._id} className="py-3 flex items-center justify-between">
                          <div>
                            <p className="text-sm font-bold text-navy-900">{exp.description}</p>
                            <p className="text-xs text-slate-500">
                              Paid by <span className="font-semibold text-emerald-700">{exp.paidBy}</span> •{' '}
                              Split among: {exp.splitAmong.join(', ')}
                            </p>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="text-sm font-black text-navy-900">
                              {formatCurrency(exp.amount, currencySymbol, currencyCode)}
                            </span>
                            <button
                              onClick={() => handleDeleteExpense(exp._id)}
                              className="p-1.5 rounded-lg text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Delete shared expense"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-6 text-center text-xs text-slate-400">
                      No group expenses logged yet. Click "+ Add Shared Expense" above.
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        <EmptyState
          icon={Users}
          title="No Expense Groups Created"
          description="Create a group for an upcoming trip, shared apartment groceries, or dinner outings to automatically calculate who owes whom."
          actionText="Create New Group"
          onAction={() => setIsNewGroupModalOpen(true)}
        />
      )}

      {/* Modal: Create Group */}
      <Modal
        isOpen={isNewGroupModalOpen}
        onClose={() => setIsNewGroupModalOpen(false)}
        title="Create Expense Sharing Group"
      >
        <form onSubmit={handleCreateGroupSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Group Name
            </label>
            <input
              type="text"
              required
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="e.g. Goa Trip 🏖️, Apartment 402, Hackathon Team"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Members (comma-separated)
            </label>
            <input
              type="text"
              required
              value={membersInput}
              onChange={(e) => setMembersInput(e.target.value)}
              placeholder="Rahul, Krishna, Priya, Vivek"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Enter at least 2 member names separated by commas
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Description (Optional)
            </label>
            <input
              type="text"
              value={groupDesc}
              onChange={(e) => setGroupDesc(e.target.value)}
              placeholder="e.g. Shared fuel, villa stay, and food"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsNewGroupModalOpen(false)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-sm font-bold shadow-sm"
            >
              {submitting ? 'Creating...' : 'Create Group'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Add Shared Expense */}
      <Modal
        isOpen={isAddExpenseModalOpen}
        onClose={() => setIsAddExpenseModalOpen(false)}
        title={`Add Expense to ${selectedGroupData?.name}`}
      >
        <form onSubmit={handleAddExpenseSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Description
            </label>
            <input
              type="text"
              required
              value={expDesc}
              onChange={(e) => setExpDesc(e.target.value)}
              placeholder="e.g. Beach Shack Dinner, Highway Tolls, Villa Stay"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Amount ({currencySymbol})
              </label>
              <input
                type="number"
                step="0.01"
                required
                min="0.01"
                value={expAmount}
                onChange={(e) => setExpAmount(e.target.value)}
                placeholder="e.g. 1500"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Paid By
              </label>
              <select
                value={expPaidBy}
                onChange={(e) => setExpPaidBy(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
              >
                {selectedGroupData?.members.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
              Split Among ({expSplitAmong.length} selected)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {selectedGroupData?.members.map((m) => {
                const isSelected = expSplitAmong.includes(m);
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => toggleParticipant(m)}
                    className={`p-2 rounded-xl text-xs font-semibold text-left border flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                        : 'bg-slate-50 border-slate-200 text-slate-400'
                    }`}
                  >
                    <span>{m}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAddExpenseModalOpen(false)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-sm font-bold shadow-sm"
            >
              {submitting ? 'Recording...' : 'Add Expense & Split'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Group Modal */}
      <ConfirmModal
        isOpen={!!deleteGroupTarget}
        onClose={() => setDeleteGroupTarget(null)}
        onConfirm={handleDeleteGroupConfirm}
        title="Delete Expense Group"
        message={`Are you sure you want to remove "${deleteGroupTarget?.name}" and all of its shared expenses?`}
        confirmText="Delete Group"
      />
    </div>
  );
};

export default SplitterPage;
