import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings2, BarChart2, Hash, Percent, ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';
import { DistributionType, DistributionConfig } from '../types';
import { QuickInterpretation, HelpTopic } from './QuickInterpretation';

interface Props {
  parameterName: string;
  label: string;
  value: number;
  config?: DistributionConfig;
  onConfigChange: (config: DistributionConfig | null) => void;
  onValueChange: (val: number) => void;
  min?: number;
  max?: number;
  step?: number;
  format?: (v: number) => string;
  infoTopic?: HelpTopic;
}

export default function DistributionSelector({ 
  parameterName, 
  label, 
  value, 
  config, 
  onConfigChange,
  onValueChange,
  min = 0,
  max = 1,
  step = 0.01,
  format = (v) => v.toString(),
  infoTopic
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  
  const type = config?.type || 'fixed';

  const types: { value: DistributionType; label: string; icon: any }[] = [
    { value: 'fixed', label: 'Constant', icon: Hash },
    { value: 'normal', label: 'Gaussian', icon: BarChart2 },
    { value: 'lognormal', label: 'Log-Normal', icon: BarChart2 },
    { value: 'beta', label: 'Beta (α,β)', icon: Percent },
  ];

  const handleTypeChange = (newType: DistributionType) => {
    if (newType === 'fixed') {
      onConfigChange(null);
    } else {
      const defaults: Record<string, DistributionConfig> = {
        normal: { type: 'normal', p1: value, p2: (max - min) / 5 },
        lognormal: { type: 'lognormal', p1: value, p2: 0.5 },
        beta: { type: 'beta', p1: 2, p2: 5 },
        fixed: { type: 'fixed', p1: value, p2: 0 }
      };
      onConfigChange(defaults[newType]);
    }
    setIsOpen(false);
  };

  const updateP1 = (val: number) => {
    if (type === 'fixed') {
      onValueChange(val);
    } else if (config) {
      onConfigChange({ ...config, p1: val });
    }
  };

  const updateP2 = (val: number) => {
    if (config) {
      onConfigChange({ ...config, p2: val });
    }
  };

  return (
    <div className="bg-white/50 dark:bg-slate-900/30 border border-slate-200/60 dark:border-slate-800 rounded-3xl mb-4 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.03)] overflow-hidden group/ds transition-all hover:shadow-[0_8px_30px_-5px_rgba(0,0,0,0.05)] backdrop-blur-sm relative">
      <div className="p-5 space-y-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-1.5 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.25em] leading-none">{label}</span>
              {infoTopic && <QuickInterpretation topic={infoTopic} variant="icon" className="w-3 h-3 text-slate-300 dark:text-slate-600 hover:text-indigo-500" />}
            </div>
            <div className="flex items-center gap-3 mt-1">
              <div className="w-12 h-5 opacity-50 group-hover/ds:opacity-100 transition-all duration-500 shrink-0">
                 <svg viewBox="0 0 40 12" className="w-full h-full text-teal-500 fill-none stroke-current stroke-2">
                    {type === 'normal' && <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} d="M0,10 Q10,10 20,2 L20,2 Q30,10 40,10" />}
                    {type === 'lognormal' && <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} d="M0,10 Q5,10 10,2 Q15,10 40,10" />}
                    {type === 'beta' && <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} d="M0,10 Q20,-5 40,10" />}
                    {type === 'fixed' && <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} d="M0,6 L40,6" />}
                 </svg>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-full border border-slate-200/50 dark:border-slate-700">
                <div className="w-1 h-1 rounded-full bg-teal-500 animate-pulse" />
                <span className="text-[9px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{type}</span>
              </div>
            </div>
          </div>
          
          <div className="flex bg-slate-100 dark:bg-slate-900/60 p-1 rounded-2xl shrink-0 border border-slate-200/50 dark:border-slate-800 shadow-inner">
            {types.map((t) => (
              <button
                key={t.value}
                onClick={() => handleTypeChange(t.value)}
                title={t.label}
                className={cn(
                  "p-2 rounded-xl transition-all duration-300 relative group/btn",
                  type === t.value 
                    ? "bg-white dark:bg-slate-700 shadow-md text-teal-600 border border-slate-100 dark:border-slate-600" 
                    : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                )}
              >
                <t.icon className="w-3.5 h-3.5" />
                <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 px-2.5 py-1.5 bg-slate-900 dark:bg-slate-800 text-white text-[8px] font-black uppercase rounded-lg shadow-xl opacity-0 group-hover/btn:opacity-100 pointer-events-none transition-all translate-y-1 group-hover/btn:translate-y-0 z-50 whitespace-nowrap border border-slate-700">
                  {t.label}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-900 dark:border-t-slate-800" />
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 py-1.5 px-1 bg-slate-50/50 dark:bg-slate-900/30 rounded-2xl border border-slate-100/50 dark:border-slate-800/50 shadow-inner">
          <span className="text-sm font-mono font-black text-slate-900 dark:text-white tabular-nums tracking-tighter ml-3">
            {type === 'fixed' ? format(value) : (
              <div className="flex items-center gap-3">
                 <div className="flex flex-col">
                    <span className="text-[8px] font-black text-slate-400 uppercase leading-none mb-0.5">Param 01</span>
                    <span className="text-[10px] font-mono font-bold text-teal-600 dark:text-teal-400">{(config?.p1 ?? 0).toFixed(2)}</span>
                 </div>
                 <div className="w-px h-6 bg-slate-200 dark:bg-slate-800" />
                 <div className="flex flex-col">
                    <span className="text-[8px] font-black text-slate-400 uppercase leading-none mb-0.5">Param 02</span>
                    <span className="text-[10px] font-mono font-bold text-teal-600 dark:text-teal-400">{(config?.p2 ?? 0).toFixed(2)}</span>
                 </div>
              </div>
            )}
          </span>
          {type === 'fixed' && (
            <div className="relative group/num mr-1">
              <input 
                type="number"
                value={isNaN(value) || value === undefined ? '' : value}
                onChange={(e) => onValueChange(parseFloat(e.target.value) || 0)}
                className="w-16 h-8 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[10px] font-mono font-black text-teal-600 text-center outline-none focus:ring-1 focus:ring-teal-500/30 transition-all shadow-sm"
              />
              <div className="absolute inset-0 rounded-xl border border-transparent group-hover/num:border-teal-500/20 pointer-events-none transition-colors" />
            </div>
          )}
        </div>
      </div>

      <div className="px-6 pb-6 pt-1">
        {type === 'fixed' ? (
          <div className="relative flex items-center h-6 group/inner-slider">
             <div className="absolute inset-x-0 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${((value - min) / (max - min)) * 100}%` }}
                  className="h-full bg-gradient-to-r from-teal-600 to-teal-400 shadow-[0_0_10px_rgba(20,184,166,0.3)]"
                />
             </div>
             <input 
              type="range"
              min={min}
              max={max}
              step={step}
              value={isNaN(value) || value === undefined ? min : value}
              onChange={(e) => updateP1(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-transparent appearance-none cursor-pointer relative z-10 accent-teal-600 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-teal-500 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:rounded-full"
            />
          </div>
        ) : (
          <div className="pt-4 space-y-6 border-t border-slate-100 dark:border-slate-800/50">
            <div className="space-y-3">
               <div className="flex justify-between items-center">
                  <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    {type === 'beta' ? 'Alfa (α)' : 'Media / Log-Media'}
                  </label>
                  <span className="text-[10px] font-mono font-bold text-teal-500 dark:text-teal-400 bg-teal-500/5 dark:bg-teal-500/10 px-2 py-0.5 rounded-full border border-teal-500/20">{(config?.p1 ?? 0).toFixed(3)}</span>
               </div>
               <div className="relative flex items-center h-6">
                  <div className="absolute inset-x-0 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full" />
                  <input 
                    type="range"
                    min={type === 'beta' ? 0.01 : min}
                    max={type === 'beta' ? 100 : max}
                    step={step}
                    value={config?.p1 ?? (type === 'beta' ? 0.01 : min)}
                    onChange={(e) => updateP1(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-transparent appearance-none cursor-pointer relative z-10 accent-teal-600 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-teal-500 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:rounded-full"
                  />
               </div>
            </div>
            <div className="space-y-3">
               <div className="flex justify-between items-center">
                  <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    {type === 'beta' ? 'Beta (β)' : 'Desviación / Log-Std'}
                  </label>
                  <span className="text-[10px] font-mono font-bold text-teal-500 dark:text-teal-400 bg-teal-500/5 dark:bg-teal-500/10 px-2 py-0.5 rounded-full border border-teal-500/20">{(config?.p2 ?? 0).toFixed(3)}</span>
               </div>
               <div className="relative flex items-center h-6">
                  <div className="absolute inset-x-0 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full" />
                  <input 
                    type="range"
                    min={type === 'beta' ? 0.01 : 0.01}
                    max={type === 'beta' ? 100 : (max - min) / 2}
                    step={type === 'beta' ? 0.1 : 0.01}
                    value={config?.p2 ?? 0.01}
                    onChange={(e) => updateP2(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-transparent appearance-none cursor-pointer relative z-10 accent-teal-600 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-teal-500 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:rounded-full"
                  />
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
