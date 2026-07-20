import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Cell,
  LineChart,
  Line,
  ComposedChart,
  PieChart,
  Pie,
  Legend,
  LabelList,
  ReferenceLine
} from 'recharts';
import { 
  TrendingUp,
  AlertCircle,
  Heart
} from 'lucide-react';
import { SimulationResult, PathogenPair, SimulationParams } from '../types';
import { formatNumber, formatCurrency, cn, preprocessSimulationData, formatDecimal } from '../lib/utils';
import { useLanguage } from '../hooks/useLanguage';
import { useTheme } from '../hooks/useTheme';

export function DALYBarChart({ result, params }: { result: SimulationResult; params: SimulationParams }) {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  
  const YLL_PER_DEATH = 35;
  const ACUTE_DW = params.acuteDalyWeight || 0.05;
  const ACUTE_DURATION_YEARS = (params.acuteDurationDays || 5) / 365;

  const getBreakdown = (cases: number, deaths: number, totalDaly: number) => {
    const yll = deaths * YLL_PER_DEATH;
    const yldAcute = cases * ACUTE_DW * ACUTE_DURATION_YEARS;
    const yldChronic = Math.max(0, totalDaly - yll - yldAcute);
    return { yll, yldAcute, yldChronic };
  };

  const mean = result.summary;
  const meanBreakdown = getBreakdown(mean.annualCases, mean.annualDeaths, mean.annualDALYs);

  // Approximate P95 scenario by scaling everything by the ratio of p95/mean cases
  const p95Ratio = result.stats.mean > 0 ? result.stats.p95 / result.stats.mean : 1;
  const p95Breakdown = getBreakdown(
    mean.annualCases * p95Ratio, 
    mean.annualDeaths * p95Ratio, 
    mean.annualDALYs * p95Ratio
  );

  const data = [
    {
      name: 'Escenario Esperado',
      yll: meanBreakdown.yll,
      yldAcute: meanBreakdown.yldAcute,
      yldChronic: meanBreakdown.yldChronic,
    },
    {
      name: 'Escenario Crítico (P95)',
      yll: p95Breakdown.yll,
      yldAcute: p95Breakdown.yldAcute,
      yldChronic: p95Breakdown.yldChronic,
    }
  ];

  return (
    <div className="h-[300px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={data} 
          margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#334155' : '#e2e8f0'} />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            fontSize={10} 
            fontWeight="black"
            tick={{ fill: isDark ? '#94a3b8' : '#64748b' }}
            className="uppercase tracking-widest"
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            fontSize={10}
            fontWeight="bold"
            tickFormatter={(v) => formatDecimal(v, 1)}
            tick={{ fill: isDark ? '#94a3b8' : '#64748b' }}
          />
          <Tooltip
            cursor={{ fill: isDark ? '#334155' : '#f1f5f9', opacity: 0.1 }}
            contentStyle={{ 
              backgroundColor: isDark ? '#0f172a' : '#fff', 
              borderRadius: '16px', 
              border: `1px solid ${isDark ? '#1e293b' : '#e2e8f0'}`,
              boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' 
            }}
            labelStyle={{ fontSize: '11px', fontWeight: '900', color: isDark ? '#f1f5f9' : '#1e293b', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}
            itemStyle={{ fontSize: '10px', fontWeight: 'bold' }}
          />
          <Legend 
            verticalAlign="top" 
            align="right"
            iconType="circle"
            wrapperStyle={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.025em', paddingBottom: '20px' }}
          />
          <Bar dataKey="yll" name="YLL (Mortalidad)" stackId="a" fill={COLORS.rose} radius={[0, 0, 0, 0]} />
          <Bar dataKey="yldAcute" name="YLD (Agudo)" stackId="a" fill={COLORS.amber} radius={[0, 0, 0, 0]} />
          <Bar dataKey="yldChronic" name="YLD (Crónico)" stackId="a" fill={COLORS.indigo} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

interface Props {
  result: SimulationResult;
}

interface BioProps {
  pair: PathogenPair;
  params: SimulationParams;
  illnessProb?: number;
}

const COLORS = {
  blue: '#3b82f6', // Bright Blue (Medical)
  amber: '#f59e0b', // Bright Amber (Secuelas / Chronic)
  rose: '#f43f5e', // Bright Rose (Mortality)
  emerald: '#10b981', // Bright Emerald (Intervention)
  indigo: '#6366f1', // Indigo (Productivity)
  stone: '#78716c',
  orange: '#f97316'
};

const HIGH_CONTRAST_COLORS = {
  blue: '#0000FF',
  amber: '#FFD700',
  rose: '#FF0000',
  emerald: '#008000',
  indigo: '#4B0082',
  stone: '#000000',
  orange: '#FF8C00'
};

export function ExposureChain({ result }: Props) {
  const { theme, isHighContrast } = useTheme();
  const { t } = useLanguage();
  const isDark = theme === 'dark';
  const rawData = result.stageProgression;
  const currentColors = isHighContrast ? HIGH_CONTRAST_COLORS : COLORS;

  // Compute log stats to decide default scale
  const logValues = rawData?.map(d => d.value) || [];
  const minLog = Math.min(...logValues);
  const maxLog = Math.max(...logValues);
  const hasSubstantialRange = maxLog - minLog >= 1.5;

  const [scale, setScale] = useState<'linear' | 'log'>(hasSubstantialRange ? 'log' : 'linear');
  
  if (!rawData || rawData.length === 0) {
    return (
      <div className="h-48 w-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 gap-2 italic border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
        <TrendingUp className="w-8 h-8 opacity-20" />
        <p className="text-[10px] uppercase tracking-widest font-bold">Datos de cadena no disponibles</p>
      </div>
    );
  }

  // Convert log values to raw values for the chart to let recharts handle the log scale
  const data = rawData.map(d => {
    const logVal = isNaN(d.value) ? -10 : d.value;
    return {
      ...d,
      value: logVal,
      rawValue: Math.pow(10, Math.max(-20, Math.min(20, logVal)))
    };
  });

  return (
    <div className="w-full h-[400px] flex flex-col space-y-3 relative group/chart">
      <div className="flex items-center justify-between shrink-0 mb-2">
        <div className="flex items-center gap-2">
           <div className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
           <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Flux Analysis Vector</span>
        </div>
        <div className="flex bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-inner">
          <button
            onClick={() => setScale('linear')}
            className={cn(
              "px-2 py-0.5 text-[8px] font-black uppercase rounded transition-all",
              scale === 'linear' 
                ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm" 
                : "text-slate-400 hover:text-slate-600"
            )}
          >
            Lin
          </button>
          <button
            onClick={() => setScale('log')}
            className={cn(
              "px-2 py-0.5 text-[8px] font-black uppercase rounded transition-all",
              scale === 'log' 
                ? "bg-slate-900 dark:bg-slate-200 text-white dark:text-slate-900 shadow-sm" 
                : "text-slate-400 hover:text-slate-600"
            )}
          >
            Log₁₀
          </button>
        </div>
      </div>
      
      <div className="flex-1 min-h-[220px] w-full" role="img" aria-label={t.microbialChainAlt}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#1e293b' : '#e7e5e4'} />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: isDark ? '#64748b' : '#a8a29e' }}
            />
            <YAxis 
              scale={scale === 'log' ? 'log' : 'auto'}
              domain={scale === 'log' ? ['auto', 'auto'] : [0, 'auto']}
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 9, fill: isDark ? '#64748b' : '#a8a29e', fontFamily: 'monospace' }}
              tickFormatter={(v) => {
                if (scale === 'linear') return formatNumber(v);
                if (v === 0) return '0';
                const log = Math.log10(v);
                return `10^${log % 1 === 0 ? log : log.toFixed(1)}`;
              }}
              label={{ 
                value: scale === 'log' ? 'Log₁₀ (UFC/g)' : 'UFC/g', 
                angle: -90, 
                position: 'insideLeft', 
                offset: 5, 
                fontSize: 9, 
                fill: isDark ? '#64748b' : '#a8a29e' 
              }}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: isDark ? '1px solid #1e293b' : '1px solid #e7e5e4', backgroundColor: isDark ? '#0f172a' : '#fff', fontSize: '11px', color: isDark ? '#f1f5f9' : '#0f172a' }}
              itemStyle={{ color: isDark ? '#94a3b8' : '#64748b' }}
              formatter={(value: number) => [
                scale === 'log' 
                  ? `${Math.log10(value).toFixed(2)} Log₁₀` 
                  : `${formatNumber(value)} UFC/g`, 
                'Carga'
              ]}
            />
            <Area 
              type="monotone" 
              dataKey="rawValue" 
              name={t.loadProgression}
              stroke={currentColors.indigo} 
              fill={currentColors.indigo} 
              fillOpacity={isHighContrast ? 0.3 : 0.1} 
              strokeWidth={isHighContrast ? 4 : 2}
              dot={{ r: 4, fill: currentColors.indigo, strokeWidth: 2, stroke: isDark ? '#0f172a' : '#fff' }}
              animationDuration={1000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

interface SensitivityProps extends Props {
  focus?: 'biological' | 'economic';
}

export function SensitivityAnalysis({ result, focus = 'biological' }: SensitivityProps) {
  const { t } = useLanguage();
  const { theme, isHighContrast } = useTheme();
  const isDark = theme === 'dark';
  const currentColors = isHighContrast ? HIGH_CONTRAST_COLORS : COLORS;

  const econParams = ['costHosp', 'costAmb', 'costAbsence', 'costDeath', 'costInterventionPerCase', 'vsl', 'annualDirectCost'];
  
  let rawData = result.sensitivity;
  if (focus === 'economic') {
    rawData = result.sensitivity.filter(d => 
      (d.name && econParams.includes(d.name)) || 
      (d.name && d.name.toLowerCase().includes('cost')) || 
      (d.name && d.name.toLowerCase().includes('impact'))
    );
    // If no specific economic ones (simulation might not have them), take the ones with highest impact but maybe we should mock some if empty?
    // Actually, usually sensitivity analysis in this app covers input parameters.
    if (rawData.length === 0) {
       // fallback: if we are in economic mode but no economic sensitivity, just show top 8
       rawData = result.sensitivity;
    }
  } else {
    rawData = result.sensitivity.filter(d => !econParams.includes(d.name));
  }

  const data = rawData.slice(0, 8).map(d => ({
    ...d,
    displayName: (t as any)[d.name] || d.name
  }));

  if (!data || data.length === 0) {
    return (
      <div className="h-64 w-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 gap-2 italic border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
        <AlertCircle className="w-8 h-8 opacity-20" />
        <p className="text-[10px] uppercase tracking-widest font-bold">Análisis de sensibilidad no disponible</p>
      </div>
    );
  }

  return (
    <div className="h-64 w-full px-2" role="img" aria-label={t.sensitivityAnalysisAlt}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={data} 
          layout="vertical" 
          margin={{ left: 80, right: 30, top: 10, bottom: 10 }}
          stackOffset="sign"
        >
          <title>{t.sensitivityMatrix}</title>
          <desc>{t.sensitivityAnalysisDesc}</desc>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={isDark ? '#1e293b' : '#f1f5f9'} />
          <XAxis type="number" hide />
          <YAxis 
            dataKey="displayName" 
            type="category" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 9, fill: isDark ? '#64748b' : '#64748b', width: 100, fontWeight: isHighContrast ? 'bold' : 'normal' }}
            width={80}
          />
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: isDark ? '#0f172a' : '#fff', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '10px', color: isDark ? '#f1f5f9' : '#0f172a' }}
            cursor={{ fill: isDark ? '#1e293b' : '#f8fafc' }}
            formatter={(value: number) => [`${value > 0 ? '+' : ''}${value}%`, t.weightedImpact]}
          />
          <ReferenceLine x={0} stroke={isDark ? '#334155' : '#cbd5e1'} strokeWidth={isHighContrast ? 2 : 1} />
          <Bar dataKey="impact" name={t.weightedImpact} radius={[2, 2, 2, 2]} barSize={16}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.impact >= 0 ? currentColors.rose : currentColors.blue} />
            ))}
            <LabelList 
              dataKey="impact" 
              content={(props: any) => {
                const { x, y, width, height, value } = props;
                const sign = value >= 0 ? 1 : -1;
                const xPos = sign > 0 ? x + (width || 0) + 5 : x - 35;
                return (
                  <text 
                    x={xPos} 
                    y={(y || 0) + (height || 0) / 2 + 3} 
                    fill={isDark ? '#64748b' : '#94a3b8'} 
                    fontSize="8" 
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    {value > 0 ? '+' : ''}{value}%
                  </text>
                );
              }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function DistributionChart({ result }: Props) {
  const { theme, isHighContrast } = useTheme();
  const { t } = useLanguage();
  const isDark = theme === 'dark';
  const currentColors = isHighContrast ? HIGH_CONTRAST_COLORS : COLORS;
  const [scale, setScale] = useState<'linear' | 'log'>('log');
  
  // Stats
  const { stats } = result;

  // Stats formatting helper
  const formatStat = (val: number) => {
    if (val === 0) return '0';
    if (scale === 'log') {
      return Math.log10(val).toFixed(2);
    }
    return val < 0.01 ? val.toExponential(2) : formatNumber(val);
  };

  const legendItems = [
    { label: `Media (◇): ${formatStat(stats.mean)}`, color: isHighContrast ? '#000000' : '#c2410c' },
    { label: `Mediana P50: ${formatStat(stats.median)}`, color: currentColors.blue },
    { label: `P5: ${formatStat(stats.p5)}`, color: currentColors.stone },
    { label: `P10: ${formatStat(stats.p10)}`, color: currentColors.amber },
    { label: `P25: ${formatStat(stats.p25)}`, color: currentColors.emerald },
    { label: `P75: ${formatStat(stats.p75)}`, color: isHighContrast ? '#000000' : '#166534' },
    { label: `P90: ${formatStat(stats.p90)}`, color: isHighContrast ? '#0000FF' : '#92400e' },
    { label: `P95: ${formatStat(stats.p95)}`, color: isHighContrast ? '#000000' : '#a8a29e' },
  ];

  // TOTAL ITERATIONS CONSTANT
  const TOTAL_ITERATIONS = 10000;

  // Adjust data for log scale if necessary
  // To avoid flat curves on log scales, we normalize the density.
  // Area under KDE curve in the visual space should look representative of probability.
  // Adjusted density calculation using dynamic TOTAL_ITERATIONS
  const chartData = result.histogram.map((d, i, arr) => {
    let binWidth = 1;
    if (i < arr.length - 1) {
      binWidth = arr[i+1].x - d.x;
    } else if (i > 0) {
      binWidth = d.x - arr[i-1].x;
    }
    binWidth = Math.max(binWidth, 1e-25);

    // Dynamic total iterations from result if available, fallback to 10000
    const iterations = (result as any).iterations || 10000;
    const density = d.value / (iterations * binWidth);

    return {
      ...d,
      x: d.x,
      displayValue: density 
    };
  });

  return (
    <div className="w-full space-y-4">
      {/* Chart Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-4 w-full">
           <div className="flex items-center gap-2">
             <div className="w-1 h-4 bg-emerald-600 rounded-full" />
             <h4 className="text-[10px] font-bold text-stone-500 dark:text-slate-400 uppercase tracking-widest font-serif">{t.probDistribution} (KDE)</h4>
           </div>
           
           {/* Summary Row */}
           <div className="flex flex-wrap gap-x-4 gap-y-1.5 leading-none">
             {legendItems.map((item, i) => (
               <div key={i} className="flex items-center gap-1.5">
                 <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                 <span className="text-[10px] font-mono text-stone-700 dark:text-slate-300 font-bold whitespace-nowrap opacity-90">{item.label}</span>
               </div>
             ))}
           </div>
        </div>

        <div className="flex bg-stone-100 dark:bg-slate-800 p-1 rounded-lg border border-stone-200 dark:border-slate-700 self-start md:self-auto shrink-0 shadow-inner">
          <button
            onClick={() => setScale('linear')}
            className={`px-3 py-1 text-[9px] font-bold uppercase rounded transition-all ${
              scale === 'linear' 
                ? "bg-white dark:bg-slate-700 text-stone-900 dark:text-slate-100 shadow-md" 
                : "text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 hover:shadow-sm"
            }`}
          >
            {t.scaleLinear}
          </button>
          <button
            onClick={() => setScale('log')}
            className={`px-3 py-1 text-[9px] font-bold uppercase rounded transition-all ${
              scale === 'log' 
                ? "bg-stone-900 dark:bg-slate-100 text-white dark:text-stone-900 shadow-md" 
                : "text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 hover:shadow-sm"
            }`}
          >
            {t.scaleLog}
          </button>
        </div>
      </div>

      <div className="h-[500px] md:h-[600px] w-full bg-[#fdf8f1] dark:bg-slate-900/50 rounded-2xl p-6 border border-stone-100 dark:border-slate-800 transition-colors shadow-inner relative group">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart id="distChart" data={chartData} margin={{ top: 10, right: 10, left: 20, bottom: 20 }}>
            <defs>
              <linearGradient id="kdeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1e634e" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#1e634e" stopOpacity={0.01}/>
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="1 3" 
              vertical={scale === 'linear'} 
              stroke={isDark ? '#334155' : '#e7e5e4'} 
              opacity={0.5}
            />
            <XAxis 
              dataKey="x" 
              type="number"
              scale={scale === 'log' ? 'log' : 'linear'}
              domain={scale === 'log' ? ['auto', 'auto'] : [0, 'auto']}
              axisLine={{ stroke: isDark ? '#334155' : '#d6d3d1' }} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: isDark ? '#94a3b8' : '#78716c', fontFamily: 'monospace' }}
              tickFormatter={(v) => {
                if (v <= 0) return '0';
                if (scale === 'log') {
                  const logValue = Math.log10(v);
                  return `10^${Math.round(logValue)}`;
                }
                return (v === undefined || v === null) ? '0' : (v < 1e-2 ? v.toExponential(2) : v.toLocaleString(undefined, { maximumFractionDigits: 3 }));
              }}
              label={{ value: t.annualCases, position: 'insideBottom', offset: -15, fontSize: 10, fill: '#78716c', fontStyle: 'italic' }}
            />
            <YAxis 
              axisLine={{ stroke: isDark ? '#334155' : '#d6d3d1' }} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: isDark ? '#94a3b8' : '#78716c', fontFamily: 'monospace' }}
              tickFormatter={(v: number) => {
                if (v === 0) return '0';
                const absV = Math.abs(v);
                // Use more precision for ticks to avoid duplicate labels if values are very close
                return (v === undefined || v === null) ? '0' : ((absV < 0.01 || absV >= 10000) ? v.toExponential(2) : v.toLocaleString(undefined, { maximumFractionDigits: 1 }));
              }}
              label={{ value: 'Densidad de Probabilidad', angle: -90, position: 'insideLeft', offset: -5, fontSize: 10, fill: '#78716c', fontStyle: 'italic' }}
            />
            <Tooltip 
              contentStyle={{ 
                borderRadius: '12px', 
                border: 'none', 
                backgroundColor: isDark ? '#0f172a' : '#fff', 
                boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', 
                fontSize: '10px', 
                color: isDark ? '#f1f5f9' : '#0f172a',
                fontFamily: 'monospace'
              }}
              labelFormatter={(v) => `Casos: ${Number(v) < 0.01 ? Number(v).toExponential(3) : Number(v).toFixed(4)}`}
              formatter={(v: number) => [v.toExponential(4), 'Densidad']}
            />
            <Area 
              type="monotone" 
              dataKey="displayValue" 
              stroke={isHighContrast ? "#000000" : "#1e634e"} 
              fill="url(#kdeGradient)" 
              strokeWidth={isHighContrast ? 5 : 3}
              activeDot={{ r: 6, fill: isHighContrast ? '#000000' : '#1e634e', stroke: '#fff', strokeWidth: 2 }}
              animationDuration={2000}
            />
            
            {/* Legend reference lines for percentiles could go here if needed, 
                but for simplicity we keep it clean matching the image line style */}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function EconomicImpactBar({ result }: Props) {
  const { t } = useLanguage();
  const { theme, isHighContrast } = useTheme();
  const isDark = theme === 'dark';
  const currentColors = isHighContrast ? HIGH_CONTRAST_COLORS : COLORS;
  const b = result.economicBreakdown;
  const data = [
    { name: t.medicalCosts, value: b.medical, fill: currentColors.blue },
    { name: t.mortalityCost, value: b.mortality, fill: currentColors.rose },
    { name: t.chronicCost, value: b.chronic, fill: currentColors.amber },
    { name: t.productivityLoss, value: b.productivity, fill: currentColors.indigo },
    { name: t.interventionCosts, value: b.intervention, fill: currentColors.emerald },
  ].sort((a, b) => b.value - a.value);
  
  if (!data || data.length === 0) {
    return (
      <div className="h-48 w-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 gap-2 italic border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
        <AlertCircle className="w-8 h-8 opacity-20" />
        <p className="text-[10px] uppercase tracking-widest font-bold">Sin datos de impacto económico</p>
      </div>
    );
  }
  
  const total = data.reduce((sum, entry) => sum + entry.value, 0);
  
  return (
    <div className="h-48 w-full flex flex-col" role="img" aria-label={t.economicImpactBarAlt}>
      <div className="flex items-center justify-between px-4 py-2 mb-2 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800">
         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Carga Económica Agregada</span>
         <span className="text-sm font-mono font-bold text-emerald-600">{formatCurrency(total)}</span>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 100, right: 60 }}>
          <title>{t.sectorEconomicLoading}</title>
          <desc>{t.economicImpactBarDesc}</desc>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={isDark ? '#1e293b' : '#f1f5f9'} />
          <XAxis type="number" hide />
          <YAxis 
            dataKey="name" 
            type="category" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 9, fill: isDark ? '#64748b' : '#64748b', width: 90, fontWeight: isHighContrast ? 'bold' : 'normal' }}
          />
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: isDark ? '#0f172a' : '#fff', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '10px', color: isDark ? '#f1f5f9' : '#0f172a' }}
            formatter={(value: number) => [formatCurrency(value), t.economy]}
          />
          <Bar dataKey="value" name={t.sectorEconomicLoading} radius={[0, 4, 4, 0]} barSize={24}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
            <LabelList 
              dataKey="value" 
              position="right" 
              formatter={(val: number) => formatCurrency(val)}
              style={{ fontSize: '9px', fontWeight: 'bold', fill: isDark ? '#94a3b8' : '#475569' }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function EconomicImpactPie({ result }: Props) {
  const { t } = useLanguage();
  const { theme, isHighContrast } = useTheme();
  const isDark = theme === 'dark';
  const currentColors = isHighContrast ? HIGH_CONTRAST_COLORS : COLORS;
  const b = result.economicBreakdown;
  const data = [
    { name: t.medicalCosts, value: b.medical, fill: currentColors.blue },
    { name: t.mortalityCost, value: b.mortality, fill: currentColors.rose },
    { name: t.chronicCost, value: b.chronic, fill: currentColors.amber },
    { name: t.productivityLoss, value: b.productivity, fill: currentColors.indigo },
    { name: t.interventionCosts, value: b.intervention, fill: currentColors.emerald },
  ].filter(d => d.value > 0);
  
  const total = data.reduce((sum, entry) => sum + entry.value, 0);

  if (!data || data.length === 0) {
    return (
      <div className="h-64 w-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 gap-2 italic">
        <AlertCircle className="w-8 h-8 opacity-20" />
        <p className="text-[10px] uppercase tracking-widest font-bold">Sin datos para distribución sectorial</p>
      </div>
    );
  }

  return (
    <div className="h-64 w-full pt-4" role="img" aria-label={t.economicImpactPieAlt}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <title>{t.costDistribution}</title>
          <desc>{t.economicImpactPieDesc}</desc>
          <Pie
            data={data}
            nameKey="name"
            dataKey="value"
            cx="50%"
            cy="45%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            stroke="none"
            label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: isDark ? '#0f172a' : '#fff', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '10px', color: isDark ? '#f1f5f9' : '#0f172a' }}
            formatter={(value: number) => [
              `${formatCurrency(value)} (${((value / total) * 100).toFixed(1)}%)`, 
              t.economy
            ]}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36} 
            content={({ payload }) => (
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-4">
                {payload?.map((entry: any, index: number) => (
                  <div key={`item-${index}`} className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{entry.value}</span>
                  </div>
                ))}
              </div>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function DoseResponseChart({ pair, params, illnessProb = 0.5 }: BioProps) {
  const { t } = useLanguage();
  const { theme, isHighContrast } = useTheme();
  const isDark = theme === 'dark';
  const currentColors = isHighContrast ? HIGH_CONTRAST_COLORS : COLORS;
  
  const isExponential = (params.drModel || pair.drModel) === 'exponential';

  const data = Array.from({ length: 61 }, (_, i) => {
    const logDose = i / 6; // from 0 to 10
    const dose = Math.pow(10, logDose);
    
    let pInf = 0;
    if (isExponential) {
      // Exponential Model: P(d) = 1 - exp(-k * d)
      const k = params.k || pair.k || 1.06e-12;
      pInf = 1 - Math.exp(-k * dose);
    } else {
      // Beta-Poisson Model: P(d) = 1 - (1 + d/beta)^(-alpha)
      const alpha = params.alpha !== undefined ? params.alpha : pair.alpha;
      const beta = params.beta !== undefined ? params.beta : pair.beta;
      pInf = 1 - Math.pow(1 + dose / beta, -alpha);
    }
    
    const pIll = pInf * illnessProb;
    return {
      dose: dose,
      logDose: logDose.toFixed(1),
      probInf: Math.min(100, pInf * 100),
      probIll: Math.min(100, pIll * 100)
    };
  });

  return (
    <div className="h-[400px] w-full min-h-[250px] pt-4 relative group">
      <div className="absolute top-6 right-12 z-10 flex flex-col items-end gap-1 pointer-events-none">
        {isExponential ? (
          <div className="flex items-center gap-2 px-2 py-1 bg-white/80 dark:bg-slate-900/80 rounded-md border border-slate-200 dark:border-slate-800 shadow-sm backdrop-blur-sm">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">k (Exp) =</span>
            <span className="text-[10px] font-mono font-bold text-teal-600">{(params.k || pair.k || 1.06e-12).toExponential(2)}</span>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 px-2 py-1 bg-white/80 dark:bg-slate-900/80 rounded-md border border-slate-200 dark:border-slate-800 shadow-sm backdrop-blur-sm">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">α (alfa) =</span>
              <span className="text-[10px] font-mono font-bold text-emerald-600">{params.alpha !== undefined ? params.alpha : pair.alpha}</span>
            </div>
            <div className="flex items-center gap-2 px-2 py-1 bg-white/80 dark:bg-slate-900/80 rounded-md border border-slate-200 dark:border-slate-800 shadow-sm backdrop-blur-sm">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">β (beta) =</span>
              <span className="text-[10px] font-mono font-bold text-blue-600">{(params.beta !== undefined ? params.beta : pair.beta).toExponential(1)}</span>
            </div>
          </>
        )}
      </div>

      <div className="absolute top-6 left-6 z-10 flex items-center gap-2">
         <span className={cn(
           "px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest shadow-sm border",
           isExponential 
             ? "bg-teal-500/10 text-teal-600 border-teal-500/20" 
             : "bg-blue-500/10 text-blue-600 border-blue-500/20"
         )}>
           {isExponential ? 'Modelo Exponencial' : 'Modelo Beta-Poisson'}
         </span>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 20, right: 10, left: -10, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#1e293b' : '#f1f5f9'} />
          <XAxis 
            dataKey="logDose" 
            axisLine={{ stroke: isDark ? '#334155' : '#e2e8f0' }} 
            tickLine={false} 
            tick={{ fontSize: 9, fill: isDark ? '#64748b' : '#94a3b8' }}
            tickFormatter={(v) => `10^${v}`}
            label={{ value: 'Dosis (UFC)', position: 'insideBottom', offset: -10, fontSize: 10, fill: isDark ? '#64748b' : '#64748b', fontWeight: 'bold' }}
          />
          <YAxis 
            axisLine={{ stroke: isDark ? '#334155' : '#e2e8f0' }} 
            tickLine={false} 
            tick={{ fontSize: 9, fill: isDark ? '#64748b' : '#94a3b8' }}
            tickFormatter={(v) => `${v}%`}
            label={{ value: 'Probabilidad', angle: -90, position: 'insideLeft', offset: 15, fontSize: 10, fill: isDark ? '#64748b' : '#64748b' }}
          />
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: isDark ? '#0f172a' : '#fff', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontSize: '10px', color: isDark ? '#f1f5f9' : '#0f172a' }}
            formatter={(val: number, name: string) => [
               val.toFixed(4) + '%', 
               name === 'probInf' ? t.probInfection : t.probIllness
            ]}
            labelFormatter={(label) => `Dosis: 10^${label} UFC`}
          />
          <Legend 
            verticalAlign="top" 
            align="center"
            content={({ payload }) => (
              <div className="flex justify-center gap-6 mb-6">
                <div className="flex items-center gap-1.5">
                  <div className={cn("w-5 h-0.5 border-t-2 border-dashed", isHighContrast ? "border-blue-700" : "border-blue-800 dark:border-blue-400")} />
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">{t.probInfection}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className={cn("w-5 h-3 border rounded-sm", isHighContrast ? "bg-emerald-500 border-black" : "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500")} />
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">{t.probIllness}</span>
                </div>
              </div>
            )}
          />
          <Area 
            type="monotone" 
            dataKey="probInf" 
            name="probInf"
            stroke={isHighContrast ? '#0000FF' : (isDark ? '#3b82f6' : '#1e40af')} 
            strokeDasharray="5 5"
            fill="transparent"
            strokeWidth={isHighContrast ? 4 : 2} 
            animationDuration={1500}
            activeDot={{ r: 4, strokeWidth: 0 }}
          />
          <Area 
            type="monotone" 
            dataKey="probIll" 
            name="probIll"
            stroke={currentColors.emerald} 
            fill={currentColors.emerald} 
            fillOpacity={isHighContrast ? 0.3 : 0.08} 
            strokeWidth={isHighContrast ? 4 : 3} 
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function InactivationChart({ pair, params }: BioProps) {
  const { theme, isHighContrast } = useTheme();
  const isDark = theme === 'dark';
  const currentColors = isHighContrast ? HIGH_CONTRAST_COLORS : COLORS;

  const delta = params.delta !== undefined ? params.delta : pair.delta;
  const p = params.p !== undefined ? params.p : pair.p;
  const inactivationTime = params.inactivationTime !== undefined ? params.inactivationTime : pair.inactivationTime;

  const data = Array.from({ length: 41 }, (_, i) => {
    const t = i * (inactivationTime / 10 || 0.5); // scaled to inactivation time
    const red = delta > 0 ? Math.pow(t / delta, p) : 0;
    return {
      t: t.toFixed(1),
      reduction: -Math.min(10, red)
    };
  });

  return (
    <div className="h-[400px] w-full min-h-[250px] pt-4 relative group">
      <div className="absolute top-6 right-12 z-10 flex flex-col items-end gap-1 pointer-events-none">
        <div className="flex items-center gap-2 px-2 py-1 bg-white/80 dark:bg-slate-900/80 rounded-md border border-slate-200 dark:border-slate-800 shadow-sm backdrop-blur-sm">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">p (forma) =</span>
          <span className="text-[10px] font-mono font-bold text-rose-600">{p.toFixed(2)}</span>
        </div>
        <div className="flex items-center gap-2 px-2 py-1 bg-white/80 dark:bg-slate-900/80 rounded-md border border-slate-200 dark:border-slate-800 shadow-sm backdrop-blur-sm">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">δ (min) =</span>
          <span className="text-[10px] font-mono font-bold text-slate-700 dark:text-slate-200">{delta.toFixed(2)}</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#1e293b' : '#f1f5f9'} />
          <XAxis 
            dataKey="t" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 9, fill: isDark ? '#64748b' : '#94a3b8' }}
            label={{ value: 'Tiempo (min)', position: 'insideBottom', offset: -10, fontSize: 10, fill: isDark ? '#64748b' : '#64748b', fontWeight: 'bold' }}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 9, fill: isDark ? '#64748b' : '#94a3b8' }}
            tickFormatter={(v) => `${v}L`}
          />
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: isDark ? '#0f172a' : '#fff', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontSize: '10px', color: isDark ? '#f1f5f9' : '#0f172a' }}
            formatter={(val: number) => [Math.abs(val).toFixed(2) + ' Log₁₀', 'Reducción']}
            labelFormatter={(label) => `Tiempo: ${label} min`}
          />
          <Area 
            type="monotone" 
            dataKey="reduction" 
            stroke={currentColors.rose} 
            fill={currentColors.rose} 
            fillOpacity={0.1}
            strokeWidth={isHighContrast ? 6 : 4} 
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function RiskExceedanceChart({ result }: Props) {
  const { theme, isHighContrast } = useTheme();
  const { t } = useLanguage();
  const isDark = theme === 'dark';
  const currentColors = isHighContrast ? HIGH_CONTRAST_COLORS : COLORS;
  const [scale, setScale] = useState<'linear' | 'log'>('log');
  const [yScale, setYScale] = useState<'linear' | 'log'>('linear');
  
  const data = result.cumulativeData || [];

  if (data.length < 5) {
    return (
      <div className="h-64 w-full flex flex-col items-center justify-center text-stone-400 dark:text-slate-600 gap-2 italic">
        <TrendingUp className="w-8 h-8 opacity-20" />
        <p className="text-[10px] uppercase tracking-widest font-bold">Datos insuficientes para excedencia</p>
      </div>
    );
  }

  // Find reference values for exceedance thresholds
  // P50 = 50% exceedance, P90 = 10% exceedance, etc.
  const findValue = (threshold: number) => {
    const point = [...data].reverse().find(d => d.exceedance >= threshold);
    return point ? point.x : null;
  };

  const p50 = findValue(50);
  const p90 = findValue(10);
  const p95 = findValue(5);
  const p99 = findValue(1);

  const refLines = [
    { label: 'P50', value: p50, threshold: 50, color: currentColors.blue },
    { label: 'P90', value: p90, threshold: 10, color: currentColors.amber },
    { label: 'P95', value: p95, threshold: 5, color: currentColors.rose },
    { label: 'P99', value: p99, threshold: 1, color: isDark ? '#f1f5f9' : '#000' }
  ].filter(l => l.value !== null);

  const formatTick = (v: number) => {
    if (v <= 0) return '0';
    if (scale === 'log') {
      const log = Math.log10(v);
      return `10^${log.toFixed(0)}`;
    }
    return v >= 10000 ? v.toExponential(2) : formatNumber(v);
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-between items-center px-2">
        <div className="flex flex-wrap gap-4">
          {refLines.map((l, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <div className="w-2.5 h-0.5" style={{ backgroundColor: l.color }} />
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">
                {l.label}: {l.value ? (l.value < 100 ? l.value.toFixed(1) : formatNumber(l.value)) : '-'}
              </span>
            </div>
          ))}
        </div>
        
        <div className="flex bg-stone-100 dark:bg-slate-800 p-0.5 rounded-lg border border-stone-200 dark:border-slate-700 shadow-inner shrink-0">
          <div className="flex items-center px-1 border-r border-stone-200 dark:border-slate-700 mr-1">
             <span className="text-[7px] font-bold text-stone-400 uppercase mr-1">Eje X:</span>
             <button
               onClick={() => setScale('linear')}
               className={cn(
                 "px-1.5 py-0.5 text-[8px] font-black uppercase rounded transition-all",
                 scale === 'linear' 
                   ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm" 
                   : "text-slate-400 hover:text-slate-600"
               )}
             >
               Lin
             </button>
             <button
               onClick={() => setScale('log')}
               className={cn(
                 "px-1.5 py-0.5 text-[8px] font-black uppercase rounded transition-all",
                 scale === 'log' 
                   ? "bg-slate-900 dark:bg-slate-200 text-white dark:text-slate-900 shadow-sm" 
                   : "text-slate-400 hover:text-slate-600"
               )}
             >
               Log
             </button>
          </div>
          
          <div className="flex items-center px-1">
             <span className="text-[7px] font-bold text-stone-400 uppercase mr-1">Eje Y:</span>
             <button
               onClick={() => setYScale('linear')}
               className={cn(
                 "px-1.5 py-0.5 text-[8px] font-black uppercase rounded transition-all",
                 yScale === 'linear' 
                   ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm" 
                   : "text-slate-400 hover:text-slate-600"
               )}
             >
               Lin
             </button>
             <button
               onClick={() => setYScale('log')}
               className={cn(
                 "px-1.5 py-0.5 text-[8px] font-black uppercase rounded transition-all",
                 yScale === 'log' 
                   ? "bg-slate-900 dark:bg-slate-200 text-white dark:text-slate-900 shadow-sm" 
                   : "text-slate-400 hover:text-slate-600"
               )}
             >
               Log
             </button>
          </div>
        </div>
      </div>

      <div className="h-[400px] md:h-[450px] w-full bg-[#fffaf5] dark:bg-slate-900/40 rounded-2xl p-4 border border-stone-100 dark:border-slate-800 shadow-inner">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart 
            id="exceedanceChart"
            data={data.map(d => ({ ...d, exceedance: d.exceedance <= 0 ? 1e-6 : d.exceedance }))} 
            margin={{ top: 25, right: 30, left: 10, bottom: 20 }}
          >
            <defs>
              <linearGradient id="exceedanceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={currentColors.rose} stopOpacity={0.25}/>
                <stop offset="95%" stopColor={currentColors.rose} stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="1 4" 
              vertical={scale === 'linear'} 
              stroke={isDark ? '#334155' : '#e2e8f0'} 
            />
            <XAxis 
              dataKey="x" 
              type="number"
              scale={scale === 'log' ? 'log' : 'linear'}
              domain={scale === 'log' ? ['auto', 'auto'] : ['auto', 'auto']}
              axisLine={{ stroke: isDark ? '#334155' : '#d6d3d1' }} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: isDark ? '#94a3b8' : '#78716c', fontFamily: 'monospace' }}
              tickFormatter={formatTick}
              label={{ value: t.annualCases, position: 'insideBottom', offset: -10, fontSize: 10, fill: '#78716c', fontStyle: 'italic' }}
            />
            <YAxis 
              scale={yScale === 'log' ? 'log' : 'linear'}
              domain={yScale === 'log' ? [0.001, 100] : [0, 100]}
              axisLine={{ stroke: isDark ? '#334155' : '#d6d3d1' }} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: isDark ? '#94a3b8' : '#78716c', fontFamily: 'monospace' }}
              tickFormatter={(v) => yScale === 'log' ? (v < 1 ? v.toExponential(1) : v.toString()) : `${v}%`}
              label={{ value: 'Probabilidad de Excedencia (%)', angle: -90, position: 'insideLeft', offset: 0, fontSize: 10, fill: '#78716c', fontStyle: 'italic' }}
            />
            <Tooltip 
              contentStyle={{ 
                borderRadius: '12px', 
                border: 'none', 
                backgroundColor: isDark ? '#0f172a' : '#fff', 
                boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', 
                fontSize: '10px', 
                color: isDark ? '#f1f5f9' : '#0f172a',
                fontFamily: 'monospace'
              }}
              formatter={(val: number) => [`${val.toFixed(3)}%`, 'Prob. Excedencia']}
              labelFormatter={(v) => `Casos > ${Number(v) >= 10000 ? Number(v).toExponential(2) : formatNumber(Number(v))}`}
            />
            {refLines.map((l, i) => (
              <ReferenceLine 
                key={i}
                x={l.value!} 
                y1={0}
                y2={l.threshold}
                stroke={l.color} 
                strokeDasharray="3 3" 
                strokeWidth={2}
                label={{ 
                  value: `${l.label}: ${l.value! >= 10000 ? l.value!.toExponential(1) : formatNumber(l.value!)}`, 
                  position: 'top', 
                  fill: l.color, 
                  fontSize: 10, 
                  fontWeight: 'bold',
                  fontFamily: 'monospace'
                }} 
              />
            ))}
            <Area 
              type="monotone" 
              dataKey="exceedance" 
              stroke={currentColors.rose} 
              fill="url(#exceedanceGradient)" 
              strokeWidth={isHighContrast ? 5 : 3}
              activeDot={{ r: 6, fill: currentColors.rose, stroke: '#fff', strokeWidth: 2 }}
              animationDuration={2500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function SeverityProfile({ pair }: BioProps) {
  const { t } = useLanguage();
  const { theme, isHighContrast } = useTheme();
  const isDark = theme === 'dark';
  const currentColors = isHighContrast ? HIGH_CONTRAST_COLORS : COLORS;

  const metrics = [
    { name: t.fatalityRate, value: pair.mortalityRate * 100, color: currentColors.rose, icon: '💀' },
    { name: t.hospRate, value: pair.hospRate * 100, color: currentColors.amber, icon: '🏥' },
    { name: t.chronicCol || 'Cronicidad', value: (pair.chronicRate || 0) * 100, color: currentColors.orange, icon: '⏳' },
    { name: t.illnessProb, value: pair.illnessProb * 100, color: currentColors.emerald, icon: '🤢' },
  ];

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="grid grid-cols-2 gap-4">
        {metrics.map((m, i) => (
          <div key={i} className="flex flex-col justify-center p-3 bg-stone-50 dark:bg-slate-800/50 rounded-xl border border-stone-100 dark:border-slate-800 transition-colors shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">{m.icon}</span>
              <span className="text-[10px] font-bold text-stone-400 dark:text-slate-500 uppercase tracking-wider leading-tight">{m.name}</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-serif font-bold text-stone-800 dark:text-slate-100">{m.value.toFixed(1)}</span>
              <span className="text-xs text-stone-400 font-bold">%</span>
            </div>
            <div className="w-full bg-stone-200 dark:bg-slate-700 h-1 rounded-full mt-2 overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${m.value}%`, backgroundColor: m.color }} />
            </div>
          </div>
        ))}
      </div>
      
      {pair.sequelae && pair.sequelae.length > 0 && (
        <div className="bg-stone-50 dark:bg-slate-800/80 p-4 rounded-xl border border-stone-100 dark:border-slate-800 transition-colors">
          <div className="text-[9px] font-bold text-stone-400 dark:text-slate-500 uppercase tracking-widest mb-3">Secuelas Específicas:</div>
          <div className="space-y-3">
            {pair.sequelae.map(s => (
              <div key={s.id} className="space-y-1.5">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-bold text-stone-700 dark:text-slate-300">{s.name}</span>
                  <span className="text-[9px] font-mono font-bold text-orange-500">{(s.rate * 100).toFixed(2)}%</span>
                </div>
                <div className="grid grid-cols-2 gap-x-4 text-[8px] text-stone-500 dark:text-slate-500 italic">
                  <span>DW: {s.dalyWeight.toFixed(2)} | {s.durationYears} años</span>
                  <span className="text-right">Coste: ~{formatCurrency(s.annualDirectCost)}/año</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
