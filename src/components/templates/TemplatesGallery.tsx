import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  Clock,
  ArrowRight,
  Workflow as WorkflowIcon,
  CheckCircle2,
  TrendingUp,
  Cpu,
  Layers,
  Copy,
} from 'lucide-react';
import { Workflow } from '../../types/workflow';
import { WORKFLOW_TEMPLATES } from '../../data/templates';

interface TemplatesGalleryProps {
  onLoadTemplate: (template: Workflow) => void;
  onNavigate: (view: string) => void;
}

export const TemplatesGallery: React.FC<TemplatesGalleryProps> = ({
  onLoadTemplate,
  onNavigate,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Marketing', 'Customer Support', 'Operations', 'Research'];

  const filtered = WORKFLOW_TEMPLATES.filter(tpl => {
    const matchesSearch =
      tpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' || tpl.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 dark:bg-blue-950/80 px-3 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Curated Production Blueprints</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Workflow Automation Templates
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
          Instantly launch pre-configured multi-agent pipelines with battle-tested prompts, token constraints, and action adapters.
        </p>
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
            placeholder="Search templates by keyword or role..."
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

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(tpl => (
          <div
            key={tpl.id}
            className="flex flex-col justify-between rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs hover:border-blue-400 dark:hover:border-blue-700 hover:shadow-lg transition-all group"
          >
            <div>
              {/* Category & Node Count */}
              <div className="flex items-center justify-between mb-3">
                <span className="rounded-full bg-blue-50 dark:bg-blue-950/80 px-2.5 py-0.5 text-xs font-semibold text-blue-600 dark:text-blue-400">
                  {tpl.category}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {tpl.nodes.length} Nodes
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {tpl.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-3 leading-relaxed">
                {tpl.description}
              </p>

              {/* Node Chain Sequence Preview */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  Pipeline Steps:
                </span>
                <div className="space-y-1">
                  {tpl.nodes.map((n, idx) => (
                    <div
                      key={n.id}
                      className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-300"
                    >
                      <span className="text-[10px] font-mono text-slate-400">0{idx + 1}.</span>
                      <span className="font-semibold truncate">{n.title}</span>
                      <span className="text-[10px] text-slate-400 uppercase">({n.category})</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Card CTA */}
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                ★ {tpl.successRate}% Success Rate
              </span>

              <button
                onClick={() => onLoadTemplate(tpl)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 active:scale-95 transition-all"
              >
                <span>Open in Builder</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
