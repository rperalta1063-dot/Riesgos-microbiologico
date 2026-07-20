import React, { useState, useCallback, useEffect, createContext, useContext } from 'react';
import { Country, PathogenPair, SimulationParams, SimulationResult, SimulationPreset, PopulationType } from '../types';
import { useMonteCarlo } from './useMonteCarlo';
import { COUNTRIES } from '../data/countries';
import { PAIRS } from '../data/pairs';
import FACTORS from '../data/susceptibility_factors.json';

interface SimulationContextType {
  country: Country;
  setCountry: (c: Country) => void;
  pair: PathogenPair;
  setPair: (p: PathogenPair) => void;
  params: SimulationParams;
  activeParams: SimulationParams;
  updateParam: (key: keyof SimulationParams, value: any) => void;
  iterations: number;
  setIterations: (v: number) => void;
  simulations: number;
  setSimulations: (v: number) => void;
  isHaccpEnabled: boolean;
  setIsHaccpEnabled: (v: boolean) => void;
  servingMode: 'frequency' | 'annual';
  setServingMode: (v: 'frequency' | 'annual') => void;
  weeklyFrequency: number;
  setWeeklyFrequency: (v: number) => void;
  result: SimulationResult | null;
  isSimulating: boolean;
  progress: number;
  reset: () => void;
  run: () => void;
  runComparison: () => void;
  updateDistribution: (key: string, config: any) => void;
  updatePopulation: (type: PopulationType, fs?: number) => void;
  togglePopulationGroup: (type: PopulationType) => void;
  updateGroupProportion: (type: PopulationType, proportion: number) => void;
  updateEconomicParams: (params: Partial<NonNullable<SimulationParams['economicParams']>>) => void;
  updateMitigation: (params: Partial<NonNullable<SimulationParams['mitigation']>>) => void;
  popFactors: any;
  
  // Presets
  presets: SimulationPreset[];
  savePreset: (name: string) => void;
  loadPreset: (id: string) => void;
  deletePreset: (id: string) => void;
}

const SimulationContext = createContext<SimulationContextType | null>(null);

