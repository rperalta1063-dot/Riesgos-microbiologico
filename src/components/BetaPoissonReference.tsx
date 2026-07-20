import React from 'react';
import { motion } from 'motion/react';
import { Info, ExternalLink, Microscope, Bug, ShieldCheck } from 'lucide-react';
import { cn } from '../lib/utils';

interface DoseResponseData {
  pathogen: string;
  type: 'Bacteria' | 'Virus';
  model: 'Beta-Poisson' | 'Exponencial';
  param1: string; // alpha for BP, k for Exp
  param2?: string; // beta for BP
  source: string;
}

const DOSE_RESPONSE_DATA: DoseResponseData[] = [
  { pathogen: 'Salmonella enterica', type: 'Bacteria', model: 'Beta-Poisson', param1: '1.32', param2: '51.45', source: 'FAO/OMS (JEMRA)' },
  { pathogen: 'Listeria monocytogenes', type: 'Bacteria', model: 'Exponencial', param1: '1.06 × 10⁻¹²', source: 'OMS / FAO' },
  { pathogen: 'Vibrio cholerae', type: 'Bacteria', model: 'Beta-Poisson', param1: '0.25', param2: '16.2', source: 'Hornick (Updated)' },
  { pathogen: 'Vibrio vulnificus', type: 'Bacteria', model: 'Beta-Poisson', param1: '0.18', param2: '1.2 × 10⁵', source: 'US FDA (Ostras)' },
  { pathogen: 'Staphylococcus aureus', type: 'Bacteria', model: 'Exponencial', param1: '8.05 × 10⁻⁸', source: 'Teunis (Exponencial)' },
  { pathogen: 'Clostridium botulinum', type: 'Bacteria', model: 'Exponencial', param1: '1.82 × 10⁻¹⁰', source: 'Manual de Riesgo' },
  { pathogen: 'Norovirus', type: 'Virus', model: 'Beta-Poisson', param1: '0.04', param2: '55.00', source: 'Teunis et al. (2008)' },
  { pathogen: 'E. coli O157:H7', type: 'Bacteria', model: 'Beta-Poisson', param1: '0.27', param2: '4.59', source: 'FAO/OMS (Updated)' },
];

export default function DoseResponseReference() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden mt-4"
    >
      <div className="p-4 bg-emerald-50/50 dark:bg-emerald-900/10 border-b border-emerald-100/50 dark:border-emerald-800/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <ShieldCheck className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">Referencia Dosis-Respuesta</h3>
            <p className="text-[9px] text-emerald-600 dark:text-emerald-400 uppercase font-bold tracking-tighter">Modelos y Parámetros Biológicos</p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/30">
              <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">Patógeno</th>
              <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">Modelo</th>
              <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">Criterio Principal</th>
              <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 text-right">Fuente</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {DOSE_RESPONSE_DATA.map((row) => (
              <tr key={row.pathogen} className="hover:bg-emerald-50/30 dark:hover:bg-emerald-900/10 transition-colors group">
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "w-6 h-6 rounded flex items-center justify-center",
                      row.type === 'Virus' ? "bg-violet-100 text-violet-600" : "bg-emerald-100 text-emerald-600"
                    )}>
                      {row.type === 'Virus' ? <Microscope className="w-3 h-3" /> : <Bug className="w-3 h-3" />}
                    </div>
                    <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 group-hover:text-emerald-600 transition-colors">{row.pathogen}</span>
                  </div>
                </td>
                <td className="px-4 py-2.5">
                  <span className={cn(
                    "text-[8px] font-black uppercase px-2 py-0.5 rounded-full border",
                    row.model === 'Exponencial' 
                      ? "bg-teal-50 text-teal-600 border-teal-200 dark:bg-teal-900/20 dark:border-teal-800" 
                      : "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800"
                  )}>
                    {row.model}
                  </span>
                </td>
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-1.5 font-mono">
                    <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-1.5 py-0.5 rounded">
                      {row.model === 'Exponencial' ? 'k=' : 'α='}{row.param1}
                    </span>
                    {row.param2 && (
                       <span className="text-[9px] font-black text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-1.5 py-0.5 rounded">
                         β={row.param2}
                       </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-2.5 text-right">
                  <div className="text-[8px] text-slate-400 font-medium flex items-center justify-end gap-1">
                    {row.source}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="p-3 bg-slate-50 dark:bg-slate-800/20 text-[9px] text-slate-400 italic">
        * Modelos validados: Beta-Poisson P(d)=1-[1+(d/β)]⁻ᵃ y Exponencial P(d)=1-exp(-k·d).
      </div>
    </motion.div>
  );
}
