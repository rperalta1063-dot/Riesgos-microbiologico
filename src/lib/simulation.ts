import { SimulationParams, SimulationResult } from '../types';
import { MonteCarloEngine } from './engine/MonteCarloEngine';

const engine = new MonteCarloEngine();

/**
 * Runs the Monte Carlo simulation asynchronously in a Web Worker if possible.
 */
export async function runMonteCarloAsync(
  p: SimulationParams, 
  iterations: number, 
  onProgress?: (progress: number) => void
): Promise<SimulationResult> {
  return new Promise((resolve, reject) => {
    try {
      const worker = new Worker(new URL('./simulation.worker.ts', import.meta.url), { type: 'module' });
      
      worker.onmessage = (e) => {
        const { type, progress, result, error } = e.data;
        if (type === 'progress' && onProgress) {
          onProgress(progress || 0);
        } else if (type === 'result') {
          worker.terminate();
          resolve(result);
        } else if (type === 'error') {
          worker.terminate();
          reject(new Error(error));
        }
      };
      
      worker.onerror = (err) => {
        worker.terminate();
        reject(err);
      };
      
      worker.postMessage({ p, iterations });
    } catch (error) {
      // Fallback if worker fails (e.g. environment doesn't supported workers)
      console.warn('Simulation worker failed to initialize, falling back to main thread:', error);
      resolve(runMonteCarlo(p, iterations));
    }
  });
}

/**
 * Runs the Monte Carlo simulation on the main thread.
 * Warning: This will block the UI for large iteration counts.
 */
export function runMonteCarlo(p: SimulationParams, iterations: number): SimulationResult {
  return engine.run(p, iterations);
}
