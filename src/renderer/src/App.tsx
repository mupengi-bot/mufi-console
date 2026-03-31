import { useState } from 'react';
import { TopBar } from './components/TopBar';
import { Dashboard } from './pages/Dashboard';
import { Settings } from './pages/Settings';
import { useAgents } from './hooks/useAgents';

type Page = 'dashboard' | 'settings';

export default function App() {
  const [page, setPage] = useState<Page>('dashboard');
  const { agents, selectedAgent, selectAgent, restartAgent, resetSession, switchModel, stats } =
    useAgents();

  return (
    <div className="h-screen flex flex-col bg-[#0a0e17] text-white font-sans overflow-hidden">
      <TopBar stats={stats} onSettingsClick={() => setPage(page === 'settings' ? 'dashboard' : 'settings')} />
      {page === 'dashboard' ? (
        <Dashboard
          agents={agents}
          selectedAgent={selectedAgent}
          onSelectAgent={selectAgent}
          onRestart={restartAgent}
          onResetSession={resetSession}
          onSwitchModel={switchModel}
        />
      ) : (
        <Settings onBack={() => setPage('dashboard')} />
      )}
    </div>
  );
}
