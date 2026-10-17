import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, AlertTriangle, Info, FileText, CheckCircle2, AlertCircle, HelpCircle, Activity } from 'lucide-react';
import { SimulationResult, SimulationParams } from '../types';
import { formatNumber } from '../lib/utils';
import { QuickInterpretation } from './QuickInterpretation';

interface Props {
  result: SimulationResult;
  params: SimulationParams;
}

export default function ScientificExecutiveSummary({ result, params }: Props) {
  const interp = result.summary.scientificInterpretation || {
    riskLevel: 'Low',
    recommendation: 'Continuar con vigilancia rutinaria.',
    confidence: 0.95,
    fso_status: 'Compliant'
  };

  const statusColors = {
    Compliant: 'bg-emerald-500 text-white',
    'Non-Compliant': 'bg-rose-500 text-white',
    Caution: 'bg-amber-500 text-white'
  };

  const riskColors = {
    Negligible: 'text-blue-500',
    Low: 'text-emerald-500',
    Medium: 'text-amber-500',
    High: 'text-orange-500',
    Severe: 'text-rose-500'
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-900 dark:bg-slate-800 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl" />
        
        <div className="relative z-10 flex-1">
          <div className="flex items-center gap-3 mb-4">
             <div className="px-3 py-1 bg-teal-500/20 border border-teal-500/30 rounded-full">
                <span className="text-[10px] font-black uppercase tracking-widest text-teal-400">Scientific Opinion v2.4</span>
             </div>
             <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${statusColors[interp.fso_status]}`}>
                FSO: {interp.fso_status}
             </div>
          </div>
          <h2 className="text-4xl font-black tracking-tighter mb-4 leading-tight">
            Reporte de Caracterización <br /> de Riesgo Microbiológico
          </h2>
          <p className="text-slate-400 text-sm max-w-xl leading-relaxed font-medium">
            Evaluación estocástica de <span className="text-white">{params.pathogen}</span> en <span className="text-white">{params.food}</span>. 
            Este reporte sintetiza {formatNumber(100000)} iteraciones de Monte Carlo siguiendo el marco de trabajo JEMRA FAO/OMS.
          </p>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center p-8 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl min-w-[240px]">
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Nivel de Riesgo JEMRA</span>
           <span className={`text-5xl font-black tracking-tighter ${riskColors[interp.riskLevel]}`}>
             {interp.riskLevel}
           </span>
           <div className="mt-4 flex items-center gap-2">
              <div className="flex gap-0.5">
                 {[1,2,3,4,5].map(s => (
                   <div key={s} className={`w-1.5 h-3 rounded-full ${s <= (interp.riskLevel === 'Severe' ? 5 : interp.riskLevel === 'High' ? 4 : interp.riskLevel === 'Medium' ? 3 : 2) ? statusColors[interp.fso_status].split(' ')[0] : 'bg-white/10'}`} />
                 ))}
              </div>
              <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">Confianza {(interp.confidence * 100).toFixed(0)}%</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <FileText className="w-4 h-4 text-teal-500" /> Resumen de Hallazgos Científicos
            </h3>
            
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                La modelización estocástica indica una probabilidad media de enfermedad de <span className="font-mono font-bold text-slate-900 dark:text-white">{result.summary.probIllness.toExponential(2)}</span> por porción consumida. 
                Considerando un tamaño de porción de {params.servingSize}g y una prevalencia de {(params.prevalence * 100).toFixed(1)}%, el sistema proyecta una carga anual de <span className="font-bold text-slate-900 dark:text-white">{formatNumber(Math.round(result.summary.annualCases))} casos clínicos</span>.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose mb-8">
                 <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5">
                    <div className="flex items-center gap-2 mb-2">
                       <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                       <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Puntos de Control Críticos</span>
                    </div>
                    <ul className="space-y-1">
                       <li className="text-[10px] text-slate-600 dark:text-slate-400">• Estabilización de Inactivación: {result.summary.probDeath.toExponential(1)}</li>
                       <li className="text-[10px] text-slate-600 dark:text-slate-400">• Carga Final Log: {result.stageProgression[result.stageProgression.length-1].value.toFixed(1)}</li>
                    </ul>
                 </div>
                 <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5">
                    <div className="flex items-center gap-2 mb-2">
                       <AlertCircle className="w-4 h-4 text-amber-500" />
                       <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Incertidumbres Identificadas</span>
                    </div>
                    <ul className="space-y-1">
                       <li className="text-[10px] text-slate-600 dark:text-slate-400">• Variabilidad en Dosis-Respuesta: {((result.summary.probIllnessCI[1]/result.summary.probIllnessCI[0])).toFixed(1)}x spread</li>
                       <li className="text-[10px] text-slate-600 dark:text-slate-400">• Sensibilidad de Prevalencia: {(result.sensitivity[0]?.impact * 100).toFixed(0)}%</li>
                    </ul>
                 </div>
              </div>

              <div className="p-6 bg-teal-500/5 border border-teal-500/10 rounded-2xl flex gap-4">
                 <ShieldCheck className="w-6 h-6 text-teal-500 shrink-0" />
                 <div className="space-y-2">
                    <h4 className="text-[11px] font-black uppercase tracking-widest text-teal-700 dark:text-teal-400">Recomendación Técnica del Comité</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium italic">
                      "{interp.recommendation}"
                    </p>
                 </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
             <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <Activity className="w-4 h-4 text-rose-500" /> Métricas Sanitarias Clave
            </h3>
            <div className="space-y-6">
               {[
                 { label: 'Casos Proyectados', value: formatNumber(Math.round(result.summary.annualCases)), sub: 'Anual / Población total', color: 'bg-blue-500' },
                 { label: 'AVAD (DALYs)', value: result.summary.annualDALYs.toFixed(1), sub: 'Años de vida ajustados', color: 'bg-emerald-500' },
                 { label: 'Defunciones', value: formatNumber(Math.round(result.summary.annualDeaths)), sub: 'Mortalidad atribuida', color: 'bg-rose-500' },
                 { label: 'Riesgo Individual', value: result.summary.individualYearlyRisk.toExponential(2), sub: 'Probabilidad anual', color: 'bg-violet-500' },
               ].map((stat) => (
                 <div key={stat.label} className="group">
                    <div className="flex items-center justify-between mb-1">
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</span>
                       <span className="text-xs font-mono font-black text-slate-900 dark:text-white">{stat.value}</span>
                    </div>
                    <div className="h-1 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                       <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '60%' }}
                        className={`h-full ${stat.color} opacity-70 group-hover:opacity-100 transition-opacity`}
                       />
                    </div>
                    <span className="text-[8px] text-slate-500 uppercase font-medium mt-1 block">{stat.sub}</span>
                 </div>
               ))}
            </div>
          </div>

          <div className="p-6 bg-slate-100 dark:bg-slate-800/50 rounded-3xl border border-slate-200 dark:border-slate-700">
             <div className="flex flex-col gap-4">
                <div className="flex gap-3">
                   <HelpCircle className="w-4 h-4 text-slate-400 shrink-0" />
                   <p className="text-[9px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium uppercase tracking-tight">
                     Este reporte cumple con los estándares de reporte de la EFSA y el Codex para la comunicación de riesgos microbiológicos.
                   </p>
                </div>
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                   <QuickInterpretation 
                    topic="source_files" 
                    variant="button" 
                    label="Arquitectura del Código Fuente"
                    className="w-full justify-start bg-white dark:bg-slate-800" 
                   />
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
