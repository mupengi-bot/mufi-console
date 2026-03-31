import { useState, useEffect } from 'react';

interface TopBarProps {
  stats: { total: number; online: number; degraded: number; offline: number };
  onSettingsClick: () => void;
}

function useLastSync() {
  const [time, setTime] = useState(() => new Date().toLocaleTimeString('en-GB', { hour12: false }));
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date().toLocaleTimeString('en-GB', { hour12: false }));
    }, 30_000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export function TopBar({ stats, onSettingsClick }: TopBarProps) {
  const lastSync = useLastSync();
  const systemStatus =
    stats.offline > 0 ? 'Issues Detected' : stats.degraded > 0 ? 'Degraded' : 'All Systems Normal';
  const statusColor =
    stats.offline > 0
      ? 'text-[#ff3355]'
      : stats.degraded > 0
        ? 'text-yellow-400'
        : 'text-[#00ff88]';
  const statusDot =
    stats.offline > 0
      ? 'bg-[#ff3355]'
      : stats.degraded > 0
        ? 'bg-yellow-400'
        : 'bg-[#00ff88]';

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/[0.02] backdrop-blur-xl" style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}>
      <div className="flex items-center gap-3" style={{ marginLeft: 70 }}>
        <div className="text-xl font-bold tracking-tight">
          <span className="text-[#00aaff]">MUFI</span>
          <span className="text-white/70 ml-1.5 font-normal text-sm">Console</span>
        </div>
        <span className="text-[10px] text-white/20 bg-white/5 px-2 py-0.5 rounded-full font-mono">
          v0.1.0
        </span>
      </div>

      <div className="flex items-center gap-6" style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
        <div className="flex items-center gap-4 text-xs text-white/50">
          <div className="flex items-center gap-1.5">
            <span className="text-white/80 font-medium">{stats.total}</span> Agents
          </div>
          <div className="w-px h-3 bg-white/10" />
          <div className="flex items-center gap-1.5">
            <span className="text-[#00ff88] font-medium">{stats.online}</span> Online
          </div>
          {stats.degraded > 0 && (
            <>
              <div className="w-px h-3 bg-white/10" />
              <div className="flex items-center gap-1.5">
                <span className="text-yellow-400 font-medium">{stats.degraded}</span> Degraded
              </div>
            </>
          )}
          {stats.offline > 0 && (
            <>
              <div className="w-px h-3 bg-white/10" />
              <div className="flex items-center gap-1.5">
                <span className="text-[#ff3355] font-medium">{stats.offline}</span> Offline
              </div>
            </>
          )}
        </div>

        <div className="w-px h-4 bg-white/10" />

        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${statusDot} animate-pulse`} />
          <span className={`text-xs font-medium ${statusColor}`}>{systemStatus}</span>
        </div>

        <div className="w-px h-4 bg-white/10" />
        <span className="text-[10px] text-white/25 font-mono">Last sync: {lastSync}</span>

        <button
          onClick={onSettingsClick}
          className="p-2 rounded-lg hover:bg-white/5 transition-colors text-white/40 hover:text-white/70"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="8" cy="8" r="2.5" />
            <path d="M13.5 8a5.5 5.5 0 0 0-.1-.9l1.4-1.1a.3.3 0 0 0 .1-.4l-1.3-2.3a.3.3 0 0 0-.4-.1l-1.6.7a5 5 0 0 0-.8-.5L10.5.7a.3.3 0 0 0-.3-.2H7.8a.3.3 0 0 0-.3.2l-.3 1.7a5 5 0 0 0-.8.5l-1.6-.7a.3.3 0 0 0-.4.1L3.1 5.6a.3.3 0 0 0 .1.4l1.4 1.1A5.5 5.5 0 0 0 4.5 8a5.5 5.5 0 0 0 .1.9l-1.4 1.1a.3.3 0 0 0-.1.4l1.3 2.3a.3.3 0 0 0 .4.1l1.6-.7a5 5 0 0 0 .8.5l.3 1.7a.3.3 0 0 0 .3.2h2.4a.3.3 0 0 0 .3-.2l.3-1.7a5 5 0 0 0 .8-.5l1.6.7a.3.3 0 0 0 .4-.1l1.3-2.3a.3.3 0 0 0-.1-.4l-1.4-1.1a5.5 5.5 0 0 0 .1-.9z" />
          </svg>
        </button>
      </div>
    </header>
  );
}
