import React, { useState } from 'react';
import {
  Workflow as WorkflowIcon,
  Play,
  Plus,
  Search,
  Filter,
  Copy,
  Trash2,
  Sliders,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Download,
  Power,
} from 'lucide-react';
import { Workflow } from '../../types/workflow';

interface WorkflowsListProps {
  workflows: Workflow[];
  onOpenWorkflow: (workflow: Workflow) => void;
  onNewWorkflow: () => void;
  onDeleteWorkflow: (id: string) => void;
  onDuplicateWorkflow: (id: string) => void;
  onToggleWorkflow: (id: string) => void;
  onRunQuick: (workflow: Workflow) => void;
}

export const WorkflowsList: React.FC<WorkflowsListProps> = ({
  workflows,
  onOpenWorkflow,
  onNewWorkflow,
  onDeleteWorkflow,
  onDuplicateWorkflow,
  onToggleWorkflow,
  onRunQuick,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Marketing', 'Customer Support', 'Operations', 'Research'];

  const filteredWorkflows = workflows.filter(wf => {
    const matchesSearch =
      wf.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wf.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat =
      selectedCategory === 'All' || wf.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            My Workflows
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage, configure, and monitor your active autonomous AI pipeline chains.
          </p>
        </div>

        <button
          onClick={onNewWorkflow}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700 active:scale-95 transition-all self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>New Workflow</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search workflows by title or keywords..."
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 pl-10 pr-4 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Categories Pills */}
        <div className="flex flex-wrap gap-1.5">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Workflows Grid */}
      {filteredWorkflows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-12 text-center bg-white/40 dark:bg-slate-900/40">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 mb-3">
            <WorkflowIcon className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            No workflows found
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search criteria or create a new workflow from scratch.
          </p>
          <button
            onClick={onNewWorkflow}
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" /> Create Workflow
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkflows.map(wf => (
            <div
              key={wf.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs hover:border-blue-400 dark:hover:border-blue-700 transition-all group"
            >
              {/* Card Header */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="rounded-full bg-blue-50 dark:bg-blue-950/80 px-2.5 py-0.5 text-xs font-semibold text-blue-600 dark:text-blue-400">
                    {wf.category}
                  </span>

                  <div className="flex items-center gap-2">
                    {/* Active toggle */}
                    <button
                      onClick={() => onToggleWorkflow(wf.id)}
                      title={wf.isEnabled ? 'Active (Click to pause)' : 'Paused'}
                      className={`flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full transition-colors ${
                        wf.isEnabled
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                          : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      <Power className="h-3 w-3" />
                      <span>{wf.isEnabled ? 'Active' : 'Paused'}</span>
                    </button>
                  </div>
                </div>

                <h3
                  onClick={() => onOpenWorkflow(wf)}
                  className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 cursor-pointer transition-colors"
                >
                  {wf.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {wf.description}
                </p>

                {/* Node sequence preview pills */}
                <div className="mt-4 flex flex-wrap items-center gap-1 text-[10px]">
                  {wf.nodes.map((n, i) => (
                    <React.Fragment key={n.id}>
                      <span className="rounded bg-slate-100 dark:bg-slate-800 px-2 py-0.5 font-medium text-slate-700 dark:text-slate-300 truncate max-w-[100px]">
                        {n.title}
                      </span>
                      {i < wf.nodes.length - 1 && (
                        <span className="text-slate-400 font-bold">→</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Card Footer: Metrics & Actions */}
              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3 text-[11px] text-slate-400">
                  <span>{wf.runCount || 0} runs</span>
                  <span>•</span>
                  <span className="text-emerald-500 font-semibold">{wf.successRate || 99}% success</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onRunQuick(wf)}
                    title="Quick Run"
                    className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white transition-colors"
                  >
                    <Play className="h-3.5 w-3.5 fill-current" />
                  </button>
                  <button
                    onClick={() => onDuplicateWorkflow(wf.id)}
                    title="Duplicate"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => onOpenWorkflow(wf)}
                    title="Open in Builder"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Sliders className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteWorkflow(wf.id)}
                    title="Delete"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
