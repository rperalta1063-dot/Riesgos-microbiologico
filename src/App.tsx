/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Dashboard from './components/Dashboard';
import { LanguageProvider } from './hooks/useLanguage';
import { ThemeProvider } from './hooks/useTheme';
import { SimulationProvider } from './hooks/useSimulation';

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <SimulationProvider>
          <div className="antialiased min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            <Dashboard />
          </div>
        </SimulationProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
