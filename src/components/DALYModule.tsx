import React from 'react';
import { SimulationResult, SimulationParams } from '../types';
import { motion } from 'motion/react';
import { HeartPulse, Skull, Activity, Info, TrendingUp, Shield } from 'lucide-react';
import { formatNumber, formatDecimal, cn } from '../lib/utils';
import { useLanguage } from '../hooks/useLanguage';
import { DALYBarChart } from './Charts';

interface Props {
  result: SimulationResult;
  params: SimulationParams;
}

export default function DALYModule({ result, params }: Props) {
  const { t } = useLanguage();
  const s = result.summary;

  // Constants used in engine (replicated here for breakdown)
  const YLL_PER_DEATH = 35;
  const ACUTE_DW = params.acuteDalyWeight || 0.05;
  const ACUTE_DURATION_YEARS = (params.acuteDurationDays || 5) / 365;

  const yll = s.annualDeaths * YLL_PER_DEATH;
  const yldAcute = s.annualCases * ACUTE_DW * ACUTE_DURATION_YEARS;
  const yldChronic = Math.max(0, s.annualDALYs - yll - yldAcute);
  const total = s.annualDALYs;

  const sections = [
    {
      label: t.yllLabel,
      sub: t.yllSub,
      value: yll,
      percent: (yll / total) * 100,
      icon: Skull,
      color: 'text-rose-500',
      bg: 'bg-rose-500/10'
    },
    {
      label: t.yldAcuteLabel,
      sub: t.yldAcuteSub,
      value: yldAcute,
      percent: (yldAcute / total) * 100,
      icon: Activity,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10'
    },
    {
      label: t.yldChronicLabel,
      sub: t.yldChronicSub,
      value: yldChronic,
      percent: (yldChronic / total) * 100,
      icon: HeartPulse,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10'
    }
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-5 shadow-[0_8px_40px_rgba(0,0,0,0.02)] relative overflow-hidden transition-all duration-500">
      <div className="absolute top-0 right-0 p-8 opacity-[0.02] dark:opacity-[0.05] pointer-events-none">
        <HeartPulse className="w-48 h-48 rotate-12" />
      </div>

      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-purple-600 rounded-2xl shadow-lg shadow-purple-500/20">
            <HeartPulse className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest leading-none mb-1">{t.dalyModuleTitle}</h3>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">{t.dalyModuleSub}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">Carga DALY Total</div>
          <div className="text-3xl font-black text-purple-600 dark:text-purple-400 italic font-serif leading-none tracking-tighter">
            {formatDecimal(total, 2)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start relative z-10">
        <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-3">
          {sections.map((section, i) => (
            <div key={i} className="group bg-slate-50 dark:bg-slate-800/40 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 transition-all hover:bg-white dark:hover:bg-slate-800 hover:shadow-md">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className={cn("p-1.5 rounded-xl", section.bg)}>
                    <section.icon className={cn("w-3.5 h-3.5", section.color)} />
                  </div>
                  <div className="text-[9px] font-black text-slate-900 dark:text-slate-200 uppercase tracking-wider">{section.label}</div>
                </div>
                <div className="text-[10px] font-black text-slate-900 dark:text-white font-mono">{section.percent.toFixed(1)}%</div>
              </div>
              
              <div className="text-xl font-black text-slate-900 dark:text-white font-serif italic mb-2">
                {formatDecimal(section.value, 2)}
              </div>

              <div className="w-full bg-slate-200/50 dark:bg-slate-700 h-1 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${section.percent}%` }}
                  transition={{ duration: 1, delay: i * 0.1 }}
                  className={cn("h-full shadow-[0_0_8px_rgba(0,0,0,0.15)]", section.color.replace('text-', 'bg-'))}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-7">
          <div className="bg-slate-50 dark:bg-slate-800/20 rounded-[2rem] p-4 border border-slate-100 dark:border-slate-800/50 h-full">
            <div className="flex items-center justify-between mb-4 px-2">
              <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Distribución de Incapacidad</div>
              <TrendingUp className="w-3.5 h-3.5 text-slate-300" />
            </div>
            <div className="h-[200px]">
              <DALYBarChart result={result} params={params} />
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col gap-3">
          {[
            { label: t.incidenceEst, icon: Activity, value: formatNumber(Math.round(s.annualCases)) },
            { label: t.mortalityBase, icon: Skull, value: `${YLL_PER_DEATH} años YLL` },
            { label: 'Peso Discapacidad (DW)', icon: Info, value: ACUTE_DW.toString() },
            { label: 'Metodología DALY', icon: Shield, value: 'WHO GBD 2024' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-transform hover:scale-[1.02]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                  <item.icon className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">{item.label}</span>
              </div>
              <span className="text-[11px] font-black text-slate-900 dark:text-white font-mono">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>

  );
}

