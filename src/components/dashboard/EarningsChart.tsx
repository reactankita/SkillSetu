'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { formatINR } from '@/lib/utils';

export function EarningsChart() {
  const [timeframe, setTimeframe] = useState<'7m' | '30d' | 'all'>('7m');

  // Realistic historical data points
  const dataPoints = [
    { label: 'Feb', value: 2800 },
    { label: 'Mar', value: 4200 },
    { label: 'Apr', value: 3800 },
    { label: 'May', value: 6900 },
    { label: 'Jun', value: 8400 },
    { label: 'Jul', value: 9800 },
    { label: 'Aug', value: 11200 },
  ];

  const maxValue = 12000;
  const height = 180;
  const width = 600;

  // Build SVG path
  const points = dataPoints.map((d, index) => {
    const x = (index / (dataPoints.length - 1)) * (width - 60) + 30;
    const y = height - (d.value / maxValue) * (height - 40) - 20;
    return { x, y, ...d };
  });

  const pathD = points.reduce((acc, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = points[i - 1];
    const cx1 = prev.x + (p.x - prev.x) / 2;
    const cy1 = prev.y;
    const cx2 = prev.x + (p.x - prev.x) / 2;
    const cy2 = p.y;
    return `${acc} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${p.x} ${p.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;

  return (
    <Card className="overflow-hidden border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
        <div>
          <CardTitle className="text-base text-slate-900 dark:text-slate-100">Earnings Overview</CardTitle>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Last 7 months verified earnings</p>
        </div>
        <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-xs font-semibold">
          <button
            type="button"
            onClick={() => setTimeframe('7m')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              timeframe === '7m'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            7 Months
          </button>
          <button
            type="button"
            onClick={() => setTimeframe('30d')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              timeframe === '30d'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            30 Days
          </button>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="relative w-full h-[200px]">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0D9488" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#0D9488" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid lines */}
            {[0, 2500, 5000, 7500, 10000].map((val) => {
              const y = height - (val / maxValue) * (height - 40) - 20;
              return (
                <g key={val}>
                  <line
                    x1="25"
                    y1={y}
                    x2={width - 25}
                    y2={y}
                    stroke="currentColor"
                    className="text-slate-200 dark:text-slate-800"
                    strokeDasharray="4 4"
                    strokeWidth="1"
                  />
                  <text x="0" y={y + 3} className="fill-slate-400 text-[9px] font-semibold">
                    {val === 0 ? '0' : `₹${val / 1000}k`}
                  </text>
                </g>
              );
            })}

            {/* Area Fill */}
            <path d={areaD} fill="url(#earningsGradient)" />

            {/* Line Path */}
            <path
              d={pathD}
              fill="none"
              stroke="#0D9488"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* Dots */}
            {points.map((p) => (
              <g key={p.label} className="group/point cursor-pointer">
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="4"
                  fill="#0B1727"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  className="transition-transform group-hover/point:r-6"
                />
                <text
                  x={p.x}
                  y={height - 2}
                  textAnchor="middle"
                  className="fill-slate-500 dark:fill-slate-400 text-[10px] font-semibold"
                >
                  {p.label}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </CardContent>
    </Card>
  );
}
