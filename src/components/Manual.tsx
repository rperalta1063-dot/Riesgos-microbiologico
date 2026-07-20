import { 
  BookOpen, 
  Info, 
  List, 
  Microscope, 
  Activity, 
  Calculator, 
  BarChart, 
  TrendingUp, 
  DollarSign, 
  AlertCircle,
  FileText,
  Download,
  Factory
} from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../hooks/useLanguage';
import { DoseResponseChart, InactivationChart, RiskExceedanceChart, SeverityProfile } from './Charts';
import { PAIRS } from '../data/pairs';
import { SimulationParams } from '../types';
import { cn } from '../lib/utils';
import { exportManualToPdf } from '../services/pdfService';

export default function Manual({ onClose }: { onClose?: () => void }) {
  const { t } = useLanguage();
  const samplePair = PAIRS[0]; // Salmonella standard for visualization
  const sampleParams: SimulationParams = {
    ...samplePair,
    id: samplePair.id,
    populationSize: 126000000,
    servingsPerYear: 52 * 126000000,
    costHosp: 5500,
    costAmb: 250,
    costAbsence: 120,
    costDeath: 2200000,
    costInterventionPerCase: 50
  };
  const mockResult = {
    cumulativeData: [
      { x: 1, exceedance: 100 },
      { x: 10, exceedance: 50 },
      { x: 100, exceedance: 10 },
      { x: 1000, exceedance: 1 },
    ]
  } as any;

  const sections = [
    { id: 'intro', title: t.introTitle, icon: Info },
    { id: 'interface', title: 'Interface y Controles', icon: List },
    { id: 'results', title: t.resultsTitle, icon: Activity },
    { id: 'industrial', title: 'Análisis de Riesgo Industrial (Lotes)', icon: Factory },
    { id: 'montecarlo', title: t.simulationTitle, icon: Calculator },
    { id: 'biological', title: t.modelsTitle, icon: Microscope },
    { id: 'economic', title: t.economyTitle, icon: DollarSign },
    { id: 'specs', title: t.specSectionTitle, icon: FileText },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-16 pb-32 text-stone-800 dark:text-slate-300 transition-colors">
      {/* Front Page / Header */}
      <header className="text-center space-y-6 pt-20">
        <div className="space-y-4">
          <h1 className="text-7xl font-serif font-bold text-stone-900 dark:text-slate-50 tracking-tight transition-colors">
            {t.appName} <span className="italic font-light text-indigo-600 dark:text-indigo-400">QMRA</span>
          </h1>
          <p className="text-sm font-bold uppercase tracking-[0.4em] text-stone-400 dark:text-slate-500 transition-colors">
            {t.appSubtitle} · 2025
          </p>
        </div>
        
        <div className="h-1 w-24 bg-indigo-600 dark:bg-indigo-500 mx-auto transition-colors" />
        
        <div className="space-y-4 max-w-2xl mx-auto">
          <h2 className="text-3xl font-serif font-bold text-indigo-900 dark:text-indigo-400 leading-tight transition-colors">
            {t.manualHeader}
          </h2>
          <p className="text-stone-500 dark:text-slate-400 font-serif italic text-lg leading-relaxed transition-colors">
            {t.manualTarget}
          </p>

          <div className="pt-4 flex justify-center gap-4">
            <button
              onClick={() => exportManualToPdf(t, PAIRS)}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-bold text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95"
            >
              <Download className="w-4 h-4" />
              {t.exportPdf}
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-full font-bold text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95"
              >
                Volver al Dashboard
              </button>
            )}
          </div>
        </div>

        <div className="flex justify-center gap-6 pt-4 text-[10px] font-bold uppercase tracking-widest text-stone-400 dark:text-slate-500 transition-colors">
          <span>14 {t.pairs}</span>
          <span>•</span>
          <span>47 {t.countries}</span>
          <span>•</span>
          <span>4 {t.languages}</span>
          <span>•</span>
          <span>Monte Carlo</span>
        </div>
      </header>

      {/* Table of Contents */}
      <section className="bg-white dark:bg-slate-800/50 p-10 rounded-[2.5rem] border border-stone-200 dark:border-slate-700 shadow-md max-w-3xl mx-auto transition-colors">
        <h3 className="text-xl font-serif font-bold text-stone-900 dark:text-slate-100 mb-8 border-b border-stone-100 dark:border-slate-800 pb-2 italic transition-colors">
          {t.toc}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12">
          {sections.map((s, i) => (
            <a 
              key={s.id} 
              href={`#${s.id}`}
              className="flex items-center gap-4 group cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              <span className="text-stone-300 dark:text-slate-600 font-mono text-xs">{i + 1}.</span>
              <span className="text-sm font-bold tracking-tight text-stone-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{s.title.split('. ').slice(1).join(' ') || s.title}</span>
            </a>
          ))}
        </div>
      </section>

      {/* 1. Introduction */}
      <section id="intro" className="space-y-8 pt-10">
        <div className="flex items-center gap-4 text-indigo-900 dark:text-indigo-400 border-b-2 border-indigo-100 dark:border-indigo-900/50 pb-3 transition-colors">
          <Info className="w-6 h-6" />
          <h3 className="text-2xl font-serif font-bold italic">{t.introTitle}</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div className="prose prose-stone dark:prose-invert max-w-none">
            <p className="text-lg leading-relaxed text-stone-600 dark:text-slate-400 transition-colors">
              {t.introBody}
            </p>
          </div>
          <div className="bg-stone-900 dark:bg-slate-950 p-8 rounded-3xl text-stone-100 space-y-6 shadow-2xl relative overflow-hidden transition-colors border border-slate-800">
             <div className="absolute top-0 right-0 p-4 opacity-10">
                <Calculator className="w-24 h-24" />
             </div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-indigo-400 dark:text-indigo-300 transition-colors">QMRA Pipeline</h4>
            <ul className="space-y-3 text-xs font-mono text-slate-400 dark:text-slate-500 transition-colors">
              <li>01. Identification</li>
              <li>02. Exposure Assessment</li>
              <li>03. Dose-Response</li>
              <li>04. Risk Characterization</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 2. Interface and Controls */}
      <section id="interface" className="space-y-8 pt-10">
        <div className="flex items-center gap-4 text-indigo-900 dark:text-indigo-400 border-b-2 border-indigo-100 dark:border-indigo-900/50 pb-3 transition-colors">
          <List className="w-6 h-6" />
          <h3 className="text-2xl font-serif font-bold italic">Nuevas Funcionalidades de Interface</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-8 bg-white dark:bg-slate-800/50 rounded-3xl border border-stone-200 dark:border-slate-700 space-y-4 transition-colors">
            <h4 className="font-bold font-serif text-stone-900 dark:text-slate-100 italic text-xl transition-colors">Modo de Selección de Raciones</h4>
            <p className="text-sm text-stone-600 dark:text-slate-400 leading-relaxed transition-colors">
              Ahora es posible definir la exposición mediante dos modalidades:
            </p>
            <ul className="text-xs space-y-2 text-stone-500 dark:text-slate-400">
              <li className="flex gap-2">
                <span className="font-bold whitespace-nowrap">Frecuencia Semanal:</span>
                <span>Permite definir cuántas raciones consume el ciudadano promedio por semana. El sistema calcula automáticamente el impacto anual poblacional basándose en el censo del país seleccionado.</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold whitespace-nowrap">Total por Año:</span>
                <span>Permite introducir directamente el volumen total de raciones puestas en el mercado anualmente (ideal para auditorías de lotes industriales específicos).</span>
              </li>
            </ul>
          </div>
          <div className="p-8 bg-white dark:bg-slate-800/50 rounded-3xl border border-stone-200 dark:border-slate-700 space-y-4 transition-colors">
            <h4 className="font-bold font-serif text-stone-900 dark:text-slate-100 italic text-xl transition-colors">Fundamentos Científicos</h4>
            <p className="text-sm text-stone-600 dark:text-slate-400 leading-relaxed transition-colors">
              Para una navegación más limpia, los modelos matemáticos (Dosis-Respuesta e Inactivación) y el Perfil de Gravedad se han consolidado en la <strong>Hoja Técnica</strong>.
            </p>
            <ul className="text-xs space-y-2 text-stone-500 dark:text-slate-400">
              <li className="flex gap-2">
                <span className="font-bold whitespace-nowrap">Modelos D-R:</span>
                <span>Visualización de la probabilidad de infección según la dosis ingerida.</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold whitespace-nowrap">Weibull:</span>
                <span>Cinética de inactivación térmica o química según el tratamiento configurado.</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold whitespace-nowrap">Perfil de Gravedad:</span>
                <span>Matriz de peligrosidad biológica que clasifica el impacto por severidad.</span>
              </li>
            </ul>
          </div>
          <div className="p-8 bg-white dark:bg-slate-800/50 rounded-3xl border border-stone-200 dark:border-slate-700 space-y-4 transition-colors">
            <h4 className="font-bold font-serif text-stone-900 dark:text-slate-100 italic text-xl transition-colors">Selección de Población Clínica</h4>
            <p className="text-sm text-stone-600 dark:text-slate-400 leading-relaxed transition-colors">
              Ahora es posible seleccionar múltiples grupos vulnerables simultáneamente para analizar el impacto diferencial del patógeno:
            </p>
            <ul className="text-xs space-y-2 text-stone-500 dark:text-slate-400">
              <li className="flex gap-2">
                <span className="font-bold whitespace-nowrap">Grupos Disponibles:</span>
                <span>Infantes, Adultos Mayores, Embarazadas e Inmunocomprometidos.</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold whitespace-nowrap">Impacto Probabilístico:</span>
                <span>El sistema desglosa los casos anuales, probabilidad de enfermedad y carga económica (DALYs y USD) para cada cohorte seleccionada, permitiendo priorizar intervenciones de salud pública específicas.</span>
              </li>
            </ul>
          </div>
          <div className="p-8 bg-white dark:bg-slate-800/50 rounded-3xl border border-stone-200 dark:border-slate-700 space-y-4 transition-colors">
            <h4 className="font-bold font-serif text-stone-900 dark:text-slate-100 italic text-xl transition-colors">Selección Dual (Pestañas)</h4>
            <p className="text-sm text-stone-600 dark:text-slate-400 leading-relaxed transition-colors">
              Se ha implementado un sistema de navegación por pestañas en el panel de control. 
              Ahora puede seleccionar primero el <strong>Patógeno</strong> y luego asociarlo con el <strong>Alimento</strong> vector específico. 
              Este cambio optimiza la búsqueda y garantiza que solo se muestren alimentos asociados científicamente al patógeno seleccionado.
            </p>
          </div>
          <div className="p-8 bg-white dark:bg-slate-800/50 rounded-3xl border border-stone-200 dark:border-slate-700 space-y-4 transition-colors">
            <h4 className="font-bold font-serif text-stone-900 dark:text-slate-100 italic text-xl transition-colors">Control de Simulación y Reinicio</h4>
            <p className="text-sm text-stone-600 dark:text-slate-400 leading-relaxed transition-colors">
              Se ha añadido un botón de <strong>Resetear Parámetros</strong> que permite volver instantáneamente a los valores base recomendados por la literatura. 
              Además, el sistema de ejecución ahora cuenta con una <strong>visualización de procesamiento en tiempo real</strong>: al activar el kernel de Monte Carlo, verá un indicador de "escaneo" y un overlay de actividad que confirma que los 10,000 ciclos están en proceso.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Results interpretation */}
      <section id="results" className="space-y-8 pt-10">
        <div className="flex items-center gap-4 text-indigo-900 dark:text-indigo-400 border-b-2 border-indigo-100 dark:border-indigo-900/50 pb-3 transition-colors">
          <Activity className="w-6 h-6" />
          <h3 className="text-2xl font-serif font-bold italic">{t.resultsTitle}</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-8 bg-white dark:bg-slate-800/50 rounded-3xl border border-stone-200 dark:border-slate-700 space-y-4 transition-colors">
            <h4 className="font-bold font-serif text-stone-900 dark:text-slate-100 italic text-xl transition-colors">{t.riskExceedance}</h4>
            <div className="space-y-4">
              <p className="text-xs text-stone-500 dark:text-slate-400 leading-relaxed italic transition-colors">
                {t.riskExceedanceDesc} La curva CCDF permite evaluar la probabilidad de que ocurran brotes de gran magnitud, 
                siendo una herramienta vital para la planificación de contingencias sanitarias.
              </p>
              <div className="h-48 opacity-60">
                <RiskExceedanceChart result={mockResult} />
              </div>
            </div>
          </div>
          <div className="p-8 bg-white dark:bg-slate-800/50 rounded-3xl border border-stone-200 dark:border-slate-700 space-y-4 transition-colors">
            <h4 className="font-bold font-serif text-stone-900 dark:text-slate-100 italic text-xl transition-colors">Interpretación y Escala</h4>
            <p className="text-sm text-stone-600 dark:text-slate-400 leading-relaxed transition-colors">
              {t.resultsBody}
            </p>
            <div className="p-4 bg-stone-950 rounded-xl text-center">
              <div className="text-[9px] font-bold text-stone-500 uppercase tracking-widest mb-1">{t.incidenceRate}</div>
              <div className="text-2xl font-serif font-bold text-white italic">7.42 <span className="text-[10px] font-mono opacity-50 uppercase tracking-tighter">/ 100k</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Industry Module Analysis */}
      <section id="industrial" className="space-y-8 pt-10">
        <div className="flex items-center gap-4 text-indigo-900 dark:text-indigo-400 border-b-2 border-indigo-100 dark:border-indigo-900/50 pb-3 transition-colors">
          <Factory className="w-6 h-6" />
          <h3 className="text-2xl font-serif font-bold italic">Análisis de Riesgo para la Industria Alimentaria</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div className="space-y-6">
            <div className="prose prose-stone dark:prose-invert">
              <p className="text-stone-600 dark:text-slate-400 leading-relaxed transition-colors">
                Este módulo está diseñado específicamente para auditorías de calidad y seguridad en plantas de procesamiento. 
                Permite evaluar el impacto de un <strong>lote de producción específico</strong> (Batch Analysis) en lugar de una exposición poblacional anual genérica.
              </p>
            </div>
            
            <div className="p-6 bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/30 space-y-4 transition-colors text-xs text-blue-800 dark:text-blue-300">
               <h4 className="font-bold uppercase tracking-wider">Métricas de Salud Pública por Lote</h4>
               <ul className="space-y-2 list-disc pl-4 leading-relaxed">
                  <li><strong>Casos Esperados:</strong> Estimación central de infecciones humanas derivadas del consumo de las raciones del lote. Se expresan de forma simplificada en números enteros para facilitar la toma de decisiones.</li>
                  <li><strong>Hospitalizaciones y Muertes:</strong> Proyecciones de gravedad clínica basadas en la virulencia del binomio patógeno-alimento.</li>
               </ul>
            </div>

            <div className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
               <FileText className="w-10 h-10 text-indigo-600 opacity-20" />
               <div className="flex-1">
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Exportación de Reportes</h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Ahora puede exportar los resultados detallados del análisis industrial a formato <strong>CSV</strong> para su integración en sistemas de gestión de calidad (LIMS/ERP).</p>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-5 bg-white dark:bg-slate-800/50 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xs transition-colors">
               <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Prob. Brote</div>
               <div className="text-xl font-bold font-mono text-rose-500 transition-colors">P ≥ 1</div>
               <p className="mt-2 text-[9px] text-slate-500 leading-tight">Riesgo de observar al menos una infección en el mercado.</p>
            </div>
            <div className="p-5 bg-white dark:bg-slate-800/50 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xs transition-colors">
               <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Impacto</div>
               <div className="text-xl font-bold font-mono text-indigo-600 dark:text-indigo-400 transition-colors">Riesgo $</div>
               <p className="mt-2 text-[9px] text-slate-500 leading-tight">Valor de riesgo económico estimado por pérdida de productividad y salud.</p>
            </div>
            <div className="col-span-2 p-5 bg-stone-900 dark:bg-slate-950 rounded-3xl border border-slate-800 shadow-sm transition-colors">
               <div className="flex justify-between items-center mb-4">
                  <div className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest">Visualización de Resultados</div>
                  <Activity className="w-4 h-4 text-white animate-pulse" />
               </div>
               <div className="space-y-3">
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                     <div className="h-full w-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                  </div>
                  <p className="text-[9px] text-indigo-400 font-mono italic">Resultados Generados y Listos para Exportación</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Algorithm & Monte Carlo Logic */}
      <section id="montecarlo" className="space-y-12 pt-10">
        <div className="flex items-center gap-4 text-indigo-900 dark:text-indigo-400 border-b-2 border-indigo-100 dark:border-indigo-900/50 pb-3 transition-colors">
          <Calculator className="w-6 h-6" />
          <h3 className="text-2xl font-serif font-bold italic">{t.simulationTitle}</h3>
        </div>

        <div className="prose prose-stone dark:prose-invert max-w-none">
          <p className="text-stone-600 dark:text-slate-400 leading-relaxed text-lg">
            {t.montecarloIntro}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 bg-stone-900 dark:bg-slate-950 p-10 rounded-[2.5rem] border border-slate-800 shadow-2xl transition-colors overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] rotate-12">
              <Calculator className="w-64 h-64" />
            </div>
            <div className="relative z-10 space-y-8">
              <div className="flex items-center gap-3 border-b border-white/10 pb-6">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.6)]" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.6)]" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.6)]" />
                <span className="ml-2 font-mono text-[11px] text-slate-500 uppercase tracking-[0.2em] leading-none mt-0.5">LOGICA_STOCASTICA_KERNEL.v3</span>
              </div>
              
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <h4 className="text-indigo-400 font-bold uppercase tracking-widest text-xs">{t.montecarloStep1Title}</h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed font-mono">
                      {t.montecarloStep1Desc}
                    </p>
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-indigo-400 font-bold uppercase tracking-widest text-xs">{t.montecarloStep2Title}</h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed font-mono">
                      {t.montecarloStep2Desc}
                    </p>
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-indigo-400 font-bold uppercase tracking-widest text-xs">{t.montecarloStep3Title}</h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed font-mono">
                      {t.montecarloStep3Desc}
                    </p>
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-indigo-400 font-bold uppercase tracking-widest text-xs">{t.montecarloStep4Title}</h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed font-mono">
                      {t.montecarloStep4Desc}
                    </p>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5">
                  <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex gap-4">
                      <div className="px-3 py-1 bg-white/5 rounded text-[10px] font-mono text-slate-500 uppercase tracking-tight">Loop: 10,000x</div>
                      <div className="px-3 py-1 bg-white/5 rounded text-[10px] font-mono text-slate-500 uppercase tracking-tight">Thread: Worker_Pool</div>
                    </div>
                    <span className="text-indigo-400 font-bold tracking-[0.3em] font-mono text-xs">{`RESULT = Σ(Impacto[i]) / N`}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800/50 p-8 rounded-[2rem] border border-stone-200 dark:border-slate-700 shadow-sm transition-colors space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 dark:text-slate-100 transition-colors tracking-tight">{t.stochasticStabilityTitle}</h4>
                </div>
              </div>
              <p className="text-xs text-stone-600 dark:text-slate-400 leading-relaxed italic">
                {t.stochasticStabilityDesc}
              </p>
              <div className="h-2 w-full bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: '100%' }}
                  className="h-full bg-indigo-500" 
                />
              </div>
              <div className="flex justify-between text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                <span>Convergencia</span>
                <span className="text-indigo-600">Completa</span>
              </div>
            </div>

            <div className="p-8 bg-indigo-600 rounded-[2rem] text-white shadow-xl space-y-4 relative overflow-hidden">
               <div className="absolute -bottom-4 -right-4 opacity-10">
                 <Calculator className="w-32 h-32" />
               </div>
               <h4 className="font-bold font-serif italic text-xl">{t.dataIntegrityTitle}</h4>
               <p className="text-xs text-indigo-100 leading-relaxed">
                 {t.dataIntegrityDesc}
               </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Biological Models */}
      <section id="biological" className="space-y-8 pt-10">
        <div className="flex items-center gap-4 text-indigo-900 dark:text-indigo-400 border-b-2 border-indigo-100 dark:border-indigo-900/50 pb-3 transition-colors">
          <Microscope className="w-6 h-6" />
          <h3 className="text-2xl font-serif font-bold italic">{t.modelsTitle}</h3>
        </div>
        
        <div className="prose prose-stone dark:prose-invert max-w-none mb-8">
          <p className="text-stone-600 dark:text-slate-400 leading-relaxed">
            Los modelos biológicos integrados en <strong>{t.appName}</strong> permiten transformar la exposición (ingesta de microorganismos) en probabilidad de infección y enfermedad, considerando tanto la virulencia del patógeno como la susceptibilidad del hospedador.
          </p>
        </div>

        <div className="flex flex-col gap-8">
          <div className="p-8 bg-white dark:bg-slate-800/50 rounded-[2rem] border border-stone-200 dark:border-slate-700 shadow-sm space-y-4 transition-colors">
             <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold font-serif text-stone-900 dark:text-slate-100 italic text-lg transition-colors">{t.doseResponseTitle}</h4>
                <div className="px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 rounded text-[8px] font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 transition-colors">Beta-Poisson</div>
             </div>
             <p className="text-xs text-stone-500 dark:text-slate-400 leading-relaxed transition-colors">
                {t.doseResponseDesc} El modelo asume que la ingestión de una sola célula capaz de sobrevivir a las barreras del hospedador e iniciar la infección es un evento estocástico determinado por los parámetros α (infectividad) y β (resistencia).
             </p>
             <DoseResponseChart pair={samplePair} params={sampleParams} />

             {/* Key Points for Dose-Response */}
             <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-stone-50 dark:bg-slate-900/50 rounded-xl border border-stone-100 dark:border-slate-800 transition-colors">
                   <div className="text-[8px] font-bold text-indigo-500 uppercase tracking-widest mb-1">Dosis Crítica (10⁵)</div>
                   <div className="text-[10px] text-stone-600 dark:text-slate-400">Prob. Infección: <span className="font-bold text-rose-500">~65%</span></div>
                </div>
                <div className="p-3 bg-stone-50 dark:bg-slate-900/50 rounded-xl border border-stone-100 dark:border-slate-800 transition-colors">
                   <div className="text-[8px] font-bold text-indigo-500 uppercase tracking-widest mb-1">Dosis Baja (10²)</div>
                   <div className="text-[10px] text-stone-600 dark:text-slate-400">Prob. Infección: <span className="font-bold text-emerald-500">~5%</span></div>
                </div>
             </div>
          </div>

          <div className="p-8 bg-white dark:bg-slate-800/50 rounded-[2rem] border border-stone-200 dark:border-slate-700 shadow-sm space-y-4 transition-colors">
             <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold font-serif text-stone-900 dark:text-slate-100 italic text-lg transition-colors">Inactivación de Weibull</h4>
                <div className="px-2 py-1 bg-emerald-50 dark:bg-emerald-900/30 rounded text-[8px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 transition-colors">Non-Linear Decay</div>
             </div>
             <p className="text-xs text-stone-500 dark:text-slate-400 leading-relaxed transition-colors">
                A diferencia de la cinética de primer orden, este modelo captura la variabilidad en la termorresistencia de la población microbiana, permitiendo curvas de reducción cóncavas o convexas basadas en el tiempo y la temperatura.
             </p>
             <InactivationChart pair={samplePair} params={sampleParams} />
             
             {/* Data Table for Inactivation */}
             <div className="mt-4 overflow-hidden rounded-xl border border-stone-100 dark:border-slate-700">
               <table className="w-full text-[9px] text-left">
                 <thead className="bg-stone-50 dark:bg-slate-900/50 text-stone-400 dark:text-slate-500 font-bold uppercase tracking-tighter">
                   <tr>
                     <th className="px-3 py-2">Tiempo (min)</th>
                     <th className="px-3 py-2">Reducción (Log₁₀)</th>
                     <th className="px-3 py-2">Sobrevivencia (%)</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-stone-50 dark:divide-slate-800 font-mono">
                   {[0, 1, 2, 5, 10].map(m => {
                     const t = m * (samplePair.inactivationTime / 10 || 0.5);
                     const red = samplePair.delta > 0 ? Math.pow(t / samplePair.delta, samplePair.p) : 0;
                     const surv = Math.pow(10, -red) * 100;
                     return (
                       <tr key={m} className={cn(m === 0 ? "bg-indigo-50/20" : "")}>
                         <td className="px-3 py-2 text-stone-800 dark:text-slate-300 font-bold">{t.toFixed(1)}</td>
                         <td className="px-3 py-2 text-rose-500">-{red.toFixed(2)}</td>
                         <td className="px-3 py-2 text-emerald-500">{surv < 0.001 ? surv.toExponential(2) : surv.toFixed(4)}%</td>
                       </tr>
                     );
                   })}
                 </tbody>
               </table>
             </div>
          </div>

          <div className="p-8 bg-white dark:bg-slate-800/50 rounded-[2rem] border border-stone-200 dark:border-slate-700 shadow-sm space-y-4 transition-colors md:col-span-2">
             <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold font-serif text-stone-900 dark:text-slate-100 italic text-lg transition-colors">Perfil de Gravedad (Bio-Matrix)</h4>
                <div className="px-2 py-1 bg-rose-50 dark:bg-rose-900/30 rounded text-[8px] font-bold uppercase tracking-widest text-rose-600 dark:text-rose-400 transition-colors">Pathogen Severity</div>
             </div>
             <div className="grid md:grid-cols-2 gap-8 items-center">
               <p className="text-xs text-stone-500 dark:text-slate-400 leading-relaxed transition-colors">
                  Este panel visualiza de forma comparada la peligrosidad intrínseca. Se desglosa la probabilidad de que una infección progrese a un estado clínico grave (Hospitalización), el riesgo de secuelas permanentes (Cronicidad) y la tasa de mortalidad esperada.
               </p>
               <div className="h-48">
                 <SeverityProfile pair={samplePair} params={sampleParams} />
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* 5. Economic Assessment */}
      <section id="economic" className="space-y-8 pt-10">
        <div className="flex items-center gap-4 text-indigo-900 dark:text-indigo-400 border-b-2 border-indigo-100 dark:border-indigo-900/50 pb-3 transition-colors">
          <DollarSign className="w-6 h-6" />
          <h3 className="text-2xl font-serif font-bold italic">{t.economyTitle}</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-12">
          <div className="prose prose-stone dark:prose-invert">
            <p className="text-stone-600 dark:text-slate-400 leading-relaxed transition-colors">
              El impacto económico de las enfermedades transmitidas por alimentos se evalúa mediante un modelo de coste de la enfermedad recientemente actualizado con datos específicos por país:
            </p>
            <div className="mt-4 p-4 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-xl border border-indigo-100 dark:border-indigo-900/30 text-[10px] text-indigo-800 dark:text-indigo-400 leading-relaxed mb-6">
              <h5 className="font-bold mb-1 uppercase">Actualización Regional: América del Norte</h5>
              <p>
                <strong>México</strong> ha sido reclasificado en el grupo de América del Norte, con valores de <strong>VSL (Valor de Vida Estadística)</strong> ajustados a $2.2M USD, y costes de hospitalización actualizados a $5,500 USD por evento.
              </p>
            </div>
            <ul className="text-sm space-y-4 pt-4">
              <li className="flex gap-4">
                <div className="w-1 h-1 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                <div>
                  <strong className="text-stone-900 dark:text-slate-100 transition-colors">{t.medicalCosts}:</strong>
                  <p className="text-stone-500 dark:text-slate-400 transition-colors">Gastos directos en hospitalización y atención ambulatoria.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-1 h-1 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
                <div>
                  <strong className="text-stone-900 dark:text-slate-100 transition-colors">{t.productivityLoss}:</strong>
                  <p className="text-stone-500 dark:text-slate-400 transition-colors">Días de trabajo perdidos por enfermedad y cuidados.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-1 h-1 bg-emerald-500 rounded-full mt-2 flex-shrink-0" />
                <div>
                  <strong className="text-stone-900 dark:text-slate-100 transition-colors">{t.interventionCosts}:</strong>
                  <p className="text-stone-500 dark:text-slate-400 transition-colors">Gastos del sistema de salud pública en vigilancia e intervenciones.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-1 h-1 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                <div>
                  <strong className="text-stone-900 dark:text-slate-100 transition-colors">{t.chronicCost}:</strong>
                  <p className="text-stone-500 dark:text-slate-400 transition-colors">
                    Modelado granular de secuelas específicas (p. ej., SUH por STEC, Guillain-Barré por Campylobacter) que incluye el coste de cuidados de por vida y el impacto funcional.
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-1 h-1 bg-rose-500 rounded-full mt-2 flex-shrink-0" />
                <div>
                  <strong className="text-stone-900 dark:text-slate-100 transition-colors">Carga de Enfermedad (DALYs):</strong>
                  <p className="text-stone-500 dark:text-slate-400 transition-colors">
                    Valoración monetaria de los años perdidos por muerte prematura (YLL) y discapacidad (YLD), utilizando tasas de descuento social del 3% anual.
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-1 h-1 bg-rose-500 rounded-full mt-2 flex-shrink-0" />
                <div>
                  <strong className="text-stone-900 dark:text-slate-100 transition-colors">{t.mortalityCost}:</strong>
                  <p className="text-stone-500 dark:text-slate-400 transition-colors">Pérdida de valor estadístico de la vida (VSL) por fallecimientos prematuros.</p>
                </div>
              </li>
            </ul>
            <div className="mt-8 p-6 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800 transition-colors">
              <h5 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4 transition-colors underline decoration-indigo-500/30 underline-offset-4">Metodología de Cálculo DALYs (Carga de Enfermedad)</h5>
              <div className="space-y-4 font-mono text-[10px] text-slate-600 dark:text-slate-400 leading-relaxed">
                <div className="p-3 bg-white dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-800 transition-colors">
                  <p className="text-indigo-600 dark:text-indigo-400 font-bold mb-1">Fórmula General:</p>
                  <p className="text-[11px] font-bold">DALY = YLL + YLD_agudo + YLD_crónico</p>
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                  <div className="p-3 bg-white dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-800 transition-colors">
                    <p className="text-indigo-600 dark:text-indigo-400 font-bold mb-1">1. YLL (Años de Vida Perdidos por Mortalidad):</p>
                    <p className="font-bold">YLL = Muertes × (Esperanza_Vida - Edad_Muerte)</p>
                    <p className="mt-1 text-[8px] opacity-70">El sistema utiliza una esperanza de vida estándar truncada a los 35 años de pérdida promedio para muertes por ETAs en población general.</p>
                  </div>
                  
                  <div className="p-3 bg-white dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-800 transition-colors">
                    <p className="text-indigo-600 dark:text-indigo-400 font-bold mb-1">2. YLD Agudo (Discapacidad por Fase de Infección):</p>
                    <p className="font-bold">YLD_agudo = Casos × DW_fase × (Duración_dias / 365)</p>
                    <p className="mt-1 text-[8px] opacity-70">
                      <strong>DW (Disability Weight):</strong> Representa la severidad de la enfermedad (0 = salud perfecta, 1 = muerte). 
                      Una infección gastrointestinal aguda típica tiene un DW aproximado de 0.074.
                    </p>
                  </div>

                  <div className="p-3 bg-white dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-800 transition-colors">
                    <p className="text-indigo-600 dark:text-indigo-400 font-bold mb-1">3. YLD Crónico (Secuelas y Complicaciones):</p>
                    <p className="font-bold text-indigo-500 italic">YLD_crónico = Σ [DW_secuela × (1 - e^(-r·L)) / r]</p>
                    <p className="mt-2 text-[8px] opacity-70 leading-normal">
                      <strong>Factores de Descuento (r = 3%):</strong> Se aplica para reflejar la preferencia social por beneficios presentes sobre futuros. 
                      Para secuelas de larga duración (L), el cálculo integra la discapacidad descontada a lo largo del tiempo. 
                      Esto es vital para secuelas como el Síndrome de Guillain-Barré (DW ≈ 0.40) o Síndrome Urémico Hemolítico.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-indigo-50/30 dark:bg-indigo-900/10 rounded-xl border border-indigo-100/50 dark:border-indigo-900/50 transition-colors">
                  <h6 className="text-[9px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-2 italic">Importancia de los Pesos de Discapacidad (DW)</h6>
                  <p className="text-[9px] text-slate-500 dark:text-slate-400 leading-normal">
                    Los DW permiten normalizar diferentes condiciones de salud. En <strong>{t.appName}</strong>, los DW se extraen del <i>Global Burden of Disease (GBD)</i>. 
                    Un DW alto en un patógeno (ej. Listeria) justifica inversiones en seguridad mucho mayores incluso si la prevalencia es baja, 
                    ya que el impacto funcional por individuo infectado es masivo.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800/50 p-8 rounded-[2.5rem] border border-stone-200 dark:border-slate-700 shadow-md transition-colors space-y-6">
             <h4 className="text-[10px] font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-[0.2em] mb-4 transition-colors">Componentes de Carga (Infografía)</h4>
             <div className="space-y-6">
                <div className="space-y-2">
                   <div className="flex justify-between text-[9px] font-bold uppercase tracking-tighter text-slate-400">
                      <span>{t.medicalCosts}</span>
                      <span className="text-indigo-600 font-mono italic">25% - 30%</span>
                   </div>
                   <div className="h-2 w-full bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 w-[28%] rounded-full shadow-[0_0_12px_rgba(99,102,241,0.3)]" />
                   </div>
                </div>
                <div className="space-y-2">
                   <div className="flex justify-between text-[9px] font-bold uppercase tracking-tighter text-slate-400">
                      <span>{t.productivityLoss}</span>
                      <span className="text-amber-600 font-mono italic">40% - 50%</span>
                   </div>
                   <div className="h-2 w-full bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 w-[45%] rounded-full shadow-[0_0_12px_rgba(245,158,11,0.3)]" />
                   </div>
                </div>
                <div className="space-y-2">
                   <div className="flex justify-between text-[9px] font-bold uppercase tracking-tighter text-slate-400">
                      <span>Carga Crónica / Secuelas</span>
                      <span className="text-rose-600 font-mono italic">15% - 20%</span>
                   </div>
                   <div className="h-2 w-full bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
                      <div className="h-full bg-rose-500 w-[18%] rounded-full shadow-[0_0_12px_rgba(244,63,94,0.3)]" />
                   </div>
                </div>
             </div>

             <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                <p className="text-[10px] text-slate-500 leading-relaxed italic">
                   * La distribución varía según el patógeno. Patógenos como STEC (E. coli) presentan una mayor proporción en costes de secuelas debido al Síndrome Urémico Hemolítico.
                </p>
             </div>
             
             <div className="bg-slate-900 rounded-2xl p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
                   <TrendingUp className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                   <div className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Incertidumbre</div>
                   <div className="text-xs text-white font-mono">Intervalo de Confianza del 95%</div>
                </div>
             </div>
          </div>
        </div>
      </section>
      
      {/* 6. Technical Sheets - Pathogen Database */}
      <section id="specs" className="space-y-8 pt-10">
        <div className="flex items-center gap-4 text-indigo-900 dark:text-indigo-400 border-b-2 border-indigo-100 dark:border-indigo-900/50 pb-3 transition-colors">
          <FileText className="w-6 h-6" />
          <h3 className="text-2xl font-serif font-bold italic">{t.specSectionTitle}</h3>
        </div>
        
        <div className="prose prose-stone dark:prose-invert max-w-none">
          <p className="text-stone-600 dark:text-slate-400 transition-colors">
            {t.specSectionDesc}
          </p>
              <div className="flex flex-wrap gap-4 pt-2 text-[10px] font-mono text-stone-500 dark:text-slate-500 italic">
                <span>α/β: Parámetros Dosis-Respuesta</span>
                <span>•</span>
                <span>Letalidad: Probabilidad fatal (%)</span>
                <span>•</span>
                <span>DW: Disability Weight (0-1)</span>
                <span>•</span>
                <span>r: Tasa descuento social (3%)</span>
                <span>•</span>
                <span>Audit: Trazabilidad de parámetros</span>
              </div>
              <div className="mt-4 p-4 bg-amber-50/50 dark:bg-amber-900/10 rounded-xl border border-amber-100 dark:border-amber-900/30 text-[10px] text-amber-800 dark:text-amber-400 leading-relaxed transition-colors">
                <p className="font-bold mb-1 uppercase tracking-wider">Trazabilidad y Auditoría de Escenarios:</p>
                <p>
                  Cada simulación genera automáticamente un panel de <strong>Scenario Audit</strong>. 
                  Este registro captura los estados exactos de las variables de entrada (prevalencia, carga, reducciones) 
                  y el número de iteraciones, permitiendo la reproducibilidad técnica y la transparencia en la comunicación del riesgo.
                </p>
              </div>
          <div className="mt-4 p-4 bg-blue-50/50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/30 text-[10px] text-blue-800 dark:text-blue-400 leading-relaxed transition-colors">
            <p className="font-bold mb-1 uppercase tracking-wider">Nota Técnica sobre Reducción Logarítmica (Preparación):</p>
            <p>
              El rango de reducción en la etapa de preparación se ha extendido hasta <strong>-8.0 Log₁₀</strong>. 
              Este ajuste permite modelar procesos de cocción de alta eficiencia, alineándose con las guías de 
              <strong> USDA (FSIS)</strong> y <strong>EFSA</strong> para <i>Salmonella</i> en productos avícolas, 
              que recomiendan una reducción de al menos 7 Log₁₀ (p. ej., alcanzando una temperatura interna de &gt;74°C durante 15 segundos).
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PAIRS.map((p) => (
            <div key={p.id} className="p-6 bg-white dark:bg-slate-800/40 rounded-3xl border border-stone-200 dark:border-slate-700 space-y-4 hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-all group shadow-md">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl grayscale group-hover:grayscale-0 transition-all">{p.icon}</span>
                  <div>
                    <h5 className="font-bold text-stone-900 dark:text-slate-100 transition-colors">{p.pathogen}</h5>
                    <p className="text-[10px] uppercase tracking-wider text-stone-400 dark:text-slate-500 font-bold">{p.food}</p>
                  </div>
                </div>
                <div className={cn(
                  "px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest",
                  p.risk === 'h' ? "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400" : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                )}>
                  {p.risk === 'h' ? 'High Risk' : 'Med Risk'}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-stone-100 dark:border-slate-700 transition-colors">
                <div className="space-y-1">
                  <p className="text-[9px] font-bold text-stone-400 dark:text-slate-500 uppercase tracking-tight">{t.infectivityCol}</p>
                  <p className="text-xs font-mono text-stone-600 dark:text-slate-300">α: {p.alpha}<br/>β: {p.beta < 1000 ? p.beta : p.beta.toExponential(1)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] font-bold text-stone-400 dark:text-slate-500 uppercase tracking-tight">{t.severityCol}</p>
                  <p className="text-xs font-mono text-stone-600 dark:text-slate-300">{(p.mortalityRate * 100).toFixed(2)}%<br/>({p.absenceDays} d)</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] font-bold text-stone-400 dark:text-slate-500 uppercase tracking-tight">{t.chronicCol}</p>
                  <p className="text-xs font-mono text-stone-600 dark:text-slate-300">{(p.chronicRate * 100).toFixed(0)}%<br/>{p.chronicDalyWeight.toFixed(2)} DW</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Warning Banner */}
      <section className="bg-rose-50 dark:bg-rose-950/20 border-2 border-rose-200 dark:border-rose-900/50 rounded-[2.5rem] p-10 flex flex-col md:flex-row gap-8 items-center text-center md:text-left transition-colors">
        <div className="p-4 bg-rose-100 dark:bg-rose-900/30 rounded-full flex-shrink-0 animate-pulse transition-colors">
           <AlertCircle className="w-10 h-10 text-rose-600 dark:text-rose-400 transition-colors" />
        </div>
        <div className="space-y-3">
          <h4 className="text-2xl font-serif font-bold text-rose-900 dark:text-rose-300 italic transition-colors">{t.warningTitle}</h4>
          <p className="text-sm text-rose-800 dark:text-rose-400 leading-relaxed font-medium transition-colors">
            {t.warningBody}
          </p>
        </div>
      </section>

      <footer className="text-center pt-24 border-t border-stone-200 dark:border-slate-800 transition-colors flex flex-col items-center gap-8">
        {onClose && (
           <button
           onClick={onClose}
           className="px-8 py-3 bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-400 rounded-full font-bold text-xs uppercase tracking-widest transition-all border border-indigo-200 dark:border-indigo-800 active:scale-95"
         >
           Finalizar Lectura y Cerrar Manual
         </button>
        )}
        <div className="inline-block px-6 py-3 bg-stone-900 dark:bg-black rounded-full text-[10px] font-mono text-stone-400 dark:text-slate-500 uppercase tracking-[0.3em] shadow-xl transition-colors border border-slate-800">
          — {t.footerEnd} — {t.appName} QMRA —
        </div>
      </footer>
    </div>
  );
}
