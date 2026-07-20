import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  HelpCircle, 
  X, 
  BookOpen, 
  Info, 
  TrendingUp, 
  ShieldAlert, 
  ArrowRight,
  Activity,
  Calculator,
  Microscope,
  DollarSign,
  Skull
} from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { cn } from '../lib/utils';

export type HelpTopic = 
  | 'incidence_rate' 
  | 'social_impact' 
  | 'daly' 
  | 'dose_response' 
  | 'weibull' 
  | 'ccdf' 
  | 'sensitivity' 
  | 'prevalence'
  | 'monte_carlo'
  | 'vsl'
  | 'exposure_flux'
  | 'haccp'
  | 'initial_load'
  | 'economic_params'
  | 'growth';

interface QuickInterpretationProps {
  topic: HelpTopic;
  className?: string;
  variant?: 'icon' | 'button' | 'link';
}

export const QuickInterpretation: React.FC<QuickInterpretationProps> = ({ topic, className, variant = 'icon' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();

  // Handle scroll lock and ESC key
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setIsOpen(false);
      };
      window.addEventListener('keydown', handleEsc);
      return () => {
        document.body.style.overflow = 'unset';
        window.removeEventListener('keydown', handleEsc);
      };
    }
  }, [isOpen]);

  const getTopicOverlay = () => {
    switch (topic) {
      case 'haccp':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <ShieldAlert className="w-5 h-5" />
              <h4 className="font-bold text-lg">Filtros HACCP y Mitigación</h4>
            </div>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              El Análisis de Peligros y Puntos Críticos de Control (HACCP) simula intervenciones técnicas que reducen la carga microbiana. Al activar este filtro, el modelo aplica factores de reducción (Deltas negativos) basados en buenas prácticas de manufactura.
            </p>
            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-900/30 text-[11px] text-emerald-800 dark:text-emerald-300 italic">
               Simula la eficacia de las barreras sanitarias en la cadena de valor.
            </div>
          </div>
        );
      case 'initial_load':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
              <Activity className="w-5 h-5" />
              <h4 className="font-bold text-lg">Carga Inicial (Log10)</h4>
            </div>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              Representa la concentración del patógeno en el punto de origen. Se mide en escala logarítmica (UFC/g o Log10). Una carga de 3.0 Log equivale a 1,000 organismos por unidad de masa.
            </p>
            <div className="text-[10px] font-mono text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-3 rounded-xl border border-amber-100 dark:border-amber-900/30">
               Concentración = 10^(LogMean ± StdDev)
            </div>
          </div>
        );
      case 'economic_params':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <DollarSign className="w-5 h-5" />
              <h4 className="font-bold text-lg">Parámetros de Costo Unitario</h4>
            </div>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              Valores monetarios asignados a cada evento clínico. Incluyen costos directos (hospitalización, medicinas) e indirectos (ausentismo laboral). Son críticos para el análisis costo-beneficio de intervenciones sanitarias.
            </p>
          </div>
        );
      case 'monte_carlo':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400">
              <Calculator className="w-5 h-5" />
              <h4 className="font-bold text-lg">Motor de Simulación Monte Carlo</h4>
            </div>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              Utiliza muestreo aleatorio repetido para obtener resultados numéricos. En QMRA, permite integrar la incertidumbre de los parámetros y la variabilidad biológica para generar una distribución de probabilidad del riesgo.
            </p>
            <div className="p-3 bg-teal-50 dark:bg-teal-900/20 rounded-xl border border-teal-100 dark:border-teal-900/30 text-[11px] font-mono">
               <div className="flex justify-between mb-1">
                 <span>Precision:</span>
                 <span className="text-teal-600 font-bold">Float64</span>
               </div>
               <div className="flex justify-between">
                 <span>Method:</span>
                 <span className="text-teal-600 font-bold">Latin Hypercube Sampling</span>
               </div>
            </div>
          </div>
        );
      case 'vsl':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
              <Skull className="w-5 h-5" />
              <h4 className="font-bold text-lg">Value of Statistical Life (VSL)</h4>
            </div>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              Es el valor monetario asignado a la reducción del riesgo de muerte prematura. No es el valor de una vida individual, sino la disposición a pagar por reducciones marginales en la mortalidad poblacional.
            </p>
            <p className="text-[10px] text-slate-400 bg-slate-50 dark:bg-slate-900 p-2 rounded-lg italic">
               Ajustado por el PIB per cápita local mediante la elasticidad de ingresos (0.8 - 1.2).
            </p>
          </div>
        );
      case 'exposure_flux':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <TrendingUp className="w-5 h-5" />
              <h4 className="font-bold text-lg">{t.exposureEvalTitle}</h4>
            </div>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {t.exposureEvalBody}
            </p>
            <div className="text-[10px] font-mono text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl border border-blue-100 dark:border-blue-900/30">
               {t.exposureEvalFormula}
            </div>
          </div>
        );
      case 'incidence_rate':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
              <Activity className="w-5 h-5" />
              <h4 className="font-bold text-lg">{t.incidenceRate}</h4>
            </div>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              Esta métrica normaliza el impacto por cada 100,000 habitantes. En seguridad alimentaria, se considera un indicador clave para comparar el riesgo entre diferentes regiones o años.
            </p>
            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl space-y-2 border border-slate-100 dark:border-slate-800">
              <p className="text-[10px] font-black uppercase text-slate-400">Escala de Interpretación</p>
              <div className="flex justify-between items-center text-[11px] font-mono">
                <span className="text-emerald-500">&lt; 1 Low</span>
                <span className="text-amber-500">1 - 10 Medium</span>
                <span className="text-rose-500">&gt; 10 High</span>
              </div>
            </div>
          </div>
        );
      case 'social_impact':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <DollarSign className="w-5 h-5" />
              <h4 className="font-bold text-lg">Impacto Económico Social</h4>
            </div>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              Representa la suma de los costos médicos directos, la pérdida de productividad por ausencia laboral y el costo de mortalidad (VSL). Es una técnica de "Cost of Illness" para cuantificar la carga del riesgo en términos monetarios.
            </p>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-900/30 text-[11px] text-blue-800 dark:text-blue-300">
               <strong>Nota:</strong> Los valores están ajustados al PIB per cápita del país seleccionado.
            </div>
          </div>
        );
      case 'daly':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
              <ShieldAlert className="w-5 h-5" />
              <h4 className="font-bold text-lg">{t.dalyMetric}</h4>
            </div>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {t.dalyDesc} Es el indicador estándar de la OMS que combina los años de vida perdidos por muerte prematura y los años vividos con discapacidad.
            </p>
            <p className="text-xs italic text-slate-500">
              Fórmula: DALY = YLL (Years of Life Lost) + YLD (Years Lived with Disability).
            </p>
          </div>
        );
      case 'dose_response':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
              <Microscope className="w-5 h-5" />
              <h4 className="font-bold text-lg">{t.doseResponseTitle}</h4>
            </div>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              El modelo Beta-Poisson describe la probabilidad de infección basada en una distribución de infectividad de la célula microbiana y la susceptibilidad del hospedador.
            </p>
            <ul className="text-xs space-y-2 list-disc pl-4 text-slate-500">
              <li><strong>α (Alfa):</strong> Parámetro de infectividad.</li>
              <li><strong>β (Beta):</strong> Parámetro de resistencia.</li>
            </ul>
          </div>
        );
      case 'ccdf':
        return (
          <div className="space-y-4">
             <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <TrendingUp className="w-5 h-5" />
              <h4 className="font-bold text-lg">{t.riskExceedance}</h4>
            </div>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {t.riskExceedanceDesc} Permite visualizar el "Tail Risk" o riesgo de cola. Un P(X &gt; 100) = 5% significa que hay un 5% de probabilidad de que ocurran más de 100 casos en un año.
            </p>
          </div>
        );
      default:
        return <p className="text-slate-600">Interpretación técnica en proceso...</p>;
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "transition-all active:scale-95 flex items-center justify-center relative z-10",
          variant === 'icon' && "p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-indigo-600",
          variant === 'button' && "px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-indigo-600",
          className
        )}
        title="Ver interpretación"
      >
        {variant === 'icon' ? <HelpCircle className="w-4 h-4" /> : variant === 'button' ? 'Interpretación' : 'Leer más'}
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 sm:p-6 overflow-hidden pointer-events-auto">
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
            />
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col"
            >
              <div className="p-6 md:p-8 flex flex-col h-full">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em]">{t.interpretationManual}</span>
                    <h3 className="text-xl font-serif font-black tracking-tighter text-slate-900 dark:text-white italic">{t.techContext}</h3>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsOpen(false);
                    }}
                    className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all text-slate-400 hover:text-rose-500 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 min-h-0">
                  {getTopicOverlay()}
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
                   <div className="flex items-center gap-2 text-[9px] font-mono text-slate-400">
                     <BookOpen className="w-3 h-3" />
                     <span>Ref: QMRA-ID: {topic?.toUpperCase()}</span>
                   </div>
                   <button
                     onClick={(e) => {
                       e.stopPropagation();
                       setIsOpen(false);
                     }}
                     className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all flex items-center gap-2 group shadow-lg shadow-indigo-500/20 active:scale-95"
                   >
                     {t.understood}
                     <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                   </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
