"use client";

import { useMemo } from 'react';

interface DonutData {
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  data: DonutData[];
  size?: number;
  strokeWidth?: number;
  className?: string;
  showLegend?: boolean;
  centerText?: string;
  centerValue?: string;
}

export function DonutChart({
  data,
  size = 200,
  strokeWidth = 30,
  className = "",
  showLegend = true,
  centerText,
  centerValue,
}: DonutChartProps) {
  const { segments, total } = useMemo(() => {
    const totalValue = data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = -90; // Start from top

    const calculatedSegments = data.map((item) => {
      const percentage = (item.value / totalValue) * 100;
      const angle = (item.value / totalValue) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;

      currentAngle = endAngle;

      return {
        ...item,
        percentage,
        startAngle,
        endAngle,
      };
    });

    return {
      segments: calculatedSegments,
      total: totalValue,
    };
  }, [data]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  if (data.length === 0 || total === 0) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
        <p className="text-[#94a3b8] text-sm">Pas de données</p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="transform -rotate-90"
        >
          {segments.map((segment, index) => {
            const dashArray = (segment.percentage / 100) * circumference;
            const previousSegments = segments.slice(0, index);
            const dashOffset =
              circumference -
              previousSegments.reduce((sum, seg) => {
                return sum + (seg.percentage / 100) * circumference;
              }, 0);

            return (
              <circle
                key={index}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={segment.color}
                strokeWidth={strokeWidth}
                strokeDasharray={`${dashArray} ${circumference}`}
                strokeDashoffset={-dashOffset}
                strokeLinecap="round"
                className="transition-all duration-500 hover:opacity-80 cursor-pointer"
                style={{
                  filter: `drop-shadow(0 2px 4px ${segment.color}40)`,
                }}
              />
            );
          })}
        </svg>

        {/* Center text */}
        {(centerText || centerValue) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {centerValue && (
              <div className="text-3xl font-bold text-[#0f172a]">{centerValue}</div>
            )}
            {centerText && (
              <div className="text-sm text-[#64748b] font-medium">{centerText}</div>
            )}
          </div>
        )}
      </div>

      {/* Legend */}
      {showLegend && (
        <div className="grid grid-cols-2 gap-3 w-full">
          {segments.map((segment, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: segment.color }}
              />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-[#0f172a] truncate">
                  {segment.label}
                </div>
                <div className="text-xs text-[#64748b]">
                  {segment.value} ({segment.percentage.toFixed(1)}%)
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
