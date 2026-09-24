export type NodeCategory = 'trigger' | 'ai' | 'action';

export type NodeType =
  // Triggers
  | 'trigger_manual'
  | 'trigger_webhook'
  | 'trigger_schedule'
  | 'trigger_email'
  // AI Processing
  | 'ai_text_gen'
  | 'ai_summarizer'
  | 'ai_sentiment'
  | 'ai_translator'
  | 'ai_seo'
  // Actions
  | 'action_email'
  | 'action_json_export'
  | 'action_slack_notion'
  | 'action_markdown';

export type ExecutionStatus = 'idle' | 'running' | 'success' | 'failed';

export interface NodeConfig {
  promptTemplate?: string;
  temperature?: number;
  model?: string;
  targetLanguage?: string;
  summaryLength?: 'short' | 'medium' | 'detailed';
  recipientEmail?: string;
  emailSubject?: string;
  webhookUrl?: string;
  channelName?: string;
  destinationType?: 'slack' | 'notion';
  scheduleCron?: string;
  manualInputText?: string;
  customFormat?: string;
  seoFocusKeyword?: string;
  webhookMethod?: 'POST' | 'GET';
  authenticationHeader?: string;
}

export interface WorkflowNode {
  id: string;
  type: NodeType;
  title: string;
  category: NodeCategory;
  description: string;
  position: { x: number; y: number };
  config: NodeConfig;
  status?: ExecutionStatus;
  lastOutput?: any;
  lastRunTimeMs?: number;
  error?: string;
}

export interface WorkflowEdge {
  id: string;
  fromNodeId: string;
  toNodeId: string;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  category: 'Marketing' | 'Customer Support' | 'Engineering' | 'Operations' | 'Research';
  icon: string;
  color: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  isEnabled: boolean;
  createdAt: string;
  updatedAt: string;
  runCount: number;
  successRate: number;
  isTemplate?: boolean;
}

export interface StepLog {
  nodeId: string;
  nodeTitle: string;
  nodeType: NodeType;
  category: NodeCategory;
  status: 'success' | 'failed' | 'running';
  durationMs: number;
  inputPayload: any;
  outputPayload: any;
  error?: string;
  timestamp: string;
}

export interface ExecutionLog {
  id: string;
  workflowId: string;
  workflowName: string;
  startedAt: string;
  completedAt?: string;
  durationMs: number;
  status: 'success' | 'failed' | 'running';
  triggeredBy: string;
  steps: StepLog[];
  finalOutputSummary: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  plan: 'free' | 'pro' | 'enterprise';
  executionsThisMonth: number;
  executionLimit: number;
  joinedDate: string;
}

export interface ApiCredentials {
  geminiApiKey: string;
  openAiApiKey: string;
  slackWebhookUrl: string;
  notionApiKey: string;
  webhookSigningSecret: string;
}
