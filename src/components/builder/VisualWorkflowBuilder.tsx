import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Save,
  Plus,
  Trash2,
  Copy,
  Settings as SettingsIcon,
  ChevronRight,
  Download,
  Share2,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  FileCode,
  Sliders,
  Layers,
  HelpCircle,
  X,
  RefreshCw,
  Terminal,
} from 'lucide-react';
import {
  Workflow,
  WorkflowNode,
  WorkflowEdge,
  NodeType,
  NodeCategory,
  ExecutionLog,
  ApiCredentials,
} from '../../types/workflow';
import { NODE_DEFINITIONS } from '../../data/nodeLibrary';
import { runWorkflowPipeline } from '../../services/executionEngine';

interface VisualWorkflowBuilderProps {
  workflow: Workflow;
  onSaveWorkflow: (workflow: Workflow) => void;
  onBack: () => void;
  credentials: ApiCredentials;
  onLogGenerated: (log: ExecutionLog) => void;
}

export const VisualWorkflowBuilder: React.FC<VisualWorkflowBuilderProps> = ({
  workflow: initialWorkflow,
  onSaveWorkflow,
  onBack,
  credentials,
  onLogGenerated,
}) => {
  const [workflow, setWorkflow] = useState<Workflow>(initialWorkflow);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(
    initialWorkflow.nodes[0]?.id || null
  );
  const [showNodePalette, setShowNodePalette] = useState(false);
  const [showExecutionDrawer, setShowExecutionDrawer] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [activeExecutingNodeId, setActiveExecutingNodeId] = useState<string | null>(null);
  const [latestExecutionLog, setLatestExecutionLog] = useState<ExecutionLog | null>(null);
  const [testInputOverride, setTestInputOverride] = useState<string>('');
  const [isSavedFeedback, setIsSavedFeedback] = useState(false);
  const [activeOutputTab, setActiveOutputTab] = useState<'preview' | 'json' | 'steps'>('preview');

  // Dragging node state
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  // Sync state if initialWorkflow prop changes
  useEffect(() => {
    setWorkflow(initialWorkflow);
    if (initialWorkflow.nodes.length > 0 && !selectedNodeId) {
      setSelectedNodeId(initialWorkflow.nodes[0].id);
    }
  }, [initialWorkflow.id]);

  const selectedNode = workflow.nodes.find(n => n.id === selectedNodeId);

  // Handle Save
  const handleSave = () => {
    onSaveWorkflow(workflow);
    setIsSavedFeedback(true);
    setTimeout(() => setIsSavedFeedback(false), 2000);
  };

  // Add a new node to canvas
  const handleAddNode = (type: NodeType) => {
    const def = NODE_DEFINITIONS[type];
    if (!def) return;

    // Calculate a nice default position based on existing nodes
    const lastNode = workflow.nodes[workflow.nodes.length - 1];
    const newX = lastNode ? lastNode.position.x + 300 : 100;
    const newY = lastNode ? lastNode.position.y : 180;

    const newNodeId = `node-${Date.now().toString(36)}`;
    const newNode: WorkflowNode = {
      id: newNodeId,
      type: def.type,
      title: def.title,
      category: def.category,
      description: def.description,
      position: { x: newX, y: newY },
      config: { ...def.defaultConfig },
      status: 'idle',
    };

    // Auto-connect with last node if possible
    const updatedEdges = [...workflow.edges];
    if (lastNode) {
      updatedEdges.push({
        id: `e-${lastNode.id}-${newNodeId}`,
        fromNodeId: lastNode.id,
        toNodeId: newNodeId,
      });
    }

    const updatedWorkflow: Workflow = {
      ...workflow,
      nodes: [...workflow.nodes, newNode],
      edges: updatedEdges,
    };

    setWorkflow(updatedWorkflow);
    setSelectedNodeId(newNodeId);
    setShowNodePalette(false);
  };

  // Delete node
  const handleDeleteNode = (nodeId: string) => {
    const updatedNodes = workflow.nodes.filter(n => n.id !== nodeId);
    const updatedEdges = workflow.edges.filter(
      e => e.fromNodeId !== nodeId && e.toNodeId !== nodeId
    );
    setWorkflow({
      ...workflow,
      nodes: updatedNodes,
      edges: updatedEdges,
    });
    if (selectedNodeId === nodeId) {
      setSelectedNodeId(updatedNodes[0]?.id || null);
    }
  };

  // Duplicate node
  const handleDuplicateNode = (node: WorkflowNode) => {
    const newId = `node-${Date.now().toString(36)}`;
    const duplicatedNode: WorkflowNode = {
      ...node,
      id: newId,
      title: `${node.title} (Copy)`,
      position: { x: node.position.x + 40, y: node.position.y + 40 },
    };
    setWorkflow({
      ...workflow,
      nodes: [...workflow.nodes, duplicatedNode],
    });
    setSelectedNodeId(newId);
  };

  // Update node config
  const handleUpdateNodeConfig = (nodeId: string, partialConfig: Record<string, any>) => {
    const updatedNodes = workflow.nodes.map(n => {
      if (n.id === nodeId) {
        return {
          ...n,
          config: { ...n.config, ...partialConfig },
        };
      }
      return n;
    });
    setWorkflow({ ...workflow, nodes: updatedNodes });
  };

  // Auto-arrange nodes in a clean pipeline layout
  const handleAutoArrange = () => {
    const startX = 80;
    const startY = 180;
    const spacingX = 320;

    const arrangedNodes = workflow.nodes.map((n, index) => ({
      ...n,
      position: {
        x: startX + index * spacingX,
        y: startY,
      },
    }));

    setWorkflow({
      ...workflow,
      nodes: arrangedNodes,
    });
  };

  // Export JSON Schema
  const handleExportJson = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(workflow, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `${workflow.name.toLowerCase().replace(/\s+/g, '-')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Dragging mechanics on canvas
  const handleMouseDownNode = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    setSelectedNodeId(nodeId);
    setDraggingNodeId(nodeId);
    const node = workflow.nodes.find(n => n.id === nodeId);
    if (node) {
      setDragOffset({
        x: e.clientX - node.position.x,
        y: e.clientY - node.position.y,
      });
    }
  };

  const handleMouseMoveCanvas = (e: React.MouseEvent) => {
    if (!draggingNodeId) return;
    const canvasBounds = canvasRef.current?.getBoundingClientRect();
    if (!canvasBounds) return;

    const newX = Math.max(20, Math.min(2200, e.clientX - dragOffset.x));
    const newY = Math.max(40, Math.min(1200, e.clientY - dragOffset.y));

    setWorkflow(prev => ({
      ...prev,
      nodes: prev.nodes.map(n =>
        n.id === draggingNodeId ? { ...n, position: { x: newX, y: newY } } : n
      ),
    }));
  };

  const handleMouseUpCanvas = () => {
    setDraggingNodeId(null);
  };

  // EXECUTE WORKFLOW PIPELINE
  const handleRunPipeline = async () => {
    if (isExecuting) return;
    setIsExecuting(true);
    setShowExecutionDrawer(true);

    // Reset status on all nodes
    setWorkflow(prev => ({
      ...prev,
      nodes: prev.nodes.map(n => ({ ...n, status: 'idle', error: undefined })),
    }));

    try {
      const executionLog = await runWorkflowPipeline({
        workflow,
        initialInput: testInputOverride.trim() || undefined,
        credentials,
        onStepStart: nodeId => {
          setActiveExecutingNodeId(nodeId);
          setWorkflow(prev => ({
            ...prev,
            nodes: prev.nodes.map(n =>
              n.id === nodeId ? { ...n, status: 'running' } : n
            ),
          }));
        },
        onStepComplete: (nodeId, output, durationMs) => {
          setWorkflow(prev => ({
            ...prev,
            nodes: prev.nodes.map(n =>
              n.id === nodeId
                ? {
                    ...n,
                    status: 'success',
                    lastOutput: output,
                    lastRunTimeMs: durationMs,
                  }
                : n
            ),
          }));
        },
        onStepError: (nodeId, error) => {
          setWorkflow(prev => ({
            ...prev,
            nodes: prev.nodes.map(n =>
              n.id === nodeId ? { ...n, status: 'failed', error } : n
            ),
          }));
        },
      });

      setLatestExecutionLog(executionLog);
      onLogGenerated(executionLog);
    } catch (err) {
      console.error('Pipeline execution error:', err);
    } finally {
      setIsExecuting(false);
      setActiveExecutingNodeId(null);
    }
  };

  // Helper to calculate SVG bezier curve between two nodes
  const calculateEdgePath = (fromNodeId: string, toNodeId: string) => {
    const fromNode = workflow.nodes.find(n => n.id === fromNodeId);
    const toNode = workflow.nodes.find(n => n.id === toNodeId);
    if (!fromNode || !toNode) return '';

    const nodeWidth = 260;
    const nodeHeight = 120;

    const startX = fromNode.position.x + nodeWidth;
    const startY = fromNode.position.y + nodeHeight / 2;

    const endX = toNode.position.x;
    const endY = toNode.position.y + nodeHeight / 2;

    const deltaX = Math.abs(endX - startX) * 0.55;
    return `M ${startX} ${startY} C ${startX + deltaX} ${startY}, ${endX - deltaX} ${endY}, ${endX} ${endY}`;
  };

  // Download Output helper
  const handleDownloadOutput = (format: 'markdown' | 'json') => {
    if (!latestExecutionLog) return;
    const lastStep = latestExecutionLog.steps[latestExecutionLog.steps.length - 1];
    const data = lastStep?.outputPayload || latestExecutionLog.finalOutputSummary;

    let content = '';
    let fileName = `flowscale-export-${Date.now()}`;

    if (format === 'json') {
      content = JSON.stringify(latestExecutionLog, null, 2);
      fileName += '.json';
    } else {
      content = `# FlowScale AI Execution Result\n\n**Workflow:** ${workflow.name}\n**Completed:** ${latestExecutionLog.completedAt}\n**Duration:** ${(latestExecutionLog.durationMs / 1000).toFixed(2)}s\n\n---\n\n${
        typeof data === 'object' && data.generatedText
          ? data.generatedText
          : typeof data === 'string'
          ? data
          : JSON.stringify(data, null, 2)
      }`;
      fileName += '.md';
    }

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-100 dark:bg-slate-950 overflow-hidden select-none">
      {/* BUILDER TOOLBAR */}
      <div className="h-14 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 flex items-center justify-between z-30 shrink-0">
        {/* Left: Workflow Title & Category */}
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1"
          >
            ← Back
          </button>
          <div className="h-4 w-px bg-slate-200 dark:border-slate-800" />
          <input
            type="text"
            value={workflow.name}
            onChange={e => setWorkflow({ ...workflow, name: e.target.value })}
            className="text-sm font-bold text-slate-900 dark:text-white bg-transparent border-b border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-blue-500 focus:outline-none px-1 py-0.5 max-w-[280px] sm:max-w-md truncate"
          />
          <span className="hidden sm:inline-flex items-center rounded-md bg-blue-50 dark:bg-blue-950 px-2 py-0.5 text-[11px] font-semibold text-blue-600 dark:text-blue-400">
            {workflow.category}
          </span>
        </div>

        {/* Center / Right: Builder Actions */}
        <div className="flex items-center gap-2">
          {/* Add Node Button */}
          <button
            onClick={() => setShowNodePalette(!showNodePalette)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <Plus className="h-3.5 w-3.5 text-blue-500" />
            <span>Add Node</span>
          </button>

          {/* Auto Arrange */}
          <button
            onClick={handleAutoArrange}
            title="Auto-Arrange Nodes"
            className="hidden md:inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
          >
            <Sliders className="h-3.5 w-3.5 text-indigo-500" />
            <span>Align</span>
          </button>

          {/* Export JSON */}
          <button
            onClick={handleExportJson}
            title="Export JSON"
            className="hidden sm:inline-flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
          >
            <FileCode className="h-3.5 w-3.5 text-slate-400" />
            <span>JSON</span>
          </button>

          {/* Save Workflow Button */}
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
          >
            <Save className="h-3.5 w-3.5 text-emerald-500" />
            <span>{isSavedFeedback ? 'Saved!' : 'Save'}</span>
          </button>

          {/* Run Pipeline Button */}
          <button
            onClick={handleRunPipeline}
            disabled={isExecuting || workflow.nodes.length === 0}
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700 active:scale-95 disabled:opacity-60 transition-all"
          >
            {isExecuting ? (
              <>
                <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Running Pipeline...</span>
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>Run Pipeline</span>
              </>
            )}
          </button>

          {/* Toggle Console */}
          <button
            onClick={() => setShowExecutionDrawer(!showExecutionDrawer)}
            title="Toggle Console"
            className={`p-1.5 rounded-lg border text-xs font-semibold ${
              showExecutionDrawer
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                : 'border-slate-200 dark:border-slate-700 text-slate-500'
            }`}
          >
            <Terminal className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* WORKFLOW CANVAS & SIDE DRAWERS */}
      <div className="flex-1 flex relative overflow-hidden">
        {/* Canvas Area */}
        <div
          ref={canvasRef}
          onMouseMove={handleMouseMoveCanvas}
          onMouseUp={handleMouseUpCanvas}
          className="flex-1 relative overflow-auto canvas-grid bg-slate-50 dark:bg-slate-950"
          style={{ minWidth: 1600, minHeight: 1200 }}
        >
          {/* SVG Wires Layer */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
            <defs>
              <linearGradient id="edgeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#06B6D4" />
              </linearGradient>
            </defs>

            {workflow.edges.map(edge => {
              const fromNode = workflow.nodes.find(n => n.id === edge.fromNodeId);
              const isRunningWire =
                isExecuting &&
                (activeExecutingNodeId === edge.fromNodeId ||
                  activeExecutingNodeId === edge.toNodeId);

              const pathData = calculateEdgePath(edge.fromNodeId, edge.toNodeId);
              if (!pathData) return null;

              return (
                <g key={edge.id}>
                  {/* Shadow background line */}
                  <path
                    d={pathData}
                    fill="none"
                    stroke="#94A3B8"
                    strokeWidth="3"
                    strokeOpacity="0.3"
                  />
                  {/* Active Gradient Line */}
                  <path
                    d={pathData}
                    fill="none"
                    stroke="url(#edgeGradient)"
                    strokeWidth={isRunningWire ? 3.5 : 2.5}
                    className={isRunningWire ? 'flow-running-wire' : ''}
                  />
                </g>
              );
            })}
          </svg>

          {/* Node Cards */}
          {workflow.nodes.map(node => {
            const isSelected = selectedNodeId === node.id;
            const isRunning = activeExecutingNodeId === node.id;
            const isSuccess = node.status === 'success';
            const isFailed = node.status === 'failed';

            // Category color accents
            let categoryBadge = 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300';
            if (node.category === 'trigger') {
              categoryBadge = 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300';
            } else if (node.category === 'action') {
              categoryBadge = 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300';
            }

            return (
              <div
                key={node.id}
                onMouseDown={e => handleMouseDownNode(e, node.id)}
                style={{
                  transform: `translate(${node.position.x}px, ${node.position.y}px)`,
                }}
                className={`absolute w-[260px] rounded-2xl border bg-white dark:bg-slate-900 p-4 shadow-md transition-all cursor-move z-20 ${
                  isRunning
                    ? 'border-blue-500 ring-4 ring-blue-500/20 shadow-blue-500/20 scale-102'
                    : isSelected
                    ? 'border-blue-500 ring-2 ring-blue-500/30 shadow-lg'
                    : isSuccess
                    ? 'border-emerald-400 dark:border-emerald-700/80'
                    : isFailed
                    ? 'border-red-400 dark:border-red-700/80'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600'
                }`}
              >
                {/* Node Ports (Input & Output Dots) */}
                {node.category !== 'trigger' && (
                  <div
                    title="Input Port"
                    className="absolute -left-2 top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-slate-300 dark:bg-slate-700 border-2 border-white dark:border-slate-900 shadow-xs"
                  />
                )}
                {node.category !== 'action' && (
                  <div
                    title="Output Port"
                    className="absolute -right-2 top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-blue-500 border-2 border-white dark:border-slate-900 shadow-xs"
                  />
                )}

                {/* Node Header */}
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${categoryBadge}`}
                  >
                    {node.category}
                  </span>

                  {/* Execution status indicator */}
                  <div>
                    {isRunning && (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 animate-pulse">
                        <div className="h-2 w-2 rounded-full bg-blue-500 animate-ping" />
                        Running
                      </span>
                    )}
                    {isSuccess && (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        {node.lastRunTimeMs ? `${node.lastRunTimeMs}ms` : 'Done'}
                      </span>
                    )}
                    {isFailed && (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-red-500">
                        <AlertCircle className="h-3.5 w-3.5" /> Error
                      </span>
                    )}
                    {!isRunning && !isSuccess && !isFailed && (
                      <span className="text-[10px] text-slate-400 font-medium">Idle</span>
                    )}
                  </div>
                </div>

                {/* Node Title & Description */}
                <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                  {node.title}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5 leading-snug">
                  {node.description}
                </p>

                {/* Config Preview Chips */}
                <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 truncate max-w-[140px]">
                    {node.config.model ||
                      node.config.targetLanguage ||
                      node.config.recipientEmail ||
                      node.config.channelName ||
                      'Configured'}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        handleDuplicateNode(node);
                      }}
                      title="Duplicate node"
                      className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      <Copy className="h-3 w-3" />
                    </button>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        handleDeleteNode(node.id);
                      }}
                      title="Delete node"
                      className="p-1 rounded text-slate-400 hover:text-red-500"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* NODE PALETTE MODAL / POPUP */}
        {showNodePalette && (
          <div className="absolute top-4 left-4 z-40 w-80 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-4 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Plus className="h-4 w-4 text-blue-500" />
                Add Workflow Node
              </h3>
              <button
                onClick={() => setShowNodePalette(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Triggers Category */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                Triggers & Inputs
              </span>
              <div className="mt-1.5 space-y-1.5">
                {(['trigger_manual', 'trigger_webhook', 'trigger_schedule', 'trigger_email'] as NodeType[]).map(
                  type => {
                    const def = NODE_DEFINITIONS[type];
                    return (
                      <button
                        key={type}
                        onClick={() => handleAddNode(type)}
                        className="w-full text-left p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-800 hover:bg-purple-50/50 dark:hover:bg-purple-950/30 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            {def.title}
                          </span>
                          <span className="text-[10px] font-semibold text-purple-600 dark:text-purple-400">
                            {def.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                          {def.description}
                        </p>
                      </button>
                    );
                  }
                )}
              </div>
            </div>

            {/* AI Processors Category */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                AI Cognitive Agents
              </span>
              <div className="mt-1.5 space-y-1.5">
                {(['ai_text_gen', 'ai_summarizer', 'ai_sentiment', 'ai_translator', 'ai_seo'] as NodeType[]).map(
                  type => {
                    const def = NODE_DEFINITIONS[type];
                    return (
                      <button
                        key={type}
                        onClick={() => handleAddNode(type)}
                        className="w-full text-left p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-800 hover:bg-blue-50/50 dark:hover:bg-blue-950/30 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            {def.title}
                          </span>
                          <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400">
                            {def.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                          {def.description}
                        </p>
                      </button>
                    );
                  }
                )}
              </div>
            </div>

            {/* Actions Category */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Actions & Outputs
              </span>
              <div className="mt-1.5 space-y-1.5">
                {(['action_email', 'action_json_export', 'action_slack_notion', 'action_markdown'] as NodeType[]).map(
                  type => {
                    const def = NODE_DEFINITIONS[type];
                    return (
                      <button
                        key={type}
                        onClick={() => handleAddNode(type)}
                        className="w-full text-left p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-800 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            {def.title}
                          </span>
                          <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                            {def.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                          {def.description}
                        </p>
                      </button>
                    );
                  }
                )}
              </div>
            </div>
          </div>
        )}

        {/* RIGHT DRAWER: NODE CONFIGURATION */}
        {selectedNode && (
          <div className="w-80 sm:w-96 border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col z-30 shrink-0">
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  Node Settings
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                  {selectedNode.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedNodeId(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Drawer Form Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Title input */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Node Label
                </label>
                <input
                  type="text"
                  value={selectedNode.title}
                  onChange={e => {
                    const val = e.target.value;
                    setWorkflow(prev => ({
                      ...prev,
                      nodes: prev.nodes.map(n =>
                        n.id === selectedNode.id ? { ...n, title: val } : n
                      ),
                    }));
                  }}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Manual Input text (for triggers) */}
              {selectedNode.category === 'trigger' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Default Trigger Payload / Topic
                  </label>
                  <textarea
                    rows={4}
                    value={selectedNode.config.manualInputText || ''}
                    onChange={e =>
                      handleUpdateNodeConfig(selectedNode.id, {
                        manualInputText: e.target.value,
                      })
                    }
                    placeholder="Enter seed topic or payload data..."
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none font-mono"
                  />
                </div>
              )}

              {/* AI Model selector */}
              {selectedNode.category === 'ai' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Foundation Model
                  </label>
                  <select
                    value={selectedNode.config.model || 'gemini-2.5-flash'}
                    onChange={e =>
                      handleUpdateNodeConfig(selectedNode.id, { model: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none"
                  >
                    <option value="gemini-2.5-flash">Gemini 2.5 Flash (Recommended)</option>
                    <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
                    <option value="gpt-4o">GPT-4o (via OpenAI Key)</option>
                    <option value="claude-3-7-sonnet">Claude 3.7 Sonnet</option>
                  </select>
                </div>
              )}

              {/* Prompt Template */}
              {selectedNode.config.promptTemplate !== undefined && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Prompt Template
                    </label>
                    <span className="text-[10px] text-blue-500 font-mono">Use {'{input}'}</span>
                  </div>
                  <textarea
                    rows={5}
                    value={selectedNode.config.promptTemplate}
                    onChange={e =>
                      handleUpdateNodeConfig(selectedNode.id, {
                        promptTemplate: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none font-mono leading-relaxed"
                  />
                </div>
              )}

              {/* Temperature Slider */}
              {selectedNode.config.temperature !== undefined && (
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    <span>Creativity (Temperature)</span>
                    <span className="font-mono text-blue-600 dark:text-blue-400">
                      {selectedNode.config.temperature}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={selectedNode.config.temperature}
                    onChange={e =>
                      handleUpdateNodeConfig(selectedNode.id, {
                        temperature: parseFloat(e.target.value),
                      })
                    }
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>Precise (0.0)</span>
                    <span>Balanced (0.5)</span>
                    <span>Creative (1.0)</span>
                  </div>
                </div>
              )}

              {/* Specific Configs: SEO Focus Keyword */}
              {selectedNode.type === 'ai_seo' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Target Primary Keyword
                  </label>
                  <input
                    type="text"
                    value={selectedNode.config.seoFocusKeyword || ''}
                    onChange={e =>
                      handleUpdateNodeConfig(selectedNode.id, {
                        seoFocusKeyword: e.target.value,
                      })
                    }
                    placeholder="e.g. AI workflow automation SaaS"
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
              )}

              {/* Specific Configs: Target Language */}
              {selectedNode.type === 'ai_translator' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Target Language
                  </label>
                  <select
                    value={selectedNode.config.targetLanguage || 'Spanish (Español)'}
                    onChange={e =>
                      handleUpdateNodeConfig(selectedNode.id, {
                        targetLanguage: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none"
                  >
                    <option value="Spanish (Español)">Spanish (Español)</option>
                    <option value="French (Français)">French (Français)</option>
                    <option value="German (Deutsch)">German (Deutsch)</option>
                    <option value="Japanese (日本語)">Japanese (日本語)</option>
                    <option value="Chinese (Mandarin)">Chinese (Mandarin)</option>
                    <option value="Portuguese (Português)">Portuguese (Português)</option>
                  </select>
                </div>
              )}

              {/* Specific Configs: Recipient Email */}
              {selectedNode.type === 'action_email' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Recipient Email Address
                  </label>
                  <input
                    type="email"
                    value={selectedNode.config.recipientEmail || ''}
                    onChange={e =>
                      handleUpdateNodeConfig(selectedNode.id, {
                        recipientEmail: e.target.value,
                      })
                    }
                    placeholder="team@flowscale.ai"
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
              )}

              {/* Specific Configs: Webhook URL */}
              {(selectedNode.type === 'action_json_export' ||
                selectedNode.type === 'trigger_webhook') && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    HTTP Webhook Target URL
                  </label>
                  <input
                    type="url"
                    value={selectedNode.config.webhookUrl || ''}
                    onChange={e =>
                      handleUpdateNodeConfig(selectedNode.id, {
                        webhookUrl: e.target.value,
                      })
                    }
                    placeholder="https://api.yourdomain.com/webhook"
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none font-mono"
                  />
                </div>
              )}

              {/* Specific Configs: Slack / Notion Channel */}
              {selectedNode.type === 'action_slack_notion' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Slack Channel / Notion Database
                  </label>
                  <input
                    type="text"
                    value={selectedNode.config.channelName || ''}
                    onChange={e =>
                      handleUpdateNodeConfig(selectedNode.id, {
                        channelName: e.target.value,
                      })
                    }
                    placeholder="#growth-marketing"
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
              )}

              {/* Last Output Payload Accordion */}
              {selectedNode.lastOutput && (
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mb-2">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Latest Step Output
                  </span>
                  <pre className="rounded-xl bg-slate-900 p-3 text-[11px] font-mono text-emerald-400 overflow-x-auto max-h-48">
                    {JSON.stringify(selectedNode.lastOutput, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/50">
              <button
                onClick={() => handleDeleteNode(selectedNode.id)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:underline"
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete Node
              </button>
              <button
                onClick={handleSave}
                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-700 transition-colors"
              >
                Apply Changes
              </button>
            </div>
          </div>
        )}
      </div>

      {/* BOTTOM SLIDE-UP LIVE EXECUTION CONSOLE */}
      {showExecutionDrawer && (
        <div className="h-64 sm:h-72 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col z-30 shrink-0 shadow-2xl transition-all">
          {/* Console Header */}
          <div className="px-4 py-2.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/60">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                <Terminal className="h-4 w-4 text-blue-500" />
                <span>Live Pipeline Execution Console</span>
              </div>
              {latestExecutionLog && (
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    latestExecutionLog.status === 'success'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                      : 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400'
                  }`}
                >
                  {latestExecutionLog.status.toUpperCase()} • {(latestExecutionLog.durationMs / 1000).toFixed(2)}s
                </span>
              )}
            </div>

            {/* Tabs & Close */}
            <div className="flex items-center gap-2">
              <div className="flex rounded-lg bg-slate-200 dark:bg-slate-800 p-0.5 text-xs">
                <button
                  onClick={() => setActiveOutputTab('preview')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                    activeOutputTab === 'preview'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  Content Preview
                </button>
                <button
                  onClick={() => setActiveOutputTab('steps')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                    activeOutputTab === 'steps'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  Step Logs ({latestExecutionLog?.steps.length || 0})
                </button>
                <button
                  onClick={() => setActiveOutputTab('json')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                    activeOutputTab === 'json'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  Raw JSON Payload
                </button>
              </div>

              {latestExecutionLog && (
                <>
                  <button
                    onClick={() => handleDownloadOutput('markdown')}
                    title="Download Markdown"
                    className="p-1 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold flex items-center gap-1 px-2"
                  >
                    <Download className="h-3 w-3" /> .MD
                  </button>
                  <button
                    onClick={() => handleDownloadOutput('json')}
                    title="Download JSON"
                    className="p-1 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold flex items-center gap-1 px-2"
                  >
                    <Download className="h-3 w-3" /> .JSON
                  </button>
                </>
              )}

              <button
                onClick={() => setShowExecutionDrawer(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Console Content */}
          <div className="flex-1 overflow-y-auto p-4 bg-slate-950 text-slate-200 font-mono text-xs">
            {isExecuting ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-3">
                <div className="h-8 w-8 animate-spin rounded-full border-3 border-blue-500 border-t-transparent" />
                <p className="text-sm text-blue-400 font-semibold">
                  Executing Pipeline: {workflow.nodes.find(n => n.id === activeExecutingNodeId)?.title || 'Initializing...'}
                </p>
                <p className="text-[11px] text-slate-400">
                  Propagating context and tokens through connected agent nodes...
                </p>
              </div>
            ) : !latestExecutionLog ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-500 text-center space-y-2">
                <p>No execution recorded in this session.</p>
                <p className="text-[11px]">
                  Click the blue <strong className="text-blue-400">"Run Pipeline"</strong> button above to test your workflow chain.
                </p>
              </div>
            ) : (
              <div>
                {activeOutputTab === 'preview' && (
                  <div className="space-y-4">
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                        Final Delivery Summary:
                      </span>
                      <p className="text-sm font-sans font-medium text-slate-100 leading-relaxed whitespace-pre-wrap">
                        {latestExecutionLog.finalOutputSummary}
                      </p>
                    </div>

                    {/* Check if any AI node has rich generated text */}
                    {latestExecutionLog.steps.map((st, idx) => {
                      if (st.outputPayload?.generatedText) {
                        return (
                          <div key={idx} className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                            <span className="text-[10px] uppercase font-bold text-blue-400 block mb-2">
                              {st.nodeTitle} ({st.durationMs}ms):
                            </span>
                            <div className="font-sans text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
                              {st.outputPayload.generatedText}
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                )}

                {activeOutputTab === 'steps' && (
                  <div className="space-y-2">
                    {latestExecutionLog.steps.map((st, i) => (
                      <div
                        key={st.nodeId}
                        className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-slate-500 font-bold">0{i + 1}</span>
                          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                          <span className="font-bold text-slate-200">{st.nodeTitle}</span>
                          <span className="text-[10px] text-slate-400">({st.nodeType})</span>
                        </div>
                        <div className="flex items-center gap-4 text-[11px]">
                          <span className="text-emerald-400 font-bold">{st.durationMs}ms</span>
                          <span className="text-slate-500">
                            {new Date(st.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeOutputTab === 'json' && (
                  <pre className="text-xs font-mono text-emerald-400 whitespace-pre-wrap">
                    {JSON.stringify(latestExecutionLog, null, 2)}
                  </pre>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
