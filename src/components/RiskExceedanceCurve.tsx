import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { Info, Zap, AlertTriangle } from 'lucide-react';
import { SimulationResult } from '../types';
import { formatNumber } from '../lib/utils';

interface Props {
  result: SimulationResult;
}

export default function RiskExceedanceCurve({ result }: Props) {
  const data = result.cumulativeData;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const val = payload[0].value;
      const x = payload[0].payload.x;
      return (
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-2xl backdrop-blur-xl">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Umbral de Riesgo</p>
          <div className="flex items-baseline gap-2 mb-1">
             <span className="text-xl font-black text-white">{formatNumber(Math.round(x))}</span>
             <span className="text-[10px] text-slate-400 font-bold uppercase">Casos Anuales</span>
          </div>
          <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-teal-500" />
             <p className="text-xs text-teal-400 font-bold">
               Probabilidad de Excedencia: {val.toFixed(2)}%
             </p>
          </div>
          <p className="text-[9px] text-slate-500 mt-2 leading-relaxed italic">
            Existe un {val.toFixed(1)}% de probabilidad de que los casos anuales superen este valor.
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-1">
               <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-teal-500" /> Curva de Excedencia de Riesgo
              </h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Complementary Cumulative Distribution Function (CCDF)</p>
            </div>
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-teal-500/20 border border-teal-500/50" />
                  <span className="text-[10px] font-bold text-slate-500">Prob. Excedencia</span>
               </div>
            </div>
          </div>

          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="exceedanceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-slate-800" />
                <XAxis 
                  dataKey="x" 
                  type="number"
                  scale="log"
                  domain={['dataMin', 'dataMax']}
                  stroke="#94a3b8" 
                  fontSize={10} 
                  tickFormatter={(v) => formatNumber(v)}
                  label={{ value: 'Casos Anuales (Escala Log)', position: 'insideBottom', offset: -5, fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }}
                />
                <YAxis 
                  stroke="#94a3b8" 
                  fontSize={10} 
                  tickFormatter={(v) => `${v}%`}
                  label={{ value: 'Probabilidad de Excedencia (%)', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="exceedance" 
                  stroke="#14b8a6" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#exceedanceGradient)" 
                  animationDuration={1500}
                />
                <ReferenceLine y={50} stroke="#cbd5e1" strokeDasharray="5 5" label={{ value: 'Mediana (50%)', position: 'right', fill: '#94a3b8', fontSize: 9 }} />
                <ReferenceLine y={5} stroke="#f43f5e" strokeDasharray="5 5" label={{ value: 'Límite de Alerta (5%)', position: 'right', fill: '#f43f5e', fontSize: 9 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-8 flex items-center gap-3 p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5">
             <Info className="w-4 h-4 text-slate-400 shrink-0" />
             <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
               Esta curva indica la probabilidad de que el número de casos anuales supere un umbral determinado. Es la herramienta estándar de la OMS para comunicar la incertidumbre en la estimación del riesgo poblacional.
             </p>
          </div>
        </div>

        <div className="space-y-6">
           <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl" />
              <div className="relative z-10">
                 <span className="text-[10px] font-black text-teal-400 uppercase tracking-[0.2em] mb-4 block">Puntos de Referencia</span>
                 <h4 className="text-2xl font-black tracking-tight mb-6">Análisis de <br /> Probabilidad</h4>
                 
                 <div className="space-y-4">
                    {[
                      { label: 'Excedencia 90%', value: formatNumber(Math.round(result.stats.p10 * (result.summary.annualCases / result.summary.probIllness))), sub: 'Riesgo Base (Mínimo)' },
                      { label: 'Excedencia 50%', value: formatNumber(Math.round(result.stats.p50 * (result.summary.annualCases / result.summary.probIllness))), sub: 'Valor más probable' },
                      { label: 'Excedencia 5%', value: formatNumber(Math.round(result.stats.p95 * (result.summary.annualCases / result.summary.probIllness))), sub: 'Escenario Pesimista' },
                    ].map((ref) => (
                      <div key={ref.label} className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                         <div className="flex items-center justify-between mb-1">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{ref.label}</span>
                            <span className="text-xs font-mono font-bold text-white">{ref.value}</span>
                         </div>
                         <span className="text-[8px] text-slate-500 uppercase font-bold">{ref.sub}</span>
                      </div>
                    ))}
                 </div>
              </div>
           </div>

           <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200/50 dark:border-amber-900/30 rounded-3xl p-8">
              <div className="flex items-start gap-4">
                 <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-1" />
                 <div className="space-y-2">
                    <h5 className="text-[11px] font-black text-amber-900 dark:text-amber-200 uppercase tracking-widest">Interpretación del Riesgo</h5>
                    <p className="text-[10px] text-amber-800/70 dark:text-amber-400/60 leading-relaxed font-medium">
                      Si la curva de excedencia se desplaza hacia la derecha, el riesgo aumenta. Una curva más vertical indica menor incertidumbre, mientras que una curva más horizontal sugiere alta variabilidad en los datos de entrada.
                    </p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
