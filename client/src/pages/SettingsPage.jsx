import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Lock,
  Moon,
  Sun,
  Coins,
  Shield,
  Trash2,
  Sparkles,
  LogOut,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { authApi, seedApi } from '../services/api';
import ConfirmModal from '../components/common/ConfirmModal';

const currencies = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee (₹ INR)' },
  { code: 'USD', symbol: '$', name: 'US Dollar ($ USD)' },
  { code: 'EUR', symbol: '€', name: 'Euro (€ EUR)' },
  { code: 'GBP', symbol: '£', name: 'British Pound (£ GBP)' },
];

const SettingsPage = () => {
  const { user, updateProfile, logout } = useAuth();
  const { success, error, info } = useToast();
  const navigate = useNavigate();

  // Profile fields
  const [name, setName] = useState(user?.name || '');
  const [profileSaving, setProfileSaving] = useState(false);

  // Preference fields
  const [currency, setCurrency] = useState(user?.preferences?.currency || 'INR');
  const [theme, setTheme] = useState(user?.preferences?.theme || 'light');

  // Security password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);

  // Data reset modal
  const [showClearModal, setShowClearModal] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    try {
      await updateProfile({
        name,
        preferences: {
          currency,
          theme,
        },
      });
      success('Profile & preferences updated successfully');
    } catch (err) {
      error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setProfileSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      error('New passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      error('New password must be at least 6 characters');
      return;
    }

    setPasswordSaving(true);
    try {
      await authApi.changePassword({ currentPassword, newPassword });
      success('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err) {
      error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleSeedData = async () => {
    setSeeding(true);
    try {
      await seedApi.seedDemoData();
      success('Sample Indian financial records seeded into your account!');
      navigate('/dashboard');
    } catch (err) {
      error('Failed to seed demo records');
    } finally {
      setSeeding(false);
    }
  };

  const handleClearDataConfirm = async () => {
    setClearing(true);
    try {
      await seedApi.clearData();
      success('All financial transactions, budgets, and goals cleared.');
      setShowClearModal(false);
      navigate('/dashboard');
    } catch (err) {
      error('Failed to clear data');
    } finally {
      setClearing(false);
    }
  };

  const handleLogout = () => {
    logout();
    info('Logged out from SmartWealth');
    navigate('/login');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-card">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-600">
          Preferences & Security
        </span>
        <h2 className="text-2xl font-black text-navy-900 mt-0.5">Account Settings</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage your personal profile, primary currency symbol, theme, security, and demo data
        </p>
      </div>

      {/* Profile & Preferences Form */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-card">
        <h3 className="text-lg font-extrabold text-navy-900 mb-5 flex items-center gap-2">
          <User className="w-5 h-5 text-emerald-600" />
          <span>Profile & Financial Preferences</span>
        </h3>

        <form onSubmit={handleUpdateProfile} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50 text-slate-500 cursor-not-allowed font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                Default Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white font-medium"
              >
                {currencies.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                Interface Theme
              </label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white font-medium"
              >
                <option value="light">Light Theme (Default Clean)</option>
                <option value="dark">Dark Theme (Night Mode)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              disabled={profileSaving}
              className="px-5 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold shadow-sm transition-all active:scale-95"
            >
              {profileSaving ? 'Saving Changes...' : 'Save Profile Preferences'}
            </button>
          </div>
        </form>
      </div>

      {/* Security & Password Change */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-card">
        <h3 className="text-lg font-extrabold text-navy-900 mb-5 flex items-center gap-2">
          <Lock className="w-5 h-5 text-emerald-600" />
          <span>Security & Password</span>
        </h3>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
              Current Password
            </label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                New Password
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="Re-type new password"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              disabled={passwordSaving}
              className="px-5 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold shadow-sm transition-all active:scale-95"
            >
              {passwordSaving ? 'Updating Password...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>

      {/* Demo & Data Management Section */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-card space-y-4">
        <h3 className="text-lg font-extrabold text-navy-900 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-600" />
          <span>Demo Data & Testing Utilities</span>
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          Quickly populate or wipe financial records for testing, demonstrations, or academic
          evaluation.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleSeedData}
            disabled={seeding}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold transition-all active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>{seeding ? 'Seeding Data...' : 'Seed Sample Indian Data'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowClearModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold transition-all active:scale-95"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear All My Data</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-bold transition-all active:scale-95 ml-auto"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* Clear Data Confirmation Modal */}
      <ConfirmModal
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
        onConfirm={handleClearDataConfirm}
        title="Clear All Financial Records"
        message="This will permanently delete all your expenses, income entries, budgets, goals, and split groups. Are you sure you want to start fresh?"
        confirmText="Clear All Data"
        loading={clearing}
      />
    </div>
  );
};

export default SettingsPage;
