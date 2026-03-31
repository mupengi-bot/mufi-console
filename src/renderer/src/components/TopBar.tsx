import { useState, useEffect } from 'react';

interface TopBarProps {
  stats: { total: number; online: number; degraded: number; offline: number };
  onSettingsClick: () => void;
}

function useTime() {
  const [t, setT] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setT(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);
  return t.toLocaleTimeString('en-GB', { hour12: false });
}

export function TopBar({ stats, onSettingsClick }: TopBarProps) {
  const time = useTime();
  const hasIssues = stats.offline > 0;
  const hasDegraded = stats.degraded > 0;
  const statusLabel = hasIssues ? 'ALERT' : hasDegraded ? 'WARN' : 'NOMINAL';
  const statusColor = hasIssues ? '#ff3355' : hasDegraded ? '#f59e0b' : '#00e68a';

  return (
    <header
      className="relative flex items-center justify-between h-12 px-5 bg-[#060a12]/90 backdrop-blur-2xl select-none"
      style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
    >
      {/* Bottom border gradient */}
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      {/* Left: Logo */}
      <div className="flex items-center gap-3">
        <span className="font-mono font-bold text-[15px] tracking-[0.25em] text-[#00d4ff]">MUFI</span>
        <div className="h-3.5 w-px bg-white/[0.06]" />
        <span className="text-[10px] font-mono text-white/20 tracking-wider">MISSION CONTROL</span>
      </div>

      {/* Right: Stats + Status */}
      <div className="flex items-center gap-4" style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
        {/* Compact stat pills */}
        <div className="flex items-center gap-1">
          <StatPill value={stats.online} label="ON" color="#00e68a" />
          {stats.degraded > 0 && <StatPill value={stats.degraded} label="DEG" color="#f59e0b" />}
          {stats.offline > 0 && <StatPill value={stats.offline} label="OFF" color="#ff3355" />}
        </div>

        <div className="h-3.5 w-px bg-white/[0.06]" />

        {/* System status badge */}
        <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-white/[0.02]">
          <div
            className="w-1.5 h-1.5 rounded-full animate-pulse-dot"
            style={{ backgroundColor: statusColor, boxShadow: `0 0 6px ${statusColor}40` }}
          />
          <span className="text-[10px] font-mono font-semibold tracking-wider" style={{ color: statusColor }}>
            {statusLabel}
          </span>
        </div>

        <div className="h-3.5 w-px bg-white/[0.06]" />

        {/* Clock */}
        <span className="text-[10px] font-mono text-white/15 tabular-nums w-[52px]">{time}</span>

        {/* Settings */}
        <button
          onClick={onSettingsClick}
          className="p-1.5 -mr-1 rounded-md hover:bg-white/[0.04] text-white/20 hover:text-white/50"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="8" cy="8" r="2.5" />
            <path d="M13.5 8a5.5 5.5 0 0 0-.1-.9l1.4-1.1a.3.3 0 0 0 .1-.4l-1.3-2.3a.3.3 0 0 0-.4-.1l-1.6.7a5 5 0 0 0-.8-.5L10.5.7a.3.3 0 0 0-.3-.2H7.8a.3.3 0 0 0-.3.2l-.3 1.7a5 5 0 0 0-.8.5l-1.6-.7a.3.3 0 0 0-.4.1L3.1 5.6a.3.3 0 0 0 .1.4l1.4 1.1A5.5 5.5 0 0 0 4.5 8a5.5 5.5 0 0 0 .1.9l-1.4 1.1a.3.3 0 0 0-.1.4l1.3 2.3a.3.3 0 0 0 .4.1l1.6-.7a5 5 0 0 0 .8.5l.3 1.7a.3.3 0 0 0 .3.2h2.4a.3.3 0 0 0 .3-.2l.3-1.7a5 5 0 0 0 .8-.5l1.6.7a.3.3 0 0 0 .4-.1l1.3-2.3a.3.3 0 0 0-.1-.4l-1.4-1.1a5.5 5.5 0 0 0 .1-.9z" />
          </svg>
        </button>
      </div>
    </header>
  );
}

function StatPill({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <div
      className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-semibold"
      style={{ backgroundColor: `${color}08`, color: `${color}cc` }}
    >
      {value}<span className="text-[8px] opacity-50 font-medium">{label}</span>
    </div>
  );
}
