interface TokenBarProps {
  used: number;
  limit: number;
  size?: 'sm' | 'md';
}

function getBarGradient(pct: number): string {
  if (pct >= 90) return 'linear-gradient(90deg, #ff3355, #ff6680)';
  if (pct >= 70) return 'linear-gradient(90deg, #f59e0b, #fbbf24)';
  return 'linear-gradient(90deg, #00d4ff, #00e68a)';
}

export function TokenBar({ used, limit, size = 'sm' }: TokenBarProps) {
  const pct = Math.min((used / limit) * 100, 100);
  const h = size === 'sm' ? 4 : 6;

  return (
    <div className="w-full">
      <div
        className="w-full rounded-full overflow-hidden"
        style={{ height: h, backgroundColor: 'rgba(255,255,255,0.03)' }}
      >
        <div
          className="h-full rounded-full animate-bar-fill relative"
          style={{ width: `${pct}%`, background: getBarGradient(pct) }}
        >
          {/* Shimmer */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 4s linear infinite',
            }}
          />
        </div>
      </div>
      {size === 'md' && (
        <div className="flex justify-between mt-2 text-[11px] font-mono">
          <span className="text-white/30">{used.toLocaleString()}</span>
          <span className="text-white/15">{limit.toLocaleString()}</span>
        </div>
      )}
    </div>
  );
}
