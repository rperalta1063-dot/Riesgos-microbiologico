
export type Language = 'es' | 'en' | 'fr' | 'pt';

export interface Translation {
  // Common
  appName: string;
  appSubtitle: string;
  dashboard: string;
  manual: string;
  specSheets: string;
  initializing: string;
  processing: string;
  deployKernel: string;
  stable: string;
  haccpActive: string;
  haccpInactive: string;
  baselineMode: string;
  haccpApplied: string;
  runtimeStatus: string;
  optimal: string;
  encrypted: string;
  station: string;
  timeElapsed: string;
  iterations: string;

  // Sidebar
  regionNode: string;
  pathogenVector: string;
  parameters: string;
  exposure: string;
  biology: string;
  economy: string;
  prevalence: string;
  initialLoad: string;
  initialLogStd: string;
  servingMass: string;
  illnessProb: string;
  hospRate: string;
  vslBaseline: string;
  interventionCostParam: string;
  prevalenceDesc: string;
  initialLoadDesc: string;
  initialLogStdDesc: string;
  servingMassDesc: string;
  illnessProbDesc: string;
  hospRateDesc: string;
  vslBaselineDesc: string;
  interventionCostDesc: string;
  costHospital: string;
  costHospitalDesc: string;
  costConsultation: string;
  costWorkDay: string;
  costWorkDayDesc: string;
  population: string;
  vslLife: string;
  darkMode: string;
  lightMode: string;
  settings: string;
  processingChange: string;
  transportChange: string;
  retailChange: string;
  preparationChange: string;
  servingsPerYearLabel: string;
  processingDesc: string;
  transportDesc: string;
  retailDesc: string;
  preparationDesc: string;
  servingsPerYearDesc: string;
  growthRate: string;
  growthTime: string;
  delta: string;
  inactivationTime: string;

  // Dashboard Cases
  primaryFocus: string;
  inMatrix: string;
  node: string;
  viralKernel: string;
  bacterialThread: string;
  econMarginDecay: string;
  estAnnualSocialImpact: string;
  globalRiskForecaster: string;
  annualCases: string;
  annualDeaths: string;
  annualSevereCases?: string; // Kept for safety or removed if fully migrated
  incidenceRate: string;
  per100k: string;
  estInstances: string;
  
  // Per-Serving Risk
  probInfection: string;
  probInfectionDesc: string;
  probIllness: string;
  probIllnessDesc: string;
  probDeath: string;
  probDeathDesc: string;
  individualYearlyRisk: string;

  // KPIs
  infections: string;
  severeCases: string;
  deaths: string;
  fatalityRate: string;
  workAbsence: string;
  ciLabel: string;
  deathsPerInfected: string;

  // Charts
  microbialChain: string;
  loadProgression: string;
  sensitivityMatrix: string;
  weightedImpact: string;
  probDistribution: string;
  illnessDensity: string;
  sectorEconomicLoading: string;
  costDistribution: string;
  medicalCosts: string;
  productivityLoss: string;
  interventionCosts: string;
  mortalityCost: string;
  chronicCost: string;
  chronicCases: string;
  dalyMetric: string;
  dalyDesc: string;
  chronicCasesDesc: string;
  dalyModuleTitle: string;
  dalyModuleSub: string;
  yllLabel: string;
  yllSub: string;
  yldAcuteLabel: string;
  yldAcuteSub: string;
  yldChronicLabel: string;
  yldChronicSub: string;
  techSummary: string;
  incidenceEst: string;
  mortalityBase: string;
  disabilityFactor: string;
  dalyCalculatedMethod: string;

  // Manual
  manualTitle: string;
  manualSubtitle: string;
  manualTarget: string;
  toc: string;
  pairs: string;
  countries: string;
  languages: string;
  introTitle: string;
  resultsTitle: string;
  simulationTitle: string;
  modelsTitle: string;
  economyTitle: string;
  specSectionTitle: string;
  specSectionDesc: string;
  pathogenCol: string;
  foodCol: string;
  infectivityCol: string;
  severityCol: string;
  chronicCol: string;
  warningTitle: string;
  warningBody: string;
  footerEnd: string;
  introBody: string;
  resultsBody: string;
  algorithmLogic: string;
  doseResponseTitle: string;
  doseResponseDesc: string;
  weibullTitle: string;
  weibullDesc: string;
  montecarloIntro: string;
  montecarloStep1Title: string;
  montecarloStep1Desc: string;
  montecarloStep2Title: string;
  montecarloStep2Desc: string;
  montecarloStep3Title: string;
  montecarloStep3Desc: string;
  montecarloStep4Title: string;
  montecarloStep4Desc: string;
  stochasticStabilityTitle: string;
  stochasticStabilityDesc: string;
  dataIntegrityTitle: string;
  dataIntegrityDesc: string;
  whatIfSensitivityTitle: string;
  whatIfSensitivityDesc: string;
  whatIfPrevalence: string;
  whatIfLoad: string;
  technicalRiskImpact: string;
  economicRiskImpact: string;
  simulatedScenario: string;
  currentScenario: string;
  bioRiskMode: string;
  econImpactMode: string;
  // Chart Accessibility
  microbialChainAlt: string;
  microbialChainDesc: string;
  sensitivityAnalysisAlt: string;
  sensitivityAnalysisDesc: string;
  economicImpactBarAlt: string;
  economicImpactBarDesc: string;
  economicImpactPieAlt: string;
  economicImpactPieDesc: string;
  // New Pairs
  shi_veg: string;
  lis_dairy: string;
  cam_poultry: string;
  sta_rte: string;
  sal_beef: string;
  clo_canned: string;
  sal_poultry: string;
  sal_egg: string;
  lis_rte: string;
  eco_beef: string;
  noro_leafy: string;
  hav_berries: string;
  vibrio_fish: string;
  bcereus_rice: string;
  manualHeader: string;
  numIterations: string;
  numSimulations: string;
  simulationSettings: string;
  exportPdf: string;
  exportCsv: string;
  exportJson: string;
  highContrastLabel: string;
  reportSummary: string;
  generatedDate: string;
  distributionStats: string;
  riskExceedance: string;
  riskExceedanceDesc: string;
  economicDrivers: string;
  economicDriversDesc: string;
  scenarioAudit: string;
  cumulativeProb: string;
  exportImage: string;
  noResultTitle: string;
  noResultDesc: string;
  resetParams: string;
  selectPathogen: string;
  selectFood: string;
  legendSelected: string;
  legendData: string;
  legendNoData: string;
  servingFrequencyLabel: string;
  servingAnnualLabel: string;
  servingModeLabel: string;
  tooltipDoseResponse: string;
  tooltipInactivation: string;
  tooltipCCDF: string;
  tooltipSensitivity: string;
  tooltipHeatmap: string;
  tooltipDistribution: string;
  tooltipEconomic: string;

  // Risk PDF (New)
  pdfTabLabel: string;
  pdfTabSub: string;
  pdfChartTitle: string;
  pdfChartSub: string;
  pdfExposureFreq: string;
  pdfDoseUnit: string;
  pdfDensityLabel: string;
  pdfDescription: string;
  pdfXAxisLabel: string;
  pdfYAxisLabel: string;

  // Quick Interpretation
  exposureEvalTitle: string;
  exposureEvalBody: string;
  exposureEvalFormula: string;
  techContext: string;
  interpretationManual: string;
  understood: string;
  scaleLinear: string;
  scaleLog: string;
  architectureTitle: string;
  architectureDesc: string;
  stackTitle: string;
}

