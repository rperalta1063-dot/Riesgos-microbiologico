import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  LabelList
} from 'recharts';
import { 
  BarChart3, 
  HelpCircle,
  AlertTriangle
} from 'lucide-react';
import { SimulationResult } from '../types';
import { useLanguage } from '../hooks/useLanguage';
import { useTheme } from '../hooks/useTheme';
import { cn } from '../lib/utils';

interface Props {
  result: SimulationResult;
}

export function GlobalSensitivity({ result }: Props) {
  const { t } = useLanguage();
  const { isDark } = useTheme();
  
  const data = result.sensitivity || [];
  
  if (data.length === 0) {
    return (
      <div className="h-64 w-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 gap-2 italic border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
        <AlertTriangle className="w-8 h-8 opacity-20" />
        <p className="text-xs uppercase tracking-widest font-bold">Análisis de Sensibilidad Global no disponible</p>
      </div>
    );
  }

  // Calculate Variance Contribution (%) as square of correlation normalized to 100
  // Often GSA results are shown as the percentage of variance explained.
  const totalSquared = data.reduce((acc, d) => acc + (d.impact * d.impact), 0);
  const varianceData = data.map(d => ({
    ...d,
    varianceContribution: totalSquared > 0 ? (d.impact * d.impact / totalSquared) * 100 : 0
  })).sort((a, b) => b.varianceContribution - a.varianceContribution);

  const COLORS = {
    positive: '#f43f5e', // Rose
    negative: '#3b82f6', // Blue
    neutral: '#94a3b8'
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 rounded-lg">
            <BarChart3 className="w-5 h-5 text-indigo-500" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-tighter">
              Sensibilidad Global (GSA)
            </h3>
            <p className="text-[10px] text-slate-500 font-medium">
              Contribución de cada variable a la varianza total del riesgo de infección
            </p>
          </div>
        </div>
        
        <div className="group relative">
          <HelpCircle className="w-4 h-4 text-slate-300 cursor-help transition-colors group-hover:text-slate-500" />
          <div className="absolute right-0 top-full mt-2 w-64 p-3 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 invisible group-hover:visible z-50 text-[10px] leading-relaxed text-slate-600 dark:text-slate-400">
            Este análisis utiliza el **Coeficiente de Correlación de Pearson** entre los parámetros de entrada y el riesgo de enfermedad. Los valores muestran qué variables "mueven la aguja" más significativamente en el modelo estocástico.
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Tornado Chart (Correlation) */}
        <div className="bg-slate-50/50 dark:bg-slate-900/30 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Dirección del Impacto (Correlación)</h4>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={data.slice(0, 8)} 
                layout="vertical" 
                margin={{ left: 10, right: 40, top: 5, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={isDark ? '#1e293b' : '#f1f5f9'} />
                <XAxis 
                  type="number" 
                  domain={[-100, 100]} 
                  fontSize={8} 
                  tick={{ fill: isDark ? '#64748b' : '#94a3b8' }}
                  axisLine={{ stroke: isDark ? '#1e293b' : '#f1f5f9' }}
                />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 9, fill: isDark ? '#94a3b8' : '#64748b', fontWeight: 'bold' }}
                  width={110}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: isDark ? '#0f172a' : '#fff', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '10px' }}
                  formatter={(value: number) => [`${value.toFixed(1)}%`, 'Correlación']}
                />
                <Bar dataKey="impact" radius={[0, 4, 4, 0]} barSize={16}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.impact >= 0 ? COLORS.positive : COLORS.negative} />
                  ))}
                  <LabelList 
                    dataKey="impact" 
                    position="right"
                    content={(props: any) => {
                      const { x, y, width, height, value } = props;
                      const sign = value >= 0 ? 1 : -1;
                      const xPos = sign > 0 ? x + (width || 0) + 5 : x - 35;
                      return (
                        <text 
                          x={xPos} 
                          y={(y || 0) + (height || 0) / 2 + 3} 
                          fill={isDark ? '#94a3b8' : '#64748b'} 
                          fontSize="8" 
                          fontWeight="bold"
                          fontFamily="monospace"
                        >
                          {value > 0 ? '+' : ''}{value.toFixed(0)}%
                        </text>
                      );
                    }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Variance Contribution Chart */}
        <div className="bg-slate-50/50 dark:bg-slate-900/30 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Contribución a la Varianza (%)</h4>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={varianceData.slice(0, 8)} 
                layout="vertical" 
                margin={{ left: 10, right: 60, top: 5, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={isDark ? '#1e293b' : '#f1f5f9'} />
                <XAxis 
                  type="number" 
                  domain={[0, 100]} 
                  fontSize={8} 
                  tick={{ fill: isDark ? '#64748b' : '#94a3b8' }}
                  axisLine={{ stroke: isDark ? '#1e293b' : '#f1f5f9' }}
                />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 9, fill: isDark ? '#94a3b8' : '#64748b', fontWeight: 'bold' }}
                  width={110}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: isDark ? '#0f172a' : '#fff', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '10px' }}
                  formatter={(value: number) => [`${value.toFixed(1)}%`, 'Varianza Explicada']}
                />
                <Bar dataKey="varianceContribution" radius={[0, 4, 4, 0]} barSize={16}>
                  {varianceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS.neutral} fillOpacity={0.6 - (index * 0.05)} />
                  ))}
                  <LabelList 
                    dataKey="varianceContribution" 
                    position="right"
                    formatter={(val: number) => `${val.toFixed(1)}%`}
                    style={{ fontSize: '9px', fontWeight: 'bold', fill: isDark ? '#94a3b8' : '#64748b', fontFamily: 'monospace' }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-100 dark:border-amber-900/30">
        <div className="flex gap-3">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h5 className="text-[10px] font-bold text-amber-900 dark:text-amber-200 uppercase tracking-tighter">Interpretación del Riesgo</h5>
            <p className="text-[10px] text-amber-800 dark:text-amber-300/70 leading-relaxed">
              Las variables con mayor contribución a la varianza son los puntos más efectivos para intervenciones de control. 
              {varianceData[0]?.impact > 0 
                ? ` La **${varianceData[0]?.name}** muestra la correlación positiva más fuerte; reducir su variabilidad o valor medio tendrá el mayor impacto sistémico.`
                : ` La **${varianceData[0]?.name}** muestra una fuerte influencia inversa; optimizar este parámetro es crítico para la seguridad del producto.`
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
