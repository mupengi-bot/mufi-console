import { Agent } from '../types/agent';

interface SummaryCardProps {
  agents: Agent[];
  onRestartAllOffline: () => void;
}

export function SummaryCard({ agents, onRestartAllOffline }: SummaryCardProps) {
  const totalUsed = agents.reduce((s, a) => s + a.tokensUsed, 0);
  const totalLimit = agents.reduce((s, a) => s + a.tokensLimit, 0);
  const pct = totalLimit > 0 ? Math.round((totalUsed / totalLimit) * 100) : 0;
  const degradedCount = agents.filter((a) => a.status === 'degraded').length;
  const offlineCount = agents.filter((a) => a.status === 'offline').length;
  const needsAttention = degradedCount + offlineCount;

  const color = pct >= 90 ? 'bg-[#ff3355]' : pct >= 70 ? 'bg-yellow-400' : 'bg-[#00ff88]';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
      {/* Total Token Usage */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-4">
        <div className="text-[10px] uppercase tracking-widest text-white/30 mb-2 font-medium">Total Token Usage</div>
        <div className="text-lg font-semibold text-white/90 font-mono">
          {(totalUsed / 1_000_000).toFixed(2)}M
          <span className="text-white/30 text-xs font-normal"> / {(totalLimit / 1_000_000).toFixed(1)}M</span>
        </div>
        <div className="mt-2 w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
          <div className={`h-1.5 rounded-full ${color} transition-all duration-500`} style={{ width: `${pct}%` }} />
        </div>
        <div className="text-[10px] text-white/25 mt-1">{pct}% consumed</div>
      </div>

      {/* Attention Needed */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-4">
        <div className="text-[10px] uppercase tracking-widest text-white/30 mb-2 font-medium">Needs Attention</div>
        {needsAttention > 0 ? (
          <div className="flex items-baseline gap-3">
            <span className="text-lg font-semibold text-yellow-400 font-mono">{needsAttention}</span>
            <span className="text-[11px] text-white/40">
              {degradedCount > 0 && <span className="text-yellow-400">{degradedCount} degraded</span>}
              {degradedCount > 0 && offlineCount > 0 && ' · '}
              {offlineCount > 0 && <span className="text-[#ff3355]">{offlineCount} offline</span>}
            </span>
          </div>
        ) : (
          <div className="text-lg font-semibold text-[#00ff88]">All Clear ✓</div>
        )}
      </div>

      {/* Quick Action */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-4 flex flex-col justify-between">
        <div className="text-[10px] uppercase tracking-widest text-white/30 mb-2 font-medium">Quick Actions</div>
        <button
          onClick={onRestartAllOffline}
          disabled={offlineCount === 0}
          className="px-4 py-2 rounded-xl text-xs font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed bg-[#00ff88]/10 border border-[#00ff88]/20 text-[#00ff88] hover:bg-[#00ff88]/20"
        >
          ↻ Restart All Offline ({offlineCount})
        </button>
      </div>
    </div>
  );
}
