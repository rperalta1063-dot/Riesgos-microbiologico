import React from 'react';
import { motion } from 'motion/react';
import { DollarSign, TrendingUp, Info, Activity, AlertTriangle, Heart } from 'lucide-react';
import { SimulationResult, SimulationParams } from '../types';
import { formatCurrency, formatNumber } from '../lib/utils';

interface Props {
  result: SimulationResult;
  params: SimulationParams;
  onUpdateParams: (params: Partial<NonNullable<SimulationParams['economicParams']>>) => void;
}

export default function EconomicImpactCalculator({ result, params, onUpdateParams }: Props) {
  const econ = params.economicParams || {
    costPerCase: 500,
    costPerHospitalization: 5000,
    costPerDeath: 50000,
    costPerDALY: 25000,
  };

  const calculateImpacts = () => {
    const summary = result.summary;
    
    // Use the same logic as the engine to ensure consistency
    const caseCost = summary.annualCases * econ.costPerCase;
    const hospCost = summary.annualHospitalized * econ.costPerHospitalization;
    const deathCost = summary.annualDeaths * econ.costPerDeath;
    const dalyCost = summary.annualDALYs * econ.costPerDALY;
    
    // Include chronic costs from the engine results (pre-calculated based on physical outcomes)
    // We add chronic costs which are not directly editable in the calculator but are part of the engine's total
    const chronicCost = result.economicBreakdown.chronic - (summary.annualDALYs * (params.economicParams?.costPerDALY || 25000));
    
    // We also include intervention costs if they exist in the engine
    const interventionCost = result.economicBreakdown.intervention || 0;
    
    const total = caseCost + hospCost + deathCost + dalyCost + chronicCost + interventionCost;
    
    return {
      caseCost,
      hospCost,
      deathCost,
      dalyCost: dalyCost + chronicCost, // Merge chronic into DALY for simplicity in this UI
      total
    };
  };

  const impacts = calculateImpacts();

  const costInputs = [
    { key: 'costPerCase', label: 'Costo por Caso Leve', icon: Activity, color: 'blue' },
    { key: 'costPerHospitalization', label: 'Costo por Hospitalización', icon: AlertTriangle, color: 'amber' },
    { key: 'costPerDeath', label: 'Costo por Defunción (VSL)', icon: DollarSign, color: 'rose' },
    { key: 'costPerDALY', label: 'Costo por DALY (AVAD)', icon: Heart, color: 'emerald' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-emerald-500" />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">Calculadora de Impacto Económico</h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium italic">Personalice los costos unitarios para evaluar la carga financiera sistémica.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Settings Panel */}
        <div className="xl:col-span-1 space-y-6">
          <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
              <DollarSign className="w-3 h-3" /> Parámetros de Costo Unitario
            </h4>
            
            <div className="space-y-6">
              {costInputs.map((input) => (
                <div key={input.key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                      <input.icon className={`w-3 h-3 text-${input.color}-500`} />
                      {input.label}
                    </label>
                  </div>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">$</span>
                    <input
                      type="number"
                      value={econ[input.key as keyof typeof econ]}
                      onChange={(e) => onUpdateParams({ [input.key]: Number(e.target.value) })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 pl-8 pr-4 text-sm font-mono font-bold focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
              <div className="flex gap-3">
                <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <p className="text-[9px] text-blue-600 dark:text-blue-400 leading-relaxed font-medium">
                  Los valores por defecto representan promedios regionales. El ajuste del VSL (Value of Statistical Life) y el costo por DALY son críticos para la valoración social del riesgo.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-slate-900 dark:bg-slate-800 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 -mr-12 -mt-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />
            
            <div className="relative z-10 mb-12">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 mb-2">Impacto Total Proyectado</h4>
              <h2 className="text-6xl font-black tracking-tighter tabular-nums leading-none font-mono">
                {formatCurrency(impacts.total)}
              </h2>
              <p className="text-xs text-slate-400 mt-4 font-medium uppercase tracking-widest">Carga Económica Anual Estimada (USD)</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
              {[
                { label: 'Casos Clínicos', value: impacts.caseCost, icon: Activity, color: 'blue' },
                { label: 'Hospitalizaciones', value: impacts.hospCost, icon: AlertTriangle, color: 'amber' },
                { label: 'Mortalidad (VSL)', value: impacts.deathCost, icon: DollarSign, color: 'rose' },
                { label: 'Carga de Morbilidad (DALY)', value: impacts.dalyCost, icon: Heart, color: 'emerald' },
              ].map((item) => (
                <div key={item.label} className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 rounded-lg bg-${item.color}-500/20`}>
                      <item.icon className={`w-4 h-4 text-${item.color}-500`} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{item.label}</span>
                  </div>
                  <div className="text-2xl font-mono font-bold tracking-tighter">
                    {formatCurrency(item.value)}
                  </div>
                  <div className="mt-2 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(item.value / impacts.total) * 100}%` }}
                      className={`h-full bg-${item.color}-500`}
                    />
                  </div>
                  <div className="mt-2 text-[9px] font-mono text-slate-500 uppercase tracking-widest">
                    {((item.value / impacts.total) * 100).toFixed(1)}% del total
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-6 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center text-center">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Costo por Habitante</span>
              <span className="text-2xl font-mono font-black text-slate-900 dark:text-white tracking-tighter">
                {formatCurrency(impacts.total / result.summary.annualCases)}
              </span>
              <span className="text-[8px] text-slate-500 mt-1 uppercase font-medium">Promedio por Caso</span>
            </div>
            
            <div className="p-6 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center text-center">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">ROI en Prevención</span>
              <span className="text-2xl font-mono font-black text-emerald-500 tracking-tighter">
                {((impacts.total / 1000000) * 0.15).toFixed(2)}x
              </span>
              <span className="text-[8px] text-slate-500 mt-1 uppercase font-medium">Retorno Estimado 15% Reducción</span>
            </div>

            <div className="p-6 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center text-center">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Semanas de PIB</span>
              <span className="text-2xl font-mono font-black text-slate-900 dark:text-white tracking-tighter">
                {((impacts.total / 1000000000) * 100).toFixed(3)}%
              </span>
              <span className="text-[8px] text-slate-500 mt-1 uppercase font-medium">Carga vs PIB Regional</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
