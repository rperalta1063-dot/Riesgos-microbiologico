import { useState, useCallback } from 'react';
import { SimulationParams, SimulationResult } from '../types';
import { runMonteCarloAsync } from '../lib/simulation';

export function useMonteCarlo() {
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const runSimulation = useCallback(async (params: SimulationParams, iterations: number, simulations: number) => {
    setIsSimulating(true);
    setProgress(0);
    setError(null);

    try {
      // Orchestrate multiple simulation runs if needed (stochastic uncertainty)
      const totalIterations = iterations * simulations;

      // Small delay to allow UI to breathe before heavy worker spin-up
      await new Promise(r => setTimeout(r, 100));

      const r = await runMonteCarloAsync(params, totalIterations, (p) => {
        setProgress(p);
      });

      setResult(r);
      return r;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Simulation Execution Failed';
      console.error("Simulation Execution Failed [Kernel Error]:", err);
      setError(errorMessage);
      throw err;
    } finally {
      setIsSimulating(false);
      setProgress(0);
    }
  }, []);

  const runComparison = useCallback(async (params: SimulationParams, iterations: number) => {
    setIsSimulating(true);
    setProgress(0);
    setError(null);
    try {
      // 1. Run Baseline
      const baseline = await runMonteCarloAsync(params, iterations, (p) => setProgress(p / 2));
      
      // 2. Run Intervention (HACCP)
      const haccpParams: SimulationParams = {
        ...params,
        prevalence: Math.max(0, params.prevalence * 0.5),
        initialLogMean: params.initialLogMean - 1.5,
        initialLogStd: Math.max(0.1, params.initialLogStd * 0.7),
        processingDeltaLog: params.processingDeltaLog - 1.0,
      };
      
      const intervention = await runMonteCarloAsync(haccpParams, iterations, (p) => setProgress(50 + (p / 2)));
      
      setResult(intervention);
      return { baseline, intervention };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Comparison Run Failed';
      console.error("Comparison Run Failed:", err);
      setError(errorMessage);
      throw err;
    } finally {
      setIsSimulating(false);
      setProgress(0);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setIsSimulating(false);
    setProgress(0);
    setError(null);
  }, []);

  return {
    result,
    isSimulating,
    progress,
    error,
    runSimulation,
    runComparison,
    reset
  };
}
