import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(n: number) {
  if (n === undefined || n === null || isNaN(n)) return '0';
  return n.toLocaleString('es-ES', { maximumFractionDigits: 0 });
}

export function formatDecimal(n: number, d = 2) {
  if (n === undefined || n === null || isNaN(n)) return '0,00';
  return n.toLocaleString('es-ES', { minimumFractionDigits: d, maximumFractionDigits: d });
}

export function formatCurrency(n: number) {
  if (n === undefined || n === null || isNaN(n)) return '$0';
  if (n >= 1e9) return `$${(n / 1e9).toLocaleString('es-ES', { maximumFractionDigits: 1 })}B`;
  if (n >= 1e6) return `$${(n / 1e6).toLocaleString('es-ES', { maximumFractionDigits: 1 })}M`;
  if (n >= 1e3) return `$${(n / 1e3).toLocaleString('es-ES', { maximumFractionDigits: 0 })}K`;
  return `$${n.toLocaleString('es-ES', { maximumFractionDigits: 0 })}`;
}

export function formatScientific(n: number) {
  if (n === 0) return '0';
  return n.toExponential(1);
}

/**
 * Unifies data preprocessing for QMRA results.
 * Filters non-positive values, sorts, and optionally transforms.
 */
export function preprocessSimulationData(data: Float64Array | number[]) {
  const values = Array.from(data).filter(v => v > 0);
  const sorted = new Float64Array(values).sort();
  
  return {
    raw: sorted,
    log10: sorted.map(v => Math.log10(v)),
    count: sorted.length
  };
}
