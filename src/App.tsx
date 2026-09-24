import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { LandingPage } from './components/landing/LandingPage';
import { DashboardHome } from './components/dashboard/DashboardHome';
import { VisualWorkflowBuilder } from './components/builder/VisualWorkflowBuilder';
import { WorkflowsList } from './components/workflows/WorkflowsList';
import { ExecutionLogsView } from './components/logs/ExecutionLogsView';
import { TemplatesGallery } from './components/templates/TemplatesGallery';
import { CredentialsManager } from './components/credentials/CredentialsManager';
import { SettingsView } from './components/settings/SettingsView';
import { PricingView } from './components/pricing/PricingView';
import { AuthModal } from './components/auth/AuthModal';

import { Workflow, ExecutionLog, UserProfile, ApiCredentials } from './types/workflow';
import { StorageService } from './services/storage';
import { WORKFLOW_TEMPLATES } from './data/templates';
import { runWorkflowPipeline } from './services/executionEngine';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('landing');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [logs, setLogs] = useState<ExecutionLog[]>([]);
  const [credentials, setCredentials] = useState<ApiCredentials>(StorageService.getCredentials());
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [activeWorkflow, setActiveWorkflow] = useState<Workflow | null>(null);
  const [quickRunNotice, setQuickRunNotice] = useState<string | null>(null);

  // Initialize data on mount
  useEffect(() => {
    const loadedUser = StorageService.getUser();
    setUser(loadedUser);

    const loadedWorkflows = StorageService.getWorkflows();
    setWorkflows(loadedWorkflows);

    const loadedLogs = StorageService.getLogs();
    setLogs(loadedLogs);

    const loadedTheme = StorageService.getTheme();
    setTheme(loadedTheme);
    StorageService.setTheme(loadedTheme);

    const loadedCreds = StorageService.getCredentials();
    setCredentials(loadedCreds);

    if (loadedWorkflows.length > 0) {
      setActiveWorkflow(loadedWorkflows[0]);
    }
  }, []);

  // Theme Toggle
  const handleToggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    StorageService.setTheme(nextTheme);
  };

  // Auth handlers
  const handleLoginSuccess = (loggedInUser: UserProfile) => {
    setUser(loggedInUser);
    StorageService.saveUser(loggedInUser);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    StorageService.saveUser(null);
    setCurrentView('landing');
  };

  // Workflow Handlers
  const handleSaveWorkflow = (updatedWf: Workflow) => {
    StorageService.saveWorkflow(updatedWf);
    const refreshed = StorageService.getWorkflows();
    setWorkflows(refreshed);
    setActiveWorkflow(updatedWf);
  };

  const handleDeleteWorkflow = (id: string) => {
    StorageService.deleteWorkflow(id);
    const refreshed = StorageService.getWorkflows();
    setWorkflows(refreshed);
    if (activeWorkflow?.id === id) {
      setActiveWorkflow(refreshed[0] || null);
    }
  };

  const handleDuplicateWorkflow = (id: string) => {
    const duplicated = StorageService.duplicateWorkflow(id);
    if (duplicated) {
      const refreshed = StorageService.getWorkflows();
      setWorkflows(refreshed);
      setActiveWorkflow(duplicated);
      setCurrentView('builder');
    }
  };

  const handleToggleWorkflow = (id: string) => {
    const wf = workflows.find(w => w.id === id);
    if (wf) {
      const updated = { ...wf, isEnabled: !wf.isEnabled };
      handleSaveWorkflow(updated);
    }
  };

  const handleNewWorkflow = () => {
    const newWf: Workflow = {
      id: `wf-${Date.now()}`,
      name: 'Untitled Agent Chain',
      description: 'Custom multi-step visual workflow pipeline.',
      category: 'Marketing',
      icon: 'Workflow',
      color: '#3B82F6',
      isEnabled: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      runCount: 0,
      successRate: 100,
      nodes: [
        {
          id: 'node-start',
          type: 'trigger_manual',
          title: 'Manual Input Trigger',
          category: 'trigger',
          description: 'Provide payload data to trigger execution.',
          position: { x: 100, y: 180 },
          config: {
            manualInputText: 'Enter your initial query, topic, or raw data here.',
          },
        },
        {
          id: 'node-ai-step',
          type: 'ai_text_gen',
          title: 'Gemini 2.5 Flash Processor',
          category: 'ai',
          description: 'Reason over input and generate structured response.',
          position: { x: 420, y: 180 },
          config: {
            model: 'gemini-2.5-flash',
            promptTemplate: 'Analyze input: "{input}" and extract key tactical opportunities.',
            temperature: 0.7,
          },
        },
      ],
      edges: [{ id: 'e-start-ai', fromNodeId: 'node-start', toNodeId: 'node-ai-step' }],
    };

    StorageService.saveWorkflow(newWf);
    setWorkflows(StorageService.getWorkflows());
    setActiveWorkflow(newWf);
    setCurrentView('builder');
  };

  const handleOpenWorkflowInBuilder = (workflow: Workflow) => {
    setActiveWorkflow(workflow);
    setCurrentView('builder');
  };

  const handleLoadTemplate = (template: Workflow) => {
    // Clone template as user workflow
    const instantiated: Workflow = {
      ...template,
      id: `wf-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: template.name,
      isTemplate: false,
      runCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    StorageService.saveWorkflow(instantiated);
    setWorkflows(StorageService.getWorkflows());
    setActiveWorkflow(instantiated);
    setCurrentView('builder');
  };

  // Quick Run Workflow directly from dashboard or workflow list
  const handleQuickRun = async (workflow: Workflow) => {
    setQuickRunNotice(`Triggering "${workflow.name}"...`);
    try {
      const log = await runWorkflowPipeline({
        workflow,
        credentials,
        stepDelayMs: 400,
      });
      StorageService.addLog(log);
      setLogs(StorageService.getLogs());
      setWorkflows(StorageService.getWorkflows());
      setQuickRunNotice(`✅ "${workflow.name}" completed successfully! (${(log.durationMs / 1000).toFixed(1)}s)`);
      setTimeout(() => setQuickRunNotice(null), 3000);
    } catch (e: any) {
      setQuickRunNotice(`❌ Pipeline run error: ${e?.message || 'Execution failed'}`);
      setTimeout(() => setQuickRunNotice(null), 4000);
    }
  };

  // Credentials Handler
  const handleSaveCredentials = (newCreds: ApiCredentials) => {
    StorageService.saveCredentials(newCreds);
    setCredentials(newCreds);
  };

  // User Profile Update
  const handleUpdateUser = (updatedUser: UserProfile) => {
    StorageService.saveUser(updatedUser);
    setUser(updatedUser);
  };

  // Plan Upgrade
  const handleUpgradePlan = (plan: 'free' | 'pro' | 'enterprise') => {
    if (!user) return;
    const updated: UserProfile = {
      ...user,
      plan,
      executionLimit: plan === 'free' ? 50 : 100000,
    };
    StorageService.saveUser(updated);
    setUser(updated);
  };

  // Export Complete Workspace Backup
  const handleExportAllData = () => {
    const backup = {
      app: 'FlowScale AI',
      exportedAt: new Date().toISOString(),
      user,
      workflows,
      logs,
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `flowscale-workspace-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  // Reset Workspace
  const handleResetWorkspace = () => {
    if (window.confirm('Reset all workflows and logs back to initial default presets?')) {
      localStorage.clear();
      const defWfs = StorageService.getWorkflows();
      const defLogs = StorageService.getLogs();
      const defUser = StorageService.getUser();
      setWorkflows(defWfs);
      setLogs(defLogs);
      setUser(defUser);
      setActiveWorkflow(defWfs[0]);
    }
  };

  const isLanding = currentView === 'landing';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-blue-500 selection:text-white transition-colors">
      {/* Quick Notification Toast */}
      {quickRunNotice && (
        <div className="fixed top-18 right-6 z-50 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-2.5 text-xs font-bold shadow-xl border border-slate-700 animate-slide-in flex items-center gap-2">
          <span>{quickRunNotice}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={setCurrentView}
        user={user}
        onOpenAuth={() => setAuthModalOpen(true)}
        onLogout={handleLogout}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onNewWorkflow={handleNewWorkflow}
      />

      {/* Main Body */}
      {isLanding ? (
        <main className="flex-1">
          <LandingPage
            onStartFree={() => {
              if (user) {
                setCurrentView('dashboard');
              } else {
                setAuthModalOpen(true);
              }
            }}
            onExploreTemplates={() => setCurrentView('templates')}
            onOpenTemplate={handleLoadTemplate}
            onNavigate={setCurrentView}
          />
        </main>
      ) : (
        <div className="flex flex-1 overflow-hidden">
          {/* Dashboard Sidebar */}
          <Sidebar
            currentView={currentView}
            onNavigate={setCurrentView}
            user={user}
            workflowCount={workflows.length}
          />

          {/* View Container */}
          <main className="flex-1 overflow-y-auto bg-slate-50/60 dark:bg-slate-950/60">
            {currentView === 'dashboard' && (
              <DashboardHome
                user={user}
                workflows={workflows}
                logs={logs}
                onNavigate={setCurrentView}
                onOpenWorkflow={handleOpenWorkflowInBuilder}
                onRunWorkflowQuick={handleQuickRun}
                onNewWorkflow={handleNewWorkflow}
              />
            )}

            {currentView === 'builder' && activeWorkflow && (
              <VisualWorkflowBuilder
                workflow={activeWorkflow}
                onSaveWorkflow={handleSaveWorkflow}
                onBack={() => setCurrentView('workflows')}
                credentials={credentials}
                onLogGenerated={newLog => {
                  StorageService.addLog(newLog);
                  setLogs(StorageService.getLogs());
                  setWorkflows(StorageService.getWorkflows());
                }}
              />
            )}

            {currentView === 'workflows' && (
              <WorkflowsList
                workflows={workflows}
                onOpenWorkflow={handleOpenWorkflowInBuilder}
                onNewWorkflow={handleNewWorkflow}
                onDeleteWorkflow={handleDeleteWorkflow}
                onDuplicateWorkflow={handleDuplicateWorkflow}
                onToggleWorkflow={handleToggleWorkflow}
                onRunQuick={handleQuickRun}
              />
            )}

            {currentView === 'logs' && (
              <ExecutionLogsView
                logs={logs}
                onClearLogs={() => {
                  StorageService.clearLogs();
                  setLogs([]);
                }}
              />
            )}

            {currentView === 'templates' && (
              <TemplatesGallery
                onLoadTemplate={handleLoadTemplate}
                onNavigate={setCurrentView}
              />
            )}

            {currentView === 'credentials' && (
              <CredentialsManager
                credentials={credentials}
                onSaveCredentials={handleSaveCredentials}
              />
            )}

            {currentView === 'settings' && (
              <SettingsView
                user={user}
                onUpdateUser={handleUpdateUser}
                theme={theme}
                onToggleTheme={handleToggleTheme}
                onExportAllData={handleExportAllData}
                onResetWorkspace={handleResetWorkspace}
              />
            )}

            {currentView === 'pricing' && (
              <PricingView user={user} onUpgradePlan={handleUpgradePlan} />
            )}
          </main>
        </div>
      )}

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}
