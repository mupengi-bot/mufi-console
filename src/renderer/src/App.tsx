import { useState, useEffect, useRef, useCallback } from 'react';
import { TopBar } from './components/TopBar';
import { Dashboard } from './pages/Dashboard';
import { Settings } from './pages/Settings';
import { ToastProvider, useToast } from './components/Toast';
import { useAgents } from './hooks/useAgents';

type Page = 'dashboard' | 'settings';

function AppInner() {
  const [page, setPage] = useState<Page>('dashboard');
  const { agents, selectedAgent, selectAgent, restartAgent, resetSession, switchModel, restartAllOffline, stats } =
    useAgents();
  const { toast } = useToast();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleRestart = useCallback((id: string) => {
    if (!confirm('Restart this agent?')) return;
    restartAgent(id);
    toast('Agent Restarted', 'success');
  }, [restartAgent, toast]);

  const handleResetSession = useCallback((id: string) => {
    if (!confirm('Reset session for this agent? Token count and messages will be cleared.')) return;
    resetSession(id);
    toast('Session Reset', 'info');
  }, [resetSession, toast]);

  const handleSwitchModel = useCallback((id: string, model: string) => {
    switchModel(id, model);
    toast(`Model switched to ${model}`, 'info');
  }, [switchModel, toast]);

  const handleRestartAllOffline = useCallback(() => {
    if (!confirm('Restart all offline agents?')) return;
    restartAllOffline();
    toast('All offline agents restarted', 'success');
  }, [restartAllOffline, toast]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedAgent) {
        selectAgent(null);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setPage('dashboard');
        setTimeout(() => searchInputRef.current?.focus(), 50);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === ',') {
        e.preventDefault();
        setPage((p) => (p === 'settings' ? 'dashboard' : 'settings'));
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [selectedAgent, selectAgent]);

  return (
    <div className="h-screen flex flex-col bg-[#060a12] text-white font-sans overflow-hidden">
      <TopBar stats={stats} onSettingsClick={() => setPage(page === 'settings' ? 'dashboard' : 'settings')} />
      {page === 'dashboard' ? (
        <Dashboard
          agents={agents}
          selectedAgent={selectedAgent}
          onSelectAgent={selectAgent}
          onRestart={handleRestart}
          onResetSession={handleResetSession}
          onSwitchModel={handleSwitchModel}
          onRestartAllOffline={handleRestartAllOffline}
          searchInputRef={searchInputRef}
        />
      ) : (
        <Settings onBack={() => setPage('dashboard')} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppInner />
    </ToastProvider>
  );
}
