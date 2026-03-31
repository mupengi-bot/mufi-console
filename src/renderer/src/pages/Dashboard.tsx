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
    <div className="flex-1 overflow-y-auto px-6 py-5">
      {/* Page header */}
      <div className="mb-5 animate-fade-in">
        <div className="flex items-baseline gap-3">
          <h1 className="text-[15px] font-bold text-white/90">Dashboard</h1>
          <span className="text-[10px] font-mono text-white/15">{agents.length} agents deployed</span>
        </div>
      </div>

      <SummaryCard agents={agents} onRestartAllOffline={onRestartAllOffline} />

      <SearchBar
        query={query}
        onQueryChange={setQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        searchInputRef={searchInputRef}
        agents={agents}
      />

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 animate-fade-in">
          <div className="w-10 h-10 rounded-full border border-white/[0.04] flex items-center justify-center mb-3">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/10">
              <circle cx="7" cy="7" r="5" />
              <path d="M11 11l3.5 3.5" strokeLinecap="round" />
            </svg>
          </div>
          <p className="text-[13px] font-medium text-white/20 mb-0.5">No agents found</p>
          <p className="text-[11px] text-white/10">
            {query ? `No results for "${query}"` : 'No agents match this filter'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {filtered.map((agent, i) => (
            <AgentCard key={agent.id} agent={agent} onClick={() => onSelectAgent(agent)} index={i} />
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
