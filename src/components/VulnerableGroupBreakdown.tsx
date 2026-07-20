import React from 'react';
import { SimulationResult, PopulationType } from '../types';
import { formatNumber, formatCurrency, cn } from '../lib/utils';
import { motion } from 'motion/react';
import { ShieldAlert, Activity, Users, DollarSign, HeartPulse } from 'lucide-react';

interface Props {
  result: SimulationResult;
  multiplier?: number;
}

const groupLabels: Record<string, string> = {
  general: 'Población General',
  elderly: 'Adultos Mayores (+65)',
  children: 'Infantes (0-5 años)',
  pregnant: 'Embarazadas',
  immunocompromised: 'Inmunocomprometidos',
  custom: 'Personalizado'
};

const groupIcons: Record<string, string> = {
  general: '🌎',
  elderly: '👴',
  children: '👶',
  pregnant: '🤰',
  immunocompromised: '🏥',
  custom: '⚙️'
};

export default function VulnerableGroupBreakdown({ result, multiplier = 1 }: Props) {
  const groups = result.summary.vulnerableResults || {};
  
  // Sort groups so general is first, then the rest
  const sortedGroups = Object.entries(groups).sort(([idA], [idB]) => {
    if (idA === 'general') return -1;
    if (idB === 'general') return 1;
    return 0;
  });
  
  const systemicTotalCases = Object.values(groups).reduce((acc, curr) => acc + curr.annualCases, 0);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-violet-500/10 border border-violet-500/20">
            <ShieldAlert className="w-5 h-5 text-violet-600" />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">Impacto Probabilístico por Cohorte</h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Comparativa de riesgo incremental y carga de salud para población general y grupos vulnerables.</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-6">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedGroups.map(([id, data], index) => (
            <motion.div
              key={id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-3xl p-6 relative overflow-hidden group/tile"
            >
              <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover/tile:scale-110 transition-transform duration-700">
                <ShieldAlert className="w-32 h-32" />
              </div>

              <div className="flex items-start justify-between mb-6 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-2xl shadow-inner">
                    {groupIcons[id] || '👥'}
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">{groupLabels[id] || id}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={cn(
                        "text-[9px] font-mono font-bold px-1.5 py-0.5 rounded uppercase tracking-widest",
                        id === 'general' ? "text-slate-600 bg-slate-500/10" : "text-violet-600 bg-violet-500/10"
                      )}>
                        {id === 'general' ? 'Referencia Global' : 'Grupo Específico'}
                      </span>
                      {id !== 'general' && data.probIllness > result.summary.probIllness && (
                        <span className="text-[9px] font-mono font-bold text-rose-500 bg-rose-500/10 px-1.5 py-0.5 rounded uppercase tracking-widest">
                          +{(((data.probIllness / result.summary.probIllness) - 1) * 100).toFixed(0)}% Riesgo
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 relative z-10">
                <div className="p-4 bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-3.5 h-3.5 text-rose-500" />
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Prob. Enfermedad</span>
                  </div>
                  <div className="text-3xl font-mono font-black text-slate-900 dark:text-white tracking-tighter">
                    {(data.probIllness * 100).toExponential(2)}%
                  </div>
                  <div className="text-[8px] font-mono text-slate-400 mt-1">
                    CI: [{(data.probIllnessCI[0] * 100).toExponential(1)}, {(data.probIllnessCI[1] * 100).toExponential(1)}]%
                  </div>
                </div>

                <div className="p-4 bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-3.5 h-3.5 text-blue-500" />
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Casos Anuales</span>
                  </div>
                  <div className="text-3xl font-mono font-black text-slate-900 dark:text-white tracking-tighter">
                    {formatNumber(Math.round(data.annualCases))}
                  </div>
                  <div className="text-[8px] font-mono text-slate-400 mt-1">
                    CI: [{formatNumber(Math.round(data.annualCasesCI[0]))}, {formatNumber(Math.round(data.annualCasesCI[1]))}]
                  </div>
                </div>

                <div className="p-4 bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                  <div className="flex items-center gap-2 mb-2">
                    <HeartPulse className="w-3.5 h-3.5 text-purple-500" />
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Carga DALYs</span>
                  </div>
                  <div className="text-3xl font-mono font-black text-slate-900 dark:text-white tracking-tighter">
                    {data.annualDALYs.toFixed(2)}
                  </div>
                  <div className="text-[8px] font-mono text-slate-400 mt-1">
                    Severidad Proporcional
                  </div>
                </div>

                <div className="p-4 bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Costo Total</span>
                  </div>
                  <div className="text-3xl font-mono font-black text-slate-900 dark:text-white tracking-tighter">
                    {formatCurrency(data.totalEconomicImpact * multiplier)}
                  </div>
                  <div className="text-[8px] font-mono text-slate-400 mt-1">
                    Proyección Económica {multiplier > 1 ? `(${multiplier}x)` : ''}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Proportional Summary Sidebar */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full xl:w-80 space-y-6"
        >
          <div className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-3xl p-8 h-full flex flex-col shadow-2xl relative overflow-hidden border border-blue-500/20">
            <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl" />
            
            <div className="relative z-10 mb-8">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-2">Resumen Proporcional</h4>
              <h3 className="text-3xl font-black tracking-tighter leading-none italic font-serif">Distribución Sistémica de Casos</h3>
            </div>

            <div className="flex-1 space-y-8 relative z-10">
              {sortedGroups.map(([id, data]) => {
                const percentage = (data.annualCases / systemicTotalCases) * 100;
                return (
                  <div key={id} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{groupIcons[id]}</span>
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-70">{groupLabels[id]}</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-blue-400">
                        {percentage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-white/10 dark:bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1.5, ease: "circOut" }}
                        className="h-full bg-gradient-to-r from-blue-600 to-blue-400"
                      />
                    </div>
                    <div className="flex justify-between items-center text-[9px] font-mono opacity-50">
                      <span>{formatNumber(Math.round(data.annualCases))} casos</span>
                      <span>de {formatNumber(Math.round(systemicTotalCases))}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 pt-8 border-t border-white/10 dark:border-slate-200 relative z-10">
              <div className="p-4 bg-white/5 dark:bg-slate-50 rounded-2xl border border-white/10 dark:border-slate-200">
                <p className="text-[9px] font-medium leading-relaxed opacity-70 italic">
                  * Este panel muestra la proporción real de casos clínicos estimada para cada cohorte dentro del sistema total de salud pública evaluado.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