export const translations: Record<Language, Translation> = {
  es: {
    appName: 'ProbRisk',
    appSubtitle: 'QMRA OIRSA.DRIA',
    dashboard: 'Resultados',
    manual: 'Manual',
    specSheets: 'Hojas Técnicas',
    initializing: 'Iniciando núcleos de análisis...',
    processing: 'Procesando...',
    deployKernel: 'Ejecutar simulación Montecarlo',
    numIterations: 'Número de Iteraciones',
    numSimulations: 'Número de Simulaciones',
    simulationSettings: 'Configuración de Simulación',
    exportPdf: 'Exportar Informe PDF',
    exportCsv: 'Exportar Datos CSV',
    exportJson: 'Exportar Datos JSON',
    reportSummary: 'Resumen del Informe de Riesgos',
    generatedDate: 'Fecha de generación',
    highContrastLabel: 'Modo Alto Contraste',
    distributionStats: 'Estadísticas de Distribución',
    riskExceedance: 'Curva de Excedencia de Riesgo (CCDF)',
    riskExceedanceDesc: 'Probabilidad de superar un número determinado de casos.',
    economicDrivers: 'Sensibilidad de Impacto Económico',
    economicDriversDesc: 'Factores que más influyen en el costo total estimado.',
    scenarioAudit: 'Resumen del Escenario de Simulación',
    cumulativeProb: 'Probabilidad Acumulada',
    exportImage: 'Exportar gráfico como imagen',
    noResultTitle: 'Sin datos de simulación',
    noResultDesc: 'Configure los parámetros y ejecute la simulación para visualizar el impacto biológico y económico.',
    resetParams: 'Resetear Parámetros',
    selectPathogen: 'Patógeno',
    selectFood: 'Alimento',
    legendSelected: 'Seleccionado',
    legendData: 'Datos Disponibles',
    legendNoData: 'Sin Datos Específicos',
    servingFrequencyLabel: 'Frecuencia Semanal',
    servingAnnualLabel: 'Total Anual',
    servingModeLabel: 'Modo de Consumo',
    tooltipDoseResponse: 'La curva Dosis-Respuesta (Beta-Poisson) estima la probabilidad de infección según la cantidad de patógenos ingeridos.',
    tooltipInactivation: 'Este modelo (Weibull) predice la reducción logarítmica de la carga microbiana en función del tiempo de exposición.',
    tooltipCCDF: 'La curva de probabilidad complementaria (CCDF) muestra qué tan probable es exceder un número de casos (eje Y vs eje X).',
    tooltipSensitivity: 'Muestra el impacto relativo (porcentaje) de cada parámetro en la variabilidad del riesgo total.',
    tooltipHeatmap: 'Cruza el riesgo individual anual con el impacto social (casos) para definir niveles de alerta sanitaria.',
    tooltipDistribution: 'Densidad de probabilidad que muestra el rango de casos posibles tras 10,000 iteraciones.',
    tooltipEconomic: 'Distribución de la carga económica total entre gastos médicos, pérdida de productividad y mortalidad.',
    pdfTabLabel: 'Densidad de Riesgo',
    pdfTabSub: 'Distribución de Probabilidad',
    pdfChartTitle: 'Distribución de Probabilidad (PDF)',
    pdfChartSub: 'Densidad de la carga bacteriana en el punto de consumo',
    pdfExposureFreq: 'Frecuencia de Exposición',
    pdfDoseUnit: 'UFC / Ración',
    pdfDensityLabel: 'Densidad de Probabilidad',
    pdfDescription: 'Este gráfico representa la función de densidad de probabilidad (PDF). Muestra la frecuencia relativa de los diferentes niveles de contaminación en las raciones individuales. Los picos indican los valores de carga microbiológica más probables al momento del consumo.',
    pdfXAxisLabel: 'Log UFC / Ración',
    pdfYAxisLabel: 'Densidad (%)',
    exposureEvalTitle: 'Evaluación de la Exposición',
    exposureEvalBody: 'Determina la dosis ingerida por el consumidor. La dosis es el producto de la concentración final (UFC/g) y el tamaño de la ración (g). Este valor es crítico para estimar la probabilidad de infección.',
    exposureEvalFormula: 'Dosis (UFC) = Concentración (UFC/g) × Tamaño Ración (g)',
    techContext: 'Contexto Técnico',
    interpretationManual: 'Manual de Interpretación',
    understood: 'Entendido',
    scaleLinear: 'Lineal',
    scaleLog: 'Log₁₀',
    architectureTitle: 'Arquitectura del Sistema',
    architectureDesc: 'Componentes principales del código fuente y lógica QMRA.',
    stackTitle: 'Stack Tecnológico',
    stable: '',
    haccpActive: 'HACCP ACTIVO',
    haccpInactive: 'HACCP INACTIVO',
    baselineMode: 'MODO BASE (SIN CONTROL)',
    haccpApplied: 'CONTROL HACCP APLICADO (-1.5 Log)',
    runtimeStatus: 'Estado Runtime',
    optimal: 'Óptimo',
    encrypted: 'Encriptado SSL/TLS',
    station: 'Estación',
    timeElapsed: 'Tiempo Transcurrido',
    iterations: 'iteraciones',
    regionNode: 'Nodo Región',
    pathogenVector: 'Vector Patógeno',
    parameters: 'Configuración',
    exposure: 'Exposición',
    biology: 'Biología',
    economy: 'Economía',
    prevalence: 'Prevalencia',
    initialLoad: 'Carga Inicial',
    initialLogStd: 'Desv. Log Carga',
    servingMass: 'Masa Ración',
    illnessProb: 'Prob. Enfermedad',
    hospRate: 'Tasa Hosp.',
    vslBaseline: 'Base VSL',
    interventionCostParam: 'Coste Intervención/Caso',
    prevalenceDesc: 'Porcentaje de raciones contaminadas en el lote.',
    initialLoadDesc: 'Concentración bacteriana inicial (Log₁₀ CFU/g).',
    initialLogStdDesc: 'Desviación estándar de la carga inicial (variabilidad).',
    servingMassDesc: 'Tamaño de la ración individual consumida.',
    illnessProbDesc: 'Probabilidad de desarrollar síntomas tras la infección.',
    hospRateDesc: 'Porcentaje de enfermos que requieren hospitalización.',
    vslBaselineDesc: 'Valor estadístico de la vida para cálculos de mortalidad.',
    interventionCostDesc: 'Coste de medidas de salud pública por caso detectado.',
    costHospital: 'Coste Hospitalización',
    costHospitalDesc: 'Coste promedio por instancia de hospitalización.',
    costConsultation: 'Costo consulta',
    costWorkDay: 'Coste Día Laboral',
    costWorkDayDesc: 'Pérdida económica diaria por ausencia laboral del paciente.',
    population: 'Población',
    vslLife: 'VSL (vida estadística)',
    darkMode: 'Modo Oscuro',
    lightMode: 'Modo Claro',
    settings: 'Ajustes',
    processingChange: 'Cambio Proc. (Log)',
    transportChange: 'Cambio Transp. (Log)',
    retailChange: 'Cambio Retail (Log)',
    preparationChange: 'Cambio Prep. (Log)',
    servingsPerYearLabel: 'Raciones por Año',
    processingDesc: 'Cambio logarítmico en la carga microbiana durante el procesamiento.',
    transportDesc: 'Cambio logarítmico durante el transporte y logística.',
    retailDesc: 'Cambio logarítmico durante la etapa de venta al por menor (retail).',
    preparationDesc: 'Cambio logarítmico durante la preparación final del alimento.',
    servingsPerYearDesc: 'Número estimado de raciones consumidas por la población anualmente.',
    growthRate: 'Tasa de Crecimiento',
    growthTime: 'Tiempo de Crecimiento',
    delta: 'Delta (Inactivación)',
    inactivationTime: 'Tiempo de Inactivación',
    primaryFocus: 'Foco de Análisis Primario',
    inMatrix: 'en matriz de',
    node: 'Nodo',
    viralKernel: 'Kernel Viral',
    bacterialThread: 'Hilo Bacteriano',
    econMarginDecay: 'Degradación de Margen Económico',
    estAnnualSocialImpact: 'Impacto Social Anual Est.',
    globalRiskForecaster: 'Pronosticador de Riesgo Global',
    annualCases: 'Casos Anuales',
    annualDeaths: 'Fallecimientos Anuales',
    annualSevereCases: 'Casos Graves Anuales',
    incidenceRate: 'Tasa Incidencia',
    per100k: 'por 100k Habitantes',
    estInstances: 'Instancias Estimadas',
    probInfection: 'Prob. Infección',
    probInfectionDesc: 'Riesgo por ración consumida',
    probIllness: 'Prob. Enfermedad',
    probIllnessDesc: 'Prob. enfermedad tras exposición',
    probDeath: 'Prob. Fallecimiento',
    probDeathDesc: 'Riesgo fatal por ración',
    individualYearlyRisk: 'Riesgo Individual Anual',
    infections: 'Infecciones',
    severeCases: 'Casos Graves',
    deaths: 'Fallecimientos',
    fatalityRate: 'Tasa Letalidad',
    workAbsence: 'Ausencia Lab.',
    ciLabel: 'IC95%',
    deathsPerInfected: 'muertes / infectados',
    microbialChain: 'Evolución Cadena Microbiana',
    loadProgression: 'Progresión de Carga (Log₁₀ CFU/g)',
    sensitivityMatrix: 'Matrices de Sensibilidad',
    weightedImpact: 'Impacto ponderado de parámetros',
    probDistribution: 'Distribución Probabilística',
    illnessDensity: 'Densidad de ocurrencia por ración',
    sectorEconomicLoading: 'Carga Económica por Sector',
    costDistribution: 'Distribución de costos directos/indirectos',
    medicalCosts: 'Gastos Médicos',
    productivityLoss: 'Pérdida de Productividad',
    interventionCosts: 'Salud Pública / Intervención',
    mortalityCost: 'Impacto de Mortalidad',
    chronicCost: 'Impacto de Secuelas',
    chronicCases: 'Casos Crónicos',
    dalyMetric: 'DALYs',
    dalyDesc: 'Años de vida ajustados por discapacidad (Carga de Enfermedad)',
    chronicCasesDesc: 'Pacientes con secuelas de largo plazo (p. ej. Artritis, HUS)',
    dalyModuleTitle: 'Módulo Calculador DALYs',
    dalyModuleSub: 'Años de Vida Ajustados por Discapacidad',
    yllLabel: 'YLL (Años de Vida Perdidos)',
    yllSub: 'Impacto por mortalidad prematura',
    yldAcuteLabel: 'YLD Agudo (Años con Discapacidad)',
    yldAcuteSub: 'Carga por fase inicial de la enfermedad',
    yldChronicLabel: 'YLD Crónico / Secuelas',
    yldChronicSub: 'Impacto a largo plazo y complicaciones',
    techSummary: 'Resumen Técnico',
    incidenceEst: 'Incidencia Estimada',
    mortalityBase: 'Mortalidad (YLL Base)',
    disabilityFactor: 'Factor Discapacidad',
    dalyCalculatedMethod: 'Cálculo basado en la carga global de enfermedad de la OMS. Los DALYs suman los años de vida perdidos por muerte prematura y los años vividos con discapacidad.',
    manualTitle: 'MANUAL DE USO E INTERPRETACIÓN',
    manualSubtitle: 'ProbRisk QMRA',
    manualTarget: 'Para especialistas en inocuidad alimentaria, epidemiólogos y tomadores de decisiones.',
    toc: 'Tabla de Contenido',
    pairs: 'Pares Patógeno-Alimento',
    countries: 'Países',
    languages: 'Idiomas',
    introTitle: '1. Introducción y Marco QMRA',
    resultsTitle: '2. Interpretación de Resultados',
    simulationTitle: '3. Motor de Simulación Monte Carlo',
    modelsTitle: '4. Gráficas de Modelo Biológico',
    economyTitle: '5. Evaluación de Carga Económica y DALYs',
    specSectionTitle: '6. Hoja Técnica: Base de Datos de Patógenos',
    specSectionDesc: 'Parámetros científicos utilizados para modelar el comportamiento biológico y el impacto epidemiológico de cada par patógeno-alimento.',
    pathogenCol: 'Patógeno',
    foodCol: 'Alimento',
    infectivityCol: 'Infectividad (α, β)',
    severityCol: 'Severidad (Letalidad)',
    chronicCol: 'Cronicidad (Tasa/DALY)',
    warningTitle: 'Aviso Regulatorio y Científico',
    warningBody: 'ProbRisk QMRA es una herramienta para la formulación de políticas. Los valores son estimaciones referenciales. Para auditorías oficiales, valide siempre con datos locales.',
    footerEnd: 'Fin del Manual',
    introBody: 'La Evaluación Cuantitativa de Riesgos Microbiológicos (QMRA) es un marco científico reconocido por el Codex Alimentarius y la OMS para estimar probabilísticamente el riesgo de efectos adversos en salud.',
    resultsBody: 'En QMRA, la Media suele ser significativamente mayor a la Mediana. Esto se debe al sesgo positivo (cola derecha) de las distribuciones microbiológicas. Un P95 alto indica que existe un riesgo real de brotes masivos.',
    algorithmLogic: 'Lógica por iteración (Simulación Estocástica)',
    doseResponseTitle: 'Beta-Poisson (Infección)',
    doseResponseDesc: 'Determina la probabilidad de que una sola célula cause infección.',
    weibullTitle: 'Inactivación de Weibull',
    weibullDesc: 'Visualiza la reducción logarítmica frente al tiempo y resistencia térmica.',
    montecarloIntro: 'La simulación de Monte Carlo es la piedra angular de ProbRisk. A diferencia de los modelos deterministas que usan un solo valor fijo (como el "promedio"), nuestro motor ejecuta 10,000 "historias" paralelas para capturar la incertidumbre inherente a la naturaleza.',
    montecarloStep1Title: 'Paso 1: Muestreo de Contaminación',
    montecarloStep1Desc: 'Para cada iteración, el sistema decide si la ración está contaminada basándose en la Prevalencia. Si lo está, se asigna una carga microbiana inicial siguiendo una distribución Log-Normal, reflejando la variabilidad real entre lotes.',
    montecarloStep2Title: 'Paso 2: Progresión de Cadena',
    montecarloStep2Desc: 'Se aplican las reducciones por procesamiento, transporte y preparación en escala logarítmica, sumando o restando carga microbiana en cada etapa crítica.',
    montecarloStep3Title: 'Paso 3: Cálculo de Dosis',
    montecarloStep3Desc: 'La carga final se multiplica por el tamaño de la ración para determinar las CFUs reales que el consumidor ingiere.',
    montecarloStep4Title: 'Paso 4: Respuesta Biológica',
    montecarloStep4Desc: 'Se calcula la probabilidad de infección utilizando modelos Beta-Poisson o Exponencial para cada dosis individual generada.',
    stochasticStabilityTitle: 'Estabilidad Estocástica',
    stochasticStabilityDesc: '¿Por qué 10,000 iteraciones? Porque la seguridad alimentaria se preocupa por los "eventos raros". Con menos ciclos, perderíamos los escenarios de alta carga que causan el mayor impacto.',
    dataIntegrityTitle: 'Integridad de Datos',
    dataIntegrityDesc: 'Cada ciclo es independiente y utiliza generadores aleatorios de alta calidad para garantizar resultados insesgados.',
    whatIfSensitivityTitle: 'Análisis de Sensibilidad de Parámetros Clave',
    whatIfSensitivityDesc: 'Ajuste manualmente la prevalencia y la carga para observar el impacto proyectado en el riesgo sin ejecutar una nueva simulación completa.',
    whatIfPrevalence: 'Ajuste de Prevalencia',
    whatIfLoad: 'Ajuste de Carga Inicial (Log)',
    technicalRiskImpact: 'Impacto en Riesgo Técnico',
    economicRiskImpact: 'Impacto en Riesgo Económico',
    simulatedScenario: 'Escenario Simulado',
    currentScenario: 'Escenario Actual',
    bioRiskMode: 'Riesgo Biológico',
    econImpactMode: 'Impacto Económico',
    microbialChainAlt: 'Gráfico de progresión de la carga microbiana a través de la cadena de procesos',
    microbialChainDesc: 'Evolución de la carga microbiana (Log10 UFC/g) desde la producción primaria hasta el consumo final, mostrando reducciones e incrementos en cada etapa.',
    sensitivityAnalysisAlt: 'Gráfico de barras de análisis de sensibilidad',
    sensitivityAnalysisDesc: 'Muestra el impacto relativo de cada parámetro de entrada (prevalencia, carga, etc.) en el resultado final del riesgo.',
    economicImpactBarAlt: 'Gráfico de barras de desglose del impacto económico',
    economicImpactBarDesc: 'Distribución de costos anuales por categorías: médica, productividad, intervención y mortalidad.',
    economicImpactPieAlt: 'Gráfico circular de distribución porcentual del impacto económico',
    economicImpactPieDesc: 'Distribución proporcional de los costos totales, permitiendo visualizar qué sector asume la mayor parte de la carga económica.',
    manualHeader: 'MANUAL DE USO E INTERPRETACIÓN',
    shi_veg: 'Vegetales',
    lis_dairy: 'Queso / Lácteos',
    cam_poultry: 'Aves de corral',
    sta_rte: 'Alimentos RTE',
    sal_beef: 'Carne de res',
    clo_canned: 'Conservas / Enlatados',
    sal_poultry: 'Aves de corral',
    sal_egg: 'Huevos',
    lis_rte: 'Alimentos RTE',
    eco_beef: 'Carne de res',
    noro_leafy: 'Vegetales de hoja',
    hav_berries: 'Berries / Frutas frescas',
    vibrio_fish: 'Pescados / Mariscos',
    bcereus_rice: 'Arroz / Cereales cocidos',
  },
  en: {
    appName: 'ProbRisk',
    appSubtitle: 'QMRA OIRSA.DRIA',
    dashboard: 'Results',
    manual: 'Manual',
    specSheets: 'Spec Sheets',
    initializing: 'Initializing analysis kernels...',
    processing: 'Processing...',
    deployKernel: 'Run Monte Carlo Simulation',
    numIterations: 'Number of Iterations',
    numSimulations: 'Number of Simulations',
    simulationSettings: 'Simulation Settings',
    exportPdf: 'Export PDF Report',
    exportCsv: 'Export CSV Data',
    exportJson: 'Export JSON Data',
    reportSummary: 'Risk Report Summary',
    generatedDate: 'Generated date',
    highContrastLabel: 'High Contrast Mode',
    distributionStats: 'Distribution Statistics',
    riskExceedance: 'Risk Exceedance Curve (CCDF)',
    riskExceedanceDesc: 'Probability of exceeding a specific number of cases.',
    economicDrivers: 'Economic Impact Sensitivity',
    economicDriversDesc: 'Factors with the greatest influence on total estimated cost.',
    scenarioAudit: 'Simulation Scenario Audit',
    cumulativeProb: 'Cumulative Probability',
    exportImage: 'Export chart as image',
    noResultTitle: 'No Simulation Data',
    noResultDesc: 'Configure parameters and run the simulation to visualize biological and economic impact.',
    resetParams: 'Reset Parameters',
    selectPathogen: 'Pathogen',
    selectFood: 'Food',
    legendSelected: 'Selected',
    legendData: 'Data Available',
    legendNoData: 'No Specific Data',
    servingFrequencyLabel: 'Weekly Frequency',
    servingAnnualLabel: 'Annual Total',
    servingModeLabel: 'Consumption Mode',
    tooltipDoseResponse: 'The Dose-Response curve (Beta-Poisson) estimates the probability of infection based on the amount of pathogens ingested.',
    tooltipInactivation: 'This model (Weibull) predicts the logarithmic reduction of the microbial load as a function of exposure time.',
    tooltipCCDF: 'The complementary cumulative distribution function (CCDF) shows how likely it is to exceed a number of cases (Y-axis vs X-axis).',
    tooltipSensitivity: 'Shows the relative impact (percentage) of each parameter on the total risk variability.',
    tooltipHeatmap: 'Crosses annual individual risk with social impact (cases) to define health alert levels.',
    tooltipDistribution: 'Probability density showing the range of possible cases after 10,000 iterations.',
    tooltipEconomic: 'Distribution of the total economic burden between medical expenses, lost productivity, and mortality.',
    pdfTabLabel: 'Risk Density',
    pdfTabSub: 'Probability Distribution',
    pdfChartTitle: 'Probability Distribution (PDF)',
    pdfChartSub: 'Bacterial load density at the point of consumption',
    pdfExposureFreq: 'Exposure Frequency',
    pdfDoseUnit: 'CFU / Serving',
    pdfDensityLabel: 'Probability Density',
    pdfDescription: 'This graph represents the probability density function (PDF). It shows the relative frequency of different contamination levels in individual servings. Peaks indicate the most likely microbiological load values at the time of consumption.',
    pdfXAxisLabel: 'Log CFU / Serving',
    pdfYAxisLabel: 'Density (%)',
    exposureEvalTitle: 'Exposure Assessment',
    exposureEvalBody: 'Determines the dose ingested by the consumer. The dose is the product of the final concentration (CFU/g) and the serving size (g). This value is critical for estimating the probability of infection.',
    exposureEvalFormula: 'Dose (CFU) = Concentration (CFU/g) × Serving Size (g)',
    techContext: 'Technical Context',
    interpretationManual: 'Interpretation Manual',
    understood: 'Understood',
    scaleLinear: 'Linear',
    scaleLog: 'Log₁₀',
    architectureTitle: 'System Architecture',
    architectureDesc: 'Main source code components and QMRA logic.',
    stackTitle: 'Tech Stack',
    stable: '',
    haccpActive: 'HACCP ACTIVE',
    haccpInactive: 'HACCP INACTIVE',
    baselineMode: 'BASELINE MODE (NO CONTROL)',
    haccpApplied: 'HACCP CONTROL APPLIED (-1.5 Log)',
    runtimeStatus: 'Runtime Status',
    optimal: 'Optimal',
    encrypted: 'Encrypted SSL/TLS',
    station: 'Station',
    timeElapsed: 'Time Elapsed',
    iterations: 'iterations',
    regionNode: 'Region Node',
    pathogenVector: 'Pathogen Vector',
    parameters: 'Configuration',
    exposure: 'Exposure',
    biology: 'Biology',
    economy: 'Economy',
    prevalence: 'Prevalence',
    initialLoad: 'Initial Load',
    initialLogStd: 'Load Std Dev',
    servingMass: 'Serving Mass',
    illnessProb: 'Illness Prob',
    hospRate: 'Hosp. Rate',
    vslBaseline: 'VSL Baseline',
    interventionCostParam: 'Intervention Cost/Case',
    prevalenceDesc: 'Percentage of contaminated servings in the batch.',
    initialLoadDesc: 'Initial bacterial concentration (Log₁₀ CFU/g).',
    initialLogStdDesc: 'Standard deviation of initial load (variability).',
    servingMassDesc: 'Individual serving size consumed.',
    illnessProbDesc: 'Probability of developing symptoms after infection.',
    hospRateDesc: 'Percentage of ill cases requiring hospitalization.',
    vslBaselineDesc: 'Statistical value of life for mortality calculations.',
    interventionCostDesc: 'Public health response cost per detected case.',
    costHospital: 'Hospitalization Cost',
    costHospitalDesc: 'Average cost per hospitalization instance.',
    costConsultation: 'Consultation Cost',
    costWorkDay: 'Work Day Cost',
    costWorkDayDesc: 'Daily economic loss due to patient absence from work.',
    population: 'Population',
    vslLife: 'VSL (Value of Statistical Life)',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    settings: 'Settings',
    processingChange: 'Processing Change (Log)',
    transportChange: 'Transport Change (Log)',
    retailChange: 'Retail Change (Log)',
    preparationChange: 'Preparation Change (Log)',
    servingsPerYearLabel: 'Servings per Year',
    processingDesc: 'Logarithmic change in microbial load during processing.',
    transportDesc: 'Logarithmic change during transport and logistics.',
    retailDesc: 'Logarithmic change during the retail stage.',
    preparationDesc: 'Logarithmic change during final food preparation.',
    servingsPerYearDesc: 'Estimated number of servings consumed by the population annually.',
    growthRate: 'Growth Rate',
    growthTime: 'Growth Time',
    delta: 'Delta (Inactivation)',
    inactivationTime: 'Inactivation Time',
    primaryFocus: 'Primary Analysis Focus',
    inMatrix: 'in matrix of',
    node: 'Node',
    viralKernel: 'Viral Kernel',
    bacterialThread: 'Bacterial Thread',
    econMarginDecay: 'Economic Margin Decay',
    estAnnualSocialImpact: 'Est. Annual Social Impact',
    globalRiskForecaster: 'Global Risk Forecaster',
    annualCases: 'Annual Cases',
    annualDeaths: 'Annual Deaths',
    annualSevereCases: 'Annual Severe Cases',
    incidenceRate: 'Incidence Rate',
    per100k: 'per 100k Pop.',
    estInstances: 'Estimated Instances',
    probInfection: 'Prob. Infection',
    probInfectionDesc: 'Risk per individual serving',
    probIllness: 'Prob. Illness',
    probIllnessDesc: 'Risk of symptoms per serving',
    probDeath: 'Prob. Death',
    probDeathDesc: 'Fatal risk per serving',
    individualYearlyRisk: 'Individual Yearly Risk',
    infections: 'Infections',
    severeCases: 'Severe Cases',
    deaths: 'Deaths',
    fatalityRate: 'Fatality Rate',
    workAbsence: 'Work Absence',
    ciLabel: '95% CI',
    deathsPerInfected: 'deaths / infected',
    microbialChain: 'Microbial Chain Evolution',
    loadProgression: 'Load Progression (Log₁₀ CFU/g)',
    sensitivityMatrix: 'Sensitivity Matrices',
    weightedImpact: 'Relative parameter weighted impact',
    probDistribution: 'Probabilistic Distribution',
    illnessDensity: 'Illness occurrence density per serving',
    sectorEconomicLoading: 'Sector Economic Loading',
    costDistribution: 'Direct & indirect cost distribution',
    medicalCosts: 'Medical Expenses',
    productivityLoss: 'Productivity Loss',
    interventionCosts: 'Public Health / Intervention',
    mortalityCost: 'Mortality Impact',
    chronicCost: 'Long-term Sequelae Impact',
    chronicCases: 'Chronic Cases',
    dalyMetric: 'DALYs',
    dalyDesc: 'Disability-Adjusted Life Years (Disease Burden)',
    chronicCasesDesc: 'Patients with long-term complications (e.g. Arthritis, HUS)',
    dalyModuleTitle: 'DALY Calculator Module',
    dalyModuleSub: 'Disability-Adjusted Life Years',
    yllLabel: 'YLL (Years of Life Lost)',
    yllSub: 'Impact due to premature mortality',
    yldAcuteLabel: 'Acute YLD (Years Lived with Disability)',
    yldAcuteSub: 'Burden from initial phase of illness',
    yldChronicLabel: 'Chronic YLD / Sequelae',
    yldChronicSub: 'Long-term impact and complications',
    techSummary: 'Technical Summary',
    incidenceEst: 'Estimated Incidence',
    mortalityBase: 'Mortality (YLL Base)',
    disabilityFactor: 'Disability Factor',
    dalyCalculatedMethod: 'Calculation based on the WHO global burden of disease. DALYs sum years of life lost due to premature death and years lived with disability.',
    manualTitle: 'USER & INTERPRETATION MANUAL',
    manualSubtitle: 'ProbRisk QMRA',
    manualTarget: 'For food safety specialists, epidemiologists, and policy makers.',
    toc: 'Table of Contents',
    pairs: 'Pathogen-Food Pairs',
    countries: 'Countries',
    languages: 'Languages',
    introTitle: '1. Introduction & QMRA Framework',
    resultsTitle: '2. Interpretation of Results',
    simulationTitle: '3. Monte Carlo Simulation Engine',
    modelsTitle: '4. Biological Model Charts',
    economyTitle: '5. Economic Burden & DALYs',
    specSectionTitle: '6. Technical Data: Pathogen Database',
    specSectionDesc: 'Scientific parameters used to model biological behavior and epidemiological impact for each pathogen-food pair.',
    pathogenCol: 'Pathogen',
    foodCol: 'Food',
    infectivityCol: 'Infectivity (α, β)',
    severityCol: 'Severity (Fatality)',
    chronicCol: 'Chronicity (Rate/DALY)',
    warningTitle: 'Regulatory and Scientific Notice',
    warningBody: 'ProbRisk QMRA is a tool for policy formulation. Values are referential estimates. For official audits, always validate with local epidemiological data.',
    footerEnd: 'End of Manual',
    introBody: 'Quantitative Microbial Risk Assessment (QMRA) is a scientific framework recognized by Codex Alimentarius and WHO to probabilistically estimate the risk of adverse health effects.',
    resultsBody: 'In QMRA, the Mean is usually significantly higher than the Median. This is due to the positive skew (right tail) of microbiological distributions. A high P95 indicates a real risk of massive outbreaks.',
    algorithmLogic: 'Logic per iteration (Stochastic Simulation)',
    doseResponseTitle: 'Beta-Poisson (Infection)',
    doseResponseDesc: 'Determines the probability for a single cell to cause infection.',
    weibullTitle: 'Weibull Inactivation',
    weibullDesc: 'Visualizes log reduction vs time and thermal resistance.',
    montecarloIntro: 'Monte Carlo simulation is the cornerstone of ProbRisk. Unlike deterministic models that use a single fixed value (like the "average"), our engine runs 10,000 parallel "histories" to capture the uncertainty inherent in nature.',
    montecarloStep1Title: 'Step 1: Contamination Sampling',
    montecarloStep1Desc: 'For each iteration, the system decides if the serving is contaminated based on Prevalence. If it is, an initial load is assigned following a Log-Normal distribution, reflecting real-world variability.',
    montecarloStep2Title: 'Step 2: Chain Progression',
    montecarloStep2Desc: 'Logarithmic reductions from processing, transport, and preparation are applied, adding or subtracting load at each critical stage.',
    montecarloStep3Title: 'Step 3: Dose Calculation',
    montecarloStep3Desc: 'The final load is multiplied by the serving size to determine the actual CFUs ingested by the consumer.',
    montecarloStep4Title: 'Step 4: Biological Response',
    montecarloStep4Desc: 'Infection probability is calculated using Beta-Poisson or Exponential models for each individual dose generated.',
    stochasticStabilityTitle: 'Stochastic Stability',
    stochasticStabilityDesc: 'Why 10,000 iterations? Because food safety cares about "rare events". With fewer cycles, we might miss high-load scenarios that cause the most impact.',
    dataIntegrityTitle: 'Data Integrity',
    dataIntegrityDesc: 'Each cycle is independent and uses high-quality random generators to ensure unbiased results.',
    whatIfSensitivityTitle: 'Key Parameter Sensitivity Analysis',
    whatIfSensitivityDesc: 'Manually adjust prevalence and load to observe projected risk impact without running a new full simulation.',
    whatIfPrevalence: 'Prevalence Adjustment',
    whatIfLoad: 'Initial Load Adjustment (Log)',
    technicalRiskImpact: 'Technical Risk Impact',
    economicRiskImpact: 'Economic Risk Impact',
    simulatedScenario: 'Simulated Scenario',
    currentScenario: 'Current Scenario',
    bioRiskMode: 'Biological Risk',
    econImpactMode: 'Economic Impact',
    microbialChainAlt: 'Microbial load progression chart through the process chain',
    microbialChainDesc: 'Evolution of microbial load (Log10 CFU/g) from primary production to final consumption, showing reductions and increases at each stage.',
    sensitivityAnalysisAlt: 'Sensitivity analysis bar chart',
    sensitivityAnalysisDesc: 'Shows the relative impact of each input parameter (prevalence, load, etc.) on the final risk outcome.',
    economicImpactBarAlt: 'Economic impact breakdown bar chart',
    economicImpactBarDesc: 'Distribution of annual costs by categories: medical, productivity, intervention, and mortality.',
    economicImpactPieAlt: 'Pie chart of economic impact percentage distribution',
    economicImpactPieDesc: 'Proportional distribution of total costs, visualizing which sector bears the largest part of the economic burden.',
    manualHeader: 'USER & INTERPRETATION MANUAL',
    shi_veg: 'Vegetables',
    lis_dairy: 'Cheese / Dairy',
    cam_poultry: 'Poultry',
    sta_rte: 'RTE Foods',
    sal_beef: 'Beef',
    clo_canned: 'Canned / Preserved',
    sal_poultry: 'Poultry',
    sal_egg: 'Eggs',
    lis_rte: 'RTE Foods',
    eco_beef: 'Beef',
    noro_leafy: 'Leafy Greens',
    hav_berries: 'Berries / Fresh Fruit',
    vibrio_fish: 'Fish / Seafood',
    bcereus_rice: 'Rice / Cooked Cereals',
  },
  fr: {
    appName: 'ProbRisk',
    appSubtitle: 'QMRA OIRSA.DRIA',
    dashboard: 'Tableau de bord',
    manual: 'Manuel',
    specSheets: 'Fiches Tech',
    initializing: 'Initialisation des noyaux d\'analyse...',
    processing: 'Traitement...',
    deployKernel: 'Exécuter la simulation Monte-Carlo',
    numIterations: 'Nombre d\'itérations',
    numSimulations: 'Nombre de Simulations',
    simulationSettings: 'Paramètres de simulation',
    exportPdf: 'Exporter le rapport PDF',
    exportCsv: 'Exporter les données CSV',
    exportJson: 'Exporter les données JSON',
    reportSummary: 'Résumé du rapport de risque',
    generatedDate: 'Date de génération',
    highContrastLabel: 'Mode Contraste Élevé',
    distributionStats: 'Statistiques de distribution',
    riskExceedance: 'Courbe de dépassement du risque (CCDF)',
    riskExceedanceDesc: 'Probabilité de dépasser un nombre spécifique de cas.',
    economicDrivers: 'Sensibilité de l\'impact économique',
    economicDriversDesc: 'Facteurs ayant la plus grande influence sur le coût total estimé.',
    scenarioAudit: 'Audit du scénario de simulation',
    cumulativeProb: 'Probabilité cumulée',
    exportImage: 'Exporter le graphique en image',
    noResultTitle: 'Pas de données de simulation',
    noResultDesc: 'Configurez les paramètres et lancez la simulation pour visualiser l\'impact biologique et économique.',
    resetParams: 'Réinitialiser les Paramètres',
    selectPathogen: 'Agent Pathogène',
    selectFood: 'Aliment',
    legendSelected: 'Sélectionné',
    legendData: 'Données Disponibles',
    legendNoData: 'Aucune Donnée Spécifique',
    servingFrequencyLabel: 'Fréquence Hebdomadaire',
    servingAnnualLabel: 'Total Annuel',
    servingModeLabel: 'Mode de Consommation',
    tooltipDoseResponse: 'La courbe Dose-Réponse (Bêta-Poisson) estime la probabilité d\'infection en fonction de la quantité de pathogènes ingérés.',
    tooltipInactivation: 'Ce modèle (Weibull) prédit la réduction logarithmique de la charge microbienne en fonction du temps d\'exposition.',
    tooltipCCDF: 'La courbe de probabilité complémentaire (CCDF) montre la probabilité de dépasser un nombre de cas (axe Y vs axe X).',
    tooltipSensitivity: 'Affiche l\'impact relatif (pourcentage) de chaque paramètre sur la variabilité du risque total.',
    tooltipHeatmap: 'Croise le risque individuel annuel avec l\'impact social (cas) pour définir les niveaux d\'alerte sanitaire.',
    tooltipDistribution: 'Densité de probabilité montrant la plage des cas possibles après 10 000 itérations.',
    tooltipEconomic: 'Répartition de la charge économique totale entre les frais médicaux, la perte de productividade et la mortalité.',
    pdfTabLabel: 'Densité de Risque',
    pdfTabSub: 'Distribution de Probabilité',
    pdfChartTitle: 'Distribution de Probabilité (PDF)',
    pdfChartSub: 'Densité de la charge bactérienne au point de consommation',
    pdfExposureFreq: 'Fréquence d\'Exposition',
    pdfDoseUnit: 'UFC / Portion',
    pdfDensityLabel: 'Densité de Probabilité',
    pdfDescription: 'Ce graphique représente la fonction de densité de probabilité (PDF). Il montre la fréquence relative des différents niveaux de contamination dans les portions individuelles. Les pics indiquent les valeurs de charge microbiologique les plus probables au moment de la consommation.',
    pdfXAxisLabel: 'Log UFC / Portion',
    pdfYAxisLabel: 'Densité (%)',
    exposureEvalTitle: 'Évaluation de l\'Exposition',
    exposureEvalBody: 'Détermine la dose ingérée par le consommateur. La dose est le produit de la concentration finale (UFC/g) et de la taille de la portion (g). Cette valeur est critique pour estimer la probabilité d\'infection.',
    exposureEvalFormula: 'Dose (UFC) = Concentration (UFC/g) × Taille Portion (g)',
    techContext: 'Contexte Technique',
    interpretationManual: 'Manuel d\'Interprétation',
    understood: 'Compris',
    scaleLinear: 'Linéaire',
    scaleLog: 'Log₁₀',
    architectureTitle: 'Architecture du Système',
    architectureDesc: 'Principaux composants du code source et logique QMRA.',
    stackTitle: 'Stack Technologique',
    stable: '',
    haccpActive: 'HACCP ACTIF',
    haccpInactive: 'HACCP INACTIF',
    baselineMode: 'MODE DE BASE (AUCUN CONTRÔLE)',
    haccpApplied: 'CONTRÔLE HACCP APPLIQUÉ (-1.5 Log)',
    runtimeStatus: 'Statut Runtime',
    optimal: 'Optimal',
    encrypted: 'Crypté SSL/TLS',
    station: 'Station',
    timeElapsed: 'Temps Écoulé',
    iterations: 'itérations',
    regionNode: 'Nœud Région',
    pathogenVector: 'Vecteur Pathogène',
    parameters: 'Paramètres',
    exposure: 'Exposition',
    biology: 'Biologie',
    economy: 'Économie',
    prevalence: 'Prévalence',
    initialLoad: 'Charge Initiale',
    initialLogStd: 'Écart-type Log',
    servingMass: 'Masse Ration',
    illnessProb: 'Prob. Maladie',
    hospRate: 'Taux Hosp.',
    vslBaseline: 'Base VSL',
    interventionCostParam: 'Coût Intervention/Cas',
    prevalenceDesc: 'Pourcentage de portions contaminées dans le lot.',
    initialLoadDesc: 'Concentration bactérienne initiale (Log₁₀ CFU/g).',
    initialLogStdDesc: 'Écart-type de la charge initiale (variabilité).',
    servingMassDesc: 'Taille de la portion individuelle consommée.',
    illnessProbDesc: 'Probabilité de développer des symptômes après l\'infection.',
    hospRateDesc: 'Pourcentage de cas malades nécessitant une hospitalisation.',
    vslBaselineDesc: 'Valeur statistique de la vie pour les calculs de mortalité.',
    interventionCostDesc: 'Coût de la réponse de santé publique par cas détecté.',
    costHospital: 'Coût Hospitalisation',
    costHospitalDesc: 'Coût moyen par instance d\'hospitalisation.',
    costConsultation: 'Coût Consultation',
    costWorkDay: 'Coût Journée de Travail',
    costWorkDayDesc: 'Perte économique quotidienne due à l\'absence du patient au travail.',
    population: 'Population',
    vslLife: 'VVE (Valeur de la Vie Statistique)',
    darkMode: 'Mode Sombre',
    lightMode: 'Mode Clair',
    settings: 'Paramètres',
    processingChange: 'Changement Proc. (Log)',
    transportChange: 'Changement Transp. (Log)',
    retailChange: 'Changement Retail (Log)',
    preparationChange: 'Changement Prép. (Log)',
    servingsPerYearLabel: 'Portions par An',
    processingDesc: 'Changement logarithmique de la charge microbienne pendant le traitement.',
    transportDesc: 'Changement logarithmique pendant le transport et la logistique.',
    retailDesc: 'Changement logarithmique pendant l\'étape de vente au détail.',
    preparationDesc: 'Changement logarithmique pendant la préparation finale des aliments.',
    servingsPerYearDesc: 'Nombre estimé de portions consommées par la population chaque année.',
    growthRate: 'Taux de croissance',
    growthTime: 'Temps de croissance',
    delta: 'Delta (Inactivation)',
    inactivationTime: 'Temps d\'inactivation',
    primaryFocus: 'Focus d\'Analyse Primaire',
    inMatrix: 'dans la matrice',
    node: 'Nœud',
    viralKernel: 'Kernel Viral',
    bacterialThread: 'Fil Bactérien',
    econMarginDecay: 'Dégradation Marge Économique',
    estAnnualSocialImpact: 'Impact Social Annuel Est.',
    globalRiskForecaster: 'Prévision de Risque Global',
    annualCases: 'Cas Annuels',
    annualDeaths: 'Décès Annuels',
    annualSevereCases: 'Cas Graves Annuels',
    incidenceRate: 'Taux Incidence',
    per100k: 'pour 100k Hab.',
    estInstances: 'Instances Estimées',
    probInfection: 'Prob. Infection',
    probInfectionDesc: 'Risque par portion individuelle',
    probIllness: 'Prob. Maladie',
    probIllnessDesc: 'Risque de symptômes par portion',
    probDeath: 'Prob. Décès',
    probDeathDesc: 'Risque fatal par portion',
    individualYearlyRisk: 'Risque Individuel Annuel',
    infections: 'Infections',
    severeCases: 'Cas Graves',
    deaths: 'Décès',
    fatalityRate: 'Taux Letalité',
    workAbsence: 'Absence Travail',
    ciLabel: 'IC95%',
    deathsPerInfected: 'décès / infectés',
    microbialChain: 'Évolution Chaîne Microbienne',
    loadProgression: 'Progression Charge (Log₁₀ CFU/g)',
    sensitivityMatrix: 'Matrices de Sensibilité',
    weightedImpact: 'Impact pondéré des paramètres',
    probDistribution: 'Distribution Probabiliste',
    illnessDensity: 'Densité d\'occurrence par ration',
    sectorEconomicLoading: 'Charge Économique par Secteur',
    costDistribution: 'Distribution des coûts directs/indirects',
    medicalCosts: 'Frais Médicaux',
    productivityLoss: 'Perte de Productivité',
    interventionCosts: 'Santé Publique / Intervention',
    mortalityCost: 'Impact de la Mortalité',
    chronicCost: 'Impact des Séquelles à Long Terme',
    chronicCases: 'Cas Chroniques',
    dalyMetric: 'DALYs',
    dalyDesc: 'Années de vie ajustées sur l\'incapacité (Charge de Morbidité)',
    chronicCasesDesc: 'Patients avec des complications à long terme (ex: Arthrite, SHU)',
    dalyModuleTitle: 'Module de Calcul DALYs',
    dalyModuleSub: 'Années de Vie Ajustées sur l\'Incapacité',
    yllLabel: 'YLL (Années de Vie Perdues)',
    yllSub: 'Impact de la mortalité prématurée',
    yldAcuteLabel: 'YLD Aigu (Années avec Incapacité)',
    yldAcuteSub: 'Charge de la phase initiale de la maladie',
    yldChronicLabel: 'YLD Chronique / Séquelles',
    yldChronicSub: 'Impact à long terme et complications',
    techSummary: 'Résumé Technique',
    incidenceEst: 'Incidence Estimée',
    mortalityBase: 'Mortalité (YLL Base)',
    disabilityFactor: 'Facteur d\'Incapacité',
    dalyCalculatedMethod: 'Calcul basé sur la charge mondiale de morbidité de l\'OMS. Les DALYs additionnent les années de vie perdues par décès prématuré et les années vécues avec une incapacité.',
    manualTitle: 'MANUEL D\'UTILISATION ET D\'INTERPRÉTATION',
    manualSubtitle: 'ProbRisk QMRA',
    manualTarget: 'Pour spécialistes en sécurité alimentaire, épidémiologistes et décideurs.',
    toc: 'Table des Matières',
    pairs: 'Paires Pathogène-Aliment',
    countries: 'Pays',
    languages: 'Langues',
    introTitle: '1. Introduction & Cadre QMRA',
    resultsTitle: '2. Interprétation des Résultats',
    simulationTitle: '3. Moteur de Simulation Monte Carlo',
    modelsTitle: '4. Graphiques Modèle Biologique',
    economyTitle: '5. Charge Économique & DALYs',
    specSectionTitle: '6. Fiche Technique : Base de Données des Pathogènes',
    specSectionDesc: 'Paramètres scientifiques utilisés pour modéliser le comportement biologique et l\'impact épidémiologique de chaque paire pathogène-aliment.',
    pathogenCol: 'Pathogène',
    foodCol: 'Aliment',
    infectivityCol: 'Infectivité (α, β)',
    severityCol: 'Sévérité (Létalité)',
    chronicCol: 'Chronicité (Taux/DALY)',
    warningTitle: 'Avis Réglementaire et Scientifique',
    warningBody: 'ProbRisk QMRA est un outil pour la formulation de politiques. Les valeurs sont des estimations. Pour les audits officiels, validez toujours avec des données locales.',
    footerEnd: 'Fin du Manuel',
    introBody: 'L\'Évaluation Quantitative des Risques Microbiologiques (QMRA) est un cadre scientifique reconnu par le Codex Alimentarius et l\'OMS pour estimer de manière probabiliste le risque d\'effets néfastes sur la santé.',
    resultsBody: 'En QMRA, la Moyenne est généralement nettement supérieure à la Médiane. Cela est dû à l\'asymétrie positive (queue droite) des distributions microbiologiques. Un P95 élevé indique un risque réel d\'épidémies massives.',
    algorithmLogic: 'Logique par itération (Simulation Stochastique)',
    doseResponseTitle: 'Beta-Poisson (Infection)',
    doseResponseDesc: 'Détermine la probabilité qu\'une seule cellule cause une infection.',
    weibullTitle: 'Inactivation de Weibull',
    weibullDesc: 'Visualise la réduction logarithmique par rapport au temps.',
    montecarloIntro: 'La simulation de Monte Carlo est la pierre angulaire de ProbRisk. Contrairement aux modèles déterministes qui utilisent une valeur fixe unique (comme la "moyenne"), notre moteur exécute 10 000 "histoires" parallèles pour capturer l\'incertitude inhérente à la nature.',
    montecarloStep1Title: 'Étape 1 : Échantillonnage de la contamination',
    montecarloStep1Desc: 'Pour chaque itération, le système décide si la portion est contaminée en fonction de la prévalence. Si c\'est le cas, une charge initiale est attribuée selon une distribution Log-Normale, reflétant la variabilité réelle.',
    montecarloStep2Title: 'Étape 2 : Progression de la chaîne',
    montecarloStep2Desc: 'Les réductions logarithmiques du traitement, du transport et de la préparation sont appliquées, ajoutant ou soustrayant de la charge à chaque étape critique.',
    montecarloStep3Title: 'Étape 3 : Calcul de la dose',
    montecarloStep3Desc: 'La charge finale est multipliée par la taille de la portion pour déterminer les UFC réelles ingérées par le consommateur.',
    montecarloStep4Title: 'Étape 4 : Réponse biologique',
    montecarloStep4Desc: 'La probabilité d\'infection est calculée à l\'aide de modèles Bêta-Poisson ou Exponentiels pour chaque dose individuelle générée.',
    stochasticStabilityTitle: 'Stabilité stochastique',
    stochasticStabilityDesc: 'Pourquoi 10 000 itérations ? Parce que la sécurité alimentaire se soucie des "événements rares". Avec moins de cycles, nous pourrions manquer les scénarios à forte charge qui causent le plus d\'impact.',
    dataIntegrityTitle: 'Intégrité des données',
    dataIntegrityDesc: 'Chaque cycle est indépendant et utilise des générateurs aléatoires de haute qualité pour garantir des résultats impartiaux.',
    whatIfSensitivityTitle: 'Analyse de sensibilité des paramètres clés',
    whatIfSensitivityDesc: 'Ajustez manuellement la prévalence et la charge pour observer l\'impact projeté sur le risque sans exécuter de nouvelle simulation complète.',
    whatIfPrevalence: 'Ajustement de la prévalence',
    whatIfLoad: 'Ajustement de la charge initiale (Log)',
    technicalRiskImpact: 'Impact sur le risque technique',
    economicRiskImpact: 'Impact sur le risque économique',
    simulatedScenario: 'Scénario simulé',
    currentScenario: 'Scénario actuel',
    bioRiskMode: 'Risque Biologique',
    econImpactMode: 'Impact Économique',
    microbialChainAlt: 'Graphique de progression de la charge microbienne à travers la chaîne de processus',
    microbialChainDesc: 'Évolution de la charge microbienne (Log10 UFC/g) de la production primaire à la consommation finale, montrant les réductions et les augmentations à chaque étape.',
    sensitivityAnalysisAlt: 'Graphique à barres d\'analyse de sensibilité',
    sensitivityAnalysisDesc: 'Affiche l\'impact relatif de chaque paramètre d\'entrée (prévalence, charge, etc.) sur le résultat final du risque.',
    economicImpactBarAlt: 'Graphique à barres de la répartition de l\'impact économique',
    economicImpactBarDesc: 'Répartition des coûts annuels par catégories : médical, productivité, intervention et mortalité.',
    economicImpactPieAlt: 'Graphique circulaire de la répartition en pourcentage de l\'impact économique',
    economicImpactPieDesc: 'Distribution proportionnelle des coûts totaux, visualisant quel secteur supporte la plus grande partie du fardeau économique.',
    manualHeader: 'MANUEL D\'UTILISATION ET D\'INTERPRÉTATION',
    shi_veg: 'Légumes',
    lis_dairy: 'Fromage / Produits Laitiers',
    cam_poultry: 'Volaille',
    sta_rte: 'Aliments Prêts à Consommer',
    sal_beef: 'Bœuf',
    clo_canned: 'Conserves / Produits mis en boîte',
    sal_poultry: 'Volaille',
    sal_egg: 'Œufs',
    lis_rte: 'Aliments Prêts à Consommer',
    eco_beef: 'Bœuf',
    noro_leafy: 'Légumes Verts',
    hav_berries: 'Baies / Fruits Frais',
    vibrio_fish: 'Poisson / Fruits de Mer',
    bcereus_rice: 'Riz / Céréales Cuites',
  },
  pt: {
    appName: 'ProbRisk',
    appSubtitle: 'QMRA OIRSA.DRIA',
    dashboard: 'Painel',
    manual: 'Manual',
    specSheets: 'Fichas Técnicas',
    initializing: 'Iniciando núcleos de análise...',
    processing: 'Processando...',
    deployKernel: 'Executar simulação de Monte Carlo',
    numIterations: 'Número de Iterações',
    numSimulations: 'Número de Simulações',
    simulationSettings: 'Configurações de Simulação',
    exportPdf: 'Exportar Relatório PDF',
    exportCsv: 'Exportar Dados CSV',
    exportJson: 'Exportar Dados JSON',
    reportSummary: 'Resumo do Relatório de Risco',
    generatedDate: 'Data de geração',
    highContrastLabel: 'Modo Alto Contraste',
    distributionStats: 'Estatísticas de Distribuição',
    riskExceedance: 'Curva de Excedência de Risco (CCDF)',
    riskExceedanceDesc: 'Probabilidade de exceder um número específico de casos.',
    economicDrivers: 'Sensibilidade do Impacto Económico',
    economicDriversDesc: 'Fatores com maior influência no custo total estimado.',
    scenarioAudit: 'Auditoria do Cenário de Simulação',
    cumulativeProb: 'Probabilidade Acumulada',
    exportImage: 'Exportar gráfico como imagem',
    noResultTitle: 'Sem dados de simulação',
    noResultDesc: 'Configure os parâmetros e execute a simulação para visualizar o impacto biológico e económico.',
    resetParams: 'Redefinir Parâmetros',
    selectPathogen: 'Patógeno',
    selectFood: 'Alimento',
    legendSelected: 'Selecionado',
    legendData: 'Dados Disponíveis',
    legendNoData: 'Sem Dados Específicos',
    servingFrequencyLabel: 'Frequência Semanal',
    servingAnnualLabel: 'Total Anual',
    servingModeLabel: 'Modo de Consumo',
    tooltipDoseResponse: 'A curva Dose-Resposta (Beta-Poisson) estima a probabilidade de infecção baseada na quantidade de patógenos ingeridos.',
    tooltipInactivation: 'Este modelo (Weibull) prevê a redução logarítmica da carga microbiana em função do tempo de exposição.',
    tooltipCCDF: 'A curva de probabilidade complementar (CCDF) mostra quão provável é exceder um número de casos (eixo Y vs eixo X).',
    tooltipSensitivity: 'Mostra o impacto relativo (porcentagem) de cada parâmetro na variabilidade do risco total.',
    tooltipHeatmap: 'Cruza o risco individual anual com o impacto social (casos) para definir níveis de alerta sanitária.',
    tooltipDistribution: 'Densidade de probabilidade mostrando a faixa de casos possíveis após 10.000 iterações.',
    tooltipEconomic: 'Distribuição da carga econômica total entre despesas médicas, perda de produtividade e mortalidade.',
    pdfTabLabel: 'Densidade de Risco',
    pdfTabSub: 'Distribuição de Probabilidade',
    pdfChartTitle: 'Distribuição de Probabilidade (PDF)',
    pdfChartSub: 'Densidade da carga bacteriana no ponto de consumo',
    pdfExposureFreq: 'Frequência de Exposição',
    pdfDoseUnit: 'UFC / Porção',
    pdfDensityLabel: 'Densidade de Probabilidade',
    pdfDescription: 'Este gráfico representa a função densidade de probabilidade (PDF). Mostra a frequência relativa dos diferentes níveis de contaminação nas porções individuais. Os picos indicam os valores de carga microbiológica mais prováveis no momento do consumo.',
    pdfXAxisLabel: 'Log UFC / Porção',
    pdfYAxisLabel: 'Densidade (%)',
    exposureEvalTitle: 'Avaliação da Exposição',
    exposureEvalBody: 'Determina a dose ingerida pelo consumidor. A dose é o produto da concentração final (UFC/g) e do tamanho da porção (g). Este valor é crítico para estimar a probabilidade de infecção.',
    exposureEvalFormula: 'Dose (UFC) = Concentração (UFC/g) × Tamanho da Porção (g)',
    techContext: 'Contexto Técnico',
    interpretationManual: 'Manual de Interpretação',
    understood: 'Entendido',
    scaleLinear: 'Linear',
    scaleLog: 'Log₁₀',
    architectureTitle: 'Arquitetura do Sistema',
    architectureDesc: 'Principais componentes do código-fonte e lógica QMRA.',
    stackTitle: 'Stack Tecnológico',
    stable: '',
    haccpActive: 'HACCP ATIVO',
    haccpInactive: 'HACCP INATIVO',
    baselineMode: 'MODO BASE (SEM CONTROLE)',
    haccpApplied: 'CONTROLE HACCP APLICADO (-1.5 Log)',
    runtimeStatus: 'Status Runtime',
    optimal: 'Ideal',
    encrypted: 'Criptografado SSL/TLS',
    station: 'Estação',
    timeElapsed: 'Tempo Decorrido',
    iterations: 'iterações',
    regionNode: 'Nó de Região',
    pathogenVector: 'Vetor Patógeno',
    parameters: 'Parâmetros',
    exposure: 'Exposição',
    biology: 'Biologia',
    economy: 'Economia',
    prevalence: 'Prevalência',
    initialLoad: 'Carga Inicial',
    initialLogStd: 'Desv. Log Carga',
    servingMass: 'Massa da Porção',
    illnessProb: 'Prob. Doença',
    hospRate: 'Taxa Hosp.',
    vslBaseline: 'Base VSL',
    interventionCostParam: 'Custo Intervenção/Caso',
    prevalenceDesc: 'Porcentagem de porções contaminadas no lote.',
    initialLoadDesc: 'Concentração bacteriana inicial (Log₁₀ CFU/g).',
    initialLogStdDesc: 'Desvio padrão da carga inicial (variabilidade).',
    servingMassDesc: 'Tamanho da porção individual consumida.',
    illnessProbDesc: 'Probabilidade de desenvolver sintomas após a infecção.',
    hospRateDesc: 'Porcentagem de casos doentes que requerem hospitalização.',
    vslBaselineDesc: 'Valor estatístico da vida para cálculos de mortalidade.',
    interventionCostDesc: 'Custo da resposta de saúde pública por caso detectado.',
    costHospital: 'Custo Hospitalização',
    costHospitalDesc: 'Custo médio por instância de hospitalização.',
    costConsultation: 'Custo Consulta',
    costWorkDay: 'Custo Dia de Trabalho',
    costWorkDayDesc: 'Perda econômica diária devido à ausência do paciente no trabalho.',
    population: 'População',
    vslLife: 'VVE (Valor da Vida Estatística)',
    darkMode: 'Modo Escuro',
    lightMode: 'Modo Claro',
    settings: 'Configurações',
    processingChange: 'Mudança Proc. (Log)',
    transportChange: 'Mudança Transp. (Log)',
    retailChange: 'Mudança Retail (Log)',
    preparationChange: 'Mudança Prep. (Log)',
    servingsPerYearLabel: 'Porções por Ano',
    processingDesc: 'Mudança logarítmica na carga microbiana durante o processamento.',
    transportDesc: 'Mudança logarítmica durante o transporte e logística.',
    retailDesc: 'Mudança logarítmica durante a fase de varejo.',
    preparationDesc: 'Mudança logarítmica durante a preparação final do alimento.',
    servingsPerYearDesc: 'Número estimado de porções consumidas pela população anualmente.',
    growthRate: 'Taxa de Crescimento',
    growthTime: 'Tempo de Crescimento',
    delta: 'Delta (Inativação)',
    inactivationTime: 'Tempo de Inativação',
    primaryFocus: 'Foco de Análise Primária',
    inMatrix: 'na matriz de',
    node: 'Nó',
    viralKernel: 'Kernel Viral',
    bacterialThread: 'Thread Bacteriano',
    econMarginDecay: 'Degradação da Margem Econômica',
    estAnnualSocialImpact: 'Impacto Social Anual Est.',
    globalRiskForecaster: 'Previsor de Risco Global',
    annualCases: 'Casos Anuais',
    annualDeaths: 'Mortes Anuais',
    annualSevereCases: 'Casos Graves Anuais',
    incidenceRate: 'Taxa Incidência',
    per100k: 'por 100k Hab.',
    estInstances: 'Instâncias Estimadas',
    probInfection: 'Prob. Infecção',
    probInfectionDesc: 'Risco por porção individual',
    probIllness: 'Prob. Doença',
    probIllnessDesc: 'Risco de sintomas por porção',
    probDeath: 'Prob. Morte',
    probDeathDesc: 'Risco fatal por porção',
    individualYearlyRisk: 'Risco Individual Anual',
    infections: 'Infecções',
    severeCases: 'Casos Graves',
    deaths: 'Mortes',
    fatalityRate: 'Taxa Letalidade',
    workAbsence: 'Ausência Trab.',
    ciLabel: 'IC95%',
    deathsPerInfected: 'mortes / infectados',
    microbialChain: 'Evolução Cadeia Microbiana',
    loadProgression: 'Progressão Carga (Log₁₀ CFU/g)',
    sensitivityMatrix: 'Matrizes de Sensibilidade',
    weightedImpact: 'Impacto ponderado de parâmetros',
    probDistribution: 'Distribuição Probabilística',
    illnessDensity: 'Densidade de ocorrência por porção',
    sectorEconomicLoading: 'Carga Econômica por Setor',
    costDistribution: 'Distribuição de custos diretos/indiretos',
    medicalCosts: 'Despesas Médicas',
    productivityLoss: 'Perda de Produtividade',
    interventionCosts: 'Saúde Pública / Intervenção',
    mortalityCost: 'Impacto da Mortalidade',
    chronicCost: 'Impacto de Sequelas',
    chronicCases: 'Casos Crônicos',
    dalyMetric: 'DALYs',
    dalyDesc: 'Anos de vida ajustados por incapacidade (Carga de Doença)',
    chronicCasesDesc: 'Pacientes com complicações de longo prazo (ex: Artrite, SHU)',
    dalyModuleTitle: 'Módulo Calculador DALYs',
    dalyModuleSub: 'Anos de Vida Ajustados por Incapacidade',
    yllLabel: 'YLL (Anos de Vida Perdidos)',
    yllSub: 'Impacto por mortalidade prematura',
    yldAcuteLabel: 'YLD Agudo (Anos com Incapacidade)',
    yldAcuteSub: 'Carga pela fase inicial da doença',
    yldChronicLabel: 'YLD Crônico / Sequelas',
    yldChronicSub: 'Impacto a longo prazo e complicações',
    techSummary: 'Resumo Técnico',
    incidenceEst: 'Incidência Estimada',
    mortalityBase: 'Mortalidad (YLL Base)',
    disabilityFactor: 'Fator de Incapacidade',
    dalyCalculatedMethod: 'Cálculo baseado na carga global de doenças da OMS. Os DALYs somam os anos de vida perdidos por morte prematura e os anos vividos com incapacidade.',
    manualTitle: 'MANUAL DE USO E INTERPRETAÇÃO',
    manualSubtitle: 'ProbRisk QMRA',
    manualTarget: 'Para especialistas em segurança alimentar, epidemiologistas e tomadores de decisão.',
    toc: 'Índice',
    pairs: 'Pares Patógeno-Alimento',
    countries: 'Países',
    languages: 'Idiomas',
    introTitle: '1. Introdução e Estrutura QMRA',
    resultsTitle: '2. Interpretação de Resultados',
    simulationTitle: '3. Motor de Simulação Monte Carlo',
    modelsTitle: '4. Gráficos de Modelo Biológico',
    economyTitle: '5. Avaliação de Carga Econômica e DALYs',
    specSectionTitle: '6. Folha Técnica: Base de Dados de Patógenos',
    specSectionDesc: 'Parâmetros científicos utilizados para modelar o comportamento biológico e o impacto epidemiológico de cada par patógeno-alimento.',
    pathogenCol: 'Patógeno',
    foodCol: 'Alimento',
    infectivityCol: 'Infectividade (α, β)',
    severityCol: 'Severidade (Letalidade)',
    chronicCol: 'Cronicidade (Taxa/DALY)',
    warningTitle: 'Aviso Regulatório e Científico',
    warningBody: 'ProbRisk QMRA é uma ferramenta para formulação de políticas. Os valores são estimativas. Para auditorias oficiais, valide sempre com dados locais.',
    footerEnd: 'Fim do Manual',
    introBody: 'A Avaliação Quantitativa de Risco Microbiológico (QMRA) é uma estrutura científica reconhecida pelo Codex Alimentarius e pela OMS para estimar probabilisticamente o risco de efeitos adversos à saúde.',
    resultsBody: 'Na QMRA, a Média é geralmente significativamente maior do que a Mediana. Isso se deve ao viés positivo (cauda direita) das distribuições microbiológicas. Um P95 alto indica um risco real de surtos massivos.',
    algorithmLogic: 'Lógica por iteração (Simulação Estocástica)',
    doseResponseTitle: 'Beta-Poisson (Infecção)',
    doseResponseDesc: 'Determina a probabilidade de uma única célula causar infecção.',
    weibullTitle: 'Inativação de Weibull',
    weibullDesc: 'Visualiza a redução logarítmica em relação ao tempo.',
    montecarloIntro: 'A simulação de Monte Carlo é a pedra angular do ProbRisk. Ao contrário dos modelos determinísticos que usam um único valor físico (como a "média"), nosso mecanismo executa 10.000 "histórias" paralelas para capturar a incerteza inerente à natureza.',
    montecarloStep1Title: 'Passo 1: Amostragem de Contaminação',
    montecarloStep1Desc: 'Para cada iteração, o sistema decide se a porção está contaminada com base na Prevalência. Se estiver, uma carga inicial é atribuída seguindo uma distribuição Log-Normal, refletindo a variabilidade do mundo real.',
    montecarloStep2Title: 'Passo 2: Progressão da Cadeia',
    montecarloStep2Desc: 'Reduções logarítmicas de processamento, transporte e preparação são aplicadas, adicionando ou subtraindo carga em cada estágio crítico.',
    montecarloStep3Title: 'Passo 3: Cálculo da Dose',
    montecarloStep3Desc: 'A carga final é multiplicada pelo tamanho da porção para determinar as CFUs reais ingeridas pelo consumidor.',
    montecarloStep4Title: 'Passo 4: Resposta Biológica',
    montecarloStep4Desc: 'A probabilidade de infecção é calculada usando modelos Beta-Poisson ou Exponenciais para cada dose individual gerada.',
    stochasticStabilityTitle: 'Estabilidade Estocástica',
    stochasticStabilityDesc: 'Por que 10.000 iterações? Porque a segurança alimentar se preocupa com "eventos raros". Com menos ciclos, podemos perder cenários de alta carga que causam o maior impacto.',
    dataIntegrityTitle: 'Integridade de Dados',
    dataIntegrityDesc: 'Cada ciclo é independente e utiliza geradores aleatórios de alta qualidade para garantir resultados imparciais.',
    whatIfSensitivityTitle: 'Análise de Sensibilidade de Parámetros Chave',
    whatIfSensitivityDesc: 'Ajuste manualmente a prevalência e a carga para observar o impacto projetado no risco sem executar uma nova simulação completa.',
    whatIfPrevalence: 'Ajuste de Prevalência',
    whatIfLoad: 'Ajuste de Carga Inicial (Log)',
    technicalRiskImpact: 'Impacto no Risco Técnico',
    economicRiskImpact: 'Impacto no Risco Econômico',
    simulatedScenario: 'Cenário Simulado',
    currentScenario: 'Cenário Atual',
    bioRiskMode: 'Risco Biológico',
    econImpactMode: 'Impacto Econômico',
    microbialChainAlt: 'Gráfico de progressão da carga microbiana através da cadeia de processo',
    microbialChainDesc: 'Evolução da carga microbiana (Log10 CFU/g) da produção primária ao consumo final, mostrando reduções e aumentos em cada estágio.',
    sensitivityAnalysisAlt: 'Gráfico de barras de análise de sensibilidade',
    sensitivityAnalysisDesc: 'Mostra o impacto relativo de cada parâmetro de entrada (prevalência, carga, etc.) no resultado de risco final.',
    economicImpactBarAlt: 'Gráfico de barras de detalhamento do impacto econômico',
    economicImpactBarDesc: 'Distribuição dos custos anuais por categorias: médico, produtividade, intervenção e mortalidade.',
    economicImpactPieAlt: 'Gráfico de pizza da distribuição de porcentagem de impacto econômico',
    economicImpactPieDesc: 'Distribuição proporcional dos custos totais, visualizando qual setor suporta a maior parte da carga econômica.',
    manualHeader: 'MANUAL DE USO E INTERPRETAÇÃO',
    shi_veg: 'Vegetais',
    lis_dairy: 'Queijo / Laticínios',
    cam_poultry: 'Aves',
    sta_rte: 'Alimentos RTE',
    sal_beef: 'Carne bovina',
    clo_canned: 'Conservas / Alimentos em lata',
    sal_poultry: 'Aves',
    sal_egg: 'Ovos',
    lis_rte: 'Alimentos RTE',
    eco_beef: 'Carne bovina',
    noro_leafy: 'Folclóricas / Verdes',
    hav_berries: 'Bagos / Frutas frescas',
    vibrio_fish: 'Peixes / Frutos do mar',
    bcereus_rice: 'Arroz / Cereais cozidos',
  }
};
