'use client';

import { SensorData } from '@/types';

interface SensorCardProps {
  name: string;
  value: number;
  unit: string;
  data: SensorData;
  decimals?: number;
}

export default function SensorCard({ name, value, unit, data, decimals = 1 }: SensorCardProps) {
  const { trend, alarm, history } = data;

  // Simple sparkline
  const sparklinePoints = history.slice(-60); // Last 60 points
  const min = Math.min(...sparklinePoints);
  const max = Math.max(...sparklinePoints);
  const range = max - min || 1;

  const sparklinePath = sparklinePoints
    .map((val, idx) => {
      const x = (idx / (sparklinePoints.length - 1)) * 100;
      const y = 100 - ((val - min) / range) * 100;
      return `${idx === 0 ? 'M' : 'L'} ${x},${y}`;
    })
    .join(' ');

  const trendIcon = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→';
  const trendColor = trend === 'up' ? 'text-status-yellow' : trend === 'down' ? 'text-status-blue' : 'text-gray-400';

  const statusColor = alarm ? 'status-red' : 'status-green';

  return (
    <div className="card-industrial">
      <div className="flex items-start justify-between mb-2">
        <div className="text-sm text-gray-400 font-semibold">{name}</div>
        <div className={`w-2 h-2 rounded-full bg-${statusColor} led-${alarm ? 'red' : 'green'}`} />
      </div>

      <div className="flex items-baseline gap-2 mb-2">
        <div className="text-3xl font-bold mono">{value.toFixed(decimals)}</div>
        <div className="text-sm text-gray-400">{unit}</div>
        <div className={`text-2xl ${trendColor}`}>{trendIcon}</div>
      </div>

      <div className="h-12 w-full">
        <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
          <path
            d={sparklinePath}
            fill="none"
            stroke="#00aaff"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>
    </div>
  );
}
