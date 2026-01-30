"use client";

import { useMemo } from 'react';

interface DataPoint {
  label: string;
  value: number;
}

interface LineChartProps {
  data: DataPoint[];
  height?: number;
  color?: string;
  showGrid?: boolean;
  showLabels?: boolean;
  className?: string;
}

export function LineChart({
  data,
  height = 200,
  color = "#1e3a8a",
  showGrid = true,
  showLabels = true,
  className = "",
}: LineChartProps) {
  const { points, maxValue, minValue, path } = useMemo(() => {
    if (data.length === 0) return { points: [], maxValue: 0, minValue: 0, path: "" };

    const values = data.map(d => d.value);
    const max = Math.max(...values);
    const min = Math.min(...values, 0);
    const range = max - min || 1;

    const chartHeight = height - 40;
    const chartWidth = 100;
    const stepX = chartWidth / (data.length - 1 || 1);

    const calculatedPoints = data.map((d, i) => ({
      x: i * stepX,
      y: chartHeight - ((d.value - min) / range) * chartHeight + 20,
      value: d.value,
      label: d.label,
    }));

    const pathStr = calculatedPoints
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
      .join(' ');

    return {
      points: calculatedPoints,
      maxValue: max,
      minValue: min,
      path: pathStr,
    };
  }, [data, height]);

  if (data.length === 0) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ height }}>
        <p className="text-[#94a3b8] text-sm">Pas de données disponibles</p>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={{ height }}>
      <svg
        viewBox={`0 0 100 ${height}`}
        className="w-full h-full"
        preserveAspectRatio="none"
      >
        {/* Grid lines */}
        {showGrid && (
          <g opacity="0.1">
            {[0, 25, 50, 75, 100].map((y) => (
              <line
                key={`grid-${y}`}
                x1="0"
                y1={y}
                x2="100"
                y2={y}
                stroke="currentColor"
                strokeWidth="0.5"
              />
            ))}
          </g>
        )}

        {/* Gradient area under line */}
        <defs>
          <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Area fill */}
        <path
          d={`${path} L 100 ${height} L 0 ${height} Z`}
          fill="url(#lineGradient)"
        />

        {/* Line */}
        <path
          d={path}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="drop-shadow-sm"
        />

        {/* Points */}
        {points.map((point, i) => (
          <g key={i}>
            <circle
              cx={point.x}
              cy={point.y}
              r="3"
              fill="white"
              stroke={color}
              strokeWidth="2"
              className="hover:r-4 transition-all cursor-pointer"
            />
          </g>
        ))}
      </svg>

      {/* Labels */}
      {showLabels && (
        <div className="flex justify-between mt-2 px-1">
          {data.map((d, i) => (
            <span
              key={i}
              className="text-xs text-[#64748b] font-medium"
              style={{ flex: 1, textAlign: i === 0 ? 'left' : i === data.length - 1 ? 'right' : 'center' }}
            >
              {d.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
