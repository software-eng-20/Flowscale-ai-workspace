import React, { useState } from 'react';
import {
  ArrowRight,
  Sparkles,
  Zap,
  Play,
  CheckCircle2,
  Workflow as WorkflowIcon,
  Shield,
  Layers,
  Cpu,
  Share2,
  LifeBuoy,
  UserCheck,
  Compass,
  TrendingUp,
  FileCode,
  MessageSquare,
  Clock,
  HelpCircle,
  ChevronDown,
  Terminal,
} from 'lucide-react';
import { Workflow } from '../../types/workflow';
import { WORKFLOW_TEMPLATES } from '../../data/templates';

interface LandingPageProps {
  onStartFree: () => void;
  onExploreTemplates: () => void;
  onOpenTemplate: (template: Workflow) => void;
  onNavigate: (view: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartFree,
  onExploreTemplates,
  onOpenTemplate,
  onNavigate,
}) => {
  // Interactive Hero Workflow Chain Simulation state
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(-1);
  const [simulationLogs, setSimulationLogs] = useState<string[]>([]);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const heroPipelineNodes = [
    { title: 'Inbound Topic Trigger', type: 'Trigger', badge: 'Webhook', desc: 'Captures new prompt payload' },
    { title: 'Gemini 2.5 Flash Agent', type: 'AI Reasoning', badge: 'Multi-turn', desc: 'Synthesizes context & drafts' },
    { title: 'SEO Formatter & Schema', type: 'AI NLP', badge: 'Optimizer', desc: 'Extracts LSI keywords & meta' },
    { title: 'Slack & Webhook Dispatch', type: 'Action', badge: 'Export', desc: 'Delivers result to channel' },
  ];

  const handleRunHeroSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setActiveStep(0);
    setSimulationLogs(['[00:00.020] Trigger received: "Autonomous AI Agents in Enterprise Ops"']);

    setTimeout(() => {
      setActiveStep(1);
      setSimulationLogs(prev => [
        ...prev,
        '[00:00.640] Gemini 2.5 Flash processing context... 642 tokens generated.',
      ]);
    }, 700);

    setTimeout(() => {
      setActiveStep(2);
      setSimulationLogs(prev => [
        ...prev,
        '[00:01.320] SEO Optimizer verified: Meta tags created, 98/100 readability score.',
      ]);
    }, 1400);

    setTimeout(() => {
      setActiveStep(3);
      setSimulationLogs(prev => [
        ...prev,
        '[00:01.890] Dispatched webhook & notified #growth-marketing Slack successfully (HTTP 200 OK).',
      ]);
    }, 2100);

    setTimeout(() => {
      setIsSimulating(false);
    }, 2800);
  };

  const faqs = [
    {
      q: 'What is FlowScale AI and how does it work?',
      a: 'FlowScale AI is a modern visual workflow automation platform that lets you connect triggers (webhooks, email, scheduled timers) to multi-step AI reasoning agents (powered by Gemini, OpenAI, and custom processors) and dispatch the finalized data to Slack, Notion, webhooks, or downloaded files without writing complex backend code.',
    },
    {
      q: 'Can I bring my own Gemini or OpenAI API keys?',
      a: 'Yes! You can securely add your Gemini API key or OpenAI key in the Credentials tab. Your keys are encrypted locally and never leaked. If you do not have an API key yet, FlowScale includes built-in high-fidelity execution simulation out of the box.',
    },
    {
      q: 'How does FlowScale compare to Zapier or Make.com?',
      a: 'Unlike traditional linear webhook tools that struggle with AI prompt chaining and token context propagation, FlowScale is built specifically for autonomous agent chains with specialized AI nodes (Summarizers, Sentiment Extractors, Multi-lingual Translators, SEO Breakers) with real-time payload debugging.',
    },
    {
      q: 'What are the limits on the Free tier?',
      a: 'The Free tier grants 50 full pipeline executions per month, access to all standard templates, and visual canvas editing. You can upgrade to Pro for unlimited executions, high-concurrency queues, and priority execution.',
    },
    {
      q: 'Can I export workflows as JSON and share them with my team?',
      a: 'Absolutely. Every workflow can be exported as clean JSON schemas, imported into different workspaces, or triggered programmatically via our external REST webhook endpoints.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Glow ambient background elements */}
      <div className="relative isolate overflow-hidden pt-12 pb-20">
        <div
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80 pointer-events-none"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-blue-600 to-cyan-400 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>

        {/* HERO SECTION */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center pt-8 pb-12">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 dark:border-blue-800/80 bg-blue-50/80 dark:bg-blue-950/40 px-3.5 py-1 text-xs font-semibold text-blue-700 dark:text-blue-300 mb-6 backdrop-blur-xs">
            <Sparkles className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
            <span>Next-Generation Visual Agent Orchestration Platform</span>
          </div>

          {/* Headline */}
          <h1 className="mx-auto max-w-4xl text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            Automate Your Work with{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">
              AI Workflow Chains
            </span>
          </h1>

          {/* Subheadline */}
          <p className="mx-auto mt-6 max-w-2xl text-lg sm:text-xl text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
            Build powerful multi-step AI agents and automations visually in minutes.
            No complex coding required.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onStartFree}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-500/25 hover:bg-blue-700 hover:shadow-blue-500/40 active:scale-95 transition-all"
            >
              <span>Start Building Free</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={onExploreTemplates}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-6 py-3.5 text-base font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-95 transition-all"
            >
              <WorkflowIcon className="h-4 w-4 text-blue-500" />
              <span>Explore Templates</span>
            </button>
          </div>

          <div className="mt-6 flex items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> No credit card required
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> 50 Free runs/month
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> 1-Click visual deployment
            </span>
          </div>

          {/* Interactive Hero Workflow Visualizer Card */}
          <div className="mt-14 mx-auto max-w-5xl rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-4 sm:p-6 shadow-2xl backdrop-blur-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-400/80" />
                  <div className="h-3 w-3 rounded-full bg-amber-400/80" />
                  <div className="h-3 w-3 rounded-full bg-emerald-400/80" />
                </div>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Live Interactive Pipeline Preview: <strong className="text-slate-800 dark:text-slate-200">Autonomous Content & SEO Chain</strong>
                </span>
              </div>
              <button
                onClick={handleRunHeroSimulation}
                disabled={isSimulating}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-60 transition-all self-start sm:self-auto"
              >
                {isSimulating ? (
                  <>
                    <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Executing Pipeline...</span>
                  </>
                ) : (
                  <>
                    <Play className="h-3.5 w-3.5 fill-current" />
                    <span>Run Live Test Simulation</span>
                  </>
                )}
              </button>
            </div>

            {/* Interactive node sequence */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
              {heroPipelineNodes.map((node, i) => {
                const isCurrent = activeStep === i;
                const isCompleted = activeStep > i;

                return (
                  <div
                    key={node.title}
                    className={`relative rounded-xl border p-4 text-left transition-all ${
                      isCurrent
                        ? 'border-blue-500 bg-blue-50/70 dark:bg-blue-950/40 shadow-lg shadow-blue-500/10 scale-102 ring-2 ring-blue-500/20'
                        : isCompleted
                        ? 'border-emerald-400/80 bg-emerald-50/40 dark:bg-emerald-950/20'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Step 0{i + 1} • {node.type}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isCurrent
                          ? 'bg-blue-500 text-white animate-pulse'
                          : isCompleted
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}>
                        {isCurrent ? 'Running...' : isCompleted ? 'Completed' : node.badge}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                      {node.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">
                      {node.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Terminal logs viewer */}
            <div className="mt-4 rounded-xl bg-slate-900 dark:bg-black p-3.5 text-left border border-slate-800">
              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-800 text-[11px] font-mono text-slate-400">
                <Terminal className="h-3.5 w-3.5 text-blue-400" />
                <span>Execution Output Console (Click "Run Live Test Simulation" to trigger)</span>
              </div>
              <div className="font-mono text-xs text-emerald-400 space-y-1 min-h-[52px]">
                {simulationLogs.length === 0 ? (
                  <span className="text-slate-500">Pipeline ready. Awaiting trigger signal...</span>
                ) : (
                  simulationLogs.map((log, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="text-blue-400 shrink-0">➜</span>
                      <span>{log}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* LOGOS / TRUSTED SECTION */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4 pb-16 text-center border-t border-slate-200/60 dark:border-slate-800/60">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-6">
            Empowering modern engineering, marketing, and operations teams worldwide
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14 text-slate-400 dark:text-slate-500 font-bold text-sm tracking-wide">
            <span className="flex items-center gap-1.5 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
              <Zap className="h-4 w-4 text-blue-500" /> ACME SCALE
            </span>
            <span className="flex items-center gap-1.5 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
              <Cpu className="h-4 w-4 text-indigo-500" /> SYNAPSE LABS
            </span>
            <span className="flex items-center gap-1.5 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
              <Layers className="h-4 w-4 text-cyan-500" /> CLOUDSTACK
            </span>
            <span className="flex items-center gap-1.5 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
              <Shield className="h-4 w-4 text-emerald-500" /> SENTINEL AI
            </span>
            <span className="flex items-center gap-1.5 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
              <Sparkles className="h-4 w-4 text-amber-500" /> HYPERFLOW
            </span>
          </div>
        </div>
      </div>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works-section" className="py-20 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 px-3 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-3">
            <span>Seamless 3-Step Workflow</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            How FlowScale AI Works
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-base text-slate-600 dark:text-slate-400">
            From raw input triggers to verified action dispatches in three intuitive stages.
          </p>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 p-8 text-left hover:border-blue-400 transition-all group">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white mb-6 group-hover:scale-110 transition-transform">
                <Zap className="h-6 w-6" />
              </div>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                Step 1
              </span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1 mb-2">
                1. Connect Triggers
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Kickstart automations with manual prompt inputs, HTTP Webhooks (from Stripe, Shopify, GitHub), inbound email listeners, or automated cron timers.
              </p>
            </div>

            <div className="relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 p-8 text-left hover:border-indigo-400 transition-all group">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white mb-6 group-hover:scale-110 transition-transform">
                <Cpu className="h-6 w-6" />
              </div>
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                Step 2
              </span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1 mb-2">
                2. Chain AI Reasoning Nodes
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Pass payload data smoothly through multi-stage Gemini 2.5 Flash generators, AI bullet-point summarizers, sentiment classifiers, and SEO optimizers.
              </p>
            </div>

            <div className="relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 p-8 text-left hover:border-cyan-400 transition-all group">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-600 text-white mb-6 group-hover:scale-110 transition-transform">
                <Share2 className="h-6 w-6" />
              </div>
              <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
                Step 3
              </span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1 mb-2">
                3. Dispatch Action Anywhere
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Post formatted notifications to Slack or Notion, dispatch structured JSON webhooks to your database, or export clean Markdown files instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CORE WORKFLOW FEATURES */}
      <section id="features-section" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 px-3 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-3">
              <span>Enterprise-Grade Architecture</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Built for Speed, Reliability, & Precision
            </h2>
            <p className="mt-4 text-base text-slate-600 dark:text-slate-400">
              Everything you need to orchestrate autonomous AI pipelines at scale.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 mb-4">
                <Layers className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Visual Interactive Canvas
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Drag, arrange, and link trigger nodes, AI cognitive processors, and output dispatches with SVG wires and live connection states.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 mb-4">
                <Cpu className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Gemini 2.5 Flash Native
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Connect your Google Gemini API key or OpenAI keys directly. Leverage fast inference speeds with built-in token optimization.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 mb-4">
                <Clock className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Step-by-Step Live Execution
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Watch nodes pulse in real time as each step completes. Inspect input and output JSON payloads with 1-click syntax viewer.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 mb-4">
                <Shield className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Credential Masking & Security
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                API secrets are masked and stored securely in local workspace storage. We never log or leak your private integration keys.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 mb-4">
                <FileCode className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Multi-Format Outputs
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Export to clean Markdown, deliver webhooks to REST endpoints, send email summaries, or integrate directly with Slack & Notion.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-100 dark:bg-cyan-900/50 text-cyan-600 dark:text-cyan-400 mb-4">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Self-Healing & Error States
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Intuitive error catchers pinpoint failed nodes instantly, offering informative error logs and 1-click step re-runs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* POPULAR TEMPLATES SECTION */}
      <section className="py-20 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 px-3 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-3">
                <span>Production-Ready Blueprints</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                Popular Workflow Templates
              </h2>
              <p className="mt-2 text-base text-slate-600 dark:text-slate-400">
                Launch complete multi-agent workflows in a single click.
              </p>
            </div>
            <button
              onClick={onExploreTemplates}
              className="mt-4 sm:mt-0 inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline"
            >
              <span>View all templates</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {WORKFLOW_TEMPLATES.slice(0, 3).map(tpl => (
              <div
                key={tpl.id}
                className="flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="rounded-full bg-blue-50 dark:bg-blue-950/80 px-2.5 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
                    {tpl.category}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {tpl.nodes.length} Nodes
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {tpl.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6 flex-1">
                  {tpl.description}
                </p>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    ★ {tpl.successRate}% Success
                  </span>
                  <button
                    onClick={() => onOpenTemplate(tpl)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 px-3 py-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white transition-all"
                  >
                    <span>Use in Builder</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* USE CASES SECTION */}
      <section className="py-20 border-t border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Built for Every Operational Function
            </h2>
            <p className="mt-4 text-base text-slate-600 dark:text-slate-400">
              Eliminate repetitive manual busywork across your entire organization.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="h-10 w-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                <Share2 className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                Marketing & Social
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Repurpose long articles into high-engagement Twitter threads, LinkedIn carousels, and newsletter digests automatically.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="h-10 w-10 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4">
                <LifeBuoy className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                Customer Support
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Triage incoming customer tickets, gauge user sentiment, flag churn risks, and draft suggested response templates.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="h-10 w-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
                <UserCheck className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                Sales & Lead Gen
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Enrich inbound email signups with company background research and draft hyper-personalized founder outreach emails.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="h-10 w-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
                <Compass className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                Research & Strategy
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Synthesize industry reports and daily news on schedule, converting noise into concise executive morning briefings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section className="py-20 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 px-3 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-3">
            <span>Simple, Transparent Pricing</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Scale As You Automate
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-base text-slate-600 dark:text-slate-400">
            Start completely free, and upgrade as your agent pipelines scale in production.
          </p>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto text-left">
            {/* Free */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Free Starter</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Perfect for prototyping & solo developers.</p>
                <div className="mt-6">
                  <span className="text-4xl font-extrabold text-slate-900 dark:text-white">$0</span>
                  <span className="text-xs text-slate-400"> / forever</span>
                </div>

                <ul className="mt-6 space-y-3 text-xs text-slate-600 dark:text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>50 pipeline runs / month</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Interactive visual workflow canvas</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Gemini 2.5 Flash simulated inference</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>All 5 standard workflow templates</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={onStartFree}
                className="mt-8 w-full rounded-xl border border-slate-300 dark:border-slate-700 py-2.5 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Start Free
              </button>
            </div>

            {/* Pro (Highlighted) */}
            <div className="relative rounded-2xl border-2 border-blue-600 bg-white dark:bg-slate-900 p-8 shadow-xl shadow-blue-500/10 flex flex-col justify-between">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-3 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                Most Popular
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Pro Builder</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">For high-velocity growth teams & agencies.</p>
                <div className="mt-6">
                  <span className="text-4xl font-extrabold text-slate-900 dark:text-white">$49</span>
                  <span className="text-xs text-slate-400"> / month</span>
                </div>

                <ul className="mt-6 space-y-3 text-xs text-slate-600 dark:text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span><strong>Unlimited</strong> workflow executions</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Live Gemini API Key integration</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>High-concurrency webhook queues</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Slack, Notion & REST endpoints</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Priority email support & 99.9% uptime</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => onNavigate('pricing')}
                className="mt-8 w-full rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-colors"
              >
                Upgrade to Pro
              </button>
            </div>

            {/* Enterprise */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Enterprise</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Dedicated clusters, SSO, and SLA.</p>
                <div className="mt-6">
                  <span className="text-4xl font-extrabold text-slate-900 dark:text-white">$199</span>
                  <span className="text-xs text-slate-400"> / month</span>
                </div>

                <ul className="mt-6 space-y-3 text-xs text-slate-600 dark:text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Unlimited everything + dedicated runner</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Custom private LLM endpoints</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>SSO / SAML authentication</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Custom SLAs & Dedicated Architect</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => onNavigate('pricing')}
                className="mt-8 w-full rounded-xl border border-slate-300 dark:border-slate-700 py-2.5 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq-section" className="py-20 border-t border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              Frequently Asked Questions
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Everything you need to know about FlowScale AI and agent workflows.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="flex w-full items-center justify-between p-5 text-left text-sm font-bold text-slate-900 dark:text-white"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`h-4 w-4 text-slate-400 transition-transform ${
                        isOpen ? 'rotate-180 text-blue-500' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-12 text-slate-500 dark:text-slate-400 text-xs">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
              F
            </div>
            <span className="font-bold text-slate-900 dark:text-white">FlowScale AI</span>
            <span>— Visual Agent Automation SaaS</span>
          </div>

          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-emerald-500 font-semibold">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              All Systems Operational (99.98%)
            </span>
            <span>© 2026 FlowScale AI Inc. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
