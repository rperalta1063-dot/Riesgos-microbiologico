import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Bug, 
  Microscope, 
  FlaskConical, 
  Filter, 
  BookOpen, 
  TrendingUp, 
  Check,
  Info,
  X,
  Database
} from 'lucide-react';
import { PAIRS } from '../data/pairs';
import { PathogenPair } from '../types';
import { cn } from '../lib/utils';
import { useSimulation } from '../hooks/useSimulation';
import { useLanguage } from '../hooks/useLanguage';

interface PathogenLibraryProps {
  onClose?: () => void;
  inline?: boolean;
}

export default function PathogenLibrary({ onClose, inline = false }: PathogenLibraryProps) {
  const sim = useSimulation();
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'bacteria' | 'virus' | 'toxin'>('all');
  const [selectedPathogen, setSelectedPathogen] = useState<string | null>(sim.pair.pathogen);

  const getPathogenType = (p: PathogenPair) => {
    if (p.isViral) return 'virus';
    const pathogenName = p.pathogen?.toLowerCase() || '';
    if (pathogenName.includes('toxina') || pathogenName.includes('aureus')) {
      // S. aureus is a bacterium but often associated with toxin in this context
      if (pathogenName.includes('toxina')) return 'toxin';
    }
    // Specific logic for types in our PAIRS
    if (['sta_salad', 'sta_dairy', 'clo_bot'].includes(p.id)) return 'toxin';
    if (['noro_shell', 'noro_veg', 'hav_shell', 'hav_veg'].includes(p.id)) return 'virus';
    return 'bacteria';
  };

  const pathogens = useMemo(() => {
    const unique = new Map<string, PathogenPair>();
    PAIRS.forEach(p => {
      if (!unique.has(p.pathogen)) {
        unique.set(p.pathogen, p);
      }
    });
    return Array.from(unique.values()).sort((a, b) => a.pathogen.localeCompare(b.pathogen));
  }, []);

  const filteredPathogens = pathogens.filter(p => {
    const pathogenName = p.pathogen?.toLowerCase() || '';
    const description = p.description?.toLowerCase() || '';
    const search = searchTerm.toLowerCase();

    const matchesSearch = pathogenName.includes(search) || description.includes(search);
    const type = getPathogenType(p);
    const matchesFilter = filterType === 'all' || type === filterType;
    return matchesSearch && matchesFilter;
  });

  const foodsForSelected = PAIRS.filter(p => p.pathogen === selectedPathogen);

  const handleSelect = (pair: PathogenPair) => {
    sim.setPair(pair);
    if (onClose) onClose();
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'virus': return <Microscope className="w-4 h-4" />;
      case 'toxin': return <FlaskConical className="w-4 h-4" />;
      default: return <Bug className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'virus': return "text-violet-500 bg-violet-50 dark:bg-violet-900/20 border-violet-100 dark:border-violet-800";
      case 'toxin': return "text-amber-500 bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800";
      default: return "text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800";
    }
  };

  const content = (
    <div className={cn(
      "flex flex-col gap-6",
      !inline && "h-full max-h-[85vh]"
    )}>
      {/* Header & Search */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-xl shadow-lg shadow-blue-500/20">
              <Database className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">Biblioteca de Patógenos</h2>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Estándares Científicos FAO/WHO & Literatura</p>
            </div>
          </div>
          {onClose && (
            <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text"
              placeholder="Buscar por nombre o descripción..."
              className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            {(['all', 'bacteria', 'virus', 'toxin'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilterType(f)}
                className={cn(
                  "px-3 py-1.5 text-[9px] font-black uppercase rounded-lg transition-all",
                  filterType === f 
                    ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-200 shadow-sm" 
                    : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                )}
              >
                {f === 'all' ? 'Todos' : f}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden min-h-0">
        {/* Left Side: Pathogen List */}
        <div className="lg:col-span-5 overflow-y-auto custom-scrollbar pr-2 space-y-2">
          {filteredPathogens.map(p => {
            const type = getPathogenType(p);
            const isSelected = selectedPathogen === p.pathogen;
            return (
              <button
                key={p.pathogen}
                onClick={() => setSelectedPathogen(p.pathogen)}
                className={cn(
                  "w-full flex items-center gap-4 p-3 rounded-2xl border transition-all text-left group",
                  isSelected
                    ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 shadow-md shadow-blue-500/5"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700"
                )}
              >
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110",
                  getTypeColor(type)
                )}>
                  {getTypeIcon(type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">{type}</span>
                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />}
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white italic font-serif tracking-tight truncate">{p.pathogen}</h4>
                </div>
              </button>
            );
          })}
          {filteredPathogens.length === 0 && (
            <div className="p-8 text-center bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
              <Search className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No se encontraron resultados</p>
            </div>
          )}
        </div>

        {/* Right Side: Details & Food Selection */}
        <div className="lg:col-span-7 flex flex-col gap-6 bg-slate-50 dark:bg-slate-900/50 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 overflow-y-auto custom-scrollbar">
          {selectedPathogen ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedPathogen}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ficha Técnica del Agente</span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white italic font-serif tracking-tighter">{selectedPathogen}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed mt-2 italic">
                    {foodsForSelected[0]?.description || "Información detallada sobre la dinámica del patógeno y su comportamiento en matrices alimentarias."}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Modelo D-R</div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                      {foodsForSelected[0]?.drModel === 'exponential' ? 'Exponencial' : 'Beta-Poisson'}
                    </div>
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                      {foodsForSelected[0]?.drModel === 'exponential' ? 'Infectividad (k)' : 'Alfa (α)'}
                    </div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white font-mono">
                      {foodsForSelected[0]?.drModel === 'exponential' 
                        ? (foodsForSelected[0]?.k || 0).toExponential(3)
                        : (foodsForSelected[0]?.alpha || 0).toFixed(4)}
                    </div>
                  </div>
                  {foodsForSelected[0]?.drModel !== 'exponential' && (
                    <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                      <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Beta (β)</div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white font-mono">
                        {(foodsForSelected[0]?.beta || 0).toLocaleString()}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Filter className="w-4 h-4 text-blue-600" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Matrices Alimentarias Disponibles</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {foodsForSelected.map(p => (
                      <button
                        key={p.id}
                        onClick={() => handleSelect(p)}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-2xl border transition-all text-left group/food",
                          sim.pair.id === p.id
                            ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 shadow-md"
                            : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700"
                        )}
                      >
                        <div className="text-2xl group-hover/food:scale-125 transition-transform duration-300">{p.icon}</div>
                        <div className="flex-1 min-w-0">
                          <h5 className="text-xs font-black text-slate-800 dark:text-slate-100 truncate">{p.food}</h5>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className={cn(
                              "text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter",
                              p.risk === 'h' ? "bg-rose-100 text-rose-600 dark:bg-rose-900/30" : "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30"
                            )}>
                              Riesgo {p.risk === 'h' ? 'Alto' : 'Bajo'}
                            </span>
                          </div>
                        </div>
                        {sim.pair.id === p.id && (
                          <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-800 flex items-start gap-3">
                  <Info className="w-4 h-4 text-blue-500 mt-0.5" />
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold leading-relaxed tracking-tight">
                    Al seleccionar una matriz, el motor QMRA cargará automáticamente los parámetros de prevalencia, carga inicial y curvas de crecimiento/inactivación validados para este escenario.
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-12 gap-4">
              <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-[2.5rem] flex items-center justify-center text-slate-300 dark:text-slate-700">
                <Database className="w-10 h-10" />
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tighter">Seleccione un Agente</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Explore la biblioteca para ver detalles y alimentos asociados</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (inline) return content;

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 sm:p-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-[3rem] shadow-[0_30px_100px_rgba(0,0,0,0.4)] border border-slate-200 dark:border-slate-800 p-8 overflow-hidden"
      >
        {content}
      </motion.div>
    </div>
  );
}
