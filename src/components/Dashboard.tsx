import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, 
  Play, 
  Settings2, 
  Globe2, 
  Database, 
  BarChart3, 
  BookOpen, 
  Download,
  Info,
  Menu,
  X,
  Activity,
  Sun,
  Moon,
  FileSpreadsheet,
  FileJson,
  Camera,
  Search,
  AlertTriangle,
  Shield,
  Eye,
  RotateCcw,
  Bug,
  Dna,
  Microscope,
  Briefcase,
  Map as MapIcon,
  FlaskConical,
  ShieldCheck,
  Target,
  ArrowRight,
  Cpu,
  Users,
  LayoutDashboard,
  Zap,
  ClipboardCheck,
  Thermometer,
  Microscope as MicroscopeIcon,
  Stethoscope,
  TrendingUp,
  FileText,
  BarChart2,
  Binary
} from 'lucide-react';
import { toPng } from 'html-to-image';
import { useSimulation } from '../hooks/useSimulation';
import { useLanguage } from '../hooks/useLanguage';
import { useTheme } from '../hooks/useTheme';
import { Language, Translation } from '../lib/translations';
import { COUNTRY_GROUPS, COUNTRIES } from '../data/countries';
import { PAIRS } from '../data/pairs';
import { exportToPdf } from '../services/pdfService';
import { exportToCsv, exportToJson } from '../services/exportService';
import { formatNumber, formatCurrency, cn } from '../lib/utils';
import KPIs from './KPIs';
import { ExposureChain, SensitivityAnalysis, DistributionChart, EconomicImpactBar, EconomicImpactPie, DoseResponseChart, InactivationChart, SeverityProfile } from './Charts';
import VulnerableGroupBreakdown from './VulnerableGroupBreakdown';
import { QuickInterpretation } from './QuickInterpretation';
import { GlobalSensitivity } from './GlobalSensitivity';
import Manual from './Manual';
import RiskMap from './RiskMap';
import OutcomeSummary from './OutcomeSummary';
import RiskHeatmap from './RiskHeatmap';
import { ParametersGrid } from './ParametersGrid';
import DALYModule from './DALYModule';
import PathogenLibrary from './PathogenLibrary';
import ScientificExecutiveSummary from './ScientificExecutiveSummary';
import RiskExceedanceCurve from './RiskExceedanceCurve';
import RiskPDFChart from './RiskPDFChart';

