import { useState, useMemo } from 'react';
import { Agent, AgentStatus } from '../types/agent';
import { AgentCard } from '../components/AgentCard';
import { AgentDetail } from '../components/AgentDetail';
import { SearchBar } from '../components/SearchBar';
import { SummaryCard } from '../components/SummaryCard';

interface DashboardProps {
  agents: Agent[];
  selectedAgent: Agent | null;
  onSelectAgent: (agent: Agent | null) => void;
  onRestart: (id: string) => void;
  onResetSession: (id: string) => void;
  onSwitchModel: (id: string, model: string) => void;
  onRestartAllOffline: () => void;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
}

export function Dashboard({
  agents,
  selectedAgent,
  onSelectAgent,
  onRestart,
  onResetSession,
  onSwitchModel,
  onRestartAllOffline,
  searchInputRef,
}: DashboardProps) {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<AgentStatus | 'all'>('all');

  const filtered = useMemo(() => {
    return agents.filter((a) => {
      if (statusFilter !== 'all' && a.status !== statusFilter) return false;
      if (query) {
        const q = query.toLowerCase();
        return (
          a.name.toLowerCase().includes(q) ||
          a.client.toLowerCase().includes(q) ||
          a.model.toLowerCase().includes(q) ||
          a.id.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [agents, query, statusFilter]);

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="mb-5">
        <h1 className="text-lg font-semibold text-white/90">Agent Dashboard</h1>
        <p className="text-xs text-white/30 mt-1">Monitor and manage your deployed AI agents</p>
      </div>

      <SummaryCard agents={agents} onRestartAllOffline={onRestartAllOffline} />

      <SearchBar
        query={query}
        onQueryChange={setQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        searchInputRef={searchInputRef}
      />

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-white/20">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-4 opacity-50">
            <circle cx="24" cy="24" r="20" />
            <path d="M17 17l14 14M31 17L17 31" strokeLinecap="round" />
          </svg>
          <p className="text-sm font-medium mb-1">No agents found</p>
          <p className="text-xs text-white/15">
            {query ? `No results for "${query}"` : 'No agents match the selected filter'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((agent) => (
            <AgentCard key={agent.id} agent={agent} onClick={() => onSelectAgent(agent)} />
          ))}
        </div>
      )}

      {selectedAgent && (
        <AgentDetail
          agent={selectedAgent}
          onClose={() => onSelectAgent(null)}
          onRestart={onRestart}
          onResetSession={onResetSession}
          onSwitchModel={onSwitchModel}
        />
      )}
    </div>
  );
}
