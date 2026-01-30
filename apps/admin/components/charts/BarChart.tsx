"use client";

interface BarData {
  label: string;
  value: number;
  color?: string;
}

interface BarChartProps {
  data: BarData[];
  height?: number;
  showValues?: boolean;
  className?: string;
}

export function BarChart({
  data,
  height = 200,
  showValues = true,
  className = "",
}: BarChartProps) {
  if (data.length === 0) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ height }}>
        <p className="text-[#94a3b8] text-sm">Pas de données disponibles</p>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d.value), 1);

  return (
    <div className={`${className}`} style={{ height }}>
      <div className="flex items-end justify-between gap-2 h-[calc(100%-30px)]">
        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * 100;
          const barColor = item.color || "#1e3a8a";

          return (
            <div
              key={index}
              className="flex-1 flex flex-col items-center gap-2 group"
            >
              <div className="relative flex-1 w-full flex items-end">
                {showValues && item.value > 0 && (
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-semibold text-[#0f172a] opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.value}
                  </div>
                )}
                <div
                  className="w-full rounded-t-lg transition-all duration-500 ease-out hover:opacity-80 cursor-pointer"
                  style={{
                    height: `${barHeight}%`,
                    backgroundColor: barColor,
                    boxShadow: `0 -2px 8px ${barColor}40`,
                  }}
                />
              </div>
              <span className="text-xs text-[#64748b] font-medium text-center line-clamp-2">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
