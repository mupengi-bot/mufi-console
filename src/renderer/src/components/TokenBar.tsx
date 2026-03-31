interface TokenBarProps {
  used: number;
  limit: number;
  size?: 'sm' | 'md';
}

export function TokenBar({ used, limit, size = 'sm' }: TokenBarProps) {
  const pct = Math.min((used / limit) * 100, 100);
  const color =
    pct >= 90 ? 'bg-[#ff3355]' : pct >= 70 ? 'bg-yellow-400' : 'bg-[#00ff88]';
  const height = size === 'sm' ? 'h-1.5' : 'h-2.5';

  return (
    <div className="w-full">
      <div className={`w-full ${height} rounded-full bg-white/5 overflow-hidden`}>
        <div
          className={`${height} rounded-full ${color} transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {size === 'md' && (
        <div className="flex justify-between mt-1 text-xs text-white/40">
          <span>{(used / 1000).toFixed(0)}k used</span>
          <span>{(limit / 1000).toFixed(0)}k limit</span>
        </div>
      )}
    </div>
  );
}
