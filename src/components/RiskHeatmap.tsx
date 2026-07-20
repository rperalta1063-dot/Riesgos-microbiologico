import React from 'react';
import { motion } from 'motion/react';
import { SimulationResult } from '../types';
import { formatNumber, cn } from '../lib/utils';
import { useTheme } from '../hooks/useTheme';
import { AlertTriangle, ShieldCheck, Flame, Info } from 'lucide-react';

interface Props {
  result: SimulationResult;
}

const IMPACT_LEVELS = [
  { label: 'Insignificante', range: '< 10', threshold: 10, color: 'text-emerald-500' },
  { label: 'Menor', range: '10 - 100', threshold: 100, color: 'text-emerald-600' },
  { label: 'Moderado', range: '100 - 1k', threshold: 1000, color: 'text-amber-500' },
  { label: 'Mayor', range: '1k - 10k', threshold: 10000, color: 'text-rose-500' },
  { label: 'Catastrófico', range: '> 10k', threshold: Infinity, color: 'text-rose-700' },
];

const PROBABILITY_LEVELS = [
  { label: 'Muy Alta', range: '> 10⁻¹', threshold: 0.1 }, 
  { label: 'Alta', range: '10⁻² - 10⁻¹', threshold: 0.01 },
  { label: 'Media', range: '10⁻⁴ - 10⁻²', threshold: 0.0001 },
  { label: 'Baja', range: '10⁻⁶ - 10⁻⁴', threshold: 0.000001 },
  { label: 'Muy Baja', range: '< 10⁻⁶', threshold: 0 },
].reverse(); // Reverse so "Muy Baja" is at the bottom (index 0)

// Helper to determine the color zone for a cell (X is impact, Y is probability)
// 0: Green (Low), 1: Yellow (Moderate), 2: Orange (High), 3: Red (Extreme)
const getZone = (probIdx: number, impactIdx: number): number => {
  const sum = probIdx + impactIdx;
  if (sum <= 2) return 0; // Green
  if (sum <= 4) return 1; // Yellow
  if (sum <= 6) return 2; // Orange
  return 3; // Red
};

const ZONE_COLORS = [
  'bg-emerald-100/40 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800',
  'bg-amber-100/40 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800',
  'bg-pink-100/40 dark:bg-pink-900/20 border-pink-200 dark:border-pink-800',
  'bg-rose-200/40 dark:bg-rose-900/40 border-rose-300 dark:border-rose-700'
];

const ZONE_TEXT = [
  'text-emerald-700 dark:text-emerald-300',
  'text-amber-700 dark:text-amber-300',
  'text-pink-700 dark:text-pink-300',
  'text-rose-700 dark:text-rose-300'
];

