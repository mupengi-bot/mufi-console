import { Agent } from '../types/agent';
import { TokenBar } from './TokenBar';
import { Sparkline } from './Sparkline';

interface AgentCardProps {
  agent: Agent;
  onClick: () => void;
  index?: number;
}

const STATUS = {
  online:   { color: '#00e68a', label: 'Online',   bg: 'rgba(0,230,138,0.04)' },
  degraded: { color: '#f59e0b', label: 'Degraded', bg: 'rgba(245,158,11,0.04)' },
  offline:  { color: '#ff3355', label: 'Offline',  bg: 'rgba(255,51,85,0.04)' },
} as const;

// Fake sparkline data per agent (deterministic from id)
function getSparkData(id: string): number[] {
  let seed = 0;
  for (let i = 0; i < id.length; i++) seed += id.charCodeAt(i);
  return Array.from({ length: 7 }, (_, i) => ((seed * (i + 3) * 17) % 80) + 20);
}

// Fake trend percentage
function getTrend(id: string): number {
  let seed = 0;
  for (let i = 0; i < id.length; i++) seed += id.charCodeAt(i);
  return ((seed % 41) - 12); // range roughly -12 to +28
}

export function AgentCard({ agent, onClick, index = 0 }: AgentCardProps) {
  const s = STATUS[agent.status];
  const pct = Math.round((agent.tokensUsed / agent.tokensLimit) * 100);
  const trend = getTrend(agent.id);
  const sparkData = getSparkData(agent.id);
  const trendPositive = trend >= 0;

  return (
    <button
      onClick={onClick}
      className="animate-slide-up group relative w-full text-left rounded-lg overflow-hidden border border-white/[0.04] hover:border-white/[0.08] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#00d4ff]/30 transition-all duration-200 hover:-translate-y-px hover:shadow-lg hover:shadow-black/20"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Status left stripe */}
      <div className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ backgroundColor: s.color }} />

      {/* Card body */}
      <div className="pl-5 pr-4 py-4" style={{ backgroundColor: s.bg }}>
        {/* Row 1: Identity + Status */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="text-xl w-9 h-9 flex items-center justify-center rounded-md bg-white/[0.03] border border-white/[0.04] shrink-0">
              {agent.avatar}
            </div>
            <div className="min-w-0">
              <h3 className="text-[13px] font-semibold text-white/90 leading-tight truncate group-hover:text-white transition-colors">
                {agent.name}
              </h3>
              <p className="text-[10px] text-white/25 mt-0.5 truncate">{agent.client}</p>
            </div>
          </div>

          {/* Status badge */}
          <div
            className="flex items-center gap-1.5 px-2 py-0.5 rounded-sm text-[9px] font-mono font-semibold tracking-wide shrink-0"
            style={{ backgroundColor: `${s.color}10`, color: s.color }}
          >
            <div
              className={`w-1.5 h-1.5 rounded-full ${agent.status === 'online' ? 'animate-pulse-dot' : ''}`}
              style={{ backgroundColor: s.color }}
            />
            {s.label.toUpperCase()}
          </div>
        </div>

        {/* Row 2: Model + Trend */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-mono text-[#00d4ff]/50 bg-[#00d4ff]/[0.04] px-1.5 py-px rounded border border-[#00d4ff]/[0.06]">
            {agent.model}
          </span>
          <div className="flex items-center gap-2">
            <Sparkline data={sparkData} color={s.color} height={16} />
            <span className={`text-[10px] font-mono font-semibold ${trendPositive ? 'text-[#00e68a]/70' : 'text-[#ff3355]/70'}`}>
              {trendPositive ? '↑' : '↓'}{Math.abs(trend)}%
            </span>
          </div>
        </div>

        {/* Row 3: Token bar — most visually prominent */}
        <div className="mb-3">
          <div className="flex items-baseline justify-between mb-1.5">
            <span className="text-[10px] font-medium text-white/20 uppercase tracking-wider">Tokens</span>
            <span className={`text-[11px] font-mono font-bold tabular-nums ${
              pct >= 90 ? 'text-[#ff3355]' : pct >= 70 ? 'text-[#f59e0b]' : 'text-white/40'
            }`}>
              {pct}%
            </span>
          </div>
          <TokenBar used={agent.tokensUsed} limit={agent.tokensLimit} />
          <div className="flex justify-between mt-1 text-[9px] font-mono text-white/12">
            <span>{(agent.tokensUsed / 1000).toFixed(0)}K</span>
            <span>{(agent.tokensLimit / 1000).toFixed(0)}K</span>
          </div>
        </div>

        {/* Row 4: Footer stats — secondary info, recedes */}
        <div className="flex items-center justify-between pt-2.5 border-t border-white/[0.03]">
          <span className="text-[10px] text-white/15 font-mono">{agent.lastActive}</span>
          <span className="text-[10px] text-white/15 font-mono">{agent.messagesProcessed.toLocaleString()} msgs</span>
        </div>
      </div>
    </button>
  );
}
