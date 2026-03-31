/**
 * CSS-only mini sparkline chart.
 * Takes an array of 7 values (e.g. last 7 data points) and renders
 * as a tiny bar chart.
 */
interface SparklineProps {
  data: number[];
  color?: string;
  height?: number;
}

export function Sparkline({ data, color = '#00d4ff', height = 20 }: SparklineProps) {
  const max = Math.max(...data, 1);

  return (
    <div className="flex items-end gap-px" style={{ height }}>
      {data.map((v, i) => {
        const h = Math.max((v / max) * height, 1);
        const isLast = i === data.length - 1;
        return (
          <div
            key={i}
            className="rounded-[1px] transition-all duration-300"
            style={{
              width: 3,
              height: h,
              backgroundColor: isLast ? color : `${color}40`,
              opacity: 0.4 + (i / data.length) * 0.6,
            }}
          />
        );
      })}
    </div>
  );
}
