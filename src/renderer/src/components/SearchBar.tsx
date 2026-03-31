import { Agent, AgentStatus } from '../types/agent';

interface SearchBarProps {
  query: string;
  onQueryChange: (q: string) => void;
  statusFilter: AgentStatus | 'all';
  onStatusFilterChange: (f: AgentStatus | 'all') => void;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
  agents: Agent[];
}

const filters: { label: string; value: AgentStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Online', value: 'online' },
  { label: 'Degraded', value: 'degraded' },
  { label: 'Offline', value: 'offline' },
];

const COLORS: Record<string, string> = {
  all: '#00d4ff',
  online: '#00e68a',
  degraded: '#f59e0b',
  offline: '#ff3355',
};

export function SearchBar({ query, onQueryChange, statusFilter, onStatusFilterChange, searchInputRef, agents }: SearchBarProps) {
  const counts: Record<string, number> = {
    all: agents.length,
    online: agents.filter((a) => a.status === 'online').length,
    degraded: agents.filter((a) => a.status === 'degraded').length,
    offline: agents.filter((a) => a.status === 'offline').length,
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-5 animate-slide-up" style={{ animationDelay: '80ms' }}>
      {/* Search input */}
      <div className="relative flex-1">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-white/12" width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="7" cy="7" r="5" />
          <path d="M11 11l3.5 3.5" />
        </svg>
        <input
          ref={searchInputRef}
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search agents..."
          className="w-full pl-9 pr-14 py-2 rounded-md bg-white/[0.02] border border-white/[0.04] text-[13px] text-white/80 placeholder-white/12 focus:outline-none focus:border-[#00d4ff]/20 focus:bg-white/[0.03] transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.15)]"
        />
        <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] text-white/10 bg-white/[0.02] border border-white/[0.04] px-1.5 py-0.5 rounded font-mono hidden sm:block">⌘K</kbd>
      </div>

      {/* Filter pills */}
      <div className="flex gap-1">
        {filters.map((f) => {
          const active = statusFilter === f.value;
          const c = COLORS[f.value];
          return (
            <button
              key={f.value}
              onClick={() => onStatusFilterChange(f.value)}
              className="px-2.5 py-2 rounded-md text-[10px] font-mono font-semibold border transition-all"
              style={{
                backgroundColor: active ? `${c}0a` : 'rgba(255,255,255,0.015)',
                borderColor: active ? `${c}20` : 'rgba(255,255,255,0.03)',
                color: active ? c : 'rgba(255,255,255,0.2)',
              }}
            >
              {f.label} <span className="opacity-50">{counts[f.value]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
