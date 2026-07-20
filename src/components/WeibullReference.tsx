import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Thermometer, Info, Database } from 'lucide-react';
import { cn } from '../lib/utils';

interface WeibullData {
  pathogen: string;
  delta: string;
  p: string;
  description: string;
}

const WEIBULL_DATA: WeibullData[] = [
  { pathogen: 'Salmonella spp.', delta: '2.00 - 2.50', p: '0.90', description: 'Sensible al calor, curvatura cóncava.' },
  { pathogen: 'Campylobacter jejuni', delta: '2.00', p: '1.00', description: 'Modelo exponencial estándar (p=1).' },
  { pathogen: 'Listeria monocytogenes', delta: '1.80 - 2.20', p: '1.15', description: 'Resistencia moderada, curvatura convexa.' },
  { pathogen: 'E. coli O157:H7 (STEC)', delta: '2.20 - 2.55', p: '1.25 - 1.35', description: 'Resistente a la acidez y calor moderado.' },
  { pathogen: 'Staphylococcus aureus', delta: '3.00 - 3.50', p: '1.50 - 1.60', description: 'Toxina altamente termoestable.' },
  { pathogen: 'Clostridium botulinum', delta: '12.00', p: '2.00', description: 'Esporas: Requiere tratamiento térmico extremo.' },
  { pathogen: 'Bacillus cereus', delta: '4.00', p: '1.70', description: 'Esporas: Resistencia térmica significativa.' },
  { pathogen: 'Vibrio cholerae', delta: '1.20', p: '1.10', description: 'Muy sensible al calor y desecación.' },
  { pathogen: 'Norovirus', delta: '1.80 - 1.95', p: '1.30 - 1.35', description: 'Alta persistencia ambiental.' },
  { pathogen: 'Virus de hepatitis A', delta: '2.20 - 2.50', p: '1.20', description: 'Termoestable en matrices complejas.' },
];

export default function WeibullReference() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden mt-6"
    >
      <div className="p-5 bg-rose-50/50 dark:bg-rose-900/10 border-b border-rose-100/50 dark:border-rose-800/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-rose-600 rounded-xl flex items-center justify-center shadow-lg shadow-rose-500/20">
            <Thermometer className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">Metadatos de Inactivación Weibull</h3>
            <p className="text-[10px] text-rose-600 dark:text-rose-400 uppercase font-bold tracking-tighter">Cinética Microbiana No Lineal</p>
          </div>
        </div>
        <div className="px-3 py-1 bg-white dark:bg-slate-800 rounded-full border border-rose-100 dark:border-rose-800 text-[9px] font-black text-rose-600 uppercase tracking-widest flex items-center gap-2">
          <Database className="w-3 h-3" />
          Referencia T-80°C
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50">
              <th className="px-5 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 text-center">Icono</th>
              <th className="px-5 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">Patógeno Objetivo</th>
              <th className="px-5 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">δ (Delta - min)</th>
              <th className="px-5 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">p (Shape - forma)</th>
              <th className="px-5 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 text-right">Comportamiento</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {WEIBULL_DATA.map((row) => (
              <tr key={row.pathogen} className="hover:bg-rose-50/20 dark:hover:bg-rose-900/10 transition-colors group">
                <td className="px-5 py-3 text-center">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                </td>
                <td className="px-5 py-3">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-rose-600 transition-colors">{row.pathogen}</span>
                </td>
                <td className="px-5 py-3">
                  <span className="text-xs font-mono font-black text-rose-600 bg-rose-50 dark:bg-rose-900/20 px-2 py-0.5 rounded shadow-sm">{row.delta}</span>
                </td>
                <td className="px-5 py-3">
                  <span className="text-xs font-mono font-black text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">{row.p}</span>
                </td>
                <td className="px-5 py-3 text-right">
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium italic flex items-center justify-end gap-2">
                    {row.description}
                    <Info className="w-3 h-3 opacity-30 group-hover:opacity-100 transition-opacity" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="p-4 bg-slate-50 dark:bg-slate-800/20 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-500 italic leading-relaxed">
        <strong>Nota Técnica:</strong> El modelo de Weibull Log(S/S₀) = -(t/δ)ᵖ permite capturar la heterogeneidad en la resistencia térmica, donde p &lt; 1 indica sensibilización y p &gt; 1 indica adaptación.
      </div>
    </motion.div>
  );
}
