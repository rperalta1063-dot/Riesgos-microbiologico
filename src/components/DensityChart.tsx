import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface DensityChartProps {
  data: { x: number; name: string; value: number }[];
  color?: string;
  isDark?: boolean;
}

/**
 * Probability Density Plot for Monte Carlo Results
 */
export default function DensityChart({ data, color = "#10b981", isDark = false }: DensityChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center text-slate-500 font-mono text-[10px] uppercase tracking-widest italic gap-4 p-8 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
        <div className="w-12 h-12 rounded-full border-4 border-slate-100 dark:border-slate-800 border-t-teal-500 animate-spin" />
        Awaiting Data Stream...
      </div>
    );
  }

  // Calculate density: frequency / (total * binWidth)
  const chartData = data.map((d, i, arr) => {
    let binWidth = 1;
    if (i < arr.length - 1) {
      binWidth = arr[i+1].x - d.x;
    } else if (i > 0) {
      binWidth = d.x - arr[i-1].x;
    }
    binWidth = Math.max(binWidth, 1e-20);

    return {
      ...d,
      density: d.value / (10000 * binWidth)
    };
  });

  return (
    <div className="w-full h-full min-h-[220px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorDensity" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.4}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid 
            strokeDasharray="3 3" 
            vertical={false} 
            stroke={isDark ? '#334155' : '#f1f5f9'} 
            opacity={0.5} 
          />
          <XAxis 
            dataKey="x" 
            tick={{ fontSize: 9, fontWeight: 700, fill: isDark ? '#94a3b8' : '#64748b', fontFamily: 'monospace' }} 
            axisLine={false}
            tickLine={false}
            tickFormatter={(val) => {
              if (val === 0) return '0';
              if (val < 0.001 || val >= 1000) return val.toExponential(0);
              return val.toFixed(val < 1 ? 3 : 1);
            }}
          />
          <YAxis 
            tick={{ fontSize: 9, fontWeight: 700, fill: isDark ? '#94a3b8' : '#64748b', fontFamily: 'monospace' }} 
            axisLine={false}
            tickLine={false}
            tickFormatter={(val) => {
              if (val === 0) return '0';
              return val.toExponential(2);
            }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: isDark ? '#0f172a' : '#fff', 
              border: isDark ? '1px solid #1e293b' : '1px solid #e2e8f0',
              borderRadius: '16px', 
              boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
              fontSize: '10px',
              fontFamily: 'monospace'
            }}
            itemStyle={{ fontWeight: 'black', color: color, textTransform: 'uppercase' }}
            labelFormatter={(label) => `P(X=${Number(label).toExponential(3)})`}
            formatter={(val: number) => [val.toExponential(4), 'Densidad (PDF)']}
          />
          <Area 
            type="monotone" 
            dataKey="density" 
            stroke={color} 
            fillOpacity={1} 
            fill="url(#colorDensity)" 
            strokeWidth={3}
            animationDuration={2000}
            activeDot={{ r: 6, fill: color, stroke: '#fff', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