export function SimulationProvider({ children }: { children: React.ReactNode }) {
  const [country, setCountry] = useState<Country>(COUNTRIES[0]);
  const [pair, setPair] = useState<PathogenPair>(PAIRS[0]);
  const [params, setParams] = useState<SimulationParams>(() => ({
    ...PAIRS[0],
    populationSize: COUNTRIES[0].pop,
    servingsPerYear: COUNTRIES[0].servings * COUNTRIES[0].pop,
    costHosp: COUNTRIES[0].costHosp,
    costAmb: COUNTRIES[0].costAmb,
    costAbsence: COUNTRIES[0].costAbs,
    costDeath: COUNTRIES[0].vsl,
    costInterventionPerCase: 50,
    selectedVulnerableGroups: [],
    groupSusceptibilityFactors: {},
    customFS: 1
  }));
  
  const [iterations, setIterations] = useState(10000);
  const [simulations, setSimulations] = useState(1);
  const [isHaccpEnabled, setIsHaccpEnabled] = useState(false);
  const [servingMode, setServingMode] = useState<'frequency' | 'annual'>('annual');
  const [weeklyFrequency, setWeeklyFrequency] = useState(1);
  
  const mc = useMonteCarlo();

  // Presets State
  const [presets, setPresets] = useState<SimulationPreset[]>(() => {
    const saved = localStorage.getItem('probrisk_presets');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('probrisk_presets', JSON.stringify(presets));
  }, [presets]);

  const savePreset = (name: string) => {
    const newPreset: SimulationPreset = {
      id: Math.random().toString(36).substring(7),
      name,
      createdAt: new Date().toISOString(),
      countryId: country.id,
      pairId: pair.id,
      params: { ...params },
      iterations,
      simulations
    };
    setPresets(prev => [newPreset, ...prev]);
  };

  const loadPreset = (id: string) => {
    const preset = presets.find(p => p.id === id);
    if (!preset) return;

    const targetCountry = COUNTRIES.find(c => c.id === preset.countryId) || COUNTRIES[0];
    const targetPair = PAIRS.find(p => p.id === preset.pairId) || PAIRS[0];

    // Important order of operations to avoid override by the country/pair sync useEffect
    setCountry(targetCountry);
    setPair(targetPair);
    setIterations(preset.iterations || 10000);
    setSimulations(preset.simulations || 1);
    
    // We update params slightly after to ensure they apply over the country/pair defaults
    setTimeout(() => {
      setParams(prev => ({
        ...prev,
        ...preset.params,
        // Ensure core IDs remain synced in case they were modified
        id: targetPair.id,
        populationSize: targetCountry.pop
      }));
    }, 0);
  };

  const deletePreset = (id: string) => {
    setPresets(prev => prev.filter(p => p.id !== id));
  };

  // Sync servings when frequency changes in frequency mode
  useEffect(() => {
    if (servingMode === 'frequency') {
      setParams(prev => ({
        ...prev,
        weeklyConsumption: weeklyFrequency,
        servingsPerYear: weeklyFrequency * 52 * country.pop
      }));
    } else {
      setParams(prev => ({
        ...prev,
        weeklyConsumption: undefined
      }));
    }
  }, [weeklyFrequency, servingMode, country.pop]);

  const activeParams = isHaccpEnabled ? {
    ...params,
    prevalence: Math.max(0, params.prevalence * 0.5),
    initialLogMean: params.initialLogMean - 1.5,
    initialLogStd: Math.max(0.1, params.initialLogStd * 0.7),
    processingDeltaLog: params.processingDeltaLog - 1.0
  } : params;

  useEffect(() => {
    setParams(prev => ({
      ...pair,
      populationSize: country.pop,
      servingsPerYear: country.servings * country.pop,
      costHosp: country.costHosp,
      costAmb: country.costAmb,
      costAbsence: country.costAbs,
      costDeath: country.vsl,
      costInterventionPerCase: prev.costInterventionPerCase || 50,
      selectedVulnerableGroups: prev.selectedVulnerableGroups || [],
      groupSusceptibilityFactors: prev.groupSusceptibilityFactors || {},
      customFS: prev.customFS || 1
    }));
    
    // Also sync weekly frequency if in that mode
    if (servingMode === 'frequency') {
      setWeeklyFrequency(country.servings / 52);
    }
  }, [country.id, pair.id]);

  const updateParam = (key: string, value: any) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  const updatePopulation = (type: PopulationType, fs?: number) => {
    setParams(prev => {
      let finalFS = fs;
      if (type !== 'custom') {
        const factorData = (FACTORS as any[]).find(f => f.pathogen === prev.pathogen);
        if (factorData) {
          if (type === 'general') finalFS = 1;
          else if (type === 'children') finalFS = factorData.children;
          else if (type === 'elderly') finalFS = factorData.elderly;
          else if (type === 'immunocompromised') finalFS = factorData.immunocompromised;
        } else {
          finalFS = 1;
        }
      }
      return { ...prev, populationType: type as any, customFS: finalFS || 1 };
    });
  };

  const togglePopulationGroup = (type: PopulationType) => {
    setParams(prev => {
      const currentGroups = prev.selectedVulnerableGroups || [];
      const isSelected = currentGroups.includes(type);
      const newGroups = isSelected
        ? currentGroups.filter(g => g !== type)
        : [...currentGroups, type];
      
      const factorData = (FACTORS as any[]).find(f => f.pathogen === prev.pathogen);
      const newFactors = { ...(prev.groupSusceptibilityFactors || {}) };
      const newProportions = { ...(prev.groupProportions || {}) };
      
      if (!isSelected) {
        let fs = 1;
        let proportion = 0.1; // Default 10%
        
        if (type === 'general') {
          fs = 1;
          proportion = 1.0;
        } else if (type === 'children') {
          fs = factorData?.children || 1;
          proportion = 0.08; // WHO/UN approx for children < 5
        } else if (type === 'elderly') {
          fs = factorData?.elderly || 1;
          proportion = 0.12; // WHO/UN approx for elderly > 65
        } else if (type === 'immunocompromised') {
          fs = factorData?.immunocompromised || 1;
          proportion = 0.05; // Typical susceptible population
        }
        
        newFactors[type] = fs;
        newProportions[type] = proportion;
      } else {
        delete newFactors[type];
        delete newProportions[type];
      }

      return { 
        ...prev, 
        selectedVulnerableGroups: newGroups, 
        groupSusceptibilityFactors: newFactors,
        groupProportions: newProportions
      };
    });
  };

  const updateGroupProportion = (type: PopulationType, proportion: number) => {
    setParams(prev => ({
      ...prev,
      groupProportions: {
        ...(prev.groupProportions || {}),
        [type]: proportion
      }
    }));
  };

  const updateEconomicParams = (newParams: Partial<NonNullable<SimulationParams['economicParams']>>) => {
    setParams(prev => {
      const updatedNested = {
        costPerCase: prev.economicParams?.costPerCase ?? 500,
        costPerHospitalization: prev.economicParams?.costPerHospitalization ?? 5000,
        costPerDeath: prev.economicParams?.costPerDeath ?? 50000,
        costPerDALY: prev.economicParams?.costPerDALY ?? 25000,
        ...newParams
      };

      return {
        ...prev,
        economicParams: updatedNested,
        // Sync top-level parameters used by the engine
        costHosp: updatedNested.costPerHospitalization,
        costDeath: updatedNested.costPerDeath,
        // costAmb is not directly in economicParams, but we can map costPerCase to it if we assume costPerCase is the "mild case" cost
        costAmb: updatedNested.costPerCase,
        // We'll keep the others as they are for now, or map them if appropriate
      };
    });
  };

  const updateMitigation = (newParams: Partial<NonNullable<SimulationParams['mitigation']>>) => {
    setParams(prev => ({
      ...prev,
      mitigation: {
        reductionLog: prev.mitigation?.reductionLog ?? 0,
        complianceRate: prev.mitigation?.complianceRate ?? 1,
        storageTemp: prev.mitigation?.storageTemp ?? 4,
        processingAdjustment: prev.mitigation?.processingAdjustment ?? 0,
        retailAdjustment: prev.mitigation?.retailAdjustment ?? 0,
        preparationAdjustment: prev.mitigation?.preparationAdjustment ?? 0,
        ...newParams
      }
    }));
  };

  const updateDistribution = (key: string, config: any) => {
    setParams(prev => {
      const distributions = { ...(prev.distributions || {}) };
      if (config === null || config.type === 'fixed') {
        delete distributions[key];
      } else {
        distributions[key] = config;
      }
      return { ...prev, distributions };
    });
  };

  const reset = useCallback(() => {
    setCountry(COUNTRIES[0]);
    setPair(PAIRS[0]);
    setParams({
      ...PAIRS[0],
      populationSize: COUNTRIES[0].pop,
      servingsPerYear: COUNTRIES[0].servings * COUNTRIES[0].pop,
      costHosp: COUNTRIES[0].costHosp,
      costAmb: COUNTRIES[0].costAmb,
      costAbsence: COUNTRIES[0].costAbs,
      costDeath: COUNTRIES[0].vsl,
      costInterventionPerCase: 50,
    });
    setIterations(10000);
    setSimulations(1);
    setIsHaccpEnabled(false);
    setServingMode('annual');
    setWeeklyFrequency(1);
    mc.reset();
  }, [mc]);

  const run = useCallback(() => mc.runSimulation(activeParams, iterations, simulations), [activeParams, iterations, simulations, mc]);

  const runComparison = useCallback(() => mc.runComparison(params, iterations), [params, iterations, mc]);
  
  const popFactors = (FACTORS as any[]).find(f => f.pathogen === pair.pathogen) || {};

  const value = {
    country, setCountry,
    pair, setPair,
    params, activeParams, updateParam,
    iterations, setIterations,
    simulations, setSimulations,
    isHaccpEnabled, setIsHaccpEnabled,
    servingMode, setServingMode,
    weeklyFrequency, setWeeklyFrequency,
    result: mc.result, 
    isSimulating: mc.isSimulating, 
    progress: mc.progress,
    reset,
    presets, savePreset, loadPreset, deletePreset,
    run,
    runComparison,
    updateDistribution,
    updatePopulation,
    togglePopulationGroup,
    updateGroupProportion,
    updateEconomicParams,
    updateMitigation,
    popFactors
  };

  return (
    <SimulationContext.Provider value={value}>
      {children}
    </SimulationContext.Provider>
  );
}

export function useSimulation() {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return context;
}
