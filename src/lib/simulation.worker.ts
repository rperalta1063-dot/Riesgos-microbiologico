import { SimulationParams } from '../types';
import { MonteCarloEngine } from './engine/MonteCarloEngine';

const engine = new MonteCarloEngine();

self.onmessage = async (e: MessageEvent) => {
  const { p, iterations } = e.data;
  
  try {
    const result = engine.run(p, iterations, (progress) => {
      self.postMessage({ type: 'progress', progress });
    });
    self.postMessage({ type: 'result', result });
  } catch (error) {
    console.error('Worker simulation error:', error);
    self.postMessage({ type: 'error', error: String(error) });
  }
};
