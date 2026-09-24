import React, { useState } from 'react';
import {
  KeyRound,
  ShieldCheck,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Save,
  Lock,
  Zap,
  ExternalLink,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { ApiCredentials } from '../../types/workflow';

interface CredentialsManagerProps {
  credentials: ApiCredentials;
  onSaveCredentials: (credentials: ApiCredentials) => void;
}

export const CredentialsManager: React.FC<CredentialsManagerProps> = ({
  credentials: initialCreds,
  onSaveCredentials,
}) => {
  const [creds, setCreds] = useState<ApiCredentials>(initialCreds);
  const [showGemini, setShowGemini] = useState(false);
  const [showOpenAi, setShowOpenAi] = useState(false);
  const [showSlack, setShowSlack] = useState(false);
  const [showNotion, setShowNotion] = useState(false);
  const [showWebhookSecret, setShowWebhookSecret] = useState(false);

  const [testingKey, setTestingKey] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ key: string; success: boolean; msg: string } | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveCredentials(creds);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  // Test live Gemini API connection
  const handleTestGemini = async () => {
    setTestingKey('gemini');
    setTestResult(null);

    const key = creds.geminiApiKey.trim();
    if (!key) {
      setTestResult({
        key: 'gemini',
        success: false,
        msg: 'Please paste a Gemini API Key before testing.',
      });
      setTestingKey(null);
      return;
    }

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: 'Respond with the word "CONNECTED"' }] }],
          }),
        }
      );

      if (res.ok) {
        setTestResult({
          key: 'gemini',
          success: true,
          msg: 'Connection verified! Gemini 2.5 Flash is ready for live agent calls.',
        });
      } else {
        const errorData = await res.json().catch(() => ({}));
        setTestResult({
          key: 'gemini',
          success: false,
          msg: errorData.error?.message || 'Invalid API Key or unauthorized request.',
        });
      }
    } catch (err: any) {
      setTestResult({
        key: 'gemini',
        success: false,
        msg: 'Network or validation error. Verify your key permissions.',
      });
    } finally {
      setTestingKey(null);
    }
  };

  const handleGenerateSecret = () => {
    const chars = '0123456789abcdef';
    let secret = 'whsec_';
    for (let i = 0; i < 32; i++) {
      secret += chars[Math.floor(Math.random() * chars.length)];
    }
    setCreds({ ...creds, webhookSigningSecret: secret });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/80 px-3 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-2">
            <Lock className="h-3.5 w-3.5" />
            <span>Encrypted Secret Vault</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            API Keys & Credentials
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Store integration tokens securely. Keys are stored locally and used exclusively for your automated workflow runs.
          </p>
        </div>

        {isSaved && (
          <div className="flex items-center gap-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950 px-3.5 py-2 text-xs font-bold text-emerald-600 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="h-4 w-4" />
            <span>Credentials Saved!</span>
          </div>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Gemini API Key */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
                AI
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Google Gemini API Key
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Powers Gemini 2.5 Flash, Gemini 2.0 Flash reasoning nodes.
                </p>
              </div>
            </div>

            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 self-start sm:self-auto"
            >
              <span>Get Free Key</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <div className="relative">
            <input
              type={showGemini ? 'text' : 'password'}
              value={creds.geminiApiKey}
              onChange={e => setCreds({ ...creds, geminiApiKey: e.target.value })}
              placeholder="AIzaSy..."
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 pl-4 pr-24 py-2.5 text-xs text-slate-900 dark:text-white font-mono placeholder-slate-400 focus:border-blue-500 focus:outline-none"
            />
            <div className="absolute right-2 top-2 flex items-center gap-1">
              <button
                type="button"
                onClick={() => setShowGemini(!showGemini)}
                className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showGemini ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
              <button
                type="button"
                onClick={handleTestGemini}
                disabled={testingKey === 'gemini'}
                className="rounded-lg bg-slate-100 dark:bg-slate-700 px-2.5 py-1 text-[11px] font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                {testingKey === 'gemini' ? 'Testing...' : 'Test Key'}
              </button>
            </div>
          </div>

          {testResult && testResult.key === 'gemini' && (
            <div
              className={`rounded-xl p-3 text-xs flex items-center gap-2 ${
                testResult.success
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                  : 'bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
              }`}
            >
              {testResult.success ? (
                <CheckCircle2 className="h-4 w-4 shrink-0" />
              ) : (
                <AlertCircle className="h-4 w-4 shrink-0" />
              )}
              <span>{testResult.msg}</span>
            </div>
          )}
        </div>

        {/* OpenAI API Key */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                OpenAI API Key
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Optional: For workflows utilizing GPT-4o or GPT-4o mini nodes.
              </p>
            </div>
          </div>

          <div className="relative">
            <input
              type={showOpenAi ? 'text' : 'password'}
              value={creds.openAiApiKey}
              onChange={e => setCreds({ ...creds, openAiApiKey: e.target.value })}
              placeholder="sk-proj-..."
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 pl-4 pr-12 py-2.5 text-xs text-slate-900 dark:text-white font-mono placeholder-slate-400 focus:border-blue-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowOpenAi(!showOpenAi)}
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              {showOpenAi ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Slack Incoming Webhook URL */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Default Slack Webhook URL
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              For Slack alert action nodes to post summaries into your workspace channels.
            </p>
          </div>

          <div className="relative">
            <input
              type={showSlack ? 'text' : 'password'}
              value={creds.slackWebhookUrl}
              onChange={e => setCreds({ ...creds, slackWebhookUrl: e.target.value })}
              placeholder="https://hooks.slack.com/services/..."
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 pl-4 pr-12 py-2.5 text-xs text-slate-900 dark:text-white font-mono placeholder-slate-400 focus:border-blue-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowSlack(!showSlack)}
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              {showSlack ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Webhook Signing Secret */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Inbound Webhook Verification Secret
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Verifies HMAC SHA-256 signatures for external webhook triggers.
              </p>
            </div>
            <button
              type="button"
              onClick={handleGenerateSecret}
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              <RefreshCw className="h-3 w-3" /> Generate New
            </button>
          </div>

          <div className="relative">
            <input
              type={showWebhookSecret ? 'text' : 'password'}
              value={creds.webhookSigningSecret}
              onChange={e => setCreds({ ...creds, webhookSigningSecret: e.target.value })}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 pl-4 pr-12 py-2.5 text-xs text-slate-900 dark:text-white font-mono focus:border-blue-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowWebhookSecret(!showWebhookSecret)}
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              {showWebhookSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700 active:scale-95 transition-all"
          >
            <Save className="h-4 w-4" />
            <span>Save All Credentials</span>
          </button>
        </div>
      </form>
    </div>
  );
};
