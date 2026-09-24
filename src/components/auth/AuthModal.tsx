import React, { useState } from 'react';
import { X, Mail, Lock, User, ArrowRight, CheckCircle2, Sparkles, KeyRound } from 'lucide-react';
import { UserProfile } from '../../types/workflow';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [tab, setTab] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [email, setEmail] = useState('alex.morgan@company.io');
  const [password, setPassword] = useState('••••••••••••');
  const [name, setName] = useState('Alex Morgan');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    setTimeout(() => {
      setLoading(false);
      if (tab === 'forgot') {
        setFeedback('Password reset link sent to your email! (Simulated)');
        return;
      }

      const loggedInUser: UserProfile = {
        id: `usr_${Date.now()}`,
        name: tab === 'signup' ? name : 'Alex Morgan',
        email: email || 'alex.morgan@company.io',
        role: 'Automation Architect',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
        plan: 'pro',
        executionsThisMonth: 142,
        executionLimit: 10000,
        joinedDate: 'March 2026',
      };

      onLoginSuccess(loggedInUser);
      onClose();
    }, 600);
  };

  const handleDemoLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const demoUser: UserProfile = {
        id: 'usr_flowscale_01',
        name: 'Alex Morgan',
        email: 'alex.morgan@company.io',
        role: 'Head of Automation & AI',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
        plan: 'pro',
        executionsThisMonth: 142,
        executionLimit: 10000,
        joinedDate: 'January 2026',
      };
      onLoginSuccess(demoUser);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-2xl transition-all">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20 mb-3">
            <KeyRound className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            {tab === 'signin' && 'Welcome back to FlowScale AI'}
            {tab === 'signup' && 'Create your FlowScale AI account'}
            {tab === 'forgot' && 'Reset your password'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {tab === 'signin' && 'Sign in to access your agent chains and dashboard'}
            {tab === 'signup' && 'Get started with 50 free workflow runs per month'}
            {tab === 'forgot' && 'Enter your email to receive recovery instructions'}
          </p>
        </div>

        {/* 1-Click Demo Signin Pill */}
        {tab !== 'forgot' && (
          <div className="mb-5">
            <button
              onClick={handleDemoLogin}
              type="button"
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-blue-200 dark:border-blue-900/80 bg-blue-50/70 dark:bg-blue-950/40 p-2.5 text-xs font-semibold text-blue-700 dark:text-blue-300 hover:bg-blue-100/70 dark:hover:bg-blue-900/60 transition-colors"
            >
              <Sparkles className="h-4 w-4 text-blue-500" />
              <span>1-Click Instant Demo Login (Pro Account)</span>
            </button>
            <div className="relative my-4 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-800" />
              </div>
              <span className="relative bg-white dark:bg-slate-900 px-3 text-[11px] font-medium text-slate-400">
                or continue with email
              </span>
            </div>
          </div>
        )}

        {/* Feedback message */}
        {feedback && (
          <div className="mb-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 p-3 text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{feedback}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {tab === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Alex Morgan"
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {tab !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                {tab === 'signin' && (
                  <button
                    type="button"
                    onClick={() => setTab('forgot')}
                    className="text-[11px] font-medium text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700 active:scale-95 disabled:opacity-60 transition-all mt-2"
          >
            {loading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <>
                <span>
                  {tab === 'signin' && 'Sign In to Workspace'}
                  {tab === 'signup' && 'Create Free Account'}
                  {tab === 'forgot' && 'Send Reset Link'}
                </span>
                <ArrowRight className="h-3.5 w-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Footer switch tabs */}
        <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-4">
          {tab === 'signin' && (
            <p>
              Don't have an account?{' '}
              <button
                onClick={() => setTab('signup')}
                className="font-bold text-blue-600 dark:text-blue-400 hover:underline"
              >
                Sign up free
              </button>
            </p>
          )}
          {tab === 'signup' && (
            <p>
              Already have an account?{' '}
              <button
                onClick={() => setTab('signin')}
                className="font-bold text-blue-600 dark:text-blue-400 hover:underline"
              >
                Sign in
              </button>
            </p>
          )}
          {tab === 'forgot' && (
            <button
              onClick={() => setTab('signin')}
              className="font-bold text-blue-600 dark:text-blue-400 hover:underline"
            >
              ← Back to sign in
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