export default function Dashboard() {
  const sim = useSimulation();
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme, isHighContrast, toggleHighContrast } = useTheme();
  const [view, setView] = useState<'config' | 'results' | 'map'>('config');
  const [isManualOpen, setIsManualOpen] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [resultsTab, setResultsTab] = useState<string>('summary');

  const resultsTabs = [
    { id: 'scientific_summary', label: 'Opinión Científica', icon: ShieldCheck, sub: 'JEMRA Report' },
    { id: 'summary', label: 'Pronóstico Global', icon: LayoutDashboard, sub: 'Epidemiología' },
    { id: 'exceedance', label: t.riskExceedance, icon: Zap, sub: t.riskExceedanceDesc },
    { id: 'pdf', label: t.pdfTabLabel, icon: BarChart3, sub: t.pdfTabSub },
    { id: 'population', label: t.population, icon: Users, sub: 'Susceptibilidad' },
    { id: 'evolution', label: 'Evolución Microbiana', icon: TrendingUp, sub: 'Dinámica Log' },
    { id: 'sensitivity', label: 'Incertidumbre', icon: Cpu, sub: 'Tornado Plot' },
    { id: 'distribution', label: 'Probabilidad', icon: BarChart2, sub: 'Curva Densidad' },
    { id: 'technical', label: 'Ficha Técnica', icon: Binary, sub: 'Metadatos' },
  ];

  // Auto-switch to results when simulation finishes
  useEffect(() => {
    if (sim.result && view === 'config') {
      setView('results');
    }
  }, [sim.result]);

  // Handle scroll lock for main manual
  useEffect(() => {
    if (isManualOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isManualOpen]);
  const [showWeibullRef, setShowWeibullRef] = useState(false);
  const [showBetaPoissonRef, setShowBetaPoissonRef] = useState(false);
  const [regionTab, setRegionTab] = useState<'select' | 'data'>('select');
  const [searchTerm, setSearchTerm] = useState('');
  const [pSelectionTab, setPSelectionTab] = useState<'pathogen' | 'food'>('pathogen');
  const [selectedPathogen, setSelectedPathogen] = useState<string>(sim.pair.pathogen);
  const [costScenario, setCostScenario] = useState<'baseline' | 'moderate' | 'high'>('baseline');

  const costMultipliers = {
    baseline: 1,
    moderate: 1.5,
    high: 3
  };

  const currentMultiplier = costMultipliers[costScenario];

  const systemicTotalCases: number = sim.result ? Object.values(sim.result.summary.vulnerableResults || {}).reduce<number>((acc, curr: any) => acc + (Number(curr.annualCases) || 0), 0) : 0;
  const systemicTotalEcon: number = sim.result ? Object.values(sim.result.summary.vulnerableResults || {}).reduce<number>((acc, curr: any) => acc + (Number(curr.totalEconomicImpact) || 0), 0) : 0;
  
  const specificVulnerableCases = sim.result ? Object.entries(sim.result.summary.vulnerableResults || {}).filter(([id]) => id !== 'general').reduce<number>((acc, [_, curr]: [string, any]) => acc + (Number(curr.annualCases) || 0), 0) : 0;
  const generalPopulationCases = sim.result?.summary?.vulnerableResults?.general?.annualCases || 0;

  const pathogens = Array.from(new Set(PAIRS.map(p => p.pathogen))).sort();

  const getPathogenType = (name: string) => {
    if (!name) return 'Bacteria';
    const lowerName = name.toLowerCase();
    const pair = PAIRS.find(p => p.pathogen === name);
    if (pair?.isViral || lowerName.includes('virus') || lowerName.includes('noro') || lowerName.includes('hav')) return 'Virus';
    if (lowerName.includes('toxina')) return 'Toxina';
    return 'Bacteria';
  };

  const getPathogenIcon = (name: string, size: string = "w-4 h-4") => {
    const type = getPathogenType(name);
    if (type === 'Virus') return <Microscope className={size} />;
    if (type === 'Toxina') return <FlaskConical className={size} />;
    return <Bug className={size} />;
  };

  const getPathogenColor = (name: string, isSelected: boolean) => {
    const type = getPathogenType(name);
    if (type === 'Virus') return "text-violet-500";
    if (type === 'Toxina') return "text-amber-500";
    return "text-emerald-500";
  };

  const normalizeString = (str: any) => {
    if (!str) return "";
    return String(str).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  };

  const filteredPathogens = pathogens.filter(p => 
    normalizeString(p).includes(normalizeString(searchTerm))
  );

  const filteredFoods = PAIRS.filter(p => 
    p.pathogen === selectedPathogen && 
    (normalizeString(p.food).includes(normalizeString(searchTerm)) || 
     (t[p.id as keyof Translation] ? normalizeString(t[p.id as keyof Translation] as string).includes(normalizeString(searchTerm)) : false))
  );


  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans selection:bg-teal-100 selection:text-teal-900 p-1 md:p-2 transition-colors duration-500 relative overflow-x-hidden">
      {/* Subtle lighting effects */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none bg-radial-at-tl from-teal-500/5 to-transparent opacity-60 z-0" />
      <div className="absolute bottom-0 right-0 w-full h-full pointer-events-none bg-radial-at-br from-blue-500/5 to-transparent opacity-60 z-0" />

      {/* Main Content Area */}
      <main className="w-full flex flex-col h-full gap-2 relative z-10 overflow-hidden">
        {/* Header - Styled like Design HTML */}
        <header className="sticky top-0 z-[100] flex justify-between items-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl px-6 py-3 rounded-2xl shadow-sm border border-white/20 dark:border-white/5 mb-4">
          <div className="flex-1 flex items-center justify-start gap-8">
            <div className="flex items-center gap-2.5 px-4 py-1.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-full shadow-inner group/status">
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] group-hover:animate-pulse" />
              <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] leading-none">System Operational</span>
              <div className="w-px h-3 bg-slate-200 dark:bg-slate-800 mx-1" />
              <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest leading-none">MRA-Protocol Validated</span>
            </div>
          </div>

          <div className="flex-1 flex justify-center">
            <div className="flex flex-col items-center">
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                     <FlaskConical className="w-5 h-5 text-white" />
                  </div>
                  <h1 className="text-3xl font-black tracking-[-0.04em] text-slate-900 dark:text-white flex items-center gap-2 select-none">
                    <span className="font-serif italic text-blue-600">ProbRisk</span>
                    <span className="font-sans">QMRA</span>
                  </h1>
               </div>
               <div className="mt-1.5 flex items-center gap-2">
                  <div className="h-px w-8 bg-slate-100 dark:bg-slate-800" />
                  <span className="text-[9px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-[0.4em] leading-none">Bio-Statistical Engine</span>
                  <div className="h-px w-8 bg-slate-100 dark:bg-slate-800" />
               </div>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-end gap-6">
             <div className="hidden xl:flex bg-slate-100 dark:bg-slate-950 p-1 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-inner">
                {(['es', 'en', 'fr', 'pt'] as Language[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={cn(
                      "px-3.5 py-2 text-[10px] font-black uppercase rounded-xl transition-all duration-300 tracking-tighter",
                      language === lang 
                        ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm ring-1 ring-slate-200/50 dark:ring-slate-600/30" 
                        : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    )}
                  >
                    {lang}
                  </button>
                ))}
             </div>

             <div className="h-8 w-px bg-slate-100 dark:bg-slate-800" />

             <div className="flex gap-2.5">
                <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-inner">
                  <button
                    onClick={toggleTheme}
                    className="p-2.5 rounded-xl text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300"
                    title={theme === 'light' ? 'Activar Modo Oscuro' : 'Activar Modo Claro'}
                  >
                    {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={toggleHighContrast}
                    className={cn(
                      "p-2.5 rounded-xl transition-all duration-300",
                      isHighContrast 
                        ? "bg-white dark:bg-slate-700 text-amber-500 shadow-sm" 
                        : "text-slate-400 hover:text-amber-500"
                    )}
                    title={isHighContrast ? 'Desactivar Alto Contraste' : 'Activar Alto Contraste'}
                  >
                    <Zap className={cn("w-4 h-4", isHighContrast && "fill-current")} />
                  </button>
                </div>
             </div>

             <div className="h-8 w-px bg-slate-100 dark:bg-slate-800" />

             <div className="flex gap-2.5">
                <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-inner">
                  {[
                    { id: 'config' as const, label: t.parameters, icon: Settings2 },
                    { id: 'results' as const, label: t.dashboard, icon: BarChart3 },
                    { id: 'library' as const, label: t.specSheets, icon: BookOpen },
                    { id: 'manual' as const, label: t.manual, icon: Info }
                  ].map((nav) => (
                    <button
                      key={nav.id}
                      onClick={() => {
                        if (nav.id === 'manual') setIsManualOpen(true);
                        else if (nav.id === 'library') setIsLibraryOpen(true);
                        else setView(nav.id);
                      }}
                      disabled={nav.id === 'results' && !sim.result}
                      className={cn(
                        "flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 relative",
                        (view === nav.id || (nav.id === 'manual' && isManualOpen) || (nav.id === 'library' && isLibraryOpen))
                          ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-md border border-slate-100 dark:border-slate-700"
                          : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300",
                        nav.id === 'results' && !sim.result && "opacity-30 cursor-not-allowed",
                        nav.id === 'manual' && "text-amber-600 dark:text-amber-400 hover:text-amber-700"
                      )}
                    >
                      <nav.icon className={cn("w-4 h-4", nav.id === 'manual' && "animate-pulse")} />
                      <span className={cn(
                        "hidden sm:inline",
                        nav.id === 'manual' && "sm:inline-block font-black text-amber-600 dark:text-amber-400"
                      )}>
                        {nav.label}
                      </span>
                      {(view === nav.id || (nav.id === 'manual' && isManualOpen) || (nav.id === 'library' && isLibraryOpen)) && (
                        <motion.div 
                          layoutId="activeNav"
                          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full"
                        />
                      )}
                    </button>
                  ))}
                </div>
             </div>
          </div>
        </header>


        <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
          <AnimatePresence mode="wait">
            {view === 'config' || view === 'results' ? (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-12 auto-rows-auto gap-4 pb-4 relative"
              >
                {/* Pathogen Info Header Card */}
                <div className="col-span-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-[0_8px_30px_rgb(0,0,0,0.01)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.08)] flex flex-col justify-between overflow-hidden relative group transition-all duration-500 hover:shadow-[0_15px_60px_rgb(0,0,0,0.03)] dark:hover:shadow-[0_15px_60_rgb(0,0,0,0.15)]">
                    <div className="absolute -top-12 -right-12 p-8 opacity-[0.02] dark:opacity-[0.04] text-blue-600 dark:text-blue-400 transform rotate-45 transition-all group-hover:scale-125 group-hover:opacity-[0.05]">
                       <Database className="w-64 h-64" />
                    </div>
                    <div className="relative z-10 flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full text-[9px] font-black uppercase tracking-[0.15em]">
                            {t.primaryFocus}
                          </span>
                          <span className="w-1 h-1 bg-slate-200 dark:bg-slate-700 rounded-full" />
                          <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest italic leading-none">{sim.pair?.id?.toUpperCase()}</span>
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-tight flex items-center gap-3 tracking-tighter">
                          <div className={cn(
                             "w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-500 rotate-2 group-hover:rotate-0",
                             getPathogenType(sim.pair.pathogen) === 'Virus' ? "bg-violet-600 shadow-violet-500/10" :
                             getPathogenType(sim.pair.pathogen) === 'Toxina' ? "bg-amber-600 shadow-amber-500/10" :
                             "bg-emerald-600 shadow-emerald-500/10"
                          )}>
                            {getPathogenIcon(sim.pair.pathogen, "w-6 h-6 text-white")}
                          </div>
                          <div className="flex flex-col">
                            <span className="italic font-serif leading-tight">{sim.pair.pathogen}</span>
                            <span className="text-sm font-sans not-italic font-medium text-slate-400 dark:text-slate-500 mt-0.5 tracking-normal">
                              en <span className="text-slate-900 dark:text-slate-200 font-bold">{t[sim.pair.id as keyof Translation] || sim.pair.food}</span>
                            </span>
                          </div>
                        </h3>
                      </div>
                      
                      <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col items-center gap-0.5 shadow-inner">
                         <div className="text-[8px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-[0.1em] mb-0.5">Impacto</div>
                         <div className={cn(
                           "w-9 h-9 rounded-xl flex items-center justify-center font-black text-white text-base shadow-md",
                           sim.pair.risk === 'h' ? "bg-rose-500 shadow-rose-500/10" : "bg-emerald-500 shadow-emerald-500/10"
                         )}>
                           {sim.pair.risk === 'h' ? 'H' : 'L'}
                         </div>
                      </div>
                    </div>
                    
                    {sim.pair.description && (
                      <div className="mt-3 relative z-10">
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-3xl italic opacity-80 border-l-2 border-slate-200 dark:border-slate-800 pl-4 bg-slate-50/30 dark:bg-slate-900/30 py-1 rounded-r-lg">
                          {sim.pair.description}
                        </p>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex-wrap relative z-10">
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:bg-white dark:hover:bg-slate-700 group/tag">
                        <Globe2 className="w-3.5 h-3.5 text-blue-500" />
                        <span className="text-[10px] font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest flex items-center gap-1.5">
                          <span className="text-base scale-110 block leading-none">{sim.country.flag}</span>
                          {sim.country.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-300 dark:text-slate-700">
                        <ArrowRight className="w-3 h-3" />
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
                         <div className={cn(
                           "w-1.5 h-1.5 rounded-full animate-pulse",
                           sim.pair.isViral ? "bg-violet-500" : "bg-emerald-500"
                         )} />
                         <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                           {sim.pair.isViral ? t.viralKernel : t.bacterialThread}
                         </span>
                      </div>
                      <div className="flex-1" />
                    </div>
                  </div>

                {/* High-Tech Simulation Loading Overlay */}
                <AnimatePresence>
                  {sim.isSimulating && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-[200] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4 overflow-hidden"
                    >
                      {/* Technical Background Grid */}
                      <div className="absolute inset-0 opacity-20 pointer-events-none">
                        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(45, 212, 191, 0.15) 1px, transparent 0)', backgroundSize: '24px 24px' }} />
                        <motion.div 
                          animate={{ y: [0, 1000] }}
                          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                          className="absolute inset-0 bg-gradient-to-b from-teal-500/10 via-transparent to-transparent h-[500px] w-full"
                        />
                      </div>

                      <div className="max-w-3xl w-full flex flex-col items-center gap-12 relative z-10">
                        {/* Central Animation: Scanning Nucleus */}
                        <div className="relative w-40 h-40">
                          <motion.div 
                            animate={{ rotate: 360, scale: [1, 1.05, 1] }}
                            transition={{ rotate: { repeat: Infinity, duration: 4, ease: "linear" }, scale: { repeat: Infinity, duration: 3 } }}
                            className="absolute inset-0 border-[6px] border-dashed border-teal-500/20 rounded-full"
                          />
                          <motion.div 
                            animate={{ rotate: -360 }}
                            transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
                            className="absolute inset-4 border-2 border-dotted border-blue-500/30 rounded-full"
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="relative">
                              <Cpu className="w-16 h-16 text-teal-400 drop-shadow-[0_0_25px_rgba(45,212,191,0.6)]" />
                              <motion.div 
                                animate={{ opacity: [0.2, 0.8, 0.2], scale: [1, 1.2, 1] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="absolute inset-0 bg-teal-400/10 blur-2xl rounded-full"
                              />
                            </div>
                          </div>
                          
                          {/* Floating "Samples" Bits */}
                          {[...Array(12)].map((_, i) => (
                            <motion.div
                              key={i}
                              animate={{ 
                                y: [-15, 15, -15],
                                x: [-8, 8, -8],
                                opacity: [0, 1, 0]
                              }}
                              transition={{ 
                                repeat: Infinity, 
                                duration: 2.5 + Math.random(), 
                                delay: i * 0.15 
                              }}
                              className="absolute w-1.5 h-1.5 bg-teal-400/60 rounded-full"
                              style={{ 
                                top: `${50 + 45 * Math.sin(i * Math.PI / 6)}%`,
                                left: `${50 + 45 * Math.cos(i * Math.PI / 6)}%`
                              }}
                            />
                          ))}
                        </div>

                        <div className="w-full text-center space-y-6">
                          <div className="space-y-1">
                            <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic font-serif">
                              ProbRisk Engine <span className="text-teal-400 not-italic font-sans">Active</span>
                            </h3>
                            <div className="flex items-center justify-center gap-3">
                              <div className="flex gap-1">
                                {[...Array(3)].map((_, i) => (
                                  <motion.div
                                    key={i}
                                    animate={{ opacity: [0.3, 1, 0.3] }}
                                    transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                                    className="w-1.5 h-1.5 rounded-full bg-teal-500 shadow-[0_0_8px_rgba(20,184,166,0.8)]"
                                  />
                                ))}
                              </div>
                              <p className="text-[11px] text-slate-400 font-black uppercase tracking-[0.3em]">
                                Ejecutando Núcleo Monte Carlo
                              </p>
                            </div>
                          </div>

                          <div className="w-full p-8 bg-slate-900/40 rounded-[2.5rem] border border-slate-800/50 backdrop-blur-md shadow-2xl space-y-6">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                               <div className="text-left space-y-1">
                                  <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Iteraciones</div>
                                  <div className="text-lg font-mono font-bold text-teal-400">
                                    {Math.floor(sim.progress * (sim.iterations || 10000) / 100).toLocaleString()} 
                                    <span className="text-slate-700 block text-[10px] mt-0.5">/ {(sim.iterations || 0).toLocaleString()}</span>
                                  </div>
                               </div>
                               <div className="text-center space-y-1 hidden md:block">
                                  <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Precision</div>
                                  <div className="text-xs font-mono font-bold text-slate-300">Float64 IEEE 754</div>
                               </div>
                               <div className="text-right space-y-1">
                                  <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">HACCP Shield</div>
                                  <div className={cn("text-xs font-mono font-bold", sim.isHaccpEnabled ? "text-emerald-500" : "text-rose-500")}>
                                    {sim.isHaccpEnabled ? 'ACTIVE' : 'BYPASS'}
                                  </div>
                               </div>
                            </div>

                            <div className="relative h-3 bg-slate-800/50 rounded-full overflow-hidden border border-slate-800">
                              <motion.div 
                                className="absolute inset-y-0 left-0 bg-gradient-to-r from-teal-600 via-teal-400 to-teal-500 shadow-[0_0_20px_rgba(45,212,191,0.6)]"
                                animate={{ width: `${sim.progress}%` }}
                                transition={{ type: "spring", bounce: 0, duration: 0.5 }}
                              />
                              <motion.div 
                                animate={{ x: ['-100%', '200%'] }}
                                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                                className="absolute inset-y-0 w-32 bg-white/10 skew-x-12"
                              />
                            </div>

                            <div className="flex justify-between items-center">
                               <div className="flex items-center gap-2">
                                  <span className="text-[9px] font-mono text-slate-600">0%</span>
                                  <div className="w-1 h-1 rounded-full bg-slate-800" />
                               </div>
                               <div className="flex flex-col items-center">
                                  <span className="text-teal-400 text-lg font-mono font-black tracking-tighter">{sim.progress}%</span>
                                  <span className="text-[8px] font-black text-teal-900/60 uppercase tracking-[0.2em] leading-none">Complete</span>
                               </div>
                               <div className="flex items-center gap-2">
                                  <div className="w-1 h-1 rounded-full bg-slate-800" />
                                  <span className="text-[9px] font-mono text-slate-600">100%</span>
                               </div>
                            </div>
                          </div>

                          {/* Technical Log Stream */}
                          <div className="h-12 overflow-hidden relative">
                             <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-transparent to-slate-950 z-10 pointer-events-none" />
                             <motion.div 
                              animate={{ y: [0, -100] }}
                              transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
                              className="text-[8px] font-mono text-teal-500/60 flex flex-col gap-1 items-center"
                             >
                                <div>[KERNEL] SAMPLING STOCHASTIC DISTRIBUTIONS...</div>
                                <div>[KERNEL] EVALUATING EXPOSURE PATHWAY...</div>
                                <div>[KERNEL] CALCULATING DOSE-RESPONSE CURVES...</div>
                                <div>[KERNEL] ESTIMATING ECONOMIC BURDEN...</div>
                                <div>[KERNEL] GENERATING CI PERCENTILES...</div>
                                <div>[KERNEL] NORMALIZING RISK VECTORS...</div>
                                <div>[KERNEL] SYNCING GLOBAL PARAMETERS...</div>
                             </motion.div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Logic Split: Config vs Results */}
                {view === 'config' ? (
                  <div className="col-span-12 flex flex-col gap-4">
                    <ParametersGrid />
                  </div>
                ) : sim.result ? (
                  <>
                    {/* Perspective Control Section */}
                    <div className="col-span-12 grid grid-cols-12 gap-8 min-h-[700px] mb-8">
                      {/* Results Sidebar */}
                      <div className="col-span-12 lg:col-span-3 flex flex-col gap-1.5 overflow-y-auto max-h-[85vh] sticky top-6 pr-2 custom-scrollbar">
                        <div className="px-4 py-3 mb-2 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Navegación</h4>
                          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">Panel de Resultados</p>
                        </div>
                        {resultsTabs.map((tab) => (
                          <button
                            key={tab.id}
                            onClick={() => setResultsTab(tab.id)}
                            className={cn(
                              "group flex items-center justify-between px-4 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 text-left border relative overflow-hidden",
                              resultsTab === tab.id
                                ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-xl shadow-slate-200 dark:shadow-none scale-[1.02] z-10"
                                : "bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-800 hover:border-teal-500/50 hover:bg-teal-50/50 dark:hover:bg-teal-900/10"
                            )}
                          >
                            <div className="flex items-center gap-3 relative z-10">
                              <div className={cn(
                                "p-2 rounded-xl transition-all duration-500",
                                resultsTab === tab.id ? "bg-white/20 dark:bg-slate-900/10" : "bg-slate-100 dark:bg-slate-800"
                              )}>
                                <tab.icon className={cn("w-4 h-4", resultsTab === tab.id ? "text-white dark:text-slate-900" : "text-slate-500")} />
                              </div>
                              <div className="flex flex-col text-left">
                                <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                                  {tab.label}
                                </span>
                                <span className="text-[8px] font-bold text-slate-400 group-hover:text-slate-500">
                                  {tab.sub}
                                </span>
                              </div>
                            </div>
                            {resultsTab === tab.id && (
                              <motion.div 
                                layoutId="active-tab-indicator"
                                className="absolute right-3 w-1.5 h-1.5 bg-teal-500 rounded-full"
                              />
                            )}
                          </button>
                        ))}
                        
                        <div className="mt-auto pt-6">
                           <div className="p-4 bg-linear-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 rounded-2xl border border-amber-100/50 dark:border-amber-800/30">
                              <p className="text-[8px] font-black text-amber-600 uppercase tracking-widest mb-2">Simulación Completa</p>
                              <div className="flex items-center gap-2 mb-3">
                                 <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                                 <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 tabular-nums">{(sim.result.rawIll?.length || 0).toLocaleString()} iteraciones</span>
                              </div>
                              <button 
                                onClick={() => setView('config')}
                                className="w-full py-2 bg-white dark:bg-slate-800 border border-amber-200 dark:border-amber-700 rounded-xl text-[9px] font-black text-amber-700 dark:text-amber-300 uppercase tracking-widest hover:bg-amber-100 dark:hover:bg-amber-700/50 transition-colors"
                              >
                                Nueva Simulación
                              </button>
                           </div>
                        </div>
                      </div>

                      {/* Results Content Area */}
                      <div className="col-span-12 lg:col-span-9">
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={resultsTab}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-4"
                          >
                            {/* TAB: OPINIÓN CIENTÍFICA (EXECUTIVE SUMMARY) */}
                            {resultsTab === 'scientific_summary' && (
                              <ScientificExecutiveSummary 
                                result={sim.result} 
                                params={sim.params} 
                              />
                            )}

                            {/* TAB: DENSIDAD DE RIESGO (PDF) */}
                            {resultsTab === 'pdf' && (
                              <RiskPDFChart 
                                result={sim.result} 
                              />
                            )}

                            {/* TAB: PRONOSTICO GLOBAL */}
                            {resultsTab === 'summary' && (
                              <div className="space-y-6">
                                {/* Hero Result Section */}
                                <div className={cn(
                                  "w-full rounded-[2.5rem] p-8 md:p-12 shadow-xl border flex flex-col relative overflow-hidden group transition-all duration-700 bg-linear-to-br from-white via-slate-50/50 to-emerald-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-emerald-900/10 border-slate-200/60 dark:border-slate-800"
                                )}>
                                  <div className="absolute top-0 right-0 p-12 opacity-[0.04] text-emerald-600 group-hover:scale-110 group-hover:rotate-12 transition-all duration-1000">
                                    <Activity className="w-64 h-64" />
                                  </div>
                                  
                                  <div className="relative z-10 flex flex-col gap-10 w-full max-w-5xl mx-auto py-4">
                                    {/* Technical Report Header */}
                                    <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-200 dark:border-slate-800 pb-6 gap-4">
                                      <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                          <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Scientific Disclosure v2.4</span>
                                        </div>
                                        <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">
                                          Informe Técnico de Impacto Sistémico
                                        </h1>
                                      </div>
                                      <div className="flex items-center gap-3">
                                        <button 
                                          onClick={() => exportToPdf(sim.result!, sim.params, sim.country, sim.pair, t, formatCurrency)}
                                          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 transition-all hover:scale-105 active:scale-95"
                                        >
                                          <FileText className="w-4 h-4" />
                                          Exportar Reporte PDF
                                        </button>
                                        <div className="hidden sm:flex items-center gap-6 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest bg-slate-50 dark:bg-slate-800/50 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700">
                                          <div className="flex flex-col items-end">
                                            <span>Confidence Interval</span>
                                            <span className="text-emerald-600 dark:text-emerald-400">95% (Standard)</span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Main Result Grid: Cases and Economy */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                      {/* Column 1: Clinical Projection */}
                                      <div className="bg-white/40 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-8 flex flex-col justify-between shadow-sm backdrop-blur-sm group/clinical hover:border-emerald-500/30 transition-colors">
                                        <div className="flex items-center justify-between mb-8">
                                          <div className="flex flex-col">
                                            <span className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Métricas de Morbilidad</span>
                                            <span className="text-[10px] text-slate-400 italic">Proyección anual estocástica</span>
                                          </div>
                                          <Activity className="w-5 h-5 text-emerald-500 opacity-50" />
                                        </div>
                                        
                                        <div className="space-y-8">
                                          <div className="space-y-1">
                                            <h2 className="text-7xl md:text-8xl font-black text-slate-900 dark:text-white tracking-tighter tabular-nums leading-none font-mono group-hover/clinical:text-blue-600 transition-colors">
                                              {formatNumber(Math.round(systemicTotalCases))}
                                            </h2>
                                            <p className="text-xl font-black text-slate-400 dark:text-slate-500 uppercase tracking-tighter">
                                              Total Sistémico de Casos Estimados / Año
                                            </p>
                                            <div className="flex items-center gap-2 mt-2">
                                               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                  Incluye {formatNumber(Math.round(generalPopulationCases))} Gral. + {formatNumber(Math.round(specificVulnerableCases))} Específicos
                                               </span>
                                            </div>
                                          </div>

                                          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-1">
                                            <div className="flex items-baseline gap-3">
                                              <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter italic font-serif">
                                                {((systemicTotalCases / sim.country.pop) * 100000).toFixed(2)}
                                              </span>
                                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tasa de Incidencia Sistémica</span>
                                            </div>
                                            <p className="text-[9px] font-mono text-slate-400 uppercase tracking-[0.2em]">
                                              Por cada 100,000 habitantes
                                            </p>
                                          </div>
                                        </div>
                                      </div>

                                      {/* Column 2: Economic Impact Breakdown */}
                                      <div className="bg-slate-900 dark:bg-slate-950 border border-slate-800 dark:border-black rounded-[2rem] p-8 flex flex-col justify-between shadow-xl group/econ overflow-hidden relative">
                                        <div className="absolute top-0 right-0 p-8 opacity-10 text-white group-hover:scale-110 transition-transform duration-1000">
                                          <Briefcase className="w-32 h-32" />
                                        </div>
                                        
                                        <div className="flex items-center justify-between mb-8 relative z-10">
                                          <div className="flex flex-col">
                                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Impacto Financiero Total</span>
                                            <span className="text-[10px] text-slate-500 italic">Desagregación por sector</span>
                                          </div>
                                          <div className="flex bg-slate-800/50 p-1 rounded-xl border border-slate-700">
                                             {[
                                               { id: 'baseline', label: 'Base' },
                                               { id: 'moderate', label: 'Mod' },
                                               { id: 'high', label: 'Ext' }
                                             ].map(s => (
                                               <button
                                                 key={s.id}
                                                 onClick={() => setCostScenario(s.id as any)}
                                                 className={cn(
                                                   "px-3 py-1.5 text-[8px] font-black uppercase tracking-widest rounded-lg transition-all",
                                                   costScenario === s.id 
                                                     ? "bg-blue-600 text-white shadow-lg" 
                                                     : "text-slate-500 hover:text-slate-300"
                                                 )}
                                               >
                                                 {s.label}
                                               </button>
                                             ))}
                                          </div>
                                        </div>

                                        <div className="space-y-6 relative z-10">
                                          <div className="flex flex-col gap-1">
                                            <h2 className="text-5xl md:text-6xl font-black text-blue-400 tracking-tighter tabular-nums leading-none font-mono">
                                              {formatCurrency(Math.round(systemicTotalEcon * currentMultiplier))}
                                            </h2>
                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Carga Económica Total Sistémica (Gral + Vuln)</span>
                                          </div>
                                          {currentMultiplier > 1 && (
                                              <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest bg-amber-500/10 px-2 py-1 rounded-md">
                                                {costScenario === 'moderate' ? 'Moderado' : 'Extremo'} ({currentMultiplier}x)
                                              </span>
                                            )}
                                          
                                          {/* Sectoral Breakdown Table */}
                                          <div className="grid grid-cols-2 gap-x-8 gap-y-4 pt-6 border-t border-slate-800">
                                            {[
                                              { label: 'Productividad', value: sim.result.economicBreakdown.productivity * currentMultiplier, color: 'bg-blue-500' },
                                              { label: 'Médico', value: sim.result.economicBreakdown.medical * currentMultiplier, color: 'bg-emerald-500' },
                                              { label: 'Mortalidad (VSL)', value: sim.result.economicBreakdown.mortality * currentMultiplier, color: 'bg-rose-500' },
                                              { label: 'Casos Crónicos', value: sim.result.economicBreakdown.chronic * currentMultiplier, color: 'bg-amber-500' },
                                            ].map((sector) => (
                                              <div key={sector.label} className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2">
                                                  <div className={cn("w-1.5 h-1.5 rounded-full", sector.color)} />
                                                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{sector.label}</span>
                                                </div>
                                                <span className="text-xs font-mono font-bold text-slate-300">
                                                  {formatCurrency(Math.round(sector.value))}
                                                </span>
                                              </div>
                                            ))}
                                          </div>
                                          
                                          {/* Sectoral Summation for Total Impact */}
                                          <div className="mt-6 pt-4 border-t border-dashed border-slate-800 flex items-center justify-between">
                                             <div className="flex flex-col">
                                                <span className="text-[8px] font-black text-slate-600 uppercase tracking-[0.2em]">Suma Vectorial de Cargas</span>
                                                <div className="flex items-center gap-1 mt-1">
                                                   <span className="text-[9px] text-slate-500 font-mono">Σ(P + M + V + C)</span>
                                                   <ArrowRight className="w-2.5 h-2.5 text-slate-700" />
                                                </div>
                                             </div>
                                             <div className="text-lg font-mono font-black text-white">
                                                {formatCurrency(Math.round(sim.result.economicBreakdown.productivity + sim.result.economicBreakdown.medical + sim.result.economicBreakdown.mortality + sim.result.economicBreakdown.chronic))}
                                             </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Simulation Summary Box */}
                                    <div className="bg-slate-50/80 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm relative overflow-hidden">
                                      <div className="absolute top-0 right-0 p-4 opacity-[0.03] text-emerald-600">
                                        <ShieldCheck className="w-24 h-24" />
                                      </div>
                                      <div className="flex items-center gap-3 mb-4">
                                        <div className="p-1.5 bg-emerald-500/10 rounded-lg">
                                          <ShieldCheck className="w-5 h-5 text-emerald-600" />
                                        </div>
                                        <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">Contexto Científico y Metodología</span>
                                      </div>
                                      <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed font-medium italic max-w-3xl">
                                        "Los resultados presentados integran la variabilidad estocástica en la contaminación y la virulencia del patógeno mediante una simulación de Monte Carlo. Este modelo proporciona una base científica crítica para la cuantificación de riesgos en salud pública, permitiendo priorizar intervenciones basadas en evidencia empírica."
                                      </p>
                                    </div>

                                    {/* Metadata Footer Row */}
                                    <div className="flex flex-wrap gap-4 w-full">
                                      <div className="flex-1 min-w-[280px] bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex items-center justify-between shadow-xs">
                                        <div className="flex flex-col">
                                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">ESCENARIO EVALUADO</p>
                                          <p className="text-lg font-bold text-slate-800 dark:text-slate-200 leading-none">
                                            {sim.pair?.pathogen} <span className="text-slate-400 font-medium">en</span> {sim.pair?.food}
                                          </p>
                                        </div>
                                        <Target className="w-5 h-5 text-slate-300" />
                                      </div>
                                      
                                      <div className="flex-1 min-w-[200px] bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex items-center justify-between shadow-xs">
                                        <div className="flex flex-col">
                                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">REGIÓN DE ESTUDIO</p>
                                          <p className="text-lg font-bold text-slate-800 dark:text-slate-200 leading-none">
                                            {sim.country?.name}
                                          </p>
                                        </div>
                                        <Target className="w-5 h-5 text-slate-300" />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                
                                {/* KPI Metrics Section */}
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between px-2">
                                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Indicadores de Riesgo Clave</h3>
                                    <div className="h-px flex-1 mx-6 bg-slate-200/50 dark:bg-slate-800" />
                                  </div>
                                  <KPIs result={sim.result} country={sim.country} highlightMode="bio" />
                                </div>
                                
                                {/* Detailed Outcome Breakdown */}
                                <div className="pt-1">
                                  <OutcomeSummary 
                                    result={sim.result} 
                                    translations={t} 
                                    pair={sim.pair} 
                                    country={sim.country}
                                    params={sim.params}
                                    mode="bio"
                                    hideVuln={true}
                                  />
                                </div>
                              </div>
                            )}

                            {/* TAB: EVOLUCIÓN MICROBIANA */}
                            {resultsTab === 'evolution' && (
                              <Card title={t.microbialChain} sub={t.loadProgression} tooltip="Análisis del flujo de contaminación desde el origen hasta el consumo final.">
                                <ExposureChain result={sim.result} />
                              </Card>
                            )}

                            {/* TAB: ANÁLISIS DE SENSIBILIDAD */}
                            {resultsTab === 'sensitivity' && (
                              <div className="space-y-6">
                                <Card title="Análisis de Sensibilidad Global" sub="Contribución a la Varianza" tooltip="Muestra qué variables tienen mayor influencia en la variabilidad del riesgo final.">
                                  <div className="absolute top-3 right-12 z-10">
                                    <QuickInterpretation topic="sensitivity" variant="icon" />
                                  </div>
                                  <GlobalSensitivity result={sim.result} />
                                </Card>
                                <Card title="Impacto Económico por Parámetro" sub="Drivers de Costo" tooltip="Identifica qué parámetros técnicos impulsan más los costos económicos.">
                                  <SensitivityAnalysis result={sim.result} focus="economic" />
                                </Card>
                              </div>
                            )}



                            {/* TAB: ESTADÍSTICAS DE DISTRIBUCIÓN */}
                            {resultsTab === 'distribution' && (
                              <Card title={t.distributionStats} sub="Densidad Probabilística (KDE)" tooltip={t.tooltipDistribution}>
                                <DistributionChart result={sim.result} />
                              </Card>
                            )}

                            {/* TAB: RIESGO: EXCEDENCIA Y MAPA TÉRMICO */}
                            {resultsTab === 'exceedance' && (
                              <div className="flex flex-col gap-8">
                                <RiskExceedanceCurve result={sim.result} />
                                
                                <Card title="Mapa Térmico de Riesgo" sub="Probabilidad vs. Impacto Social (Annual Cases)" tooltip={t.tooltipHeatmap}>
                                  <div className="absolute top-3 right-12 z-10">
                                    <QuickInterpretation topic="heatmap" variant="icon" />
                                  </div>
                                  <RiskHeatmap result={sim.result} />
                                </Card>
                              </div>
                            )}

                            {/* TAB: MAGNITUD IMPACTO BIOLÓGICO */}
                            {resultsTab === 'impact' && (
                              <div className="space-y-6">
                                <DALYModule result={sim.result} params={sim.params} />
                                <Card title={t.sectorEconomicLoading} sub={t.costDistribution} tooltip={t.tooltipEconomic}>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                                    <EconomicImpactBar result={sim.result} />
                                    <div className="border-l border-slate-100 dark:border-slate-800 pl-8 h-full flex flex-col justify-center transition-colors">
                                      <EconomicImpactPie result={sim.result} />
                                    </div>
                                  </div>
                                </Card>
                                <OutcomeSummary 
                                  result={sim.result} 
                                  translations={t} 
                                  pair={sim.pair} 
                                  country={sim.country}
                                  params={sim.params}
                                  mode="econ"
                                />
                              </div>
                            )}

                            {/* TAB: IMPACTO EN POBLACIÓN SELECCIONADA */}
                            {resultsTab === 'population' && (
                              <div className="space-y-6">
                                {(Object.keys(sim.result.summary.vulnerableResults || {}).length === 0) ? (
                                  <div className="flex flex-col items-center justify-center min-h-[400px] bg-slate-50 dark:bg-slate-900/50 rounded-[3rem] border border-dashed border-slate-200 dark:border-slate-800 p-12 text-center">
                                    <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-xl mb-6">
                                      <Users className="w-12 h-12 text-slate-300" />
                                    </div>
                                    <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic font-serif mb-2">No hay Población Específica Seleccionada</h4>
                                    <p className="text-sm text-slate-500 max-w-md">Seleccione uno o más grupos vulnerables en la pestaña de configuración (Módulo Biológico) para ver el impacto probabilístico por cohorte.</p>
                                    <button 
                                      onClick={() => setView('config')}
                                      className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 hover:scale-105 transition-transform"
                                    >
                                      Ir a Configuración
                                    </button>
                                  </div>
                                ) : (
                                  <VulnerableGroupBreakdown 
                                    result={sim.result} 
                                    multiplier={currentMultiplier}
                                  />
                                )}
                              </div>
                            )}

                            {/* TAB: HOJA TÉCNICA Y FUNDAMENTOS CIENTÍFICOS */}
                            {resultsTab === 'technical' && (
                              <div className="space-y-8">
                                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-xs transition-colors overflow-hidden relative">
                                    <div className="absolute top-0 right-0 p-8 opacity-10">
                                      <ClipboardCheck className="w-32 h-32 rotate-12" />
                                    </div>
                                    <div className="flex items-center justify-between mb-8">
                                      <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-6 bg-blue-600 rounded-full shadow-[0_0_8px_rgba(37,99,235,0.4)]" />
                                        <h4 className="text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-[0.2em] leading-none">Hoja Técnica del Escenario</h4>
                                      </div>
                                      <div className="flex items-center gap-3 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                                         <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                         <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Certificado de Simulación: {new Date().toLocaleDateString()}</span>
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-8 gap-x-8 relative z-10">
                                      {[
                                        { label: 'Patógeno Analizado', value: sim.pair.pathogen },
                                        { label: 'Matriz Alimentaria', value: sim.pair.food },
                                        { label: t.prevalence, value: (sim.activeParams.prevalence * 100).toFixed(2) + '%' },
                                        { label: 'Modelo Dosis-Respuesta', value: (sim.params?.drModel || 'beta-poisson').toUpperCase() },
                                        { 
                                          label: sim.params.drModel === 'beta-poisson' ? 'Parámetro Alfa (α)' : 'Parámetro Infectividad (k)', 
                                          value: sim.params.drModel === 'beta-poisson' 
                                            ? (sim.params.alpha ?? 0).toFixed(6) 
                                            : (sim.params.k ?? sim.params.alpha ?? 0).toExponential(4) 
                                        },
                                        { 
                                          label: 'Parámetro Beta (β)', 
                                          value: sim.params.drModel === 'beta-poisson' ? (sim.params.beta ?? 0).toLocaleString() : 'No Aplicable' 
                                        },
                                        { label: 'Carga Inicial Media', value: sim.activeParams.initialLogMean.toFixed(2) + ' Log CFU/g' },
                                        { label: 'Dispersión de Carga', value: sim.activeParams.initialLogStd.toFixed(2) + ' Log' },
                                        { label: 'Tamaño de Ración', value: sim.params.servingSize + 'g' },
                                        { label: 'Reducción en Proceso', value: Math.abs(sim.params.processingDeltaLog).toFixed(2) + ' Log₁₀' },
                                        { label: 'Inactivación Doméstica', value: Math.abs(sim.params.preparationDeltaLog).toFixed(2) + ' Log₁₀' },
                                        { label: 'Población en Riesgo', value: (sim.country.pop / 1e6).toFixed(2) + ' Millones' },
                                        { label: 'Consumo Anual Est.', value: (sim.country.servings ?? 0).toLocaleString() + ' raciones' },
                                        { label: 'Motor de Simulación', value: 'Monte Carlo (V2.4)' },
                                        { label: 'Convergencia', value: '95% Confidence Interval' },
                                        { label: 'Semilla Aleatoria', value: '#MC_' + Math.floor(Math.random() * 1000000) },
                                        { label: 'Carga Económica Total', value: formatCurrency(Math.round(sim.result.economicBreakdown.total)) },
                                        { label: 'Impacto Per Cápita', value: formatCurrency(sim.result.economicBreakdown.total / sim.country.pop) },
                                      ].map((item, i) => (
                                        <div key={i} className="flex flex-col gap-2 p-4 bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800/50">
                                          <div className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">{item.label}</div>
                                          <div className="text-sm font-black text-slate-900 dark:text-white font-serif italic tracking-tighter truncate" title={item.value?.toString()}>{item.value}</div>
                                        </div>
                                      ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                  <Card title="Perfil de Gravedad Biológica" sub="Matriz de Peligrosidad Probabilística">
                                    <SeverityProfile pair={sim.pair} params={sim.params} />
                                  </Card>
                                  <div className="h-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-[3rem] p-8 text-center flex flex-col justify-center gap-4 group relative overflow-hidden transition-all hover:shadow-xl">
                                    <div className="absolute -right-6 -top-6 opacity-5 group-hover:opacity-10 transition-all duration-700">
                                      <Activity className="w-48 h-48 text-blue-600 transition-transform group-hover:scale-110" />
                                    </div>
                                    <div className="relative z-10">
                                      <QuickInterpretation topic="incidence_rate" variant="icon" />
                                      <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] block mb-2">{t.incidenceRate}</span>
                                      <div className="flex items-center justify-center gap-2">
                                        <span className="text-6xl font-black text-slate-900 dark:text-white tracking-tighter italic font-serif leading-none">
                                          {((sim.result.summary.annualCases / sim.country.pop) * 100000).toFixed(2)}
                                        </span>
                                      </div>
                                      <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold mt-2 block">{t.per100k}</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                  <Card title={t.doseResponseTitle} sub={t.doseResponseDesc} tooltip={t.tooltipDoseResponse}>
                                    <div className="absolute top-3 right-12 z-10">
                                      <QuickInterpretation topic="dose_response" variant="icon" />
                                    </div>
                                    <DoseResponseChart pair={sim.pair} params={sim.params} illnessProb={sim.params.illnessProb} />
                                  </Card>
                                  {!sim.pair.isViral && (
                                    <Card title={t.weibullTitle} sub={t.weibullDesc} tooltip={t.tooltipInactivation}>
                                      <InactivationChart pair={sim.pair} params={sim.params} />
                                    </Card>
                                  )}
                                </div>

                                <Card title="Contexto de Susceptibilidad y Comparativa" sub="Factores de Riesgo Relativo">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                     <div className="space-y-4">
                                        <h5 className="text-xs font-black text-slate-400 uppercase tracking-widest">Grupos de Riesgo</h5>
                                        <div className="space-y-3">
                                           {[
                                             { label: 'Población General', factor: 1.0, color: 'bg-slate-400' },
                                             { label: 'Niños < 5 años', factor: 1.8, color: 'bg-blue-400' },
                                             { label: 'Adultos Mayores', factor: 2.5, color: 'bg-amber-400' },
                                             { label: 'Inmunocomprometidos', factor: 12.0, color: 'bg-rose-500' },
                                           ].map(g => (
                                             <div key={g.label} className="space-y-1">
                                                <div className="flex justify-between text-[10px] font-bold uppercase tracking-tighter">
                                                   <span className="text-slate-600 dark:text-slate-300">{g.label}</span>
                                                   <span className="text-slate-400">{g.factor}x</span>
                                                </div>
                                                <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                   <div className={cn("h-full rounded-full", g.color)} style={{ width: `${(g.factor / 12) * 100}%` }} />
                                                </div>
                                             </div>
                                           ))}
                                        </div>
                                     </div>
                                     <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col justify-center">
                                        <Stethoscope className="w-8 h-8 text-blue-500 mb-4" />
                                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                                          El análisis de susceptibilidad considera las variaciones fisiológicas que alteran la dosis infectiva mínima. Para <strong>{sim.pair.pathogen}</strong>, factores como el pH gástrico y la microbiota preexistente son determinantes críticos del riesgo relativo.
                                        </p>
                                     </div>
                                  </div>
                                </Card>
                              </div>
                            )}
                          </motion.div>
                        </AnimatePresence>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="col-span-12 flex flex-col items-center justify-center p-20 text-center gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm">
                    <BarChart3 className="w-16 h-16 text-slate-200 dark:text-slate-800 animate-pulse" />
                    <div>
                      <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">{t.noResultTitle}</h4>
                      <p className="text-xs text-slate-400 font-bold max-w-sm mx-auto">{t.noResultDesc}</p>
                    </div>
                    <button 
                      onClick={() => setView('config')}
                      className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center gap-2 active:scale-95 shadow-lg shadow-blue-500/20"
                    >
                      Ir a Configuración
                    </button>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="map"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="h-full pb-4"
              >
                <RiskMap 
                  selectedCountry={sim.country}
                  countries={COUNTRIES}
                  onCountrySelect={sim.setCountry}
                  t={t}
                  isDark={theme === 'dark'}
                  isHighContrast={isHighContrast}
                  result={sim.result}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Global Manual Modal */}
        <AnimatePresence mode="wait">
          {isManualOpen && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-8">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsManualOpen(false);
                }}
                className="absolute inset-0 bg-slate-950/60 backdrop-blur-md pointer-events-auto"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 40 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-6xl max-h-[90vh] bg-stone-50 dark:bg-slate-900 rounded-[3rem] shadow-[0_30px_100px_rgba(0,0,0,0.4)] border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col pointer-events-auto"
              >
                <div className="absolute top-8 right-8 z-50">
                  <button 
                    onClick={() => setIsManualOpen(false)}
                    className="p-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-full shadow-2xl border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-rose-500 transition-all active:scale-90 hover:rotate-90 duration-300"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                  <div className="bg-white dark:bg-slate-900 min-h-full">
                    <Manual onClose={() => setIsManualOpen(false)} />
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Theme Footer Bar */}
        <footer className="pt-12 pb-12 border-t border-slate-200/50 flex flex-col items-center gap-6 text-[10px] text-slate-500 font-bold font-mono uppercase tracking-[0.2em] relative z-10">
           <div className="flex flex-col items-center text-center gap-2">
              <div className="flex flex-col text-xs text-slate-600 dark:text-slate-400 leading-relaxed lowercase tracking-[0.05em] italic font-sans font-bold">
                <span>Organismo Internacional Regional de Sanidad Agropecuaria — OIRSA</span>
                <span>Direccion Regional de Inocuidad de Alimentos — DRIA</span>
              </div>
           </div>
           <div className="flex items-center gap-6 mt-4">
              <span className="text-[10px] text-slate-400 opacity-60">Monte Carlo Engine v2.4</span>
              <span className="text-[10px] text-slate-400 opacity-60">ProbRisk QMRA {new Date().getFullYear()}</span>
           </div>
        </footer>

        <AnimatePresence>
          {isLibraryOpen && (
            <PathogenLibrary onClose={() => setIsLibraryOpen(false)} />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function Slider({ label, description, value, min, max, step = 1, format, onChange, disabled, highlight, haccpInfo }: { 
  label: string; 
  description?: string;
  value: number; 
  min: number; 
  max: number; 
  step?: number; 
  format?: (v: number) => string;
  onChange: (v: number) => void; 
  disabled?: boolean;
  highlight?: boolean;
  haccpInfo?: string;
}) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className={cn(
      "space-y-3 relative group transition-all duration-500", 
      disabled && "opacity-20 pointer-events-none grayscale",
      highlight && "bg-emerald-500/[0.05] dark:bg-emerald-500/[0.08] rounded-[1.5rem] p-4 -m-4 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.05)]"
    )}>
      <div className="flex justify-between items-end px-1">
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex items-center gap-2">
            <div className="flex flex-col flex-wrap gap-1">
              <label className={cn(
                "text-[10px] font-black uppercase tracking-[0.15em] truncate cursor-help transition-colors flex items-center gap-1.5",
                highlight ? "text-green-400" : "text-green-500 group-hover:text-green-400"
              )}
                     onMouseEnter={() => setShowTooltip(true)}
                     onMouseLeave={() => setShowTooltip(false)}>
                {label}
                {highlight && (
                  <span className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500 text-white rounded-full text-[8px] font-black tracking-tighter shadow-lg shadow-emerald-500/20 animate-in fade-in zoom-in duration-500">
                    <ShieldCheck className="w-2.5 h-2.5" />
                    REDUCIDO POR HACCP
                  </span>
                )}
              </label>
              
              {haccpInfo && (
                <div className="flex items-center gap-1 group/h-info cursor-help w-fit">
                  <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 transition-colors">
                    <Info className="w-2.5 h-2.5" />
                    <span className="text-[7px] font-bold uppercase tracking-widest text-green-400">Info HACCP</span>
                  </div>
                  <div className="absolute left-0 bottom-full mb-3 w-64 p-3 bg-slate-900 dark:bg-slate-800 text-white text-[10px] rounded-xl opacity-0 group-hover/h-info:opacity-100 pointer-events-none transition-all duration-300 z-50 shadow-2xl border border-blue-500/30 transform scale-95 group-hover/h-info:scale-100 leading-relaxed font-medium">
                    <div className="text-green-400 font-bold mb-1 uppercase tracking-widest text-[8px]">Modificación HACCP Activa</div>
                    {haccpInfo}
                    <div className="absolute bottom-0 left-6 translate-y-1/2 rotate-45 w-2 h-2 bg-slate-900 border-r border-b border-blue-500/10" />
                  </div>
                </div>
              )}
            </div>
            <AnimatePresence>
              {showTooltip && description && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute left-0 bottom-full mb-3 w-56 p-3 bg-slate-900 dark:bg-slate-800 shadow-2xl rounded-[1.25rem] z-50 text-[10px] text-slate-200 border border-slate-800 leading-relaxed pointer-events-none italic backdrop-blur-md"
                >
                  <div className="absolute bottom-0 left-4 translate-y-1/2 rotate-45 w-2 h-2 bg-slate-900 border-r border-b border-slate-800" />
                    <div className="text-blue-400 font-black mb-1 uppercase tracking-widest text-[8px] not-italic">Información Técnica</div>
                  {description}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <span className={cn(
          "text-xs font-black font-mono tabular-nums transition-all group-hover:scale-110 origin-right",
          highlight ? "text-emerald-400" : "text-teal-400"
        )}>
          {format ? format(value) : value}
        </span>
      </div>
      <div className="px-1 relative h-6 flex items-center">
        <input 
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className={cn(
            "w-full h-1.5 rounded-full appearance-none cursor-pointer transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/10",
            highlight 
              ? "bg-emerald-100 dark:bg-emerald-950 accent-emerald-500" 
              : "bg-slate-100 dark:bg-slate-800 accent-blue-600 dark:accent-blue-400"
          )}
        />
        {/* Track decoration */}
        <div className="absolute inset-x-1 top-1/2 -translate-y-1/2 h-1.5 rounded-full pointer-events-none -z-10 bg-linear-to-r from-transparent via-transparent to-black/5 dark:to-white/5" />
      </div>
    </div>
  );
}

function InfoTooltip({ content }: { content: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block ml-1">
      <button 
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors focus:outline-none"
      >
        <Info className="w-3.5 h-3.5 text-slate-400 hover:text-teal-500 transition-colors" />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 5 }}
            className="absolute z-50 w-56 p-3 bg-slate-900 dark:bg-slate-800 text-white text-[10px] font-bold rounded-xl shadow-2xl leading-relaxed -translate-x-1/2 left-1/2 bottom-full mb-2 pointer-events-none border border-slate-700 backdrop-blur-sm"
          >
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 dark:bg-slate-800 rotate-45 border-r border-b border-slate-700" />
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Card({ title, sub, children, tooltip }: { title: string; sub?: string; children: React.ReactNode; tooltip?: string }) {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  const exportImage = async () => {
    if (!cardRef.current) return;
    try {
      const dataUrl = await toPng(cardRef.current, { 
        cacheBust: true,
        backgroundColor: document.documentElement.classList.contains('dark') ? '#0f172a' : '#ffffff',
        style: {
          borderRadius: '24px'
        }
      });
      const link = document.createElement('a');
      link.download = `${title.toLowerCase().replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Export failed', err);
    }
  };

  return (
    <div ref={cardRef} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.01)] transition-all duration-300 group/card flex flex-col h-full hover:shadow-[0_15px_50px_rgb(0,0,0,0.04)] dark:hover:shadow-[0_15px_50px_rgb(0,0,0,0.15)]">
      <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between transition-colors">
        <div className="flex items-center gap-2.5">
          <div className="w-1 h-5 bg-blue-600 dark:bg-blue-500 rounded-full shadow-lg shadow-blue-500/20" />
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-[0.15em] leading-none">{title}</h3>
              {tooltip && <InfoTooltip content={tooltip} />}
            </div>
            {sub && <p className="text-[9px] text-slate-400 dark:text-slate-500 mt-1 font-medium tracking-tight italic opacity-80">{sub}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <button 
            onClick={exportImage}
            title={t.exportImage || "Exportar Imagen"}
            className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg opacity-0 group-hover/card:opacity-100 transition-all active:scale-90 shadow-sm"
          >
            <Camera className="w-3.5 h-3.5" />
          </button>
          <div className="p-0.5 px-1.5 bg-slate-50 dark:bg-slate-800 rounded-md border border-slate-100 dark:border-slate-700/50">
             <Settings2 className="w-2.5 h-2.5 text-slate-300 dark:text-slate-600" />
          </div>
        </div>
      </div>
      <div className="p-4 flex-1 relative ring-1 ring-slate-50 dark:ring-slate-800/10 transition-colors">
        {children}
      </div>
    </div>
  );
}

function BigStat({ label, value, sub, dark }: { label: string; value: string; sub: string; dark?: boolean }) {
  return (
    <div className="space-y-1.5">
      <div className={cn("text-[9px] font-bold uppercase tracking-[0.2em]", dark ? "text-slate-400 dark:text-slate-500" : "text-blue-400/80")}>{label}</div>
      <div className={cn("text-3xl font-serif font-bold italic leading-none transition-colors", dark ? "text-slate-900 dark:text-slate-100" : "text-white")}>{value}</div>
      <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-widest">{sub}</div>
    </div>
  );
}
