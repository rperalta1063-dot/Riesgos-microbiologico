/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Country {
  id: string;
  flag: string;
  name: string;
  sub: string;
  pop: number;
  vsl: number;
  costHosp: number;
  costAmb: number;
  costAbs: number;
  servings: number;
}

export interface PathogenPair {
  id: string;
  icon: string;
  pathogen: string;
  food: string;
  description?: string;
  risk: 'h' | 'm' | 'l';
  isViral?: boolean;
  drModel?: 'beta-poisson' | 'exponential';
  alpha: number;
  beta: number;
  k?: number;
  illnessProb: number;
  hospRate: number;
  mortalityRate: number;
  absenceDays: number;
  prevalence: number;
  initialLogMean: number;
  initialLogStd: number;
  servingSize: number;
  processingDeltaLog: number;
  transportDeltaLog: number;
  distributionDeltaLog: number;
  preparationDeltaLog: number;
  growthRate: number;
  growthTime: number;
  delta: number;
  deltaStd: number;
  p: number;
  pStd: number;
  inactivationTime: number;
  
  // Detailed Chronic Sequelae
  sequelae?: ChronicSequela[];
  
  // Legacy fallback (can be empty if sequelae is used)
  chronicRate?: number;       // Rate of long-term sequelae among ill
  chronicDalyWeight?: number; // Disability weight for chronic condition
  chronicDurationYears?: number; // Avg duration of chronic condition
  chronicCostPerCase?: number;   // Lifetime cost of managing chronic condition
  acuteDalyWeight?: number;   // Disability weight for acute phase
  acuteDurationDays?: number;  // Duration of acute illness
}

export interface ChronicSequela {
  id: string;
  name: string;
  rate: number;           // Probability of developing this sequela given illness
  dalyWeight: number;     // DW for this condition
  durationYears: number;  // Expected duration
  annualDirectCost: number; // Medical/care costs per year
}

export type DistributionType = 'fixed' | 'normal' | 'lognormal' | 'beta';

export type PopulationType = 'general' | 'children' | 'elderly' | 'immunocompromised' | 'custom';

export interface SusceptibilityFactors {
  pathogen: string;
  children: number;
  elderly: number;
  immunocompromised: number;
  apply_FS: boolean;
  source: string;
  listeria_r?: {
    general: number;
    susceptible: number;
  };
}

export interface DistributionConfig {
  type: DistributionType;
  p1: number; // Mean, LogMean, Alpha, or Fixed Value
  p2: number; // Std, LogStd, Beta, or Unused
}

export interface SimulationParams extends PathogenPair {
  populationSize: number;
  servingsPerYear: number;
  weeklyConsumption?: number;
  costHosp: number;
  costAmb: number;
  costAbsence: number;
  costDeath: number;
  costInterventionPerCase: number;
  
  // Advanced Distributions (Optional overrides for engine)
  distributions?: Record<string, DistributionConfig>;

  // Vulnerable Populations
  populationType?: PopulationType; // Legacy support
  selectedVulnerableGroups?: PopulationType[];
  groupSusceptibilityFactors?: Record<string, number>;
  groupProportions?: Record<string, number>;
  customFS?: number;
  economicParams?: {
    costPerCase: number;
    costPerHospitalization: number;
    costPerDeath: number;
    costPerDALY: number;
  };
  mitigation?: {
    reductionLog: number;
    complianceRate: number;
    storageTemp: number;
    processingAdjustment?: number;
    retailAdjustment?: number;
    preparationAdjustment?: number;
  };
}

export interface SimulationResult {
  summary: {
    // Per-serving probabilities (Risk)
    probInfection: number;
    probIllness: number;
    probIllnessCI: [number, number];
    probHospitalized: number;
    probDeath: number;
    
    // Annualized population results
    annualInfections: number;
    annualInfectionsCI: [number, number];
    annualCases: number;
    annualCasesCI: [number, number];
    annualHospitalized: number;
    annualHospitalizedCI: [number, number];
    annualDeaths: number;
    annualDeathsCI: [number, number];
    annualAbsence: number;
    annualAbsenceCI: [number, number];
    annualChronicCases: number;
    annualChronicCasesCI: [number, number];
    annualDALYs: number;
    annualDALYsCI: [number, number];
    
    individualYearlyRisk: number;
    individualYearlyRiskCI: [number, number];
    
    // Expert/Scientific Interpretation
    scientificInterpretation?: {
      riskLevel: 'Negligible' | 'Low' | 'Medium' | 'High' | 'Severe';
      recommendation: string;
      confidence: number; // 0-1
      fso_status: 'Compliant' | 'Non-Compliant' | 'Caution';
    };
    
    // Vulnerable population results
    vulnerableResults?: Record<string, {
      probIllness: number;
      probIllnessCI: [number, number];
      probInfection: number;
      annualCases: number;
      annualCasesCI: [number, number];
      annualHospitalized: number;
      annualDeaths: number;
      annualDALYs: number;
      individualYearlyRisk: number;
      individualYearlyRiskCI: [number, number];
      totalEconomicImpact: number;
    }>;
    vulnerable?: any; // Alias for backward compatibility
  };
  stats: {
    mean: number;
    median: number;
    sd: number;
    skewness: number;
    kurtosis: number;
    p5: number;
    p10: number;
    p25: number;
    p50: number;
    p75: number;
    p90: number;
    p95: number;
    p99?: number;
    ciLow: number;
    ciHigh: number;
  };
  economicBreakdown: {
    medical: number;
    productivity: number;
    intervention: number;
    mortality: number;
    chronic: number;
    total: number;
    totalCI: [number, number];
  };
  rawIll: number[];
  rawIllGroups?: Record<string, number[]>;
  rawIllVuln?: Record<string, number[]>; // Alias for backward compatibility
  rawAnnual: number[];
  rawEcon: number[];
  processedIllData?: {
    raw: number[];
    log10: number[];
  };
  histogram: { x: number; name: string; value: number }[];
  cumulativeData: { x: number; name: string; value: number; exceedance: number }[];
  stageProgression: { name: string; value: number }[];
  sensitivity: { name: string; impact: number }[];
}

export interface SimulationPreset {
  id: string;
  name: string;
  createdAt: string;
  countryId: string;
  pairId: string;
  params: Partial<SimulationParams>;
  iterations: number;
  simulations: number;
}
