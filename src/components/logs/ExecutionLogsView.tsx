import React, { useState } from 'react';
import {
  ListOrdered,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  Trash2,
  Eye,
  Copy,
  Check,
  Download,
  Filter,
  ArrowRight,
  Terminal,
  X,
  Play,
} from 'lucide-react';
import { ExecutionLog } from '../../types/workflow';

interface ExecutionLogsViewProps {
  logs: ExecutionLog[];
  onClearLogs: () => void;
  onRerunWorkflow?: (workflowId: string) => void;
}

export const ExecutionLogsView: React.FC<ExecutionLogsViewProps> = ({
  logs,
  onClearLogs,
  onRerunWorkflow,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'success' | 'failed'>('all');
  const [selectedLog, setSelectedLog] = useState<ExecutionLog | null>(null);
  const [copiedPayload, setCopiedPayload] = useState(false);

  const filteredLogs = logs.filter(log => {
    const matchesSearch =
      log.workflowName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.triggeredBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.finalOutputSummary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || log.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 2000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Execution Logs & History
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Audit every automated execution run, debug node-level inputs/outputs, and analyze latency.
          </p>
        </div>

        {logs.length > 0 && (
          <button
            onClick={onClearLogs}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors self-start sm:self-auto"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Clear History</span>
          </button>
        )}
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
            placeholder="Search by workflow, trigger, or payload keyword..."
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 pl-10 pr-4 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setStatusFilter('all')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              statusFilter === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
            }`}
          >
            All Runs ({logs.length})
          </button>
          <button
            onClick={() => setStatusFilter('success')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              statusFilter === 'success'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
            }`}
          >
            Success ({logs.filter(l => l.status === 'success').length})
          </button>
          <button
            onClick={() => setStatusFilter('failed')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              statusFilter === 'failed'
                ? 'bg-red-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
            }`}
          >
            Failed ({logs.filter(l => l.status === 'failed').length})
          </button>
        </div>
      </div>

      {/* Logs Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
        {filteredLogs.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            No execution logs match your filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-950/50 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Workflow Name</th>
                  <th className="py-3.5 px-4">Trigger Source</th>
                  <th className="py-3.5 px-4">Duration</th>
                  <th className="py-3.5 px-4">Timestamp</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {filteredLogs.map(log => {
                  const isSuccess = log.status === 'success';
                  return (
                    <tr
                      key={log.id}
                      onClick={() => setSelectedLog(log)}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                    >
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                            isSuccess
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                              : 'bg-red-100 text-red-800 dark:bg-red-950/80 dark:text-red-300'
                          }`}
                        >
                          {isSuccess ? (
                            <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                          ) : (
                            <AlertCircle className="h-3 w-3 text-red-600" />
                          )}
                          {isSuccess ? 'Success' : 'Failed'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white max-w-xs truncate">
                        {log.workflowName}
                      </td>

                      <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 max-w-[200px] truncate">
                        {log.triggeredBy}
                      </td>

                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 font-mono">
                        {(log.durationMs / 1000).toFixed(2)}s
                      </td>

                      <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                        {new Date(log.startedAt).toLocaleString([], {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })}
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            setSelectedLog(log);
                          }}
                          className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-bold hover:underline"
                        >
                          <Eye className="h-3.5 w-3.5" /> Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* DETAIL MODAL / DRAWER */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-3xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                      selectedLog.status === 'success'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                    }`}
                  >
                    {selectedLog.status.toUpperCase()}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {selectedLog.workflowName}
                  </h3>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Run ID: <code className="font-mono">{selectedLog.id}</code> • Trigger: {selectedLog.triggeredBy}
                </p>
              </div>

              <button
                onClick={() => setSelectedLog(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4 text-xs">
              {/* Timing metrics banner */}
              <div className="grid grid-cols-3 gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Total Duration</span>
                  <p className="text-sm font-bold text-slate-900 dark:text-white font-mono">
                    {(selectedLog.durationMs / 1000).toFixed(2)}s
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Started</span>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    {new Date(selectedLog.startedAt).toLocaleTimeString()}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Steps Executed</span>
                  <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                    {selectedLog.steps?.length || 1} Nodes
                  </p>
                </div>
              </div>

              {/* Final Delivery Summary */}
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                  Execution Output Summary:
                </span>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 leading-relaxed font-sans whitespace-pre-wrap">
                  {selectedLog.finalOutputSummary}
                </div>
              </div>

              {/* Step Waterfall */}
              {selectedLog.steps && selectedLog.steps.length > 0 && (
                <div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-2">
                    Step-by-Step Breakdown:
                  </span>
                  <div className="space-y-2">
                    {selectedLog.steps.map((st, i) => (
                      <div
                        key={st.nodeId || i}
                        className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 space-y-2"
                      >
                        <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                          <div className="flex items-center gap-2">
                            <span className="text-slate-400 font-mono">0{i + 1}</span>
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                            <span>{st.nodeTitle}</span>
                            <span className="text-[10px] text-slate-400 uppercase">({st.nodeType})</span>
                          </div>
                          <span className="text-emerald-500 font-mono">{st.durationMs}ms</span>
                        </div>

                        {st.outputPayload && (
                          <pre className="p-2 rounded-lg bg-slate-900 text-emerald-400 font-mono text-[11px] overflow-x-auto max-h-32">
                            {JSON.stringify(st.outputPayload, null, 2)}
                          </pre>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex items-center justify-between">
              <button
                onClick={() => handleCopy(JSON.stringify(selectedLog, null, 2))}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                {copiedPayload ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedPayload ? 'Copied Full JSON!' : 'Copy JSON Payload'}</span>
              </button>

              <button
                onClick={() => setSelectedLog(null)}
                className="rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
