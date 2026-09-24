import { Workflow, ExecutionLog, UserProfile, ApiCredentials } from '../types/workflow';
import { WORKFLOW_TEMPLATES } from '../data/templates';

const STORAGE_KEYS = {
  WORKFLOWS: 'flowscale_workflows_v1',
  LOGS: 'flowscale_logs_v1',
  USER: 'flowscale_user_v1',
  CREDENTIALS: 'flowscale_credentials_v1',
  THEME: 'flowscale_theme_v1',
};

// Initial Seed Execution Logs
const SEED_LOGS: ExecutionLog[] = [
  {
    id: 'exec-101',
    workflowId: 'tpl-blog-to-social',
    workflowName: 'Blog Post to Social Media Auto-Poster',
    startedAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    completedAt: new Date(Date.now() - 1000 * 60 * 18 + 2420).toISOString(),
    durationMs: 2420,
    status: 'success',
    triggeredBy: 'Manual Input: Autonomous AI Agents',
    finalOutputSummary: 'Drafted 800-word article, formatted 4-tweet thread and posted snippet to #growth-marketing Slack.',
    steps: [
      {
        nodeId: 'node-1',
        nodeTitle: 'Input Article Topic',
        nodeType: 'trigger_manual',
        category: 'trigger',
        status: 'success',
        durationMs: 40,
        inputPayload: 'Why Autonomous AI Agents Will Replace Monolithic SaaS in 2026',
        outputPayload: { event: 'TRIGGER_RECEIVED', source: 'Manual Input' },
        timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
      },
      {
        nodeId: 'node-2',
        nodeTitle: 'AI Blog Generator',
        nodeType: 'ai_text_gen',
        category: 'ai',
        status: 'success',
        durationMs: 1140,
        inputPayload: 'Why Autonomous AI Agents Will Replace Monolithic SaaS in 2026',
        outputPayload: {
          model: 'gemini-2.5-flash',
          tokensUsed: 620,
          generatedText: 'The SaaS industry is experiencing an unbundling event...',
        },
        timestamp: new Date(Date.now() - 1000 * 60 * 18 + 50).toISOString(),
      },
      {
        nodeId: 'node-3',
        nodeTitle: 'Social Repurposer',
        nodeType: 'ai_summarizer',
        category: 'ai',
        status: 'success',
        durationMs: 780,
        inputPayload: 'Article text...',
        outputPayload: {
          tldr: 'Autonomous agents unbundle software into agile, context-aware micro-loops.',
          socialSnippet: '🚀 Big tech shift: Autonomous AI agents are replacing rigid software stacks...',
        },
        timestamp: new Date(Date.now() - 1000 * 60 * 18 + 1200).toISOString(),
      },
      {
        nodeId: 'node-4',
        nodeTitle: 'Notify Growth Channel',
        nodeType: 'action_slack_notion',
        category: 'action',
        status: 'success',
        durationMs: 460,
        inputPayload: 'Social snippet...',
        outputPayload: { status: 'POSTED_SUCCESSFULLY', channel: '#growth-marketing' },
        timestamp: new Date(Date.now() - 1000 * 60 * 18 + 1980).toISOString(),
      },
    ],
  },
  {
    id: 'exec-102',
    workflowId: 'tpl-support-classifier',
    workflowName: 'Customer Support Ticket Categorizer',
    startedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    completedAt: new Date(Date.now() - 1000 * 60 * 45 + 1890).toISOString(),
    durationMs: 1890,
    status: 'success',
    triggeredBy: 'Email: support-inbox@flows.flowscale.ai',
    finalOutputSummary: 'Detected high urgency (score 9/10), drafted customer empathy response, and dispatched Zendesk webhook.',
    steps: [
      {
        nodeId: 'node-supp-1',
        nodeTitle: 'Inbound Ticket Email',
        nodeType: 'trigger_email',
        category: 'trigger',
        status: 'success',
        durationMs: 50,
        inputPayload: 'Urgent: Payment failed 3 times during checkout on Enterprise upgrade...',
        outputPayload: { event: 'EMAIL_RECEIVED', from: 'enterprise-client@acme.corp' },
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      },
      {
        nodeId: 'node-supp-2',
        nodeTitle: 'Sentiment & Urgency Analyzer',
        nodeType: 'ai_sentiment',
        category: 'ai',
        status: 'success',
        durationMs: 820,
        inputPayload: 'Payment failed ticket...',
        outputPayload: { urgencyLevel: '9 / 10', overallSentiment: 'Urgent & Critical' },
        timestamp: new Date(Date.now() - 1000 * 60 * 45 + 60).toISOString(),
      },
      {
        nodeId: 'node-supp-3',
        nodeTitle: 'Draft Resolution Response',
        nodeType: 'ai_text_gen',
        category: 'ai',
        status: 'success',
        durationMs: 710,
        inputPayload: 'Sentiment analysis...',
        outputPayload: { model: 'gemini-2.5-flash', response: 'Hi Acme team, we sincerely apologize...' },
        timestamp: new Date(Date.now() - 1000 * 60 * 45 + 890).toISOString(),
      },
      {
        nodeId: 'node-supp-4',
        nodeTitle: 'Dispatch to Zendesk/Intercom',
        nodeType: 'action_json_export',
        category: 'action',
        status: 'success',
        durationMs: 310,
        inputPayload: 'Resolution draft...',
        outputPayload: { httpStatus: 200, statusText: 'TICKET_UPDATED' },
        timestamp: new Date(Date.now() - 1000 * 60 * 45 + 1600).toISOString(),
      },
    ],
  },
  {
    id: 'exec-103',
    workflowId: 'tpl-lead-enrichment',
    workflowName: 'Lead Enrichment & Email Drafter',
    startedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    completedAt: new Date(Date.now() - 1000 * 60 * 120 + 2150).toISOString(),
    durationMs: 2150,
    status: 'success',
    triggeredBy: 'Webhook: /v1/hooks/lead_enrichment_webhook',
    finalOutputSummary: 'Enriched VP Marketing at CloudPeak and composed personalized 100-word intro email for sales AE.',
    steps: [],
  },
  {
    id: 'exec-104',
    workflowId: 'tpl-market-digest',
    workflowName: 'Daily Market Research Digest',
    startedAt: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    completedAt: new Date(Date.now() - 1000 * 60 * 300 + 3120).toISOString(),
    durationMs: 3120,
    status: 'success',
    triggeredBy: 'Schedule: 0 8 * * *',
    finalOutputSummary: 'Synthesized daily AI automation news and saved markdown briefing to workspace knowledge repository.',
    steps: [],
  },
  {
    id: 'exec-105',
    workflowId: 'tpl-blog-to-social',
    workflowName: 'Blog Post to Social Media Auto-Poster',
    startedAt: new Date(Date.now() - 1000 * 60 * 480).toISOString(),
    completedAt: new Date(Date.now() - 1000 * 60 * 480 + 980).toISOString(),
    durationMs: 980,
    status: 'failed',
    triggeredBy: 'Manual Run',
    finalOutputSummary: 'Workflow execution failed. Node Slack Notification returned 401 Unauthorized (invalid channel webhook secret).',
    steps: [],
  },
];

