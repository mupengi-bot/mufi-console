import { AgentStatus } from '../types/agent';

interface SearchBarProps {
  query: string;
  onQueryChange: (q: string) => void;
  statusFilter: AgentStatus | 'all';
  onStatusFilterChange: (f: AgentStatus | 'all') => void;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
}

const filters: { label: string; value: AgentStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Online', value: 'online' },
  { label: 'Degraded', value: 'degraded' },
  { label: 'Offline', value: 'offline' },
];

const filterColors: Record<string, string> = {
  all: 'bg-[#00aaff]/10 text-[#00aaff] border-[#00aaff]/20',
  online: 'bg-[#00ff88]/10 text-[#00ff88] border-[#00ff88]/20',
  degraded: 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20',
  offline: 'bg-[#ff3355]/10 text-[#ff3355] border-[#ff3355]/20',
};

export function SearchBar({ query, onQueryChange, statusFilter, onStatusFilterChange, searchInputRef }: SearchBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-5">
      <div className="relative flex-1">
        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20" width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="7" cy="7" r="5" />
          <path d="M11 11l3.5 3.5" />
        </svg>
        <input
          ref={searchInputRef}
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search agents... (⌘K)"
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-sm text-white/80 placeholder-white/20 focus:outline-none focus:border-[#00aaff]/30 transition-colors"
        />
      </div>
      <div className="flex gap-2">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => onStatusFilterChange(f.value)}
            className={`px-3 py-2 rounded-xl text-[11px] font-medium border transition-colors ${
              statusFilter === f.value
                ? filterColors[f.value]
                : 'bg-white/[0.03] border-white/[0.06] text-white/30 hover:text-white/50 hover:border-white/10'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );
}
