import React from 'react';
import {
  LayoutDashboard,
  Workflow as WorkflowIcon,
  FolderGit2,
  ListOrdered,
  Sparkles,
  KeyRound,
  Settings as SettingsIcon,
  Zap,
  ChevronRight,
  TrendingUp,
  Layers,
} from 'lucide-react';
import { UserProfile } from '../../types/workflow';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  user: UserProfile | null;
  workflowCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  user,
  workflowCount,
}) => {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'builder',
      label: 'Visual Builder',
      icon: WorkflowIcon,
      badge: 'PRO',
      badgeColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    },
    {
      id: 'workflows',
      label: 'My Workflows',
      icon: FolderGit2,
      badge: workflowCount > 0 ? String(workflowCount) : null,
      badgeColor: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    },
    {
      id: 'logs',
      label: 'Execution Logs',
      icon: ListOrdered,
      badge: 'Live',
      badgeColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400',
    },
    {
      id: 'templates',
      label: 'Templates',
      icon: Sparkles,
      badge: '5 Prebuilt',
      badgeColor: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300',
    },
    {
      id: 'credentials',
      label: 'Credentials',
      icon: KeyRound,
      badge: null,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: SettingsIcon,
      badge: null,
    },
    {
      id: 'pricing',
      label: 'Upgrade',
      icon: Zap,
      badge: '20% OFF',
      badgeColor: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400',
    },
  ];

  const runsUsed = user?.executionsThisMonth || 0;
  const runsLimit = user?.executionLimit || 1000;
  const usagePercent = Math.min(100, Math.round((runsUsed / runsLimit) * 100));

  return (
    <aside className="w-64 shrink-0 hidden md:flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 h-[calc(100vh-4rem)] sticky top-16 select-none transition-colors">
      {/* Navigation menu list */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Workflow Automation
        </div>

        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 font-semibold shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`h-4 w-4 transition-colors ${
                    isActive
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    item.badgeColor || 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Usage Meter Card */}
      <div className="p-3 m-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
          <span className="flex items-center gap-1.5">
            <TrendingUp className="h-3.5 w-3.5 text-blue-500" /> Runs This Month
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            {runsUsed} / {runsLimit.toLocaleString()}
          </span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${usagePercent}%` }}
          />
        </div>
        <div className="mt-2.5 flex items-center justify-between">
          <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
            {user?.plan === 'pro' ? 'Pro Plan Active' : 'Free Tier (50/mo)'}
          </span>
          <button
            onClick={() => onNavigate('pricing')}
            className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5"
          >
            Upgrade <ChevronRight className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Bottom User Card */}
      {user && (
        <div className="border-t border-slate-200 dark:border-slate-800 p-3 flex items-center gap-3">
          <img
            src={user.avatar}
            alt={user.name}
            className="h-8 w-8 rounded-full object-cover ring-1 ring-blue-500/40"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
              {user.name}
            </p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">
              {user.role}
            </p>
          </div>
          <button
            onClick={() => onNavigate('settings')}
            title="Settings"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <SettingsIcon className="h-4 w-4" />
          </button>
        </div>
      )}
    </aside>
  );
};
