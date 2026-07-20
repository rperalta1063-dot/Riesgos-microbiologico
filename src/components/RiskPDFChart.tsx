import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Info, BarChart3 } from 'lucide-react';
import { SimulationResult } from '../types';
import { formatNumber } from '../lib/utils';
import { useLanguage } from '../hooks/useLanguage';

interface Props {
  result: SimulationResult;
}

export default function RiskPDFChart({ result }: Props) {
  const { t } = useLanguage();
  const data = result.histogram;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const freq = payload[0].value;
      const x = payload[0].payload.x;
      return (
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-2xl backdrop-blur-xl">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">{t.pdfExposureFreq}</p>
          <div className="flex items-baseline gap-2 mb-1">
             <span className="text-xl font-black text-white">{x < 1e-3 ? x.toExponential(2) : formatNumber(x)}</span>
             <span className="text-[10px] text-slate-400 font-bold uppercase">{t.pdfDoseUnit}</span>
          </div>
          <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-blue-500" />
             <p className="text-xs text-blue-400 font-bold">
               {t.pdfDensityLabel}: {(freq * 100).toFixed(2)}%
             </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-1">
             <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-500" /> {t.pdfChartTitle}
            </h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{t.pdfChartSub}</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500/20 border border-blue-500/50" />
                <span className="text-[10px] font-bold text-slate-500">{t.pdfDensityLabel}</span>
             </div>
          </div>
        </div>

        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="pdfGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-slate-800" />
              <XAxis 
                dataKey="x" 
                type="number"
                scale="log"
                domain={['auto', 'auto']}
                stroke="#94a3b8" 
                fontSize={10} 
                tickFormatter={(v) => v < 1e-2 ? v.toExponential(0) : formatNumber(v)}
                label={{ value: t.pdfXAxisLabel, position: 'insideBottom', offset: -5, fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }}
              />
              <YAxis 
                stroke="#94a3b8" 
                fontSize={10} 
                tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
                label={{ value: t.pdfYAxisLabel, angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#3b82f6" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#pdfGradient)" 
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-8 flex items-center gap-3 p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5">
           <Info className="w-4 h-4 text-slate-400 shrink-0" />
           <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
             {t.pdfDescription}
           </p>
        </div>
      </div>
    </div>
  );
}
