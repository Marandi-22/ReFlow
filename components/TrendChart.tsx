'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

interface TrendChartProps {
  title: string;
  data: number[];
  color: string;
  unit: string;
  domain?: [number, number];
}

export default function TrendChart({ title, data, color, unit, domain }: TrendChartProps) {
  // Take last 300 points (5 minutes at 1Hz)
  const chartData = data.slice(-300).map((value, index) => ({
    index,
    value,
  }));

  return (
    <div className="card-industrial">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-semibold text-gray-400">{title}</div>
        <div className="text-xs text-gray-400">{unit}</div>
      </div>

      <ResponsiveContainer width="100%" height={120}>
        <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis
            dataKey="index"
            stroke="#666"
            tick={false}
            axisLine={{ stroke: '#333' }}
          />
          <YAxis
            stroke="#666"
            tick={{ fill: '#999', fontSize: 10 }}
            domain={domain || ['auto', 'auto']}
            axisLine={{ stroke: '#333' }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
