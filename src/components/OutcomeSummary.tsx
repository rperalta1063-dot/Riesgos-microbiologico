import React, { useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'motion/react';
import { Target, AlertTriangle, TrendingUp, Heart, Activity, ArrowRight, Shield, Download, FileText, DollarSign, Users, Briefcase, ShieldCheck, BookOpen, FileJson, FileType, Hospital, Skull, HeartPulse, ShieldAlert } from 'lucide-react';
import { cn, formatCurrency } from '../lib/utils';
import { exportToText, exportToPdf, exportToJson } from '../services/exportService';

interface CountUpProps {
  value: number;
  formatter?: (val: number) => string;
  duration?: number;
}

function CountUp({ value, formatter = (v) => (v ?? 0).toFixed(0), duration = 1 }: CountUpProps) {
  const count = useMotionValue(0);
  const displayValue = useTransform(count, (latest) => formatter(latest ?? 0));

  useEffect(() => {
    const controls = animate(count, value, { 
      duration,
      ease: "easeOut"
    });
    return controls.stop;
  }, [value, duration, count]);

  return <motion.span>{displayValue}</motion.span>;
}

const MetricCard: React.FC<{ m: any; i: number }> = ({ m, i }) => {
  return (
    <div className="group relative bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all duration-500 overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-[0.02] dark:opacity-[0.05] group-hover:scale-110 transition-transform duration-700">
        <m.icon className="w-16 h-16 rotate-12" />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <div className={cn("p-1.5 rounded-lg text-white shadow-sm", m.color)}>
            <m.icon className="w-3 h-3" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-[0.1em] truncate">{m.label}</span>
            <span className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tighter italic opacity-80 truncate">{m.desc}</span>
          </div>
        </div>

        <div className="flex items-baseline gap-2">
          <div className="text-[16px] font-black text-slate-900 dark:text-white tabular-nums tracking-tighter truncate">
            <CountUp 
              value={m.value} 
              formatter={(v) => {
                if (m.isCurrency) return formatCurrency(v);
                if (m.isScientific) return (v ?? 0).toExponential(2) + (m.isPercent ? '%' : '');
                if (m.isFloat) {
                  const val = v ?? 0;
                  return (m.isPercent ? val.toFixed(2) + '%' : val.toFixed(2));
                }
                return Math.ceil(v ?? 0).toLocaleString();
              }} 
            />
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-slate-50 dark:border-slate-800/50 pt-2">
          {m.ci ? (
            <div className="text-[9px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-tighter flex flex-col">
              <span className="text-[8px] text-slate-300">CI 95%</span>
              <span className="font-mono">
                [
                  {m.ci[0] !== undefined ? (m.isCurrency ? formatCurrency(m.ci[0]) : m.isScientific ? m.ci[0].toExponential(1) : m.isFloat ? m.ci[0].toFixed(2) : Math.ceil(m.ci[0]).toLocaleString()) : '0'} - 
                  {m.ci[1] !== undefined ? (m.isCurrency ? formatCurrency(m.ci[1]) : m.isScientific ? m.ci[1].toExponential(1) : m.isFloat ? m.ci[1].toFixed(2) : Math.ceil(m.ci[1]).toLocaleString()) : '0'}
                ]
              </span>
            </div>
          ) : (
            <div className="text-[9px] font-bold text-slate-300 dark:text-slate-700 uppercase tracking-tighter flex flex-col">
              <span className="text-[8px] text-slate-300 opacity-50">CI 95%</span>
              <span className="font-mono italic opacity-40">Estimado Fijo</span>
            </div>
          )}
          <span className="text-[8px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-[0.1em]">P95</span>
        </div>
      </div>
    </div>
  );
}

interface OutcomeSummaryProps {
  result: any;
  translations: any;
  pair: any;
  country: any;
  params: any;
  mode?: 'bio' | 'econ';
  hideGeneral?: boolean;
  hideVuln?: boolean;
  hideFooter?: boolean;
}

export default function OutcomeSummary({ 
  result, 
  translations: t, 
  pair, 
  country, 
  params, 
  mode = 'bio',
  hideGeneral = false,
  hideVuln = false,
  hideFooter = false
}: OutcomeSummaryProps) {
  if (!result) return null;

  const probIllness = result.summary.probIllness || 0;
  const riskLevel = probIllness > 0.05 ? 'High' : probIllness > 0.01 ? 'Moderate' : 'Low';
  
  const bioMetrics = [
    { label: 'Casos Clínicos', value: result.summary.annualCases, ci: result.summary.annualCasesCI, color: 'bg-blue-500', icon: Activity, desc: 'Incidencia anual proyectada' },
    { label: 'Hospitalizaciones', value: result.summary.annualHospitalized, ci: result.summary.annualHospitalizedCI, color: 'bg-amber-500', icon: Hospital, desc: 'Carga de sistema de salud' },
    { label: 'Defunciones', value: result.summary.annualDeaths, ci: result.summary.annualDeathsCI, color: 'bg-rose-500', icon: Skull, desc: 'Mortalidad atribuible' },
    { label: 'Carga DALYs', value: result.summary.annualDALYs, ci: result.summary.annualDALYsCI, color: 'bg-purple-500', icon: HeartPulse, desc: 'Años de vida ajustados', isFloat: true },
  ];

  const vulnMetrics = result.summary.vulnerable ? [
    { label: 'Prob. Enfermedad (Vuln)', value: result.summary.vulnerable.probIllness * 100, isScientific: true, isPercent: true, color: 'bg-indigo-600', icon: Users, desc: 'Riesgo población seleccionada' },
    { label: 'Casos Anuales (Vuln)', value: result.summary.vulnerable.annualCases, ci: result.summary.vulnerable.annualCasesCI, color: 'bg-indigo-500', icon: Activity, desc: 'Incidencia en grupo vulnerable' },
    { label: 'Hospitalizaciones (Vuln)', value: result.summary.vulnerable.annualHospitalized, color: 'bg-amber-600', icon: Hospital, desc: 'Carga hospitalaria grupo' },
    { label: 'Defunciones (Vuln)', value: result.summary.vulnerable.annualDeaths, color: 'bg-rose-600', icon: Skull, desc: 'Mortalidad grupo específico' },
  ] : [];

  const vulnContextMetrics = result.summary.vulnerable ? [
    { label: 'Prob. Enfermedad (Gral)', value: result.summary.probIllness * 100, isScientific: true, isPercent: true, color: 'bg-slate-400', icon: Target, desc: 'Riesgo población general' },
    { label: 'Incremento Riesgo', value: result.summary.probIllness > 0 ? ((result.summary.vulnerable.probIllness / result.summary.probIllness) - 1) * 100 : 0, isFloat: true, isPercent: true, color: 'bg-amber-500', icon: TrendingUp, desc: 'Aumento relativo vs general' },
    { label: 'Impacto Económico (Vuln)', value: result.summary.vulnerable.totalEconomicImpact, color: 'bg-emerald-600', icon: DollarSign, desc: 'Costo social en grupo', isCurrency: true },
    { label: 'Carga DALYs (Vuln)', value: result.summary.vulnerable.annualDALYs, color: 'bg-purple-600', icon: HeartPulse, desc: 'Impacto en salud grupo', isFloat: true },
  ] : [];

  const econBreakdownMetrics = result.economicBreakdown ? [
    { label: 'Costos Médicos', value: (result.economicBreakdown.medical / result.economicBreakdown.total) * 100, isFloat: true, isPercent: true, color: 'bg-blue-400', icon: Hospital, desc: 'Hospitalización y clínicas' },
    { label: 'Pérdida Productiva', value: (result.economicBreakdown.productivity / result.economicBreakdown.total) * 100, isFloat: true, isPercent: true, color: 'bg-emerald-400', icon: Briefcase, desc: 'Ausentismo laboral' },
    { label: 'Costo Mortalidad', value: (result.economicBreakdown.mortality / result.economicBreakdown.total) * 100, isFloat: true, isPercent: true, color: 'bg-rose-400', icon: Skull, desc: 'Valor vida estadística (VSL)' },
    { label: 'Secuelas Crónicas', value: (result.economicBreakdown.chronic / result.economicBreakdown.total) * 100, isFloat: true, isPercent: true, color: 'bg-purple-400', icon: Activity, desc: 'Impacto a largo plazo' },
  ] : [];

  const econMetrics = [
    { label: 'Costo por Caso', value: result.summary.annualCases > 0 ? result.economicBreakdown.total / result.summary.annualCases : 0, color: 'bg-indigo-500', icon: DollarSign, desc: 'Promedio por afectado', isCurrency: true },
    { label: 'Costo Per Cápita', value: country.pop > 0 ? result.economicBreakdown.total / country.pop : 0, ci: result.economicBreakdown.totalCI.map((v: number) => country.pop > 0 ? v / country.pop : 0), color: 'bg-slate-500', icon: Users, desc: 'Impacto por habitante', isCurrency: true },
  ];

  const currentMetrics = mode === 'bio' ? bioMetrics : econMetrics;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="col-span-12 space-y-4 mb-4"
    >
      {!hideGeneral && (
        <>
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.25em] flex items-center gap-2">
                <div className={cn("w-1 h-3 rounded-full", mode === 'bio' ? "bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.4)]" : "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]")} />
                {mode === 'bio' ? 'Magnitud del Impacto Biológico' : 'Desglose de Costos Sociales'}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              {mode === 'bio' && (
                <div className={cn(
                  "px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 border shadow-xs transition-colors",
                  riskLevel === 'High' ? "bg-rose-50 border-rose-100 text-rose-600 dark:bg-rose-900/20 dark:border-rose-800" :
                  riskLevel === 'Moderate' ? "bg-amber-50 border-amber-100 text-amber-600 dark:bg-amber-900/20 dark:border-amber-800" :
                  "bg-emerald-50 border-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:border-emerald-800"
                )}>
                  <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                  Riesgo: {riskLevel}
                </div>
              )}
            </div>
          </div>

          <div className={cn(
            "grid gap-3",
            mode === 'bio' ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" : "grid-cols-1 sm:grid-cols-2"
          )}>
            {currentMetrics.map((m, i) => (
              <MetricCard key={m.label} m={m} i={i} />
            ))}
          </div>
        </>
      )}

      {mode === 'econ' && result.economicBreakdown && (
        <div className="space-y-4">
          <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.25em] flex items-center gap-2">
            <div className="w-1 h-3 rounded-full bg-amber-600 shadow-[0_0_8px_rgba(217,119,6,0.4)]" />
            Distribución de Impacto Económico (%)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {econBreakdownMetrics.map((m, i) => (
              <MetricCard key={m.label} m={m} i={i} />
            ))}
          </div>
        </div>
      )}

      {mode === 'bio' && result.summary.vulnerable && !hideVuln && (
        <div className="space-y-4">
          <div className="space-y-3">
            <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.25em] flex items-center gap-2">
              <div className="w-1 h-3 rounded-full bg-indigo-600 shadow-[0_0_8px_rgba(79,70,229,0.4)]" />
              Impacto en Población Seleccionada ({params.populationType})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {vulnMetrics.map((m, i) => (
                <MetricCard key={m.label} m={m} i={i} />
              ))}
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.25em] flex items-center gap-2 opacity-70">
              <div className="w-1 h-3 rounded-full bg-slate-400" />
              Contexto y Comparativa de Susceptibilidad
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {vulnContextMetrics.map((m, i) => (
                <MetricCard key={m.label} m={m} i={i} />
              ))}
            </div>
          </div>
        </div>
      )}

      {!hideFooter && (
        <>
          <div className="bg-slate-100/50 dark:bg-slate-800/30 p-4 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4 border border-slate-200 dark:border-slate-800 transition-colors group">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center shadow-sm border border-slate-200 dark:border-slate-700">
                <Shield className="w-4 h-4 text-slate-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">Validación de Escenario</span>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">Motor Monte Carlo — Simulación {(result.rawIll?.length || 10000).toLocaleString()} iteraciones</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={() => exportToJson(result, country, pair, params)}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95 border border-slate-200 dark:border-slate-700 shadow-xs group/btn"
              >
                <FileJson className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform" />
                JSON
              </button>
              <button 
                onClick={() => exportToText(result, country, pair, params)}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95 border border-slate-200 dark:border-slate-700 shadow-xs group/btn"
              >
                <FileText className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform" />
                TXT
              </button>
              <button 
                onClick={() => exportToPdf(result, country, pair, params)}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95 group/btn"
              >
                <FileType className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform" />
                Descargar Reporte PDF
              </button>
            </div>
          </div>

          <div className="mt-6 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 rounded-3xl p-6 relative overflow-hidden group">
            <div className="absolute -right-8 -bottom-8 opacity-[0.03] dark:opacity-[0.05] text-blue-600 rotate-12 transition-transform group-hover:scale-110">
              <BookOpen className="w-48 h-48" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-600 rounded-xl shadow-lg shadow-blue-500/20">
                  <ShieldCheck className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest leading-none">Recomendación del sistema</h4>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter mt-1">Sugerencia automatizada basada en el perfil de riesgo</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-8 space-y-3">
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed italic">
                    "Basado en el perfil de riesgo de <span className="font-bold text-slate-900 dark:text-slate-200">{pair.pathogen}</span>, se recomienda priorizar intervenciones en los puntos críticos de control identificados por el <span className="font-bold">Análisis de Sensibilidad</span>. Una reducción de 1-log en la cadena de {(params.processingDeltaLog < params.preparationDeltaLog) ? "procesamiento" : "preparación"} tendría un impacto significativo en la reducción de DALYs anuales."
                  </p>
                </div>
                <div className="lg:col-span-4 flex flex-col justify-center gap-2.5">
                  <div className="flex items-center gap-3 px-4 py-2.5 bg-white dark:bg-slate-900 rounded-2xl border border-blue-100 dark:border-blue-800 shadow-sm transition-transform hover:scale-[1.02]">
                    <div className={cn(
                      "w-2 h-2 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.2)]",
                      (result.summary.annualDALYs / country.pop) <= 1e-6 ? "bg-emerald-500" : "bg-rose-500"
                    )} />
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none">
                      HBT (10⁻⁶): <span className={cn(
                        "ml-1",
                        (result.summary.annualDALYs / country.pop) <= 1e-6 ? "text-emerald-600" : "text-rose-600"
                      )}>
                        {(result.summary.annualDALYs / country.pop) <= 1e-6 ? 'CONFORME' : 'REQUIERE ACCIÓN'}
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center gap-3 px-4 py-2.5 bg-white dark:bg-slate-900 rounded-2xl border border-blue-100 dark:border-blue-800 shadow-sm transition-transform hover:scale-[1.02]">
                    <Activity className="w-3.5 h-3.5 text-blue-500" />
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none">
                      INCERTIDUMBRE: <span className="text-blue-600 ml-1">MODERADA</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}
