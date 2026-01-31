"use client";

import { useMemo } from 'react';

interface DataPoint {
  label: string;
  value: number;
}

interface ComparisonDataPoint {
  label: string;
  current: number;
  previous: number;
}

interface LineChartProps {
  data?: DataPoint[];
  comparisonData?: ComparisonDataPoint[];
  height?: number;
  color?: string;
  secondaryColor?: string;
  showGrid?: boolean;
  showLabels?: boolean;
  showLegend?: boolean;
  currentLabel?: string;
  previousLabel?: string;
  className?: string;
}

export function LineChart({
  data = [],
  comparisonData,
  height = 200,
  color = "#1e3a8a",
  secondaryColor = "#94a3b8",
  showGrid = true,
  showLabels = true,
  showLegend = false,
  currentLabel = "Cette année",
  previousLabel = "Année précédente",
  className = "",
}: LineChartProps) {
  const isComparison = !!comparisonData && comparisonData.length > 0;

  const { points, previousPoints, path, previousPath, yAxisLabels, labels } = useMemo(() => {
    if (isComparison) {
      const allValues = comparisonData!.flatMap(d => [d.current, d.previous]);
      const max = Math.max(...allValues, 0);
      const min = Math.min(...allValues, 0);
      const range = max - min || 1;

      const chartHeight = height - 40;
      const chartWidth = 100;
      const stepX = chartWidth / (comparisonData!.length - 1 || 1);

      const currentPoints = comparisonData!.map((d, i) => ({
        x: i * stepX,
        y: chartHeight - ((d.current - min) / range) * chartHeight + 20,
        value: d.current,
        label: d.label,
      }));

      const prevPoints = comparisonData!.map((d, i) => ({
        x: i * stepX,
        y: chartHeight - ((d.previous - min) / range) * chartHeight + 20,
        value: d.previous,
        label: d.label,
      }));

      const currentPathStr = currentPoints
        .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
        .join(' ');

      const prevPathStr = prevPoints
        .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
        .join(' ');

      const yLabels = [0, 0.25, 0.5, 0.75, 1].map(ratio => {
        const value = min + (range * ratio);
        const yPosition = chartHeight - (ratio * chartHeight) + 20;
        return { value, yPosition };
      });

      return {
        points: currentPoints,
        previousPoints: prevPoints,
        path: currentPathStr,
        previousPath: prevPathStr,
        yAxisLabels: yLabels,
        labels: comparisonData!.map(d => d.label),
      };
    }

    // Simple data mode
    if (data.length === 0) {
      return { points: [], previousPoints: [], path: "", previousPath: "", yAxisLabels: [], labels: [] };
    }

    const values = data.map(d => d.value);
    const max = Math.max(...values, 0);
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

    const yLabels = [0, 0.25, 0.5, 0.75, 1].map(ratio => {
      const value = min + (range * ratio);
      const yPosition = chartHeight - (ratio * chartHeight) + 20;
      return { value, yPosition };
    });

    return {
      points: calculatedPoints,
      previousPoints: [],
      path: pathStr,
      previousPath: "",
      yAxisLabels: yLabels,
      labels: data.map(d => d.label),
    };
  }, [data, comparisonData, height, isComparison]);

  if ((data.length === 0 && !isComparison) || (isComparison && comparisonData!.length === 0)) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ height }}>
        <p className="text-[#94a3b8] text-sm">Pas de données disponibles</p>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Legend */}
      {showLegend && isComparison && (
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-xs font-medium text-[#0f172a]">{currentLabel}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: secondaryColor }} />
            <span className="text-xs font-medium text-[#64748b]">{previousLabel}</span>
          </div>
        </div>
      )}

      <div className="relative flex" style={{ height: showLegend ? height - 30 : height }}>
        {/* Y-axis labels */}
        <div className="flex flex-col justify-between pr-2 text-xs text-[#64748b] font-medium" style={{ minWidth: '50px' }}>
          {yAxisLabels.slice().reverse().map((label, i) => (
            <div key={i} className="leading-none text-right">
              {label.value >= 1000
                ? `${(label.value / 1000).toFixed(0)}k`
                : Math.round(label.value).toLocaleString()}
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="flex-1 relative">
          <svg
            viewBox={`0 0 100 ${height}`}
            className="w-full h-full"
            preserveAspectRatio="none"
          >
            {/* Horizontal grid lines */}
            {showGrid && (
              <g opacity="0.2">
                {yAxisLabels.map((label, i) => (
                  <line
                    key={`grid-${i}`}
                    x1="0"
                    y1={label.yPosition}
                    x2="100"
                    y2={label.yPosition}
                    stroke="currentColor"
                    strokeWidth="0.5"
                  />
                ))}
              </g>
            )}

            {/* Gradient definitions */}
            <defs>
              <linearGradient id="lineGradientCurrent" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                <stop offset="100%" stopColor={color} stopOpacity="0" />
              </linearGradient>
              <linearGradient id="lineGradientPrevious" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={secondaryColor} stopOpacity="0.15" />
                <stop offset="100%" stopColor={secondaryColor} stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Previous year - render first so it's behind */}
            {isComparison && previousPath && (
              <>
                <path
                  d={`${previousPath} L 100 ${height} L 0 ${height} Z`}
                  fill="url(#lineGradientPrevious)"
                />
                <path
                  d={previousPath}
                  fill="none"
                  stroke={secondaryColor}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="4,4"
                />
                {previousPoints.map((point, i) => (
                  <circle
                    key={`prev-${i}`}
                    cx={point.x}
                    cy={point.y}
                    r="2"
                    fill={secondaryColor}
                  />
                ))}
              </>
            )}

            {/* Current year / main line */}
            <path
              d={`${path} L 100 ${height} L 0 ${height} Z`}
              fill="url(#lineGradientCurrent)"
            />
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
              {labels.map((label, i) => (
                <span
                  key={i}
                  className="text-xs text-[#64748b] font-medium"
                  style={{ flex: 1, textAlign: i === 0 ? 'left' : i === labels.length - 1 ? 'right' : 'center' }}
                >
                  {label}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
