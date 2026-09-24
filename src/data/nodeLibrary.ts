import { NodeType, NodeCategory, NodeConfig } from '../types/workflow';

export interface NodeDefinition {
  type: NodeType;
  title: string;
  category: NodeCategory;
  description: string;
  defaultConfig: NodeConfig;
  badge: string;
}

export const NODE_DEFINITIONS: Record<NodeType, NodeDefinition> = {
  // Triggers
  trigger_manual: {
    type: 'trigger_manual',
    title: 'Manual Input',
    category: 'trigger',
    description: 'Manually pass custom prompt, text, or payload to trigger the pipeline.',
    defaultConfig: {
      manualInputText: 'How to scale B2B SaaS marketing in 2026 with autonomous AI workflows.',
    },
    badge: 'Manual',
  },
  trigger_webhook: {
    type: 'trigger_webhook',
    title: 'Webhook Listener',
    category: 'trigger',
    description: 'Receive real-time HTTP POST requests from external apps (Stripe, GitHub, Zapier).',
    defaultConfig: {
      webhookUrl: 'https://api.flowscale.ai/v1/hooks/prod_9a823bf1',
      webhookMethod: 'POST',
      authenticationHeader: 'Bearer sk_live_flowscale',
    },
    badge: 'HTTP Webhook',
  },
  trigger_schedule: {
    type: 'trigger_schedule',
    title: 'Schedule / Timer',
    category: 'trigger',
    description: 'Run automation on recurring cron schedule (daily, hourly, weekly).',
    defaultConfig: {
      scheduleCron: '0 9 * * 1-5 (Every weekday at 09:00 AM UTC)',
    },
    badge: 'Cron Timer',
  },
  trigger_email: {
    type: 'trigger_email',
    title: 'Email Trigger',
    category: 'trigger',
    description: 'Trigger automation whenever an inbound email hits your designated flow address.',
    defaultConfig: {
      recipientEmail: 'inbound-agent@flows.flowscale.ai',
    },
    badge: 'Inbound Email',
  },

  // AI Processors
  ai_text_gen: {
    type: 'ai_text_gen',
    title: 'AI Text Generator',
    category: 'ai',
    description: 'Generate high-fidelity reasoning, articles, or responses with Gemini 2.5 Flash / GPT-4o.',
    defaultConfig: {
      model: 'gemini-2.5-flash',
      promptTemplate: 'You are an industry expert. Using the input topic: "{input}", write a comprehensive, data-driven analysis with actionable takeaways.',
      temperature: 0.7,
    },
    badge: 'Gemini 2.5',
  },
  ai_summarizer: {
    type: 'ai_summarizer',
    title: 'AI Summarizer',
    category: 'ai',
    description: 'Distill lengthy text into executive summaries, key bullet points, or social snippets.',
    defaultConfig: {
      summaryLength: 'medium',
      promptTemplate: 'Summarize the input into 3 executive bullet points and a punchy 1-sentence TL;DR: {input}',
      temperature: 0.3,
    },
    badge: 'Distillation',
  },
  ai_sentiment: {
    type: 'ai_sentiment',
    title: 'Sentiment & Intent Analyzer',
    category: 'ai',
    description: 'Classify tone (Positive/Neutral/Urgent), customer intent, and urgency level.',
    defaultConfig: {
      promptTemplate: 'Analyze sentiment, emotional tone, and urgency score (1-10) of: {input}',
      temperature: 0.1,
    },
    badge: 'NLP Classifier',
  },
  ai_translator: {
    type: 'ai_translator',
    title: 'Language Translator',
    category: 'ai',
    description: 'Translate input text smoothly into 15+ target languages preserving nuance.',
    defaultConfig: {
      targetLanguage: 'Spanish (Español)',
      promptTemplate: 'Translate the following text into {targetLanguage} with native fluency: {input}',
      temperature: 0.2,
    },
    badge: 'Multi-lingual',
  },
  ai_seo: {
    type: 'ai_seo',
    title: 'SEO Optimizer',
    category: 'ai',
    description: 'Generate high-CTR title tags, meta descriptions, primary keywords, and schema outline.',
    defaultConfig: {
      seoFocusKeyword: 'AI workflow automation SaaS',
      promptTemplate: 'Optimize the content for SEO with keyword "{seoFocusKeyword}". Provide Title Tag (<60 chars), Meta Description (<155 chars), and 5 Search Keywords.',
      temperature: 0.4,
    },
    badge: 'SEO Score 95+',
  },

  // Actions
  action_email: {
    type: 'action_email',
    title: 'Send Email Notification',
    category: 'action',
    description: 'Deliver compiled pipeline results directly to a recipient email inbox.',
    defaultConfig: {
      recipientEmail: 'alex.marketing@company.io',
      emailSubject: '[FlowScale AI] Automated Report & Content Generated',
    },
    badge: 'SMTP Dispatch',
  },
  action_json_export: {
    type: 'action_json_export',
    title: 'JSON / Webhook Export',
    category: 'action',
    description: 'Send structured JSON payload via webhook POST to your backend, Zapier, or Make.',
    defaultConfig: {
      webhookUrl: 'https://webhook.site/sample-flowscale-target',
      customFormat: '{"status": "completed", "source": "flowscale", "data": "{input}"}',
    },
    badge: 'JSON API',
  },
  action_slack_notion: {
    type: 'action_slack_notion',
    title: 'Notion / Slack Notifier',
    category: 'action',
    description: 'Post updates to a Slack channel or create a new page in a Notion database.',
    defaultConfig: {
      destinationType: 'slack',
      channelName: '#growth-marketing-ai',
      webhookUrl: 'https://hooks.slack.com/services/T00/B00/XXXXX',
    },
    badge: 'Slack / Notion',
  },
  action_markdown: {
    type: 'action_markdown',
    title: 'Download Markdown File',
    category: 'action',
    description: 'Export the complete workflow output as a clean, ready-to-publish .md file.',
    defaultConfig: {
      customFormat: '# FlowScale AI Automation Export\n\nGenerated on {date}\n\n{input}',
    },
    badge: '.MD File',
  },
};
