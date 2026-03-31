import { Agent } from '../types/agent';
import { Sparkline } from './Sparkline';

interface SummaryCardProps {
  agents: Agent[];
  onRestartAllOffline: () => void;
}

export function SummaryCard({ agents, onRestartAllOffline }: SummaryCardProps) {
  const totalUsed = agents.reduce((s, a) => s + a.tokensUsed, 0);
  const totalLimit = agents.reduce((s, a) => s + a.tokensLimit, 0);
  const pct = totalLimit > 0 ? Math.round((totalUsed / totalLimit) * 100) : 0;
  const onlineCount = agents.filter((a) => a.status === 'online').length;
  const degradedCount = agents.filter((a) => a.status === 'degraded').length;
  const offlineCount = agents.filter((a) => a.status === 'offline').length;
  const totalMessages = agents.reduce((s, a) => s + a.messagesProcessed, 0);
  const avgUptime = ((onlineCount + degradedCount) / agents.length * 100).toFixed(1);

  // Fake historical data for sparklines
  const tokenHistory = [32, 38, 41, 35, 44, 48, pct];
  const msgHistory = [1200, 1800, 2100, 1900, 2400, 2800, 3200];

  return (
    <div className="relative rounded-lg border border-white/[0.04] bg-[#080c16]/60 mb-6 overflow-hidden animate-fade-in">
      {/* Top accent */}
      <div className="h-px bg-gradient-to-r from-[#00d4ff]/20 via-[#00d4ff]/5 to-transparent" />

      <div className="grid grid-cols-2 lg:grid-cols-5 divide-x divide-white/[0.03]">
        {/* Token Usage */}
        <MetricCell>
          <MetricLabel>Token Budget</MetricLabel>
          <div className="flex items-baseline gap-1.5">
            <MetricValue>{(totalUsed / 1_000_000).toFixed(2)}</MetricValue>
            <span className="text-[11px] text-white/20 font-mono">/ {(totalLimit / 1_000_000).toFixed(0)}M</span>
          </div>
          <div className="mt-2 flex items-center gap-3">
            <div className="flex-1 h-1 rounded-full bg-white/[0.03] overflow-hidden">
              <div
                className="h-1 rounded-full animate-bar-fill"
                style={{
                  width: `${pct}%`,
                  background: pct >= 90 ? '#ff3355' : pct >= 70 ? '#f59e0b' : 'linear-gradient(90deg, #00d4ff, #00e68a)',
                }}
              />
            </div>
            <span className={`text-[10px] font-mono font-bold tabular-nums ${
              pct >= 90 ? 'text-[#ff3355]' : pct >= 70 ? 'text-[#f59e0b]' : 'text-white/30'
            }`}>{pct}%</span>
          </div>
          <div className="mt-2">
            <Sparkline data={tokenHistory} color="#00d4ff" height={18} />
          </div>
        </MetricCell>

        {/* Fleet Status */}
        <MetricCell>
          <MetricLabel>Fleet Status</MetricLabel>
          <div className="flex items-baseline gap-1">
            <MetricValue color="#00e68a">{onlineCount}</MetricValue>
            <span className="text-[11px] text-white/15 font-mono">/ {agents.length}</span>
          </div>
          <div className="mt-2.5 flex gap-2">
            {degradedCount > 0 && (
              <StatusMini color="#f59e0b" count={degradedCount} label="deg" />
            )}
            {offlineCount > 0 && (
              <StatusMini color="#ff3355" count={offlineCount} label="off" />
            )}
            {degradedCount === 0 && offlineCount === 0 && (
              <span className="text-[10px] text-[#00e68a]/50 font-mono">ALL CLEAR</span>
            )}
          </div>
          <div className="mt-2 text-[10px] text-white/15 font-mono">
            Uptime: <span className="text-white/30">{avgUptime}%</span>
          </div>
        </MetricCell>

        {/* Messages */}
        <MetricCell>
          <MetricLabel>Messages</MetricLabel>
          <div className="flex items-baseline gap-1.5">
            <MetricValue>{totalMessages >= 1000 ? `${(totalMessages / 1000).toFixed(1)}K` : String(totalMessages)}</MetricValue>
            <span className="text-[10px] font-mono text-[#00e68a]/60">↑12%</span>
          </div>
          <div className="mt-2.5">
            <Sparkline data={msgHistory} color="#00e68a" height={18} />
          </div>
          <div className="mt-1.5 text-[10px] text-white/12 font-mono">7d trend</div>
        </MetricCell>

        {/* Avg Latency (fake) */}
        <MetricCell>
          <MetricLabel>Avg Latency</MetricLabel>
          <div className="flex items-baseline gap-1.5">
            <MetricValue>1.4</MetricValue>
            <span className="text-[11px] text-white/20 font-mono">sec</span>
            <span className="text-[10px] font-mono text-[#00e68a]/60">↓8%</span>
          </div>
          <div className="mt-2.5">
            <Sparkline data={[2.1, 1.8, 1.9, 1.6, 1.5, 1.3, 1.4]} color="#a78bfa" height={18} />
          </div>
          <div className="mt-1.5 text-[10px] text-white/12 font-mono">p50 response</div>
        </MetricCell>

        {/* Quick Action */}
        <MetricCell className="flex flex-col justify-between">
          <MetricLabel>Actions</MetricLabel>
          <button
            onClick={onRestartAllOffline}
            disabled={offlineCount === 0}
            className="mt-2 w-full px-3 py-2 rounded text-[11px] font-mono font-semibold transition-all disabled:opacity-15 disabled:cursor-not-allowed border"
            style={{
              backgroundColor: offlineCount > 0 ? 'rgba(255,51,85,0.06)' : 'rgba(255,255,255,0.02)',
              borderColor: offlineCount > 0 ? 'rgba(255,51,85,0.15)' : 'rgba(255,255,255,0.03)',
              color: offlineCount > 0 ? '#ff6680' : 'rgba(255,255,255,0.2)',
            }}
          >
            ↻ Restart Offline ({offlineCount})
          </button>
          <div className="mt-2 text-[9px] text-white/10 font-mono text-center">
            {offlineCount > 0 ? `${offlineCount} agent${offlineCount > 1 ? 's' : ''} down` : 'No action needed'}
          </div>
        </MetricCell>
      </div>
    </div>
  );
}

/* ---- Sub-components ---- */

function MetricCell({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`px-5 py-4 ${className}`}>{children}</div>;
}

function MetricLabel({ children }: { children: React.ReactNode }) {
  return <div className="text-[9px] uppercase tracking-[0.15em] text-white/20 font-semibold mb-1.5">{children}</div>;
}

function MetricValue({ children, color }: { children: React.ReactNode; color?: string }) {
  return (
    <span
      className="text-xl font-bold font-mono tabular-nums"
      style={{ color: color ?? 'rgba(255,255,255,0.85)', textShadow: color ? `0 0 20px ${color}15` : undefined }}
    >
      {children}
    </span>
  );
}

function StatusMini({ color, count, label }: { color: string; count: number; label: string }) {
  return (
    <div
      className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold"
      style={{ backgroundColor: `${color}08`, color }}
    >
      {count} {label}
    </div>
  );
}