export default function RiskHeatmap({ result }: Props) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const prob = result.summary.individualYearlyRisk;
  const cases = result.summary.annualCases;

  // Find Indices
  const impactIdx = IMPACT_LEVELS.findIndex(level => cases < level.threshold);
  const probIdx = PROBABILITY_LEVELS.findIndex((level, i, arr) => {
    const nextLevel = arr[i+1];
    if (!nextLevel) return prob >= level.threshold;
    return prob >= level.threshold && prob < nextLevel.threshold;
  });

  const finalImpactIdx = impactIdx === -1 ? 4 : impactIdx;
  const finalProbIdx = probIdx === -1 ? 4 : probIdx;

  const currentZone = getZone(finalProbIdx, finalImpactIdx);
  const zoneName = ['RIESGO BAJO', 'RIESGO MEDIO', 'RIESGO ALTO', 'RIESGO EXTREMO'][currentZone];
  const zoneIcon = [<ShieldCheck key="s" />, <Info key="i" />, <AlertTriangle key="a" />, <Flame key="f" />][currentZone];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 px-2">
        <div className="flex items-center gap-3">
          <div className={cn(
             "p-2 rounded-xl shadow-md transition-colors",
             ZONE_COLORS[currentZone].split(' ')[0],
             ZONE_TEXT[currentZone]
          )}>
            {React.cloneElement(zoneIcon as React.ReactElement, { className: "w-5 h-5" })}
          </div>
          <div>
            <h3 className={cn("text-base font-black tracking-tighter uppercase leading-none", ZONE_TEXT[currentZone])}>
              {zoneName}
            </h3>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-0.5 opacity-70">Perfil de Riesgo</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 shrink-0">
          <div className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg shadow-sm">
            <span className="block text-[7px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Impacto</span>
            <span className="text-xs font-mono font-black text-slate-700 dark:text-slate-200">{formatNumber(cases)}</span>
          </div>
          <div className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg shadow-sm">
            <span className="block text-[7px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Prob. Ind.</span>
            <span className="text-xs font-mono font-black text-slate-700 dark:text-slate-200">{prob < 0.0001 ? prob.toExponential(1) : prob.toFixed(4)}</span>
          </div>
        </div>
      </div>

      <div className="relative group max-w-2xl mx-auto py-4">
        {/* Axis Titles */}
        <div className="absolute -left-12 top-1/2 -translate-y-1/2 -rotate-90 text-[8px] font-black text-slate-400 uppercase tracking-[0.4em] whitespace-nowrap">
          Probabilidad Individual
        </div>
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-[8px] font-black text-slate-400 uppercase tracking-[0.4em] whitespace-nowrap">
          Impacto Social (Nº Casos)
        </div>

        {/* Heatmap Grid */}
        <div className="grid grid-cols-[80px_1fr] gap-x-3">
          {/* Y-axis labels */}
          <div className="flex flex-col justify-between py-2 text-right pr-1">
            {[...PROBABILITY_LEVELS].reverse().map((level, i) => (
              <div key={i} className="flex flex-col h-full justify-center">
                <span className="text-[8px] font-black text-slate-700 dark:text-slate-200 uppercase leading-tight">{level.label}</span>
                <span className="text-[6px] font-mono text-slate-400 dark:text-slate-500">{level.range}</span>
              </div>
            ))}
          </div>

          <div className="space-y-3">
             <div className="grid grid-cols-5 gap-1.5 aspect-[5/2.8] relative">
               {/* Background Zones */}
               {Array.from({ length: 25 }).map((_, i) => {
                 const x = i % 5;
                 const y = 4 - Math.floor(i / 5); // Reverse Y for grid
                 const zone = getZone(y, x);
                 return (
                   <div 
                     key={i} 
                     className={cn(
                       "rounded-md border-[0.5px] transition-all duration-500",
                       ZONE_COLORS[zone]
                     )} 
                   />
                 );
               })}

               {/* Current Risk Marker */}
               <motion.div 
                 className="absolute w-5 h-5 flex items-center justify-center z-10"
                 initial={{ opacity: 0, scale: 0 }}
                 animate={{ 
                   opacity: 1, 
                   scale: 1,
                   left: `${(finalImpactIdx * 20) + 10}%`, 
                   bottom: `${(finalProbIdx * 20) + 10}%` 
                 }}
                 transition={{ type: 'spring', damping: 12, stiffness: 80, delay: 0.5 }}
                 style={{ translate: '-50% 50%' }}
               >
                 <div className="relative flex items-center justify-center">
                   <div className="absolute w-8 h-8 bg-black dark:bg-white rounded-full animate-ping opacity-10" />
                   <div className="w-3.5 h-3.5 bg-white dark:bg-slate-200 rounded-full shadow-lg border-2 border-slate-900 dark:border-white" />
                   <div className="absolute -top-10 bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-[7px] font-black px-1.5 py-0.5 rounded shadow-lg whitespace-nowrap uppercase tracking-widest border border-white/10 pointer-events-none mb-1">
                     Riesgo Detectado
                   </div>
                 </div>
               </motion.div>
             </div>

             {/* X-axis labels */}
             <div className="grid grid-cols-5 gap-1">
               {IMPACT_LEVELS.map((level, i) => (
                 <div key={i} className="text-center pt-0.5">
                   <div className="text-[8px] font-black text-slate-700 dark:text-slate-200 uppercase leading-tight truncate">{level.label}</div>
                   <div className="text-[6px] font-mono text-slate-400 dark:text-slate-500">{level.range}</div>
                 </div>
               ))}
             </div>
          </div>
        </div>

        {/* Legend Overlay */}
        <div className="flex justify-center gap-4 mt-6 pt-3 border-t border-slate-100 dark:border-slate-800">
          {['BAJO', 'MEDIO', 'ALTO', 'EXTREMO'].map((label, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <div className={cn("w-2.5 h-2.5 rounded-sm border", ZONE_COLORS[i])} />
              <span className="text-[7px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
