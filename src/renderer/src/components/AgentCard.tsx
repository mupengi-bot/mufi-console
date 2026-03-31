import { Agent } from '../types/agent';
import { TokenBar } from './TokenBar';

interface AgentCardProps {
  agent: Agent;
  onClick: () => void;
}

const statusConfig = {
  online: { dot: 'bg-[#00ff88]', ring: 'ring-[#00ff88]/20', label: 'Online' },
  offline: { dot: 'bg-[#ff3355]', ring: 'ring-[#ff3355]/20', label: 'Offline' },
  degraded: { dot: 'bg-yellow-400', ring: 'ring-yellow-400/20', label: 'Degraded' },
};

export function AgentCard({ agent, onClick }: AgentCardProps) {
  const status = statusConfig[agent.status];
  const pct = Math.round((agent.tokensUsed / agent.tokensLimit) * 100);

  return (
    <button
      onClick={onClick}
      className="group relative w-full text-left rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-5 transition-all duration-300 hover:bg-white/[0.06] hover:border-white/[0.12] hover:shadow-lg hover:shadow-black/20 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00aaff]/50"
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-[#00aaff]/[0.03] to-transparent pointer-events-none" />

      <div className="relative">
        {/* Header: avatar + name + status */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="text-2xl w-10 h-10 flex items-center justify-center rounded-xl bg-white/5">
              {agent.avatar}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white/90">{agent.name}</h3>
              <p className="text-[11px] text-white/30 mt-0.5">{agent.client}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${status.dot} ${status.ring} ring-4 ${agent.status === 'online' ? 'animate-pulse' : ''}`} />
            <span className="text-[10px] text-white/40 font-medium">{status.label}</span>
          </div>
        </div>

        {/* Model */}
        <div className="mb-3">
          <span className="inline-block text-[10px] font-mono bg-white/5 text-[#00aaff]/80 px-2 py-0.5 rounded-md">
            {agent.model}
          </span>
        </div>

        {/* Token usage */}
        <div className="mb-3">
          <div className="flex justify-between text-[10px] text-white/30 mb-1">
            <span>Tokens</span>
            <span>{pct}%</span>
          </div>
          <TokenBar used={agent.tokensUsed} limit={agent.tokensLimit} />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-[10px] text-white/25">
          <span>Active {agent.lastActive}</span>
          <span>{agent.messagesProcessed.toLocaleString()} msgs</span>
        </div>
      </div>
    </button>
  );
}
