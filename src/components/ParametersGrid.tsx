import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Globe2, 
  Database, 
  Settings2, 
  ShieldCheck, 
  DollarSign, 
  TrendingUp, 
  Info,
  ChevronRight,
  ChevronDown,
  Activity,
  MapPin,
  Bug,
  Dna,
  Truck,
  Cpu,
  ShieldAlert,
  ThermometerSnowflake,
  Filter,
  ShoppingCart,
  Users
} from 'lucide-react';
import { useSimulation } from '../hooks/useSimulation';
import { useLanguage } from '../hooks/useLanguage';
import { cn, formatCurrency } from '../lib/utils';
import DistributionSelector from './DistributionSelector';
import { PopulationType } from '../types';
import { COUNTRY_GROUPS, COUNTRIES } from '../data/countries';
import { PAIRS } from '../data/pairs';
import { BIO_PRESETS } from '../data/bio_presets';
import { QuickInterpretation, HelpTopic } from './QuickInterpretation';

type ConfigSection = 'region' | 'hazard' | 'exposure' | 'characterization' | 'mitigation' | 'economic' | 'engine';

export function ParametersGrid() {
  const sim = useSimulation();
  const { t } = useLanguage();
  const [activeSection, setActiveSection] = useState<ConfigSection>('region');

  const sections: { id: ConfigSection; label: string; icon: any; color: string; sub: string }[] = [
    { id: 'region', label: 'Contexto Reg.', icon: MapPin, color: 'text-slate-600 bg-slate-50 border-slate-100', sub: 'Demografía y Carga' },
    { id: 'hazard', label: 'Id. Peligro', icon: Bug, color: 'text-amber-600 bg-amber-50 border-amber-100', sub: 'Patógeno/Alimento' },
    { id: 'exposure', label: 'Ev. Exposición', icon: Activity, color: 'text-teal-600 bg-teal-50 border-teal-100', sub: 'Cadena de Suministro' },
    { id: 'characterization', label: 'Ev. Peligro', icon: Dna, color: 'text-violet-600 bg-violet-50 border-violet-100', sub: 'Dosis-Respuesta' },
    { id: 'mitigation', label: 'Mitigación', icon: ShieldCheck, color: 'text-emerald-600 bg-emerald-50 border-emerald-100', sub: 'Intervenciones' },
    { id: 'economic', label: 'Eco-Análisis', icon: DollarSign, color: 'text-sky-600 bg-sky-50 border-sky-100', sub: 'Costos y VSL' },
    { id: 'engine', label: 'Engine MC', icon: Cpu, color: 'text-rose-600 bg-rose-50 border-rose-100', sub: 'Simulación' },
  ];

  const currentFactorData = sim.params.populationType && sim.popFactors?.[sim.params.populationType];

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full min-h-[600px]">
      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-72 shrink-0">
        <div className="bg-white/80 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-4 shadow-sm sticky top-24">
          <div className="px-4 mb-6">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Module Config</h2>
          </div>
          <nav className="space-y-1.5">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  "w-full flex items-center justify-between p-3.5 rounded-2xl transition-all duration-300 group relative overflow-hidden",
                  activeSection === section.id 
                    ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg shadow-slate-200 dark:shadow-none" 
                    : "hover:bg-slate-50 dark:hover:bg-white/5 text-slate-500 dark:text-slate-400"
                )}
              >
                <div className="flex items-center gap-3.5 relative z-10">
                  <div className={cn(
                    "p-2 rounded-xl transition-all duration-500",
                    activeSection === section.id 
                      ? "bg-white/20 text-white dark:bg-slate-900/10 dark:text-slate-900" 
                      : cn("bg-slate-100 dark:bg-slate-800", section.color.split(' ')[0])
                  )}>
                    <section.icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest transition-colors">
                    {section.label}
                  </span>
                  <span className="text-[8px] font-bold text-slate-400 block -mt-0.5 group-hover:text-slate-500">
                    {section.sub}
                  </span>
                </div>
                {activeSection === section.id && (
                  <motion.div 
                    layoutId="active-indicator"
                    className="absolute right-3 w-1 h-4 bg-teal-500 rounded-full"
                  />
                )}
              </button>
            ))}
          </nav>

          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 px-2 pb-2">
            <button
              onClick={sim.run}
              className="w-full relative group/run overflow-hidden bg-slate-900 dark:bg-teal-500 hover:bg-slate-800 dark:hover:bg-teal-600 text-white py-4.5 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] transition-all active:scale-95 shadow-xl shadow-teal-500/10"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/run:animate-[shimmer_2s_infinite]" />
              <div className="flex items-center justify-center gap-3 relative z-10">
                <Activity className="w-4 h-4" />
                <span>Initialize Core</span>
              </div>
            </button>
            <div className="mt-4 flex items-center justify-center gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
               <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">Engine Ready</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Dynamic Content Panel */}
      <div className="flex-1 animate-in fade-in slide-in-from-bottom-2 duration-500">
        {activeSection === 'region' && (
          <Card 
            title={t.regionNode} 
            icon={<Globe2 />} 
            className="ring-1 ring-slate-400/20"
            status="green"
            themeColor="slate"
          >
            <div className="grid grid-cols-1 gap-6 pt-1 max-w-2xl">
              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Seleccionar Región / País</label>
                <select 
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500/30 transition-all font-mono"
                  value={sim.country.id}
                  onChange={(e) => {
                    const c = COUNTRIES.find(x => x.id === e.target.value);
                    if (c) sim.setCountry(c);
                  }}
                >
                  {COUNTRY_GROUPS.map(group => (
                    <optgroup key={group.group} label={group.group}>
                      {group.countries.map(country => (
                        <option key={country.id} value={country.id}>
                          {country.flag} {country.name}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
              <div className="bg-slate-50/50 dark:bg-white/5 border border-slate-100 dark:border-white/5 p-4 rounded-2xl">
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed italic">
                  La selección del nodo regional ajusta automáticamente los parámetros demográficos y de carga base según los perfiles epidemiológicos locales validados.
                </p>
              </div>
            </div>
          </Card>
        )}

        {activeSection === 'hazard' && (
          <Card 
            title="Identificación del Peligro" 
            sub="Codex Alimentarius Step 1"
            icon={<Database />} 
            className="ring-1 ring-amber-400/20"
            status="green"
            themeColor="amber"
          >
            <div className="grid grid-cols-1 gap-8 pt-1">
              <div className="space-y-4">
                <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Peligro Biológico / Matriz</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500">Patógeno de Interés</label>
                    <select 
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-amber-500/30 transition-all font-mono"
                      value={sim.pair.id}
                      onChange={(e) => {
                        const p = PAIRS.find(x => x.id === e.target.value);
                        if (p) sim.setPair(p);
                      }}
                    >
                      {PAIRS.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.pathogen} ({p.food})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500">Matriz Alimentaria Base</label>
                    <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-mono text-amber-600">
                      {sim.pair.food}
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-amber-50/50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 rounded-2xl flex gap-4">
                <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-xs font-bold text-amber-900 dark:text-amber-200 uppercase tracking-tight">Referencia JEMRA/FAO</p>
                  <p className="text-[11px] text-amber-700 dark:text-amber-400 leading-relaxed italic">
                    {sim.pair.description || "Referencia científica basada en perfiles de riesgo internacionales validados por la OMS."}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        )}

        {activeSection === 'exposure' && (
          <div className="space-y-6">
            <Card 
              title="Parámetros de Exposición" 
              icon={<Activity />} 
              className="ring-1 ring-teal-400/20"
              status="amber"
              themeColor="teal"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-1">
                <DistributionSelector
                  parameterName="prevalence"
                  label={t.prevalence}
                  value={sim.params.prevalence}
                  config={sim.params.distributions?.prevalence}
                  onConfigChange={(config) => sim.updateDistribution('prevalence', config)}
                  onValueChange={(v) => sim.updateParam('prevalence', v)}
                  min={0} max={1} step={0.01}
                  format={(v) => (v * 100).toFixed(0) + '%'}
                  infoTopic="prevalence"
                />
                <DistributionSelector
                  parameterName="initialLogMean"
                  label={t.initialLoad}
                  value={sim.params.initialLogMean}
                  config={sim.params.distributions?.initialLogMean}
                  onConfigChange={(config) => sim.updateDistribution('initialLogMean', config)}
                  onValueChange={(v) => sim.updateParam('initialLogMean', v)}
                  min={-10} max={10} step={0.1}
                  format={(v) => (v ?? 0).toFixed(1) + ' Log'}
                  infoTopic="initial_load"
                />
                <GridSlider 
                  label={t.logLoadStd} 
                  value={sim.params.initialLogStd} 
                  format={(v) => (v ?? 0).toFixed(2) + ' \u03c3'} 
                  onChange={(v) => sim.updateParam('initialLogStd', v)} 
                  min={0} max={3} step={0.05}
                  infoTopic="initial_load"
                />
              </div>
            </Card>

            <Card 
              title="Patrones de Consumo" 
              icon={<ShoppingCart />} 
              className="ring-1 ring-emerald-400/20"
              themeColor="emerald"
            >
              <div className="space-y-8 pt-1">
                <div className="flex items-center gap-4 p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
                   <div className="p-2 bg-emerald-500 rounded-lg text-white">
                      <Users className="w-4 h-4" />
                   </div>
                   <div className="space-y-0.5">
                      <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Modelo de Consumo</span>
                      <p className="text-[11px] text-emerald-800/70 font-medium">Configure la frecuencia de exposición por individuo.</p>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Modo de Cálculo</label>
                    <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
                       <button 
                         onClick={() => sim.setServingMode('annual')}
                         className={cn(
                           "flex-1 px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all",
                           sim.servingMode === 'annual' ? "bg-white dark:bg-slate-800 text-emerald-600 shadow-sm" : "text-slate-400"
                         )}
                       >Total Anual</button>
                       <button 
                         onClick={() => sim.setServingMode('frequency')}
                         className={cn(
                           "flex-1 px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all",
                           sim.servingMode === 'frequency' ? "bg-white dark:bg-slate-800 text-emerald-600 shadow-sm" : "text-slate-400"
                         )}
                       >Por Frecuencia</button>
                    </div>
                  </div>

                  {sim.servingMode === 'frequency' ? (
                    <GridSlider 
                      label="Consumo Semanal (por persona)" 
                      value={sim.weeklyFrequency} 
                      format={(v) => v.toFixed(1) + ' veces/sem'} 
                      onChange={(v) => sim.setWeeklyFrequency(v)} 
                      min={0.1} max={21} step={0.1}
                      helper={`Traducido a ${(sim.weeklyFrequency * 52).toFixed(0)} raciones anuales por persona.`}
                    />
                  ) : (
                    <GridSlider 
                      label="Raciones Totales (Población/Año)" 
                      value={sim.params.servingsPerYear} 
                      format={(v) => v.toLocaleString()} 
                      onChange={(v) => sim.updateParam('servingsPerYear', v)} 
                      min={1000} max={1000000000} step={1000}
                    />
                  )}

                  <DistributionSelector
                    parameterName="servingSize"
                    label={t.servingMass}
                    value={sim.params.servingSize}
                    config={sim.params.distributions?.servingSize}
                    onConfigChange={(config) => sim.updateDistribution('servingSize', config)}
                    onValueChange={(v) => sim.updateParam('servingSize', v)}
                    min={1} max={1000} step={1}
                    format={(v) => (v ?? 0).toFixed(0) + ' g'}
                    infoTopic="exposure_flux"
                  />
                </div>
              </div>
            </Card>

            <Card 
              title="Configuración de Motor" 
              icon={<Settings2 />} 
              className="ring-1 ring-sky-400/20"
              themeColor="sky"
            >
              <div className="space-y-8 pt-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                  <GridSlider 
                    label="Iteraciones (Variabilidad)" 
                    value={sim.iterations} 
                    format={(v) => v.toLocaleString()} 
                    onChange={(v) => sim.setIterations(v)} 
                    min={100} max={100000} step={100}
                    infoTopic="monte_carlo"
                  />
                  <GridSlider 
                    label="Simulaciones (Incertidumbre)" 
                    value={sim.simulations} 
                    format={(v) => v.toLocaleString()} 
                    onChange={(v) => sim.setSimulations(v)} 
                    min={1} max={100} step={1}
                    infoTopic="monte_carlo"
                  />
                </div>

                <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                  <div className={cn(
                    "flex items-center justify-between p-6 rounded-3xl border transition-all duration-500 relative overflow-hidden group/haccp",
                    sim.isHaccpEnabled 
                      ? "bg-emerald-500/5 border-emerald-500/20 shadow-[inset_0_2px_10px_rgba(16,185,129,0.05)]" 
                      : "bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800"
                  )}>
                    {sim.isHaccpEnabled && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-transparent to-transparent pointer-events-none"
                      />
                    )}

                    <div className="flex items-center gap-4 relative z-10">
                      <div className={cn(
                        "p-2.5 rounded-xl border shadow-xs transition-all duration-500",
                        sim.isHaccpEnabled 
                          ? "bg-emerald-500 text-white border-emerald-400 shadow-emerald-500/20" 
                          : "bg-white dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700"
                      )}>
                        <ShieldCheck className={cn("w-5 h-5", sim.isHaccpEnabled && "animate-pulse")} />
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "text-[10px] font-black uppercase tracking-[0.2em]",
                            sim.isHaccpEnabled ? "text-emerald-700 dark:text-emerald-400" : "text-slate-500 dark:text-slate-400"
                          )}>Filtros HACCP</span>
                          <QuickInterpretation topic="haccp" variant="icon" className="w-3 h-3 opacity-50" />
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                           <div className={cn("w-1 h-1 rounded-full", sim.isHaccpEnabled ? "bg-emerald-500" : "bg-slate-300")} />
                           <span className="text-[9px] text-slate-400 font-mono font-bold uppercase tracking-widest leading-none">
                             {sim.isHaccpEnabled ? 'Active Mitigation' : 'System Bypass'}
                           </span>
                        </div>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => sim.setIsHaccpEnabled(!sim.isHaccpEnabled)}
                      className={cn(
                        "relative inline-flex h-8 w-14 items-center rounded-full transition-all duration-500 focus:outline-none p-1 shadow-inner",
                        sim.isHaccpEnabled ? "bg-emerald-500 shadow-emerald-500/30" : "bg-slate-200 dark:bg-slate-800"
                      )}
                    >
                      <motion.span
                        animate={{ x: sim.isHaccpEnabled ? 24 : 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        className={cn(
                          "inline-block h-6 w-6 rounded-full bg-white shadow-md flex items-center justify-center border border-slate-100"
                        )}
                      >
                         <div className={cn(
                           "w-1 h-1 rounded-full transition-colors",
                           sim.isHaccpEnabled ? "bg-emerald-500" : "bg-slate-300"
                         )} />
                      </motion.span>
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeSection === 'characterization' && (
          <Card 
            title="Caracterización del Peligro" 
            sub="Codex Alimentarius Step 2"
            icon={<Dna />} 
            className="ring-1 ring-violet-400/20"
            status="green"
            themeColor="violet"
          >
            <div className="space-y-8 pt-1">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Validated Reference Profiles</label>
                  <div className="px-2 py-0.5 bg-violet-500/10 rounded border border-violet-500/20">
                     <span className="text-[8px] font-mono font-bold text-violet-600 uppercase tracking-widest leading-none">Database active</span>
                  </div>
                </div>
                <div className="relative group/select">
                  <select 
                    className="w-full bg-slate-50/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 text-xs text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-violet-500/30 transition-all font-mono appearance-none cursor-pointer"
                    onChange={(e) => {
                      const preset = BIO_PRESETS.find(p => p.id === e.target.value);
                      if (preset) {
                        sim.updateParam('drModel', preset.drModel);
                        sim.updateParam('illnessProb', preset.illnessProb);
                        sim.updateParam('hospRate', preset.hospRate);
                        sim.updateParam('mortalityRate', preset.mortalityRate);
                        if (preset.drModel === 'beta-poisson') {
                          sim.updateParam('alpha', preset.alpha);
                          sim.updateParam('beta', preset.beta);
                        } else {
                          sim.updateParam('k', preset.k);
                        }
                      }
                    }}
                    value=""
                  >
                    <option value="" disabled>Load reference data set...</option>
                    {BIO_PRESETS.filter(p => p.pathogen === sim.pair.pathogen).map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.source})
                      </option>
                    ))}
                    <optgroup label="Global Biological Library">
                      {BIO_PRESETS.filter(p => p.pathogen !== sim.pair.pathogen).map(p => (
                        <option key={p.id} value={p.id}>
                          {p.name} - {p.pathogen}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between bg-slate-50/80 dark:bg-slate-900/40 p-2 rounded-2xl border border-slate-200/50 dark:border-slate-800 shadow-inner">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4">Dose-Response Protocol</span>
                <div className="flex gap-1">
                    {(['beta-poisson', 'exponential'] as const).map(model => (
                      <button
                          key={model}
                          onClick={() => sim.updateParam('drModel', model)}
                          className={cn(
                            "px-5 py-2.5 text-[9px] font-black uppercase rounded-xl transition-all relative overflow-hidden",
                            (sim.params.drModel || 'beta-poisson') === model 
                                ? "bg-white dark:bg-slate-700 text-violet-600 shadow-sm border border-slate-200 dark:border-slate-600" 
                                : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                          )}
                      >
                        {model}
                      </button>
                    ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <DistributionSelector
                  parameterName="illnessProb"
                  label={t.illnessProb}
                  value={sim.params.illnessProb}
                  config={sim.params.distributions?.illnessProb}
                  onConfigChange={(config) => sim.updateDistribution('illnessProb', config)}
                  onValueChange={(v) => sim.updateParam('illnessProb', v)}
                  min={0} max={1} step={0.01}
                  format={(v) => ((v ?? 0) * 100).toFixed(0) + '%'}
                  infoTopic="dose_response"
                />
                <DistributionSelector
                  parameterName="hospRate"
                  label={t.hospRate}
                  value={sim.params.hospRate}
                  config={sim.params.distributions?.hospRate}
                  onConfigChange={(config) => sim.updateDistribution('hospRate', config)}
                  onValueChange={(v) => sim.updateParam('hospRate', v)}
                  min={0} max={1} step={0.01}
                  format={(v) => ((v ?? 0) * 100).toFixed(1) + '%'}
                  infoTopic="dose_response"
                />
              </div>

              <div className="pt-6 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-8">
                {sim.params.drModel === 'exponential' ? (
                  <GridSlider 
                    label="Parámetro k (Exp)" 
                    value={sim.params.k || 1.06e-12} 
                    format={(v) => v.toExponential(2)} 
                    onChange={(v) => sim.updateParam('k', v)} 
                    min={1e-15} max={1e-5} step={1e-15}
                    helper="Infectividad intrínseca"
                    infoTopic="dose_response"
                  />
                ) : (
                  <>
                    <GridSlider 
                      label="α (Alpha)" 
                      value={sim.params.alpha} 
                      format={(v) => (v ?? 0).toFixed(4)} 
                      onChange={(v) => sim.updateParam('alpha', v)} 
                      min={0.0001} max={10} step={0.0001}
                      helper="Forma β-Poisson"
                      infoTopic="dose_response"
                    />
                    <GridSlider 
                      label="β (Beta)" 
                      value={sim.params.beta} 
                      format={(v) => v.toExponential(2)} 
                      onChange={(v) => sim.updateParam('beta', v)} 
                      min={1} max={1e12} step={1}
                      helper="Escala β-Poisson"
                      infoTopic="dose_response"
                    />
                  </>
                )}
              </div>

              <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Clinical Target Population</label>
                    <p className="text-[9px] text-slate-400 italic">Seleccione grupos para evaluar impacto sistémico por cohorte.</p>
                  </div>
                  <button
                    onClick={() => {
                      // Apply WHO Standard Demographics
                      const whoRecs: Record<string, number> = {
                        children: 0.08,
                        elderly: 0.12,
                        pregnant: 0.02,
                        immunocompromised: 0.05
                      };
                      Object.entries(whoRecs).forEach(([id, prop]) => {
                        const type = id as PopulationType;
                        if (!sim.params.selectedVulnerableGroups?.includes(type)) {
                          sim.togglePopulationGroup(type);
                        }
                        sim.updateGroupProportion(type, prop);
                      });
                    }}
                    className="px-3 py-1.5 bg-violet-500/10 hover:bg-violet-500/20 text-violet-600 dark:text-violet-400 text-[9px] font-black uppercase tracking-widest rounded-lg border border-violet-500/20 transition-all flex items-center gap-2 group/who"
                  >
                    <Settings2 className="w-3 h-3 group-hover/who:rotate-180 transition-transform duration-500" />
                    Aplicar Rec. OMS
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {[
                    { id: 'elderly', label: 'Adultos Mayores (+65)', icon: '👴' },
                    { id: 'children', label: 'Infantes (0-5 años)', icon: '👶' },
                    { id: 'pregnant', label: 'Embarazadas', icon: '🤰' },
                    { id: 'immunocompromised', label: 'Inmunocomprometidos', icon: '🏥' },
                  ].map((group) => {
                    const isSelected = sim.params.selectedVulnerableGroups?.includes(group.id as PopulationType);
                    const fs = sim.params.groupSusceptibilityFactors?.[group.id];
                    const proportion = sim.params.groupProportions?.[group.id] || 0.1;
                    
                    return (
                      <div key={group.id} className="space-y-3">
                        <button
                          onClick={() => sim.togglePopulationGroup(group.id as PopulationType)}
                          className={cn(
                            "w-full flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 text-left relative overflow-hidden group/poptile",
                            isSelected
                              ? "bg-violet-500/5 border-violet-500 shadow-md shadow-violet-500/5 ring-1 ring-violet-500"
                              : "bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 hover:border-violet-500/50"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{group.icon}</span>
                            <div className="flex flex-col">
                              <span className={cn(
                                "text-[11px] font-bold uppercase tracking-tight",
                                isSelected ? "text-violet-700 dark:text-violet-400" : "text-slate-600 dark:text-slate-400"
                              )}>
                                {group.label}
                              </span>
                              {isSelected && fs && (
                                <span className="text-[9px] font-mono font-black text-violet-500/70">
                                  Factor S: {fs.toFixed(1)}x
                                </span>
                              )}
                            </div>
                          </div>
                          {isSelected && (
                            <div className="flex items-center gap-2">
                               <span className="text-[10px] font-mono font-bold text-violet-600">{(proportion * 100).toFixed(0)}% Pop.</span>
                               <div className="w-2 h-2 rounded-full bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.5)]" />
                            </div>
                          )}
                        </button>
                        
                        {isSelected && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="px-4 pb-2"
                          >
                            <GridSlider 
                              label={`Proporción de ${group.label}`}
                              value={proportion}
                              min={0.01} max={0.5} step={0.01}
                              format={(v) => (v * 100).toFixed(1) + '%'}
                              onChange={(v) => sim.updateGroupProportion(group.id as PopulationType, v)}
                              helper="Proporción demográfica estimada para este grupo en la población total"
                            />
                          </motion.div>
                        )}
                      </div>
                    );
                  })}
                </div>
                
                {/* Custom FS Override */}
                <div className="pt-4 mt-2 border-t border-slate-100/50 dark:border-slate-800/50">
                  <div className="flex items-center justify-between mb-4">
                     <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Ajuste de Susceptibilidad Manual</span>
                     <div className="px-2 py-0.5 bg-amber-500/10 rounded border border-amber-500/20">
                        <span className="text-[8px] font-mono font-bold text-amber-600 uppercase tracking-widest leading-none">Global override</span>
                     </div>
                  </div>
                  <GridSlider 
                    label="Factor de Susceptibilidad (Custom)" 
                    value={sim.params.customFS || 1} 
                    format={(v) => v.toFixed(1) + 'x'} 
                    onChange={(v) => sim.updateParam('customFS', v)} 
                    min={0.1} max={100} step={0.1}
                    infoTopic="dose_response"
                  />
                </div>
              </div>
            </div>
          </Card>
        )}

        {activeSection === 'mitigation' && (
          <Card 
            title="Estrategias de Mitigación" 
            sub="Risk Management Interventions"
            icon={<ShieldCheck />} 
            className="ring-1 ring-emerald-400/20"
            status="blue"
            themeColor="emerald"
          >
            <div className="space-y-8 pt-1">
              <div className="p-5 bg-emerald-500/5 border border-emerald-500/10 rounded-3xl flex gap-4 items-start">
                <ShieldAlert className="w-6 h-6 text-emerald-500 shrink-0 mt-1" />
                <div className="space-y-1">
                  <h4 className="text-[11px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">Intervenciones en la Cadena</h4>
                  <p className="text-[10px] text-emerald-600/80 dark:text-emerald-400/60 leading-relaxed italic font-medium">
                    Ajuste los niveles de carga microbiológica por etapa para simular medidas de control, Buenas Prácticas de Manufactura (BPM) o riesgos de re-contaminación.
                  </p>
                </div>
              </div>

              <div className="space-y-10">
                 <div className="flex items-center gap-4 mb-2">
                    <TrendingUp className="w-5 h-5 text-emerald-500" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ajustes por Etapa de Cadena</span>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                    <GridSlider 
                      label="Ajuste en Planta (Processing)" 
                      value={sim.params.mitigation?.processingAdjustment || 0} 
                      format={(v) => (v > 0 ? '+' : '') + v.toFixed(1) + ' Log'} 
                      onChange={(v) => sim.updateMitigation({ processingAdjustment: v })} 
                      min={-5} max={5} step={0.1}
                      helper="Efecto neto en la etapa de procesamiento (limpieza, desinfección o fallos)"
                      infoTopic="haccp"
                    />
                    <GridSlider 
                      label="Ajuste en Retail (Distribution)" 
                      value={sim.params.mitigation?.retailAdjustment || 0} 
                      format={(v) => (v > 0 ? '+' : '') + v.toFixed(1) + ' Log'} 
                      onChange={(v) => sim.updateMitigation({ retailAdjustment: v })} 
                      min={-5} max={5} step={0.1}
                      helper="Impacto durante la venta al por menor y almacenamiento comercial"
                      infoTopic="haccp"
                    />
                    <GridSlider 
                      label="Ajuste en Preparación (Home/Service)" 
                      value={sim.params.mitigation?.preparationAdjustment || 0} 
                      format={(v) => (v > 0 ? '+' : '') + v.toFixed(1) + ' Log'} 
                      onChange={(v) => sim.updateMitigation({ preparationAdjustment: v })} 
                      min={-8} max={5} step={0.1}
                      helper="Inactivación por cocción (-) o contaminación cruzada (+) en el hogar"
                      infoTopic="haccp"
                    />
                 </div>
              </div>

              <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
                 <div className="flex items-center gap-4 mb-6">
                    <ThermometerSnowflake className="w-5 h-5 text-blue-500" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Control de Cadena de Frío</span>
                 </div>
                 <GridSlider 
                    label="Temperatura Crítica de Almacenamiento" 
                    value={sim.params.mitigation?.storageTemp || 4} 
                    format={(v) => v.toFixed(1) + ' °C'} 
                    onChange={(v) => sim.updateMitigation({ storageTemp: v })} 
                    min={-2} max={15} step={0.5}
                    helper="Temperatura media de mantenimiento. Afecta directamente la tasa de crecimiento."
                    infoTopic="growth"
                  />
              </div>

              <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2 mb-2">
                  <Filter className="w-3 h-3 text-slate-400" />
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Nota Metodológica JEMRA</span>
                </div>
                <p className="text-[9px] text-slate-400 leading-relaxed font-medium">
                  Los ajustes se aplican como desplazamientos (offsets) logarítmicos en cada etapa. Un valor negativo representa una reducción de la carga, mientras que un valor positivo simula aumentos no deseados.
                </p>
              </div>
            </div>
          </Card>
        )}

        {activeSection === 'economic' && (
          <Card 
            title="Configuración Económica" 
            icon={<DollarSign />} 
            className="ring-1 ring-emerald-400/20"
            status="green"
            themeColor="emerald"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 pt-1">
              <GridSlider 
                label="Costo Hosp." 
                value={sim.params.costHosp} 
                format={(v) => formatCurrency(v)} 
                onChange={(v) => sim.updateParam('costHosp', v)} 
                min={0} max={25000} step={100}
                infoTopic="economic_params"
              />
              <GridSlider 
                label="Costo Médico" 
                value={sim.params.costAmb} 
                format={(v) => formatCurrency(v)} 
                onChange={(v) => sim.updateParam('costAmb', v)} 
                min={0} max={1000} step={10}
                infoTopic="economic_params"
              />
              <GridSlider 
                label="Ausencia / Día" 
                value={sim.params.costAbsence} 
                format={(v) => formatCurrency(v)} 
                onChange={(v) => sim.updateParam('costAbsence', v)} 
                min={0} max={500} step={5}
                infoTopic="economic_params"
              />
              <GridSlider 
                label="Mortalidad (VSL)" 
                value={sim.params.costDeath} 
                format={(v) => ((v ?? 0) / 1e6).toFixed(1) + 'M'} 
                onChange={(v) => sim.updateParam('costDeath', v)} 
                min={0} max={15e6} step={1e5}
                infoTopic="vsl"
              />
            </div>
          </Card>
        )}

        {activeSection === 'logistics' && (
          <Card 
            title="Consumo y Logística" 
            icon={<Truck />} 
            className="ring-1 ring-sky-400/20"
            status="green"
            themeColor="sky"
          >
            <div className="space-y-8 pt-1">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3">Modo Raciones</span>
                    <div className="flex gap-1">
                        {(['frequency', 'annual'] as const).map(mode => (
                          <button
                              key={mode}
                              onClick={() => sim.setServingMode(mode)}
                              className={cn(
                                "px-4 py-2 text-[10px] font-black uppercase rounded-xl transition-all",
                                sim.servingMode === mode 
                                    ? "bg-white dark:bg-slate-700 text-sky-600 shadow-xs" 
                                    : "text-slate-400 hover:text-slate-600"
                              )}
                          >
                            {mode === 'frequency' ? 'Frecuencia' : 'Total Anual'}
                          </button>
                        ))}
                    </div>
                  </div>
                  <div className="space-y-6">
                    {sim.servingMode === 'frequency' ? (
                      <GridSlider 
                          label="Frecuencia Semanal" 
                          value={sim.weeklyFrequency} 
                          format={(v) => (v ?? 0) + ' raciones'} 
                          onChange={(v) => sim.setWeeklyFrequency(v)} 
                          min={0.1} max={21} step={0.1}
                      />
                    ) : (
                      <GridSlider 
                          label="Raciones por Año" 
                          value={sim.params.servingsPerYear} 
                          format={(v) => ((v ?? 0) / 1e6).toFixed(1) + 'M'} 
                          onChange={(v) => sim.updateParam('servingsPerYear', v)} 
                          min={1e4} max={1e9} step={1e4}
                      />
                    )}
                    <DistributionSelector
                      parameterName="servingSize"
                      label="Masa Ración (g)"
                      value={sim.params.servingSize}
                      config={sim.params.distributions?.servingSize}
                      onConfigChange={(config) => sim.updateDistribution('servingSize', config)}
                      onValueChange={(v) => sim.updateParam('servingSize', v)}
                      min={10} max={1000} step={5}
                      format={(v) => (v ?? 0).toFixed(0) + 'g'}
                      infoTopic="exposure_flux"
                    />
                  </div>
                </div>

                <div className="space-y-8">
                   {!sim.pair.isViral && (
                    <div className="grid grid-cols-1 gap-8">
                      <GridSlider 
                        label="Tasa Crec. (Log/h)" 
                        value={sim.params.growthRate} 
                        format={(v) => (v ?? 0).toFixed(2)} 
                        onChange={(v) => sim.updateParam('growthRate', v)} 
                        min={0} max={1} step={0.01}
                        infoTopic="exposure_flux"
                      />
                      <GridSlider 
                        label="Tiempo Crec. (h)" 
                        value={sim.params.growthTime} 
                        format={(v) => (v ?? 0).toFixed(0) + 'h'} 
                        onChange={(v) => sim.updateParam('growthTime', v)} 
                        min={0} max={168} step={1}
                        infoTopic="exposure_flux"
                      />
                    </div>
                  )}

                  {/* Monte Carlo Section Moved to Exposure section */}
                </div>
              </div>

              <div className="pt-8 border-t border-slate-100 dark:border-white/5">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-6">Cadena de Suministro (Deltas Logarítmicos)</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                  <DistributionSelector parameterName="processingDeltaLog" label="Proceso" value={sim.params.processingDeltaLog} config={sim.params.distributions?.processingDeltaLog} onConfigChange={(c) => sim.updateDistribution('processingDeltaLog', c)} onValueChange={(v) => sim.updateParam('processingDeltaLog', v)} min={-5} max={5} step={0.1} format={(v) => (v > 0 ? '+' : '') + (v ?? 0).toFixed(1)} infoTopic="exposure_flux" />
                  <DistributionSelector parameterName="transportDeltaLog" label="Transporte" value={sim.params.transportDeltaLog} config={sim.params.distributions?.transportDeltaLog} onConfigChange={(c) => sim.updateDistribution('transportDeltaLog', c)} onValueChange={(v) => sim.updateParam('transportDeltaLog', v)} min={-5} max={5} step={0.1} format={(v) => (v > 0 ? '+' : '') + (v ?? 0).toFixed(1)} infoTopic="exposure_flux" />
                  <DistributionSelector parameterName="distributionDeltaLog" label="Logística" value={sim.params.distributionDeltaLog} config={sim.params.distributions?.distributionDeltaLog} onConfigChange={(c) => sim.updateDistribution('distributionDeltaLog', c)} onValueChange={(v) => sim.updateParam('distributionDeltaLog', v)} min={-5} max={5} step={0.1} format={(v) => (v > 0 ? '+' : '') + (v ?? 0).toFixed(1)} infoTopic="exposure_flux" />
                  <DistributionSelector parameterName="preparationDeltaLog" label="Preparación" value={sim.params.preparationDeltaLog} config={sim.params.distributions?.preparationDeltaLog} onConfigChange={(c) => sim.updateDistribution('preparationDeltaLog', c)} onValueChange={(v) => sim.updateParam('preparationDeltaLog', v)} min={-8} max={5} step={0.1} format={(v) => (v > 0 ? '+' : '') + (v ?? 0).toFixed(1)} infoTopic="exposure_flux" />
                </div>
              </div>
            </div>
          </Card>
        )}

        {activeSection === 'engine' && (
          <div className="space-y-6">
            <Card 
              title="Monte Carlo Statistical Engine" 
              icon={<Cpu />} 
              className="ring-1 ring-rose-400/20"
              status="green"
              themeColor="rose"
            >
              <div className="space-y-10 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                       <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Iteraciones (Variabilidad)</label>
                       <span className="text-[10px] font-mono font-bold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">{sim.iterations.toLocaleString()}</span>
                    </div>
                    <GridSlider 
                      label="Muestreo de Primer Orden" 
                      value={sim.iterations} 
                      format={(v) => v.toLocaleString()} 
                      onChange={(v) => sim.setIterations(v)} 
                      min={100} max={100000} step={100}
                    />
                    <p className="text-[9px] text-slate-400 italic">Determina la resolución de la variabilidad biológica y ambiental.</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                       <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Simulaciones (Incertidumbre)</label>
                       <span className="text-[10px] font-mono font-bold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">{sim.simulations.toLocaleString()}</span>
                    </div>
                    <GridSlider 
                      label="Muestreo de Segundo Orden" 
                      value={sim.simulations} 
                      format={(v) => v.toLocaleString()} 
                      onChange={(v) => sim.setSimulations(v)} 
                      min={1} max={100} step={1}
                    />
                    <p className="text-[9px] text-slate-400 italic">Cuantifica el error de estimación de los parámetros del modelo.</p>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 space-y-4">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-slate-900 dark:bg-white flex items-center justify-center">
                         <Settings2 className="w-4 h-4 text-white dark:text-slate-900" />
                      </div>
                      <span className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">Estado de Cómputo</span>
                   </div>
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                         <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Datapoints</div>
                         <div className="text-sm font-mono font-bold text-slate-900 dark:text-white">{(sim.iterations * sim.simulations).toLocaleString()}</div>
                      </div>
                      <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                         <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Parallelization</div>
                         <div className="text-[9px] font-mono font-bold text-emerald-500">OPTIMIZED</div>
                      </div>
                      <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                         <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Precision</div>
                         <div className="text-[9px] font-mono font-bold text-slate-500 uppercase">Float64 / Standard</div>
                      </div>
                      <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                         <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">HACCP Shield</div>
                         <div className={cn("text-[9px] font-mono font-bold", sim.isHaccpEnabled ? "text-emerald-500" : "text-rose-500")}>
                           {sim.isHaccpEnabled ? 'ENABLED' : 'DISABLED'}
                         </div>
                      </div>
                   </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

function Card({ title, sub, icon, children, className, status, themeColor }: { 
  title: string; 
  sub?: string;
  icon: React.ReactNode; 
  children: React.ReactNode; 
  className?: string;
  status?: 'green' | 'amber' | 'blue';
  themeColor?: 'slate' | 'amber' | 'teal' | 'violet' | 'emerald' | 'sky' | 'rose';
}) {
  const themes = {
    slate: 'border-slate-500/20 text-slate-600 bg-slate-50/50 dark:bg-slate-900/10',
    amber: 'border-amber-500/20 text-amber-600 bg-amber-50/50 dark:bg-amber-900/10',
    teal: 'border-teal-500/20 text-teal-600 bg-teal-50/50 dark:bg-teal-900/10',
    violet: 'border-violet-500/20 text-violet-600 bg-violet-50/50 dark:bg-violet-900/10',
    emerald: 'border-emerald-500/20 text-emerald-600 bg-emerald-50/50 dark:bg-emerald-900/10',
    sky: 'border-sky-500/20 text-sky-600 bg-sky-50/50 dark:bg-sky-900/10',
    rose: 'border-rose-500/20 text-rose-600 bg-rose-50/50 dark:bg-rose-900/10',
  };

  const statusMap = {
    green: { color: 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]', label: 'Calibrated' },
    amber: { color: 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]', label: 'Adjustment Required' },
    blue: { color: 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]', label: 'Active Intervention' },
  };

  return (
    <div className={cn(
      "bg-white/80 dark:bg-slate-900/40 backdrop-blur-md rounded-[2.5rem] border border-slate-200/60 dark:border-slate-800 shadow-sm overflow-hidden transition-all duration-500 group/card relative",
      className
    )}>
      {/* Decorative Gradient Background */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-slate-100/50 dark:from-slate-800/20 to-transparent rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />
      
      <div className="p-8 relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className={cn(
              "p-3 rounded-2xl border shadow-xs transition-all group-hover/card:scale-105 duration-500",
              themeColor ? themes[themeColor] : themes.teal
            )}>
              {React.cloneElement(icon as React.ReactElement, { className: "w-5 h-5" })}
            </div>
            <div className="flex flex-col">
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 mb-1 leading-none">{title}</h3>
              {sub && <span className="text-[10px] font-bold text-slate-900 dark:text-white mt-1 uppercase tracking-wider">{sub}</span>}
              {status && (
                <div className="flex items-center gap-2 mt-2">
                   <div className={cn(
                      "w-1.5 h-1.5 rounded-full",
                      statusMap[status].color
                   )} />
                   <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">{statusMap[status].label}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex-1 h-full">
          {children}
        </div>
      </div>
    </div>
  );
}

function GridSlider({ label, value, min, max, step, format, onChange, helper, infoTopic }: { 
  label: string; 
  value: number; 
  min: number; 
  max: number; 
  step: number; 
  format: (v: number) => string; 
  onChange: (v: number) => void;
  helper?: string;
  infoTopic?: HelpTopic;
}) {
  return (
    <div className="group space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2 px-0.5">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] leading-tight">{label}</label>
            {infoTopic && <QuickInterpretation topic={infoTopic} variant="icon" className="w-3 h-3 opacity-50" />}
          </div>
          {helper && <span className="text-[9px] text-slate-400 font-medium italic opacity-60 leading-tight">{helper}</span>}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="relative group/input">
            <input 
              type="number"
              value={isNaN(value) || value === undefined ? '' : value}
              onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
              className="w-24 h-9 bg-slate-50/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white text-center outline-none focus:ring-1 focus:ring-teal-500/20 transition-all shadow-inner tabular-nums"
            />
            <div className="absolute inset-0 rounded-xl pointer-events-none border border-transparent group-hover/input:border-slate-200 dark:group-hover/input:border-slate-700 transition-colors" />
          </div>
          <span className="text-[10px] font-mono font-black text-teal-600 dark:text-teal-400 leading-none bg-teal-500/5 dark:bg-teal-400/10 px-3 py-2 rounded-xl border border-teal-500/10 dark:border-teal-400/20 min-w-[5rem] text-center shadow-xs">
            {format(value ?? 0)}
          </span>
        </div>
      </div>
      <div className="relative flex items-center h-6 group/slider">
        {/* Background Track */}
        <div className="absolute inset-x-0 h-1 bg-slate-100 dark:bg-slate-800/50 rounded-full overflow-hidden">
           <div 
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-teal-500 to-teal-400 transition-all duration-300 opacity-30"
            style={{ width: `${((value - min) / (max - min)) * 100}%` }}
          />
        </div>
        
        <input 
          type="range"
          min={min}
          max={max}
          step={step}
          value={isNaN(value) || value === undefined ? min : value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-full h-1 bg-transparent appearance-none cursor-pointer focus:outline-none relative z-10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-teal-500 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:hover:scale-125 [&::-webkit-slider-thumb]:active:scale-95"
        />
      </div>
    </div>
  );
}
