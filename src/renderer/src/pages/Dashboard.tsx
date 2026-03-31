import { Agent } from '../types/agent';
import { AgentCard } from '../components/AgentCard';
import { AgentDetail } from '../components/AgentDetail';

interface DashboardProps {
  agents: Agent[];
  selectedAgent: Agent | null;
  onSelectAgent: (agent: Agent | null) => void;
  onRestart: (id: string) => void;
  onResetSession: (id: string) => void;
  onSwitchModel: (id: string, model: string) => void;
}

export function Dashboard({
  agents,
  selectedAgent,
  onSelectAgent,
  onRestart,
  onResetSession,
  onSwitchModel,
}: DashboardProps) {
  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-white/90">Agent Dashboard</h1>
        <p className="text-xs text-white/30 mt-1">Monitor and manage your deployed AI agents</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {agents.map((agent) => (
          <AgentCard key={agent.id} agent={agent} onClick={() => onSelectAgent(agent)} />
        ))}
      </div>

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
