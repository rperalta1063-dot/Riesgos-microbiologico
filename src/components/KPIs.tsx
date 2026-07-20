import { SimulationResult, Country } from '../types';
import { formatNumber, formatDecimal, formatCurrency, cn } from '../lib/utils';
import { motion } from 'motion/react';
import { 
  Activity, 
  Hospital, 
  Skull, 
  Clock, 
  Percent, 
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  HeartPulse, 
  Target, 
  TrendingUp, 
  Briefcase, 
  Heart,
  Users,
  Info,
  DollarSign 
} from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { QuickInterpretation, HelpTopic } from './QuickInterpretation';

interface Props {
  result: SimulationResult;
  country: Country;
  highlightMode?: 'bio' | 'econ';
}

export default function KPIs({ result, country, highlightMode = 'bio' }: Props) {
  const { t } = useLanguage();
  const s = result.summary;

  const cards: { 
    label: string; 
    value: string; 
    ci: string; 
    icon: any; 
    color: string; 
    bg: string; 
    accent: string; 
    tooltip?: string;
    topic?: HelpTopic;
    isPrimary?: boolean;
    mode: 'bio' | 'econ' | 'both';
    visible?: boolean;
  }[] = [
    { 
      label: 'Carga de Salud (DALYs)', 
      value: s.annualDALYs.toFixed(2), 
      ci: s.annualDALYsCI ? `95% CI: [${s.annualDALYsCI[0].toFixed(1)}, ${s.annualDALYsCI[1].toFixed(1)}]` : 'Métrica de severidad',
      icon: Activity,
      color: 'text-amber-700 dark:text-amber-400',
      bg: 'bg-amber-500/10 dark:bg-amber-400/10',
      accent: 'border-amber-500/20 dark:border-amber-400/20',
      isPrimary: true,
      mode: 'bio'
    },
    { 
      label: 'Casos Clínicos Anuales', 
      value: formatNumber(Math.round(s.annualCases)), 
      ci: s.annualCasesCI ? `95% CI: [${formatNumber(Math.round(s.annualCasesCI[0]))}, ${formatNumber(Math.round(s.annualCasesCI[1]))}]` : 'Proyección media',
      icon: Users,
      color: 'text-blue-700 dark:text-blue-400',
      bg: 'bg-blue-500/10 dark:bg-blue-400/10',
      accent: 'border-blue-500/20 dark:border-blue-400/20',
      isPrimary: false,
      mode: 'bio'
    },
    { 
      label: Object.keys(s.vulnerableResults || {}).length > 0 ? 'Riesgo Población General' : 'Prob. de Enfermedad', 
      value: (s.probIllness * 100).toExponential(2) + '%', 
      ci: s.probIllnessCI ? `95% CI: [${(s.probIllnessCI[0] * 100).toExponential(1)}, ${(s.probIllnessCI[1] * 100).toExponential(1)}]%` : 'Estimación media',
      icon: Target,
      color: 'text-rose-600 dark:text-rose-400',
      bg: 'bg-rose-50 dark:bg-rose-900/40',
      accent: 'border-rose-200/50 dark:border-rose-500/20',
      topic: 'incidence_rate',
      isPrimary: false,
      mode: 'bio'
    },
    { 
      label: 'Impacto en Grupos Vulnerables', 
      value: Object.keys(s.vulnerableResults || {}).length.toString(), 
      ci: 'Cohortes en riesgo seleccionadas',
      icon: ShieldAlert,
      color: 'text-indigo-600 dark:text-indigo-400',
      bg: 'bg-indigo-50 dark:bg-indigo-900/40',
      accent: 'border-indigo-200/50 dark:border-indigo-500/20',
      isPrimary: true,
      mode: 'bio',
      visible: Object.keys(s.vulnerableResults || {}).length > 0
    },
    { 
      label: 'Exposición Media', 
      value: (result.stats.mean ?? 0) < 1e-2 ? (result.stats.mean ?? 0).toExponential(2) : (result.stats.mean ?? 0).toLocaleString(undefined, { maximumFractionDigits: 3 }), 
      ci: `95% CI: [${(result.stats.ciLow ?? 0) < 1e-2 ? (result.stats.ciLow ?? 0).toExponential(1) : (result.stats.ciLow ?? 0).toFixed(2)}, ${(result.stats.ciHigh ?? 0) < 1e-2 ? (result.stats.ciHigh ?? 0).toExponential(1) : (result.stats.ciHigh ?? 0).toFixed(2)}]`,
      icon: Activity,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-900/40',
      accent: 'border-blue-200/50 dark:border-blue-500/20',
      topic: 'dose_response',
      isPrimary: highlightMode === 'bio' && !(s as any).vulnerable,
      mode: 'bio'
    },
    { 
      label: t.deaths, 
      value: formatNumber(Math.round(s.annualDeaths)), 
      ci: s.annualDeathsCI ? `95% CI: [${formatNumber(Math.round(s.annualDeathsCI[0]))}, ${formatNumber(Math.round(s.annualDeathsCI[1]))}]` : 'Proyección media',
      icon: Skull,
      color: 'text-slate-600 dark:text-slate-400',
      bg: 'bg-slate-50 dark:bg-slate-800',
      accent: 'border-slate-200 dark:border-slate-700',
      isPrimary: highlightMode === 'bio',
      mode: 'bio'
    },
    { 
      label: t.dalyMetric, 
      value: formatDecimal(s.annualDALYs, 2), 
      ci: s.annualDALYsCI ? `95% CI: [${formatDecimal(s.annualDALYsCI[0], 1)}, ${formatDecimal(s.annualDALYsCI[1], 1)}]` : 'Carga estimada',
      icon: HeartPulse,
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-50 dark:bg-purple-900/40',
      accent: 'border-purple-200/50 dark:border-purple-500/20',
      topic: 'daly',
      isPrimary: true,
      mode: 'both'
    },
    { 
      label: 'Carga Económica Total', 
      value: formatCurrency(result.economicBreakdown.total), 
      ci: result.economicBreakdown.totalCI ? `95% CI: [${formatCurrency(result.economicBreakdown.totalCI[0])}, ${formatCurrency(result.economicBreakdown.totalCI[1])}]` : 'Suma total proyectada',
      icon: DollarSign,
      color: 'text-emerald-700 dark:text-emerald-400',
      bg: 'bg-emerald-500/10 dark:bg-emerald-400/10',
      accent: 'border-emerald-500/20 dark:border-emerald-400/20',
      isPrimary: true,
      mode: 'econ'
    },
    { 
      label: 'Gasto Médico Directo', 
      value: formatCurrency(result.economicBreakdown.medical), 
      ci: 'Costos hospitalarios y ambulatorios',
      icon: Hospital,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-900/40',
      accent: 'border-blue-200/50 dark:border-blue-500/20',
      mode: 'econ'
    },
    { 
      label: 'Pérdida Productividad', 
      value: formatCurrency(result.economicBreakdown.productivity), 
      ci: 'Impacto por ausentismo laboral',
      icon: Briefcase,
      color: 'text-slate-600 dark:text-slate-400',
      bg: 'bg-slate-50 dark:bg-slate-800',
      accent: 'border-slate-200 dark:border-slate-700',
      mode: 'econ'
    },
    { 
      label: 'Impacto Mortalidad (VSL)', 
      value: formatCurrency(result.economicBreakdown.mortality), 
      ci: 'Valor de vida estadística',
      icon: Heart,
      color: 'text-rose-600 dark:text-rose-400',
      bg: 'bg-rose-50 dark:bg-rose-900/40',
      accent: 'border-rose-200/50 dark:border-rose-500/20',
      mode: 'econ'
    },
    { 
      label: 'Carga Per Cápita', 
      value: formatCurrency(country.pop > 0 ? result.economicBreakdown.total / country.pop : 0), 
      ci: `Población: ${formatNumber(country.pop)}`,
      icon: Users,
      color: 'text-indigo-600 dark:text-indigo-400',
      bg: 'bg-indigo-50 dark:bg-indigo-900/40',
      accent: 'border-indigo-200/50 dark:border-indigo-500/20',
      mode: 'econ'
    },
  ];

  const filteredCards = cards.filter(c => (c.mode === highlightMode || c.mode === 'both') && (c.visible !== false)).slice(0, 4);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {filteredCards.map((card, i) => (
        <motion.div
          key={card.label}
          layout
          initial={{ opacity: 0, y: 10 }}
          animate={{ 
            opacity: 1, 
            y: 0,
            scale: card.isPrimary ? 1.01 : 1,
            zIndex: card.isPrimary ? 10 : i
          }}
          transition={{ 
            delay: i * 0.05,
            scale: { type: "spring", stiffness: 300, damping: 20 }
          }}
          className={cn(
            "w-full bg-white/60 dark:bg-slate-900/60 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 backdrop-blur-md transition-all duration-500 group/card relative overflow-hidden flex flex-col justify-between h-full",
            card.isPrimary ? "ring-1 ring-blue-500/20 shadow-md border-blue-500/30" : "shadow-sm hover:shadow-md"
          )}
        >
          {/* Subtle Scanning Effect for Primary Cards */}
          {card.isPrimary && (
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent animate-[shimmer_3s_infinite]" />
          )}
          
          <div className="flex items-center justify-between mb-5 relative z-10">
            <div className="flex items-center gap-3">
              <div className={cn("p-2 rounded-xl border shadow-xs transition-transform group-hover/card:scale-105 duration-500", card.bg, card.accent.replace('border-', 'border-'))}>
                <card.icon className={cn("w-4 h-4 transition-colors", card.color)} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 leading-none truncate max-w-[140px]">
                {card.label}
              </span>
            </div>
            
            <div className="flex items-center gap-1.5">
              {card.label === t.dalyMetric && (
                <div className={cn(
                  "px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1 shadow-sm border",
                  (s.annualDALYs / country.pop) <= 1e-6 
                    ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" 
                    : "bg-rose-500/10 text-rose-600 border-rose-500/20"
                )}>
                  <div className={cn("w-1 h-1 rounded-full", (s.annualDALYs / country.pop) <= 1e-6 ? "bg-emerald-500" : "bg-rose-500")} />
                  { (s.annualDALYs / country.pop) <= 1e-6 ? 'Pass' : 'Alert' }
                </div>
              )}
              {card.topic && (
                <QuickInterpretation topic={card.topic} variant="icon" />
              )}
            </div>
          </div>

          <div className="relative z-10 text-left space-y-2">
            <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter leading-none font-mono">
              {card.value}
            </div>
            <div className="flex flex-col gap-1 pt-1">
               <div className="flex items-center gap-2">
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Bound Interval</span>
                  <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800" />
               </div>
               <div className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-500 truncate italic bg-slate-50/50 dark:bg-slate-800/30 px-2 py-1 rounded-lg border border-slate-100/50 dark:border-slate-700/50">
                 {card.ci.replace('95% CI: ', '')}
               </div>
            </div>
          </div>
          
          <div className="absolute right-4 bottom-4 opacity-[0.03] dark:opacity-[0.07] text-slate-900 dark:text-white pointer-events-none">
             <card.icon className="w-16 h-16" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
