import React, { useState } from 'react';
import {
  CheckCircle2,
  Zap,
  Sparkles,
  ArrowRight,
  Shield,
  HelpCircle,
  X,
  CreditCard,
  Lock,
} from 'lucide-react';
import { UserProfile } from '../../types/workflow';

interface PricingViewProps {
  user: UserProfile | null;
  onUpgradePlan: (plan: 'free' | 'pro' | 'enterprise') => void;
}

export const PricingView: React.FC<PricingViewProps> = ({ user, onUpgradePlan }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [checkoutPlan, setCheckoutPlan] = useState<'pro' | 'enterprise' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const isPro = user?.plan === 'pro';
  const isEnterprise = user?.plan === 'enterprise';

  const handleConfirmUpgrade = () => {
    if (!checkoutPlan) return;
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onUpgradePlan(checkoutPlan);
      setCheckoutPlan(null);
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3500);
    }, 1000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-12 max-w-7xl mx-auto text-center">
      {/* Celebration Banner if recently upgraded */}
      {showCelebration && (
        <div className="rounded-2xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950 p-4 text-emerald-800 dark:text-emerald-200 flex items-center justify-center gap-3 animate-bounce">
          <Sparkles className="h-5 w-5 text-emerald-500" />
          <span className="text-sm font-bold">
            🎉 Congratulations! Your plan has been upgraded successfully. Unlimited executions unlocked!
          </span>
        </div>
      )}

      {/* Header */}
      <div className="max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 dark:bg-blue-950/80 px-3 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-3">
          <Zap className="h-3.5 w-3.5 fill-current" />
          <span>Flexible Plans for High-Velocity Teams</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white">
          Simple, Transparent SaaS Pricing
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400">
          Scale your autonomous agent chains seamlessly. Upgrade, downgrade, or cancel anytime.
        </p>

        {/* Billing cycle toggle */}
        <div className="mt-8 inline-flex items-center gap-3 rounded-full bg-slate-200/80 dark:bg-slate-800/80 p-1">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
              billingCycle === 'monthly'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setBillingCycle('annual')}
            className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all flex items-center gap-1.5 ${
              billingCycle === 'annual'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>Annual Billing</span>
            <span className="rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 text-[10px] px-1.5 py-0.2">
              Save 20%
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto text-left">
        {/* Free Plan */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Free Starter</h3>
              {user?.plan === 'free' && (
                <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-[11px] font-bold text-slate-600 dark:text-slate-300">
                  Current Plan
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              For solo builders experimenting with autonomous agent chains.
            </p>

            <div className="mt-6">
              <span className="text-4xl font-extrabold text-slate-900 dark:text-white">$0</span>
              <span className="text-xs text-slate-400"> / month</span>
            </div>

            <ul className="mt-6 space-y-3 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>50 workflow executions / month</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Interactive Visual Workflow Builder</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Standard AI Nodes (Summarizer, Sentiment)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>All 5 Prebuilt Templates</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Community Discord Support</span>
              </li>
            </ul>
          </div>

          <button
            disabled={user?.plan === 'free'}
            onClick={() => onUpgradePlan('free')}
            className="mt-8 w-full rounded-xl border border-slate-300 dark:border-slate-700 py-2.5 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 transition-colors"
          >
            {user?.plan === 'free' ? 'Current Plan' : 'Downgrade to Free'}
          </button>
        </div>

        {/* Pro Plan (Featured) */}
        <div className="relative rounded-2xl border-2 border-blue-600 bg-white dark:bg-slate-900 p-8 flex flex-col justify-between shadow-xl shadow-blue-500/10 scale-102">
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-3.5 py-0.5 text-[11px] font-bold text-white uppercase tracking-wider shadow-sm">
            Most Popular Choice
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Pro Builder</h3>
              {isPro && (
                <span className="rounded-full bg-blue-50 dark:bg-blue-950 px-2.5 py-0.5 text-[11px] font-bold text-blue-600 dark:text-blue-400">
                  Current Plan
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              For teams, agencies, and high-frequency production automations.
            </p>

            <div className="mt-6">
              <span className="text-4xl font-extrabold text-slate-900 dark:text-white">
                {billingCycle === 'annual' ? '$39' : '$49'}
              </span>
              <span className="text-xs text-slate-400"> / month</span>
              {billingCycle === 'annual' && (
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                  Billed annually ($468/yr)
                </p>
              )}
            </div>

            <ul className="mt-6 space-y-3 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span><strong>Unlimited</strong> workflow executions</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Direct Gemini 2.5 & OpenAI API Key usage</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>High-throughput Webhook Ingestion</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Slack, Notion & REST Export Nodes</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Priority email support & 99.9% uptime SLA</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => setCheckoutPlan('pro')}
            className={`mt-8 w-full rounded-xl py-2.5 text-xs font-bold transition-all ${
              isPro
                ? 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-500/20 active:scale-95'
            }`}
          >
            {isPro ? 'Pro Plan Active' : 'Upgrade to Pro'}
          </button>
        </div>

        {/* Enterprise Plan */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Enterprise</h3>
              {isEnterprise && (
                <span className="rounded-full bg-purple-50 dark:bg-purple-950 px-2.5 py-0.5 text-[11px] font-bold text-purple-600 dark:text-purple-400">
                  Current Plan
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              For enterprises needing dedicated infrastructure, SSO, and custom SLAs.
            </p>

            <div className="mt-6">
              <span className="text-4xl font-extrabold text-slate-900 dark:text-white">
                {billingCycle === 'annual' ? '$159' : '$199'}
              </span>
              <span className="text-xs text-slate-400"> / month</span>
              {billingCycle === 'annual' && (
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                  Billed annually ($1,908/yr)
                </p>
              )}
            </div>

            <ul className="mt-6 space-y-3 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Unlimited everything + dedicated runner node</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Custom Private Model Endpoints (vLLM / Bedrock)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>SSO / SAML 2.0 & Role-Based Access Control</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Dedicated Enterprise Solutions Architect</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Custom Contract, Invoicing & SOC2 Type II</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => setCheckoutPlan('enterprise')}
            className="mt-8 w-full rounded-xl border border-slate-300 dark:border-slate-700 py-2.5 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            {isEnterprise ? 'Enterprise Active' : 'Upgrade to Enterprise'}
          </button>
        </div>
      </div>

      {/* UPGRADE CHECKOUT MODAL */}
      {checkoutPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl text-left">
            <button
              onClick={() => setCheckoutPlan(null)}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                <CreditCard className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Confirm Upgrade to {checkoutPlan === 'pro' ? 'Pro Builder' : 'Enterprise'}
                </h3>
                <p className="text-xs text-slate-500">
                  {billingCycle === 'annual' ? 'Billed annually with 20% discount' : 'Billed monthly'}
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 mb-4 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Selected Plan:</span>
                <span className="font-bold text-slate-900 dark:text-white capitalize">{checkoutPlan}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Total Price:</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">
                  {checkoutPlan === 'pro'
                    ? billingCycle === 'annual' ? '$39 / month ($468 billed now)' : '$49 / month'
                    : billingCycle === 'annual' ? '$159 / month' : '$199 / month'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Billing Account:</span>
                <span className="text-slate-900 dark:text-white font-mono">{user?.email}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-5">
              <Lock className="h-3.5 w-3.5 text-emerald-500" />
              <span>Simulated 256-bit SSL encrypted checkout. No real card charge.</span>
            </div>

            <button
              onClick={handleConfirmUpgrade}
              disabled={isProcessing}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-xs font-bold text-white shadow-md hover:bg-blue-700 disabled:opacity-60 transition-all"
            >
              {isProcessing ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Activating Plan...</span>
                </>
              ) : (
                <>
                  <span>Activate {checkoutPlan === 'pro' ? 'Pro' : 'Enterprise'} Now</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
