import React, { useState } from 'react';
import {
  Workflow as WorkflowIcon,
  Sun,
  Moon,
  Plus,
  Play,
  User,
  LogOut,
  ChevronDown,
  Layers,
  Sparkles,
  ExternalLink,
  Menu,
  X,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { UserProfile } from '../../types/workflow';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  user: UserProfile | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onNewWorkflow: () => void;
  onOpenQuickRun?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  user,
  onOpenAuth,
  onLogout,
  theme,
  onToggleTheme,
  onNewWorkflow,
  onOpenQuickRun,
}) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isLanding = currentView === 'landing';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/90 transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate(user ? 'dashboard' : 'landing')}
            className="group flex items-center gap-2.5 text-left focus:outline-none"
          >
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <WorkflowIcon className="h-5 w-5 text-white" />
              <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-cyan-400 border-2 border-white dark:border-slate-900 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                  FlowScale<span className="text-blue-600 dark:text-blue-400">AI</span>
                </span>
                <span className="hidden sm:inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 text-xs font-semibold text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  v2.4
                </span>
              </div>
              <p className="hidden md:block text-[11px] font-medium text-slate-500 dark:text-slate-400 -mt-0.5">
                Autonomous Agent Workflow Engine
              </p>
            </div>
          </button>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {isLanding ? (
            <>
              <button
                onClick={() => {
                  const el = document.getElementById('features-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-white transition-colors"
              >
                Features
              </button>
              <button
                onClick={() => {
                  const el = document.getElementById('how-it-works-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-white transition-colors"
              >
                How It Works
              </button>
              <button
                onClick={() => onNavigate('templates')}
                className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-white transition-colors flex items-center gap-1.5"
              >
                <span>Templates</span>
                <span className="rounded bg-blue-100 dark:bg-blue-900/50 px-1.5 py-0.5 text-[10px] font-bold text-blue-600 dark:text-blue-400">HOT</span>
              </button>
              <button
                onClick={() => onNavigate('pricing')}
                className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-white transition-colors"
              >
                Pricing
              </button>
              <button
                onClick={() => {
                  const el = document.getElementById('faq-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-white transition-colors"
              >
                FAQ
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => onNavigate('dashboard')}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  currentView === 'dashboard'
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => onNavigate('workflows')}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  currentView === 'workflows'
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                My Workflows
              </button>
              <button
                onClick={() => onNavigate('builder')}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  currentView === 'builder'
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Visual Builder
              </button>
              <button
                onClick={() => onNavigate('logs')}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  currentView === 'logs'
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Execution Logs
              </button>
              <button
                onClick={() => onNavigate('templates')}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  currentView === 'templates'
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Templates
              </button>
            </>
          )}
        </nav>

        {/* Right Action Icons & Auth */}
        <div className="flex items-center gap-2.5">
          {/* Dark / Light Toggle */}
          <button
            onClick={onToggleTheme}
            aria-label="Toggle theme"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-slate-600" />
            )}
          </button>

          {user ? (
            <div className="flex items-center gap-2">
              {/* Quick Action: New Workflow */}
              <button
                onClick={onNewWorkflow}
                className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 active:scale-95 transition-all"
              >
                <Plus className="h-4 w-4" />
                <span>New Workflow</span>
              </button>

              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-800 p-1 pr-2 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-7 w-7 rounded-full object-cover ring-1 ring-blue-500"
                  />
                  <span className="hidden md:block text-xs font-semibold text-slate-700 dark:text-slate-200 max-w-[100px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 shadow-xl z-50">
                    <div className="border-b border-slate-100 dark:border-slate-800 pb-2 px-3 pt-1">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{user.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="inline-flex items-center gap-1 rounded bg-blue-50 dark:bg-blue-950/70 px-2 py-0.5 text-[11px] font-semibold text-blue-600 dark:text-blue-400 uppercase">
                          <Zap className="h-3 w-3" /> {user.plan} Plan
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {user.executionsThisMonth} runs
                        </span>
                      </div>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          onNavigate('dashboard');
                        }}
                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <Layers className="h-4 w-4 text-blue-500" />
                        Workspace Dashboard
                      </button>
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          onNavigate('credentials');
                        }}
                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <ShieldCheck className="h-4 w-4 text-indigo-500" />
                        API Keys & Credentials
                      </button>
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          onNavigate('settings');
                        }}
                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <User className="h-4 w-4 text-slate-400" />
                        Account Settings
                      </button>
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          onNavigate('pricing');
                        }}
                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <Sparkles className="h-4 w-4 text-amber-500" />
                        Upgrade Plan
                      </button>
                    </div>

                    <div className="border-t border-slate-100 dark:border-slate-800 pt-1">
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          onLogout();
                        }}
                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30"
                      >
                        <LogOut className="h-4 w-4" />
                        Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenAuth}
                className="px-3.5 py-1.5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={onOpenAuth}
                className="rounded-lg bg-blue-600 px-4 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 active:scale-95 transition-all"
              >
                Start Free
              </button>
            </div>
          )}

          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-6 space-y-2">
          {user ? (
            <>
              <button
                onClick={() => {
                  onNavigate('dashboard');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Dashboard
              </button>
              <button
                onClick={() => {
                  onNavigate('builder');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Visual Workflow Builder
              </button>
              <button
                onClick={() => {
                  onNavigate('workflows');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                My Workflows
              </button>
              <button
                onClick={() => {
                  onNavigate('logs');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Execution Logs
              </button>
              <button
                onClick={() => {
                  onNavigate('templates');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Workflow Templates
              </button>
              <button
                onClick={() => {
                  onNavigate('credentials');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Credentials & API Keys
              </button>
              <button
                onClick={() => {
                  onNavigate('pricing');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/20"
              >
                Upgrade to Pro
              </button>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => {
                    onNewWorkflow();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white"
                >
                  <Plus className="h-4 w-4" /> New Workflow
                </button>
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  onNavigate('landing');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-800 dark:text-slate-100"
              >
                Home
              </button>
              <button
                onClick={() => {
                  onNavigate('templates');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-800 dark:text-slate-100"
              >
                Explore Templates
              </button>
              <button
                onClick={() => {
                  onNavigate('pricing');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-800 dark:text-slate-100"
              >
                Pricing Plans
              </button>
              <button
                onClick={() => {
                  onOpenAuth();
                  setMobileMenuOpen(false);
                }}
                className="w-full mt-2 rounded-lg bg-blue-600 px-4 py-2 text-center text-sm font-semibold text-white"
              >
                Get Started Free
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
};
