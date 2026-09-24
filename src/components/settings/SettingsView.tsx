import React, { useState } from 'react';
import {
  User,
  Mail,
  Shield,
  Bell,
  Download,
  Trash2,
  CheckCircle2,
  Save,
  Moon,
  Sun,
  Laptop,
} from 'lucide-react';
import { UserProfile } from '../../types/workflow';

interface SettingsViewProps {
  user: UserProfile | null;
  onUpdateUser: (updatedUser: UserProfile) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onExportAllData: () => void;
  onResetWorkspace: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  user,
  onUpdateUser,
  theme,
  onToggleTheme,
  onExportAllData,
  onResetWorkspace,
}) => {
  const [name, setName] = useState(user?.name || 'Alex Morgan');
  const [email, setEmail] = useState(user?.email || 'alex.morgan@company.io');
  const [role, setRole] = useState(user?.role || 'Head of Automation & AI');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [slackAlerts, setSlackAlerts] = useState(true);
  const [savedFeedback, setSavedFeedback] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const updated: UserProfile = {
      ...user,
      name,
      email,
      role,
      avatar,
    };
    onUpdateUser(updated);
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Account & Workspace Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your personal profile, notification preferences, and workspace data.
          </p>
        </div>

        {savedFeedback && (
          <div className="flex items-center gap-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950 px-3.5 py-2 text-xs font-bold text-emerald-600 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="h-4 w-4" />
            <span>Profile Updated!</span>
          </div>
        )}
      </div>

      {/* Profile Card */}
      <form onSubmit={handleSaveProfile} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-6">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <User className="h-4 w-4 text-blue-500" />
          User Profile
        </h3>

        <div className="flex items-center gap-4">
          <img
            src={avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'}
            alt="Avatar"
            className="h-16 w-16 rounded-full object-cover ring-2 ring-blue-500/50"
          />
          <div className="flex-1">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Avatar Image URL
            </label>
            <input
              type="url"
              value={avatar}
              onChange={e => setAvatar(e.target.value)}
              placeholder="https://..."
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Role / Title
            </label>
            <input
              type="text"
              value={role}
              onChange={e => setRole(e.target.value)}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 transition-colors shadow-xs"
          >
            <Save className="h-3.5 w-3.5" />
            <span>Save Profile</span>
          </button>
        </div>
      </form>

      {/* Appearance Settings */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sun className="h-4 w-4 text-amber-500" />
          Appearance & Theme
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Switch between Light Mode and Dark Mode for optimal canvas readability.
        </p>

        <div className="flex gap-4 pt-2">
          <button
            onClick={() => {
              if (theme !== 'light') onToggleTheme();
            }}
            className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all ${
              theme === 'light'
                ? 'border-blue-600 bg-blue-50/60 text-blue-700 shadow-xs'
                : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            <Sun className="h-4 w-4 text-amber-500" /> Light Mode
          </button>

          <button
            onClick={() => {
              if (theme !== 'dark') onToggleTheme();
            }}
            className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all ${
              theme === 'dark'
                ? 'border-blue-600 bg-blue-950/60 text-blue-300 shadow-xs'
                : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            <Moon className="h-4 w-4 text-blue-400" /> Dark Mode
          </button>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Bell className="h-4 w-4 text-indigo-500" />
          Notifications & Alerts
        </h3>

        <div className="space-y-3 pt-2">
          <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40">
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                Workflow Failure Alerts
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Receive instant email notification if any production node aborts.
              </span>
            </div>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={e => setEmailAlerts(e.target.checked)}
              className="h-4 w-4 accent-blue-600 rounded"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40">
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                Daily Run Summary
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Daily digest of executed pipelines, tokens consumed, and success rates.
              </span>
            </div>
            <input
              type="checkbox"
              checked={slackAlerts}
              onChange={e => setSlackAlerts(e.target.checked)}
              className="h-4 w-4 accent-blue-600 rounded"
            />
          </label>
        </div>
      </div>

      {/* Data Management & Export */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Download className="h-4 w-4 text-emerald-500" />
          Workspace Data & Backups
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Export your entire pipeline catalog, node configurations, and execution logs as JSON.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={onExportAllData}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
          >
            <Download className="h-3.5 w-3.5 text-blue-500" />
            <span>Export Complete Workspace Backup</span>
          </button>

          <button
            onClick={onResetWorkspace}
            className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20 px-4 py-2 text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-100/50"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Reset Workspace to Defaults</span>
          </button>
        </div>
      </div>
    </div>
  );
};
