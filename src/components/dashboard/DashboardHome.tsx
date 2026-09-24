import React from 'react';
import {
  Workflow as WorkflowIcon,
  Play,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  TrendingUp,
  Activity,
  Plus,
  ArrowUpRight,
  ArrowRight,
  FileCode,
  Zap,
  Sliders,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { Workflow, ExecutionLog, UserProfile } from '../../types/workflow';

interface DashboardHomeProps {
  user: UserProfile | null;
  workflows: Workflow[];
  logs: ExecutionLog[];
  onNavigate: (view: string) => void;
  onOpenWorkflow: (workflow: Workflow) => void;
  onRunWorkflowQuick: (workflow: Workflow) => void;
  onNewWorkflow: () => void;
}

export const DashboardHome: React.FC<DashboardHomeProps> = ({
  user,
  workflows,
  logs,
  onNavigate,
  onOpenWorkflow,
  onRunWorkflowQuick,
  onNewWorkflow,
}) => {
  const activeWorkflowsCount = workflows.filter(w => w.isEnabled).length;
  const totalRuns = logs.length;
  const successfulRuns = logs.filter(l => l.status === 'success').length;
  const successRate = totalRuns > 0 ? Math.round((successfulRuns / totalRuns) * 100) : 100;

  // Calculate average execution duration
  const avgDuration =
    totalRuns > 0
      ? (logs.reduce((acc, curr) => acc + (curr.durationMs || 1500), 0) / totalRuns / 1000).toFixed(1)
      : '1.8';

  const recentLogs = logs.slice(0, 6);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Welcome back, {user?.name.split(' ')[0] || 'Builder'}
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 dark:bg-blue-950/80 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              <Zap className="h-3 w-3 fill-current" /> Pro Plan
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Monitor active agent chains, execution pipelines, and workflow throughput in real time.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigate('templates')}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <Sparkles className="h-3.5 w-3.5 text-blue-500" />
            <span>Templates</span>
          </button>
          <button
            onClick={onNewWorkflow}
            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 active:scale-95 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>New Workflow</span>
          </button>
        </div>
      </div>

      {/* METRIC STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Card 1: Active Workflows */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Workflows</span>
            <div className="h-8 w-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <WorkflowIcon className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {activeWorkflowsCount}
            </span>
            <span className="text-xs text-slate-400">/ {workflows.length} total</span>
          </div>
          <p className="mt-2 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
            <TrendingUp className="h-3 w-3" /> All triggers operational
          </p>
        </div>

        {/* Card 2: Total Executions */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Runs</span>
            <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Activity className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {totalRuns}
            </span>
            <span className="text-xs text-slate-400">logged runs</span>
          </div>
          <p className="mt-2 text-[11px] text-blue-600 dark:text-blue-400 font-medium">
            {user?.executionsThisMonth || 142} runs this month
          </p>
        </div>

        {/* Card 3: Success Rate */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Success Rate</span>
            <div className="h-8 w-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {successRate}%
            </span>
            <span className="text-xs text-emerald-500 font-semibold">High stability</span>
          </div>
          <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
            {successfulRuns} succeeded of {totalRuns}
          </p>
        </div>

        {/* Card 4: Avg Speed */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Avg Pipeline Speed</span>
            <div className="h-8 w-8 rounded-lg bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {avgDuration}s
            </span>
            <span className="text-xs text-slate-400">per full chain</span>
          </div>
          <p className="mt-2 text-[11px] text-cyan-600 dark:text-cyan-400 font-medium">
            Gemini 2.5 sub-second streaming
          </p>
        </div>
      </div>

      {/* QUICK ACTIONS BANNER */}
      <div className="rounded-2xl border border-blue-200/80 dark:border-blue-900/60 bg-gradient-to-r from-blue-500/10 via-indigo-500/5 to-cyan-500/10 p-5 sm:p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-blue-500" />
              Quick Actions
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Kick off a workflow run, configure node keys, or test live agent payloads.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onNewWorkflow}
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-blue-700 transition-colors shadow-xs"
            >
              <Plus className="h-3.5 w-3.5" /> Create Blank Flow
            </button>
            <button
              onClick={() => onNavigate('templates')}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <FileCode className="h-3.5 w-3.5 text-indigo-500" /> Load Template
            </button>
            <button
              onClick={() => onNavigate('credentials')}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> Manage API Keys
            </button>
            <button
              onClick={() => onNavigate('logs')}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <Activity className="h-3.5 w-3.5 text-amber-500" /> View All Logs
            </button>
          </div>
        </div>
      </div>

      {/* TWO COLUMNS: PINNED WORKFLOWS & RECENT EXECUTION LOGS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Active Workflows List (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <WorkflowIcon className="h-4 w-4 text-blue-500" />
              Active Workflow Pipelines
            </h3>
            <button
              onClick={() => onNavigate('workflows')}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <span>View all ({workflows.length})</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {workflows.slice(0, 4).map(wf => (
              <div
                key={wf.id}
                className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 hover:border-blue-400 dark:hover:border-blue-700 transition-all group"
              >
                <div
                  onClick={() => onOpenWorkflow(wf)}
                  className="flex items-center gap-3.5 min-w-0 cursor-pointer flex-1"
                >
                  <div className="h-10 w-10 shrink-0 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs group-hover:scale-105 transition-transform">
                    <WorkflowIcon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {wf.name}
                      </h4>
                      <span className="rounded bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600 dark:text-slate-300">
                        {wf.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 truncate mt-0.5">
                      {wf.nodes.length} nodes connected • {wf.runCount || 0} runs • {wf.successRate || 99}% success
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onRunWorkflowQuick(wf)}
                    title="Test Run Pipeline"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 px-3 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white transition-all"
                  >
                    <Play className="h-3 w-3 fill-current" />
                    <span>Run</span>
                  </button>
                  <button
                    onClick={() => onOpenWorkflow(wf)}
                    title="Open Builder"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <Sliders className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Recent Execution History (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-500" />
              Live Execution Feed
            </h3>
            <button
              onClick={() => onNavigate('logs')}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <span>Full logs</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-3">
            {recentLogs.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">No execution logs yet.</p>
            ) : (
              recentLogs.map(log => {
                const isSuccess = log.status === 'success';
                return (
                  <div
                    key={log.id}
                    onClick={() => onNavigate('logs')}
                    className="cursor-pointer p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        {isSuccess ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-red-500" />
                        )}
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-[180px]">
                          {log.workflowName}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {(log.durationMs / 1000).toFixed(2)}s
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                      {log.finalOutputSummary}
                    </p>

                    <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                      <span className="truncate max-w-[170px]">Trigger: {log.triggeredBy}</span>
                      <span>{new Date(log.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
