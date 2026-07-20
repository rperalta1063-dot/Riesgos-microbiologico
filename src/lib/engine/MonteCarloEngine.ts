import { SimulationParams, SimulationResult, ChronicSequela } from '../../types';
import { preprocessSimulationData } from '../utils';

/**
 * Core Monte Carlo Engine for Quantitative Microbial Risk Assessment (QMRA)
 * 
 * This class handles the probabilistic modeling of pathogen exposure and health risks
 * through multiple supply chain stages and dose-response kinetics.
 */
export class MonteCarloEngine {
  private readonly PI = Math.PI;
  private readonly DISCOUNT_RATE = 0.03;
  private readonly YLL_PER_DEATH = 35; // Standard YLL for a theoretical median-aged fatality

  /**
   * Generates a sample from a normal distribution using Box-Muller transform
   */
  private normalSample(mean: number, std: number): number {
    let u1 = 0;
    while (u1 === 0) u1 = Math.random();
    const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * this.PI * Math.random());
    return z * std + mean;
  }

  /**
   * Generates a sample from a Gamma distribution using Marsaglia and Tsang method
   */
  private gammaSample(alpha: number, beta: number): number {
    if (alpha < 1) {
      return this.gammaSample(1 + alpha, beta) * Math.pow(Math.random(), 1 / alpha);
    }
    const d = alpha - 1 / 3;
    const c = 1 / Math.sqrt(9 * d);
    while (true) {
      let x = 0;
      let v = 0;
      while (v <= 0) {
        x = this.normalSample(0, 1);
        v = 1 + c * x;
      }
      v = v * v * v;
      const u = Math.random();
      if (u < 1 - 0.0331 * x * x * x * x) return d * v / beta;
      if (Math.log(u) < 0.5 * x * x + d * (1 - v + Math.log(v))) return d * v / beta;
    }
  }

  /**
   * Generates a sample from a Beta distribution
   */
  private betaSample(alpha: number, beta: number): number {
    const y1 = this.gammaSample(alpha, 1);
    const y2 = this.gammaSample(beta, 1);
    return y1 / (y1 + y2);
  }

  /**
   * Resolves a parameter value based on its distribution configuration
   */
  private getParamValue(name: string, baseValue: number, p: SimulationParams): number {
    const dist = p.distributions?.[name];
    if (!dist || dist.type === 'fixed') return baseValue;

    switch (dist.type) {
      case 'normal':
        return this.normalSample(dist.p1, dist.p2);
      case 'lognormal':
        // Assuming p1 is log-mean and p2 is log-std in base 10 (common in QMRA)
        return Math.pow(10, this.normalSample(dist.p1, dist.p2));
      case 'beta':
        return this.betaSample(dist.p1, dist.p2);
      default:
        return baseValue;
    }
  }

  /**
   * Beta-Poisson dose-response model
   * P(inf) = 1 - (1 + dose/beta)^(-alpha)
   */
  private betaPoissonInfProb(dose: number, alpha: number, beta: number): number {
    if (dose <= 0) return 0;
    return Math.min(1, 1 - Math.pow(1 + dose / beta, -alpha));
  }

  /**
   * Exponential dose-response model (for some pathogens)
   * P(inf) = 1 - exp(-k * dose)
   */
  private exponentialInfProb(dose: number, k: number): number {
    if (dose <= 0) return 0;
    return 1 - Math.exp(-k * dose);
  }

  /**
   * Numerical approximation of the error function (ERF) for normal CDF calculations
   */
  private erf(x: number): number {
    const t = 1 / (1 + 0.5 * Math.abs(x));
    const tau = t * Math.exp(-x * x - 1.26551223 +
      t * (1.00002368 +
      t * (0.37409196 +
      t * (0.09678418 +
      t * (-0.18628806 +
      t * (0.27886807 +
      t * (-1.13520398 +
      t * (1.48851587 +
      t * (-0.82215223 +
      t * 0.17087277)))))))));
    return x >= 0 ? 1 - tau : tau - 1;
  }

  /**
   * Models the microbial load progression through the supply chain
   */
  private evaluateExposurePath(p: SimulationParams) {
    // 1. Initial Load (Farm/Source)
    let logLoad = p.distributions?.initialLogMean 
      ? this.getParamValue('initialLogMean', p.initialLogMean, p)
      : this.normalSample(p.initialLogMean, p.initialLogStd);

    const stageValues = {
      initial: logLoad,
      processing: 0,
      transport: 0,
      retail: 0,
      preparation: 0
    };

    // 2. Processing Stage (Inactivation/Cross-contamination)
    logLoad += p.distributions?.processingDeltaLog 
      ? this.getParamValue('processingDeltaLog', p.processingDeltaLog, p)
      : p.processingDeltaLog;
    stageValues.processing = logLoad;

    // 3. Transport & Cold Chain
    logLoad += p.distributions?.transportDeltaLog 
      ? this.getParamValue('transportDeltaLog', p.transportDeltaLog, p)
      : p.transportDeltaLog;
    stageValues.transport = logLoad;

    // 4. Growth (If non-viral and nutrients/temp allow)
    if (!p.isViral) {
      // Add slight variability to growth rate
      const actualGr = p.growthRate + this.normalSample(0, 0.01);
      logLoad += Math.max(0, actualGr) * p.growthTime;
    }

    // 5. Retail/Distribution
    logLoad += p.distributions?.distributionDeltaLog 
      ? this.getParamValue('distributionDeltaLog', p.distributionDeltaLog, p)
      : p.distributionDeltaLog;
    stageValues.retail = logLoad;

    // 6. Consumer Preparation (Inactivation such as cooking)
    // Model thermal inactivation using Weibull kinetics approximation
    // D-value and p-shape (concavity/convexity of inactivation curve)
    const dValue = p.distributions?.delta 
      ? this.getParamValue('delta', p.delta, p)
      : Math.max(0.001, this.normalSample(p.delta, p.deltaStd));
      
    const pShape = p.distributions?.p
      ? this.getParamValue('p', p.p, p)
      : Math.max(0.001, this.normalSample(p.p, p.pStd));

    const logReduction = dValue > 0 ? Math.pow(p.inactivationTime / dValue, pShape) : 0;
    
    logLoad += (p.distributions?.preparationDeltaLog 
      ? this.getParamValue('preparationDeltaLog', p.preparationDeltaLog, p)
      : p.preparationDeltaLog) - logReduction;
    stageValues.preparation = logLoad;

    return { logLoad, stageValues };
  }

  /**
   * Risk Characterization: Mapping exposure to health outcomes
   */
  private characterizeHealthRisk(dose: number, p: SimulationParams, fs: number = 1) {
    // Probability of infection based on selected model (General Population)
    const pInfection = p.drModel === 'exponential' 
      ? this.exponentialInfProb(dose, p.k || 1.06e-12)
      : this.betaPoissonInfProb(dose, p.alpha, p.beta);
    
    // Conditional probabilities for downstream health events
    const illnessProb = p.distributions?.illnessProb 
      ? this.getParamValue('illnessProb', p.illnessProb, p)
      : p.illnessProb;
      
    const hospRate = p.distributions?.hospRate
      ? this.getParamValue('hospRate', p.hospRate, p)
      : p.hospRate;

    const pIllness = pInfection * illnessProb;

    // 1. Calculate General Population Outcomes
    const pHospitalization = pIllness * hospRate;
    const pDeath = pIllness * p.mortalityRate;
    const absDays = pIllness * p.absenceDays;

    const calculateBurden = (pIll: number, pHosp: number, pD: number) => {
      // DALYs
      const yll = pD * this.YLL_PER_DEATH;
      const yldAcute = pIll * (p.acuteDalyWeight || 0.05) * ((p.acuteDurationDays || 5) / 365);
      
      let yldChronic = 0;
      let chronicCost = 0;
      let chronicCasesCount = 0;

      if (p.sequelae && p.sequelae.length > 0) {
        for (const s of p.sequelae) {
          const sequelaProb = pIll * s.rate;
          chronicCasesCount += sequelaProb;
          if (s.durationYears > 0 && sequelaProb > 0) {
            const df = s.durationYears <= 1 ? s.durationYears : (1 - Math.pow(1 + this.DISCOUNT_RATE, -s.durationYears)) / this.DISCOUNT_RATE;
            yldChronic += sequelaProb * s.dalyWeight * df;
            chronicCost += sequelaProb * s.annualDirectCost * df;
          }
        }
      } else {
        const legacyChronicProb = pIll * (p.chronicRate || 0);
        chronicCasesCount = legacyChronicProb;
        const duration = p.chronicDurationYears || 0;
        if (duration > 0 && legacyChronicProb > 0) {
          const df = duration <= 1 ? duration : (1 - Math.pow(1 + this.DISCOUNT_RATE, -duration)) / this.DISCOUNT_RATE;
          yldChronic = legacyChronicProb * (p.chronicDalyWeight || 0) * df;
        }
        chronicCost = legacyChronicProb * (p.chronicCostPerCase || 0);
      }

      // Economic (Unified with Calculator)
      const econ = p.economicParams || {
        costPerCase: p.costAmb || 500,
        costPerHospitalization: p.costHosp || 5000,
        costPerDeath: p.costDeath || 50000,
        costPerDALY: 25000
      };

      const caseCost = pIll * econ.costPerCase;
      const hospCost = pHosp * econ.costPerHospitalization;
      const deathCost = pD * econ.costPerDeath;
      const dalyCost = (yll + yldAcute + yldChronic) * econ.costPerDALY;
      
      return {
        daly: yll + yldAcute + yldChronic,
        econ: caseCost + hospCost + deathCost + dalyCost + chronicCost,
        chronicCasesCount,
        chronicCost
      };
    };

    const generalBurden = calculateBurden(pIllness, pHospitalization, pDeath);

    // 2. Calculate Vulnerable Population Outcomes
    let pInfectionVuln = pInfection;
    let pIllnessVuln = pIllness;

    if (p.pathogen === 'Listeria monocytogenes') {
      if (p.populationType && p.populationType !== 'general') {
        pInfectionVuln = this.exponentialInfProb(dose, 1.06e-10);
        pIllnessVuln = pInfectionVuln * illnessProb;
      }
    } else {
      pInfectionVuln = Math.min(1, pInfection * fs);
      pIllnessVuln = Math.min(1, pIllness * fs);
    }

    const pHospVuln = pIllnessVuln * hospRate;
    const pDeathVuln = pIllnessVuln * p.mortalityRate;
    const vulnBurden = calculateBurden(pIllnessVuln, pHospVuln, pDeathVuln);

    return {
      pInfection,
      pIllness,
      pHospitalization,
      pDeath,
      absDays,
      chronicCases: generalBurden.chronicCasesCount,
      chronicDirectCost: generalBurden.chronicCost,
      totalDaly: generalBurden.daly,
      econ: generalBurden.econ,
      
      // Vulnerable metrics
      pInfectionVuln,
      pIllnessVuln,
      pHospVuln,
      pDeathVuln,
      dalyVuln: vulnBurden.daly,
      econVuln: vulnBurden.econ
    };
  }

  /**
   * Runs the full Monte Carlo simulation
   */
  public run(p: SimulationParams, iterations: number, onProgress?: (p: number) => void): SimulationResult {
    const selectedGroups = p.selectedVulnerableGroups || [];
    
    const data = {
      ill: new Float64Array(iterations),
      infected: new Float64Array(iterations),
      hosp: new Float64Array(iterations),
      deaths: new Float64Array(iterations),
      absence: new Float64Array(iterations),
      chronics: new Float64Array(iterations),
      dalys: new Float64Array(iterations),
      chronicCosts: new Float64Array(iterations),
      groups: selectedGroups.reduce((acc, g) => {
        acc[g] = new Float64Array(iterations);
        return acc;
      }, {} as Record<string, Float64Array>)
    };

    // Track accumulators for each selected group
    const groupAccumulators: Record<string, { 
      inf: number, ill: number, hosp: number, dead: number, daly: number, econ: number 
    }> = selectedGroups.reduce((acc, g) => {
      acc[g] = { inf: 0, ill: 0, hosp: 0, dead: 0, daly: 0, econ: 0 };
      return acc;
    }, {} as any);

    // Track input samples for global sensitivity analysis (Correlation)
    const samples: Record<string, Float64Array> = {
      prevalence: new Float64Array(iterations),
      initialLoad: new Float64Array(iterations),
      processing: new Float64Array(iterations),
      transport: new Float64Array(iterations),
      retail: new Float64Array(iterations),
      growth: new Float64Array(iterations),
      preparation: new Float64Array(iterations),
      inactivation: new Float64Array(iterations),
      dose: new Float64Array(iterations)
    };

    const accumulators = {
      inf: 0, ill: 0, illVuln: 0, hosp: 0, dead: 0, abs: 0, chronic: 0, daly: 0, chronicCost: 0, econ: 0,
      infVuln: 0, hospVuln: 0, deadVuln: 0, dalyVuln: 0, econVuln: 0,
      contaminated: 0,
      loads: { initial: 0, processing: 0, transport: 0, retail: 0, preparation: 0 }
    };

    const PROGRESS_STEP = Math.max(1, Math.floor(iterations / 50));

    for (let i = 0; i < iterations; i++) {
      if (onProgress && i % PROGRESS_STEP === 0) {
        onProgress(Math.round((i / iterations) * 100));
      }
      
      // Sample all inputs REGARDLESS of prevalence for robust sensitivity analysis
      const prevVal = p.distributions?.prevalence 
        ? this.getParamValue('prevalence', p.prevalence, p)
        : p.prevalence;
      
      samples.prevalence[i] = prevVal;

      let logLoad = p.distributions?.initialLogMean 
        ? this.getParamValue('initialLogMean', p.initialLogMean, p)
        : this.normalSample(p.initialLogMean, p.initialLogStd);
      
      samples.initialLoad[i] = logLoad;

      const stageValues = {
        initial: logLoad,
        processing: (p.distributions?.processingDeltaLog ? this.getParamValue('processingDeltaLog', p.processingDeltaLog, p) : p.processingDeltaLog) + (p.mitigation?.processingAdjustment || 0),
        transport: p.distributions?.transportDeltaLog ? this.getParamValue('transportDeltaLog', p.transportDeltaLog, p) : p.transportDeltaLog,
        retail: (p.distributions?.distributionDeltaLog ? this.getParamValue('distributionDeltaLog', p.distributionDeltaLog, p) : p.distributionDeltaLog) + (p.mitigation?.retailAdjustment || 0),
        growth: !p.isViral ? (p.growthRate + this.normalSample(0, 0.01)) * p.growthTime : 0,
        preparation: (p.distributions?.preparationDeltaLog ? this.getParamValue('preparationDeltaLog', p.preparationDeltaLog, p) : p.preparationDeltaLog) + (p.mitigation?.preparationAdjustment || 0)
      };

      samples.processing[i] = stageValues.processing;
      samples.transport[i] = stageValues.transport;
      samples.retail[i] = stageValues.retail;
      samples.growth[i] = stageValues.growth;
      samples.preparation[i] = stageValues.preparation;

      const dValue = p.distributions?.delta 
        ? this.getParamValue('delta', p.delta, p)
        : Math.max(0.001, this.normalSample(p.delta, p.deltaStd));
        
      const pShape = p.distributions?.p
        ? this.getParamValue('p', p.p, p)
        : Math.max(0.001, this.normalSample(p.p, p.pStd));

      const logReduction = dValue > 0 ? Math.pow(p.inactivationTime / dValue, pShape) : 0;
      samples.inactivation[i] = -logReduction;

      accumulators.contaminated++;
      
      const finalLog = logLoad + stageValues.processing + stageValues.transport + stageValues.growth + stageValues.retail + stageValues.preparation - logReduction;
      
      accumulators.loads.initial += logLoad;
      accumulators.loads.processing += logLoad + stageValues.processing;
      accumulators.loads.transport += logLoad + stageValues.processing + stageValues.transport;
      accumulators.loads.retail += logLoad + stageValues.processing + stageValues.transport + stageValues.growth + stageValues.retail;
      accumulators.loads.preparation += finalLog;

      const servingSizeSample = this.getParamValue('servingSize', p.servingSize, p);
      const dose = Math.pow(10, Math.min(finalLog, 15)) * servingSizeSample;
      samples.dose[i] = dose;

      // 1. General Population Risk
      const risk = this.characterizeHealthRisk(dose, p, 1);

      accumulators.inf += risk.pInfection;
      accumulators.ill += risk.pIllness;
      accumulators.hosp += risk.pHospitalization;
      accumulators.dead += risk.pDeath;
      accumulators.abs += risk.absDays;
      accumulators.chronic += risk.chronicCases;
      accumulators.daly += risk.totalDaly;
      accumulators.chronicCost += risk.chronicDirectCost;
      accumulators.econ += risk.econ;
      
      data.infected[i] = risk.pInfection;
      data.ill[i] = risk.pIllness;
      data.hosp[i] = risk.pHospitalization;
      data.deaths[i] = risk.pDeath;
      data.absence[i] = risk.absDays;
      data.chronics[i] = risk.chronicCases;
      data.dalys[i] = risk.totalDaly;
      data.chronicCosts[i] = risk.chronicDirectCost;

      // 2. Vulnerable Groups Risks
      for (const group of selectedGroups) {
        const fs = p.groupSusceptibilityFactors?.[group] || 1;
        const groupRisk = this.characterizeHealthRisk(dose, p, fs);
        
        const acc = groupAccumulators[group];
        acc.inf += groupRisk.pInfectionVuln;
        acc.ill += groupRisk.pIllnessVuln;
        acc.hosp += groupRisk.pHospVuln;
        acc.dead += groupRisk.pDeathVuln;
        acc.daly += groupRisk.dalyVuln;
        acc.econ += groupRisk.econVuln;
        
        data.groups[group][i] = groupRisk.pIllnessVuln;
      }
    }

    const result = this.postProcess(p, iterations, data, accumulators, groupAccumulators);
    result.sensitivity = this.calculateGlobalSensitivity(samples, data.ill);
    return result;
  }

  /**
   * Post-processes iteration data into a complete SimulationResult
   */
  private postProcess(
    p: SimulationParams, 
    n: number, 
    data: {
      ill: Float64Array;
      infected: Float64Array;
      hosp: Float64Array;
      deaths: Float64Array;
      absence: Float64Array;
      chronics: Float64Array;
      dalys: Float64Array;
      chronicCosts: Float64Array;
      groups: Record<string, Float64Array>;
    }, 
    acc: {
      inf: number; ill: number; illVuln: number; hosp: number; dead: number; abs: number; chronic: number; daly: number; chronicCost: number; econ: number;
      contaminated: number;
      loads: Record<string, number>;
    },
    groupAcc: Record<string, { inf: number, ill: number, hosp: number, dead: number, daly: number, econ: number }>
  ): SimulationResult {
    // UNIFIED DATA PREPROCESSING
    const illData = preprocessSimulationData(data.ill);
    const sortedIll = illData.raw;
    
    // Percentile function
    const getPercentile = (sorted: Float64Array, q: number) => 
      sorted.length > 0 ? sorted[Math.min(sorted.length - 1, Math.max(0, Math.floor(sorted.length * q)))] : 0;
    
    // Confidence intervals
    const getCI = (arr: Float64Array | number[]): [number, number] => {
      const s = new Float64Array(arr).sort();
      return [getPercentile(s, 0.025), getPercentile(s, 0.975)];
    };
 
    // Annualization
    const annualFactor = p.servingsPerYear;
    
    // Systemic Calculation (Weighted average of all groups)
    const totalProp = Object.values(p.groupProportions || {}).reduce((a, b) => a + b, 0);
    const restProp = Math.max(0, 1 - totalProp);
    
    let sysMeanInf = (acc.inf / n) * restProp;
    let sysMeanIll = (acc.ill / n) * restProp;
    let sysMeanHosp = (acc.hosp / n) * restProp;
    let sysMeanDead = (acc.dead / n) * restProp;
    let sysMeanDaly = (acc.daly / n) * restProp;
    let sysMeanAbs = (acc.abs / n) * restProp;
    let sysMeanChronic = (acc.chronic / n) * restProp;
    let sysMeanChronicCost = (acc.chronicCost / n) * restProp;
    let sysMeanEcon = (acc.econ / n) * restProp;

    Object.keys(groupAcc).forEach(g => {
      const ga = groupAcc[g];
      const prop = p.groupProportions?.[g] ?? 0;
      sysMeanInf += (ga.inf / n) * prop;
      sysMeanIll += (ga.ill / n) * prop;
      sysMeanHosp += (ga.hosp / n) * prop;
      sysMeanDead += (ga.dead / n) * prop;
      sysMeanDaly += (ga.daly / n) * prop;
      // Note: absence and chronic costs for groups are currently inherited from general if not specific
      sysMeanAbs += (acc.abs / n) * prop; 
      sysMeanChronic += (acc.chronic / n) * prop;
      sysMeanChronicCost += (acc.chronicCost / n) * prop;
      sysMeanEcon += (ga.econ / n) * prop;
    });
    
    const summary = {
      probInfection: sysMeanInf,
      probIllness: sysMeanIll,
      probIllnessCI: getCI(data.ill) as [number, number],
      probHospitalized: sysMeanHosp,
      probDeath: sysMeanDead,
      annualInfections: sysMeanInf * annualFactor,
      annualInfectionsCI: getCI(data.infected).map(v => v * annualFactor) as [number, number],
      annualCases: sysMeanIll * annualFactor,
      annualCasesCI: getCI(data.ill).map(v => v * annualFactor) as [number, number],
      annualHospitalized: sysMeanHosp * annualFactor,
      annualHospitalizedCI: getCI(data.hosp).map(v => v * annualFactor) as [number, number],
      annualDeaths: sysMeanDead * annualFactor,
      annualDeathsCI: getCI(data.deaths).map(v => v * annualFactor) as [number, number],
      annualAbsence: sysMeanAbs * annualFactor,
      annualAbsenceCI: getCI(data.absence).map(v => v * annualFactor) as [number, number],
      annualChronicCases: sysMeanChronic * annualFactor,
      annualChronicCasesCI: getCI(data.chronics).map(v => v * annualFactor) as [number, number],
      annualDALYs: sysMeanDaly * annualFactor,
      annualDALYsCI: getCI(data.dalys).map(v => v * annualFactor) as [number, number],
      individualYearlyRisk: (sysMeanIll * annualFactor) / p.populationSize,
      individualYearlyRiskCI: getCI(data.ill).map(v => (v * annualFactor) / p.populationSize) as [number, number],
      vulnerableResults: (() => {
        const vResults: Record<string, any> = {};
        let totalProp = 0;
        
        // 1. Calculate for specific vulnerable groups
        Object.keys(groupAcc).forEach(g => {
          const ga = groupAcc[g];
          const prop = p.groupProportions?.[g] ?? 0;
          totalProp += prop;
          
          const mCases = ga.ill / n;
          const groupData = data.groups[g];
          
          vResults[g] = {
            probInfection: ga.inf / n,
            probIllness: mCases,
            probIllnessCI: getCI(groupData) as [number, number],
            annualCases: mCases * annualFactor * prop,
            annualCasesCI: getCI(groupData).map(v => v * annualFactor * prop) as [number, number],
            annualHospitalized: (ga.hosp / n) * annualFactor * prop,
            annualDeaths: (ga.dead / n) * annualFactor * prop,
            annualDALYs: (ga.daly / n) * annualFactor * prop,
            individualYearlyRisk: (mCases * annualFactor) / p.populationSize,
            individualYearlyRiskCI: getCI(groupData).map(v => (v * annualFactor) / p.populationSize) as [number, number],
            totalEconomicImpact: (ga.econ / n) * annualFactor * prop,
          };
        });

        // 2. Add the "General/Reference" group (the rest of the population)
        const restProp = Math.max(0, 1 - totalProp);
        const gaGeneral = acc; // Using global accumulators for general risk
        const mCasesGen = acc.ill / n;
        
        vResults['general'] = {
          probInfection: acc.inf / n,
          probIllness: mCasesGen,
          probIllnessCI: getCI(data.ill) as [number, number],
          annualCases: mCasesGen * annualFactor * restProp,
          annualCasesCI: getCI(data.ill).map(v => v * annualFactor * restProp) as [number, number],
          annualHospitalized: (acc.hosp / n) * annualFactor * restProp,
          annualDeaths: (acc.dead / n) * annualFactor * restProp,
          annualDALYs: (acc.daly / n) * annualFactor * restProp,
          individualYearlyRisk: (mCasesGen * annualFactor) / p.populationSize,
          individualYearlyRiskCI: getCI(data.ill).map(v => (v * annualFactor) / p.populationSize) as [number, number],
          totalEconomicImpact: (acc.econ / n) * annualFactor * restProp,
          isReference: true
        };

        return vResults;
      })(),
      scientificInterpretation: this.getScientificInterpretation(sysMeanIll, p)
    };

    // Economic analysis (Unified with Calculator)
    const econ = p.economicParams || {
      costPerCase: p.costAmb || 500,
      costPerHospitalization: p.costHosp || 5000,
      costPerDeath: p.costDeath || 50000,
      costPerDALY: 25000
    };

    const economicBreakdown = {
      medical: summary.annualHospitalized * econ.costPerHospitalization,
      productivity: summary.annualCases * econ.costPerCase,
      intervention: summary.annualCases * p.costInterventionPerCase,
      mortality: summary.annualDeaths * econ.costPerDeath,
      chronic: summary.annualDALYs * econ.costPerDALY + sysMeanChronicCost * annualFactor,
    };
    const economicRaw = this.calculateRawEconomic(data, p, annualFactor);
    const economicTotal = Object.values(economicBreakdown).reduce((a, b) => a + b, 0);

    return {
      summary,
      stats: this.calculateStats(illData),
      economicBreakdown: { ...economicBreakdown, total: economicTotal, totalCI: getCI(economicRaw) as [number, number] },
      processedIllData: {
        raw: Array.from(illData.raw),
        log10: Array.from(illData.log10)
      },
      rawIll: this.downsample(Array.from(data.ill), 2000),
      rawIllGroups: Object.keys(data.groups).reduce((acc, g) => {
        acc[g] = this.downsample(Array.from(data.groups[g]), 2000);
        return acc;
      }, {} as Record<string, number[]>),
      rawAnnual: this.downsample(Array.from(data.ill).map(v => v * annualFactor), 2000),
      rawEcon: this.downsample(economicRaw, 2000),
      histogram: this.generateHistogram(illData, getPercentile(sortedIll, 0.99) || 1e-10),
      cumulativeData: this.generateCumulative(sortedIll, annualFactor),
      stageProgression: [
        { name: 'Inicial', value: acc.loads.initial / (acc.contaminated || 1) },
        { name: 'Proceso', value: acc.loads.processing / (acc.contaminated || 1) },
        { name: 'Transporte', value: acc.loads.transport / (acc.contaminated || 1) },
        { name: 'Retail', value: acc.loads.retail / (acc.contaminated || 1) },
        { name: 'Preparación', value: acc.loads.preparation / (acc.contaminated || 1) },
      ],
      sensitivity: []
    };
  }

  /**
   * Calculates Global Sensitivity Analysis using Pearson Correlation
   * between input parameters and the output risk (Illness).
   */
  private calculateGlobalSensitivity(inputs: Record<string, Float64Array>, outputs: Float64Array): { name: string; impact: number }[] {
    const n = outputs.length;
    let meanY = 0;
    for (let i = 0; i < n; i++) meanY += outputs[i];
    meanY /= n;
    
    const labels: Record<string, string> = {
      prevalence: 'Prevalencia',
      initialLoad: 'Carga Inicial',
      processing: 'Procesamiento',
      transport: 'Transporte/Frío',
      retail: 'Distribución/Retail',
      growth: 'Crecimiento Microbiano',
      preparation: 'Manipulación',
      inactivation: 'Inactivación Térmica',
      dose: 'Dosis Ingerida'
    };

    return Object.keys(inputs).map(key => {
      const x = inputs[key];
      let meanX = 0;
      for (let i = 0; i < n; i++) meanX += x[i];
      meanX /= n;
      
      let num = 0;
      let denX = 0;
      let denY = 0;
      
      for (let i = 0; i < n; i++) {
        const dx = x[i] - meanX;
        const dy = outputs[i] - meanY;
        num += dx * dy;
        denX += dx * dx;
        denY += dy * dy;
      }
      
      const correlation = (denX > 0 && denY > 0) ? num / Math.sqrt(denX * denY) : 0;
      
      return {
        name: labels[key] || key,
        impact: parseFloat((correlation * 100).toFixed(1))
      };
    }).sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact));
  }

  private calculateStats(prep: { raw: Float64Array; log10: Float64Array; count: number }) {
    const { raw, count } = prep;
    
    if (count === 0) {
      return {
        mean: 0, median: 0, sd: 0, skewness: 0, kurtosis: 0,
        p5: 0, p10: 0, p25: 0, p50: 0, p75: 0, p90: 0, p95: 0, p99: 0,
        ciLow: 0, ciHigh: 0
      };
    }

    const mean = raw.reduce((a, b) => a + b, 0) / count;
    const median = raw[Math.floor(count / 2)];
    
    let varianceSum = 0;
    let skewSum = 0;
    let kurtSum = 0;
    
    for (let i = 0; i < count; i++) {
      const diff = raw[i] - mean;
      const d2 = diff * diff;
      varianceSum += d2;
      skewSum += d2 * diff;
      kurtSum += d2 * d2;
    }
    
    const sd = Math.sqrt(varianceSum / (count - 1 || 1));
    const skewness = sd > 0 ? (skewSum / count) / Math.pow(sd, 3) : 0;
    const kurtosis = sd > 0 ? (kurtSum / count) / Math.pow(sd, 4) - 3 : 0;

    const pct = (q: number) => raw[Math.min(count - 1, Math.max(0, Math.floor(count * q)))];

    return {
      mean, median, sd, skewness, kurtosis,
      p5: pct(0.05), p10: pct(0.10), p25: pct(0.25), p50: median,
      p75: pct(0.75), p90: pct(0.90), p95: pct(0.95), p99: pct(0.99),
      ciLow: pct(0.025), ciHigh: pct(0.975)
    };
  }

  private calculateRawEconomic(data: any, p: SimulationParams, factor: number): number[] {
    const raw: number[] = [];
    const iterations = data.ill.length;
    
    const econ = p.economicParams || {
      costPerCase: p.costAmb || 500,
      costPerHospitalization: p.costHosp || 5000,
      costPerDeath: p.costDeath || 50000,
      costPerDALY: 25000
    };

    for (let i = 0; i < iterations; i++) {
        if (data.ill[i] === 0) {
            raw.push(0);
            continue;
        }
        const aI = data.ill[i] * factor;
        const aH = data.hosp[i] * factor;
        const aDaly = data.dalys[i] * factor;
        const aD = data.deaths[i] * factor;
        const aCCost = data.chronicCosts[i] * factor;

        const med = aH * econ.costPerHospitalization;
        const prod = aI * econ.costPerCase;
        const chronic = (aDaly * econ.costPerDALY) + aCCost;
        const mort = aD * econ.costPerDeath;
        const intv = aI * p.costInterventionPerCase;

        raw.push(med + prod + chronic + mort + intv);
    }
    return raw;
  }

  private downsample<T>(arr: T[], maxN: number): T[] {
    if (arr.length <= maxN) return arr;
    const step = arr.length / maxN;
    const out: T[] = [];
    for (let i = 0; i < maxN; i++) {
      out.push(arr[Math.floor(i * step)]);
    }
    return out;
  }

  private generateHistogram(prep: { raw: Float64Array; log10: Float64Array; count: number }, maxV: number) {
    const bins = 60;
    const { raw, count } = prep;
    if (count === 0) return [];
    
    const minV = raw[0] || 1e-10;
    const isWideRange = maxV / minV > 100;

    if (isWideRange) {
      // Log-spaced bins
      const logMin = Math.log10(minV);
      const logMax = Math.log10(maxV);
      const logStep = (logMax - logMin) / bins;
      
      const histogram = Array.from({ length: bins }, (_, i) => ({
        x: Math.pow(10, logMin + logStep * i),
        name: (logMin + logStep * i).toFixed(1),
        value: 0
      }));

      let bi = 0;
      for (const v of raw) {
        if (v > maxV) continue;
        while (bi < bins - 1 && v >= histogram[bi + 1].x) bi++;
        histogram[bi].value++;
      }
      return histogram;
    } else {
      // Linear bins
      const binSize = maxV / bins;
      const histogram = Array.from({ length: bins }, (_, i) => ({
        x: binSize * i,
        name: (binSize * i).toExponential(1),
        value: 0
      }));
      
      let bi = 0;
      for (const v of raw) {
        if (v > maxV) continue;
        while (bi < bins - 1 && v >= histogram[bi + 1].x) bi++;
        histogram[bi].value++;
      }
      return histogram;
    }
  }

  private getScientificInterpretation(meanIllness: number, p: SimulationParams) {
    let riskLevel: 'Negligible' | 'Low' | 'Medium' | 'High' | 'Severe' = 'Low';
    let recommendation = "";
    let fso_status: 'Compliant' | 'Non-Compliant' | 'Caution' = 'Compliant';

    if (meanIllness < 1e-9) riskLevel = 'Negligible';
    else if (meanIllness < 1e-7) riskLevel = 'Low';
    else if (meanIllness < 1e-5) riskLevel = 'Medium';
    else if (meanIllness < 1e-3) riskLevel = 'High';
    else riskLevel = 'Severe';

    if (riskLevel === 'Severe' || riskLevel === 'High') {
      recommendation = "Intervención urgente requerida. Se recomienda revisión de PCCs y auditoría de cadena de frío según directrices Codex.";
      fso_status = 'Non-Compliant';
    } else if (riskLevel === 'Medium') {
      recommendation = "Se recomienda fortalecer el monitoreo de higiene y considerar medidas de mitigación adicionales.";
      fso_status = 'Caution';
    } else {
      recommendation = "El riesgo se encuentra dentro de los límites de aceptabilidad. Continuar con vigilancia rutinaria.";
      fso_status = 'Compliant';
    }

    return {
      riskLevel,
      recommendation,
      confidence: 0.95,
      fso_status
    };
  }

  private generateCumulative(sortedIll: Float64Array, factor: number) {
    const nonZero = Array.from(sortedIll).filter(v => v > 0);
    const downsampled = this.downsample(nonZero, 500);
    return downsampled.map((v, i, arr) => ({
      x: v * factor,
      name: Math.round(v * factor).toString(),
      value: ((i + 1) / arr.length) * 100,
      exceedance: (1 - (i + 1) / arr.length) * 100
    }));
  }
}