const DEFAULT_USER: UserProfile = {
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

const DEFAULT_CREDENTIALS: ApiCredentials = {
  geminiApiKey: '',
  openAiApiKey: '',
  slackWebhookUrl: 'https://hooks.slack.com/services/T0123/B0456/sample_slack_webhook',
  notionApiKey: '',
  webhookSigningSecret: 'whsec_98f4a13c9e830bd71a',
};

// Storage Utilities
export const StorageService = {
  getWorkflows(): Workflow[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.WORKFLOWS);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Failed reading workflows from localStorage', e);
    }
    // Default seed
    localStorage.setItem(STORAGE_KEYS.WORKFLOWS, JSON.stringify(WORKFLOW_TEMPLATES));
    return WORKFLOW_TEMPLATES;
  },

  saveWorkflows(workflows: Workflow[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.WORKFLOWS, JSON.stringify(workflows));
    } catch (e) {
      console.error('Failed saving workflows', e);
    }
  },

  getWorkflowById(id: string): Workflow | undefined {
    const list = this.getWorkflows();
    return list.find(w => w.id === id);
  },

  saveWorkflow(workflow: Workflow): void {
    const list = this.getWorkflows();
    const idx = list.findIndex(w => w.id === workflow.id);
    const updated = { ...workflow, updatedAt: new Date().toISOString() };
    if (idx >= 0) {
      list[idx] = updated;
    } else {
      list.unshift(updated);
    }
    this.saveWorkflows(list);
  },

  deleteWorkflow(id: string): void {
    const list = this.getWorkflows().filter(w => w.id !== id);
    this.saveWorkflows(list);
  },

  duplicateWorkflow(id: string): Workflow | undefined {
    const original = this.getWorkflowById(id);
    if (!original) return undefined;
    const duplicated: Workflow = {
      ...original,
      id: `flow-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: `${original.name} (Copy)`,
      isTemplate: false,
      runCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.saveWorkflow(duplicated);
    return duplicated;
  },

  // Execution Logs
  getLogs(): ExecutionLog[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LOGS);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Failed reading logs from storage', e);
    }
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(SEED_LOGS));
    return SEED_LOGS;
  },

  addLog(log: ExecutionLog): void {
    const logs = this.getLogs();
    logs.unshift(log);
    // Keep last 100 logs
    const capped = logs.slice(0, 100);
    try {
      localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(capped));
    } catch (e) {
      console.error('Failed saving log', e);
    }

    // Increment workflow run count
    const list = this.getWorkflows();
    const wf = list.find(w => w.id === log.workflowId);
    if (wf) {
      wf.runCount = (wf.runCount || 0) + 1;
      this.saveWorkflows(list);
    }

    // Increment user run count
    const user = this.getUser();
    if (user) {
      user.executionsThisMonth = (user.executionsThisMonth || 0) + 1;
      this.saveUser(user);
    }
  },

  clearLogs(): void {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify([]));
  },

  // User Profile
  getUser(): UserProfile | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Failed reading user', e);
    }
    // Return default logged in user for immediate seamless SaaS experience
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(DEFAULT_USER));
    return DEFAULT_USER;
  },

  saveUser(user: UserProfile | null): void {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEYS.USER);
      }
    } catch (e) {
      console.error('Failed saving user', e);
    }
  },

  // Credentials
  getCredentials(): ApiCredentials {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CREDENTIALS);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Failed reading credentials', e);
    }
    localStorage.setItem(STORAGE_KEYS.CREDENTIALS, JSON.stringify(DEFAULT_CREDENTIALS));
    return DEFAULT_CREDENTIALS;
  },

  saveCredentials(credentials: ApiCredentials): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CREDENTIALS, JSON.stringify(credentials));
    } catch (e) {
      console.error('Failed saving credentials', e);
    }
  },

  // Theme
  getTheme(): 'light' | 'dark' {
    try {
      const t = localStorage.getItem(STORAGE_KEYS.THEME);
      if (t === 'dark' || t === 'light') return t;
    } catch (e) {}
    return 'light';
  },

  setTheme(theme: 'light' | 'dark'): void {
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {}
  },
};
