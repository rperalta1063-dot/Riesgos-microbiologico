import { SimulationResult, Country, PathogenPair } from '../types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const exportToCsv = (
  result: SimulationResult,
  country: Country,
  pair: PathogenPair
) => {
  const headers = ['Iteration', 'Infected (Sample)', 'Annual Cases (Projected)', 'Economic Impact (Total)'];
  if (result.rawIllVuln) headers.push('Infected (Vulnerable Sample)');

  const rows = [
    headers,
    ...result.rawIll.map((val, i) => {
      const row = [
        i + 1,
        val,
        result.rawAnnual[i],
        result.rawEcon[i]
      ];
      // Backward compatibility for rawIllVuln
      if (result.rawIllVuln && typeof result.rawIllVuln === 'object' && !Array.isArray(result.rawIllVuln)) {
        const firstKey = Object.keys(result.rawIllVuln)[0];
        if (firstKey) row.push((result.rawIllVuln as any)[firstKey][i]);
      } else if (result.rawIllVuln && Array.isArray(result.rawIllVuln)) {
        row.push((result.rawIllVuln as any)[i]);
      }
      return row;
    })
  ];

  const csvContent = rows.map(e => e.join(",")).join("\n");
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  const filename = `ProbRisk_Data_${country.id}_${pair.id}_${new Date().toISOString().split('T')[0]}.csv`;
  link.setAttribute("download", filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToJson = (
  result: SimulationResult,
  country: Country,
  pair: PathogenPair,
  params: any
) => {
  const data = {
    metadata: {
      appName: 'ProbRisk',
      generatedDate: new Date().toISOString(),
      country: country,
      pathogenPair: pair,
      parameters: params
    },
    summary: result.summary,
    economicBreakdown: result.economicBreakdown,
    statistics: result.stats,
    rawData: {
      infections: result.rawIll,
      annualCases: result.rawAnnual,
      economicImpact: result.rawEcon
    }
  };

  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  const filename = `ProbRisk_Data_${country.id}_${pair.id}_${new Date().toISOString().split('T')[0]}.json`;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToPdf = (
  result: SimulationResult,
  country: Country,
  pair: PathogenPair,
  params: any
) => {
  const doc = new jsPDF();
  const date = new Date().toLocaleString();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header
  doc.setFontSize(22);
  doc.setTextColor(30, 41, 59); // slate-800
  doc.text('ProbRisk QMRA Report', 14, 22);
  
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139); // slate-500
  doc.text(`Generated on: ${date}`, 14, 28);
  doc.line(14, 32, pageWidth - 14, 32);

  // Metadata Section
  doc.setFontSize(14);
  doc.setTextColor(30, 41, 59);
  doc.text('Scenario Information', 14, 42);
  
  autoTable(doc, {
    startY: 45,
    head: [['Attribute', 'Value']],
    body: [
      ['Country', `${country.name} (${(country.pop / 1e6).toFixed(1)}M pop)`],
      ['Pathogen', pair.pathogen],
      ['Food Matrix', pair.food],
      ['Monte Carlo Iterations', result.rawIll.length.toLocaleString()]
    ],
    theme: 'striped',
    headStyles: { fillColor: [51, 65, 85] }
  });

  // Parameters Section
  doc.setFontSize(14);
  doc.text('Model Parameters', 14, (doc as any).lastAutoTable.finalY + 15);
  
  autoTable(doc, {
    startY: (doc as any).lastAutoTable.finalY + 18,
    head: [['Parameter', 'Value']],
    body: [
      ['Initial Prevalence', `${(params.prevalence * 100).toFixed(2)}%`],
      ['Mean Initial Load', `${params.initialLogMean.toFixed(2)} Log CFU/g`],
      ['Initial Load Std Dev', `${params.initialLogStd.toFixed(2)} Log`],
      ['Serving Size', `${params.servingSize}g`],
      ['Dose-Response Model', (pair.drModel || 'Exponential').toUpperCase()],
      ['D-R Parameters', pair.drModel === 'beta-poisson' ? `Alpha: ${pair.alpha}, Beta: ${pair.beta}` : `K: ${pair.k || pair.alpha}`],
      ['Processing Reduction', `${Math.abs(params.processingDeltaLog).toFixed(2)} Log`],
      ['Preparation Reduction', `${Math.abs(params.preparationDeltaLog).toFixed(2)} Log`]
    ],
    theme: 'grid',
    headStyles: { fillColor: [71, 85, 105] }
  });

  // Results Section
  doc.setFontSize(14);
  doc.text('Simulation Findings', 14, (doc as any).lastAutoTable.finalY + 15);
  
  const body = [
    ['Prob. of Illness per Serving', `${(result.summary.probIllness * 100).toExponential(3)}%`],
    ['Estimated Annual Cases', Math.ceil(result.summary.annualCases).toLocaleString()],
    ['Health Burden (DALYs)', result.summary.annualDALYs.toFixed(2)],
    ['Total Economic Impact', `$${result.economicBreakdown.total.toLocaleString(undefined, { minimumFractionDigits: 2 })} USD`]
  ];

  if ((result.summary as any).vulnerable) {
    body.push(['---', '---']);
    body.push(['Vulnerable Population', (params.populationType || 'Custom').toUpperCase()]);
    body.push(['Prob. Illness (Vuln)', `${((result.summary as any).vulnerable.probIllness * 100).toExponential(3)}%`]);
    body.push(['Annual Cases (Vuln)', Math.ceil((result.summary as any).vulnerable.annualCases).toLocaleString()]);
    body.push(['Individual Yearly Risk (Vuln)', (result.summary as any).vulnerable.individualYearlyRisk.toExponential(3)]);
  }

  autoTable(doc, {
    startY: (doc as any).lastAutoTable.finalY + 18,
    head: [['Key Performance Indicator', 'Value']],
    body: body,
    theme: 'striped',
    headStyles: { fillColor: [30, 41, 59] }
  });

  // Footer Disclaimer
  const finalY = (doc as any).lastAutoTable.finalY + 20;
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text('Disclaimer: This report is generated by the ProbRisk QMRA stochastic engine. Results are probabilistic estimations.', 14, finalY);
  doc.text('Intended for professional risk assessment only.', 14, finalY + 5);

  const filename = `ProbRisk_Report_${country.id}_${pair.id}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
};

export const exportToText = (
  result: SimulationResult,
  country: Country,
  pair: PathogenPair,
  params: any
) => {
  const date = new Date().toLocaleString();
  
  const content = `==========================================================
PROBRISK QMRA - REPORTE DE RESUMEN DE SIMULACIÓN
==========================================================
Fecha: ${date}
País: ${country.name} (${country.pop.toLocaleString()} habitantes)
Patógeno: ${pair.pathogen}
Matriz Alimentaria: ${pair.food}

----------------------------------------------------------
PARÁMETROS DEL ESCENARIO
----------------------------------------------------------
Iteraciones Monte Carlo: ${result.rawIll.length.toLocaleString()}
Prevalencia Inicial: ${(params.prevalence * 100).toFixed(2)}%
Carga Inicial (Media): ${params.initialLogMean.toFixed(2)} Log CFU/g
Carga Inicial (Desv. Est.): ${params.initialLogStd.toFixed(2)} Log
Tamaño de Porción: ${params.servingSize}g
Modelo D-R: ${(pair.drModel || 'Exponential').toUpperCase()}
Parámetros D-R: ${pair.drModel === 'beta-poisson' ? `Alpha: ${pair.alpha}, Beta: ${pair.beta}` : `K: ${pair.k || pair.alpha}`}
Reducción por Proceso: ${Math.abs(params.processingDeltaLog).toFixed(2)} Log
Reducción por Preparación: ${Math.abs(params.preparationDeltaLog).toFixed(2)} Log
Población de Riesgo: ${country.pop.toLocaleString()} habitantes
Raciones por Año: ${country.servings.toLocaleString()}

----------------------------------------------------------
RESULTADOS DE EXPOSICIÓN (Dosis)
----------------------------------------------------------
Exposición Media: ${result.stats.mean.toExponential(3)} CFU/porción
Percentil 95 (P95): ${result.stats.p95.toExponential(3)} CFU/porción
Percentil 5 (P5): ${result.stats.p5.toExponential(3)} CFU/porción
Desviación Estándar: ${result.stats.sd.toExponential(3)}

----------------------------------------------------------
ANÁLISIS DE RIESGO SANITARIO
----------------------------------------------------------
Probabilidad de Enfermedad (Gral): ${(result.summary.probIllness * 100).toExponential(3)}%
Probabilidad de Infección (Gral): ${(result.summary.probInfection * 100).toExponential(3)}%
Casos Anuales Estimados (Gral): ${Math.ceil(result.summary.annualCases).toLocaleString()}
Carga de Salud (DALYs): ${result.summary.annualDALYs.toFixed(2)} años

${(result.summary as any).vulnerable ? `----------------------------------------------------------
ANÁLISIS POBLACIÓN VULNERABLE (${(params.populationType || 'Custom').toUpperCase()})
----------------------------------------------------------
Probabilidad de Enfermedad (Vuln): ${((result.summary as any).vulnerable.probIllness * 100).toExponential(3)}%
Casos Anuales Estimados (Vuln): ${Math.ceil((result.summary as any).vulnerable.annualCases).toLocaleString()}
Riesgo Individual Anual: ${(result.summary as any).vulnerable.individualYearlyRisk.toExponential(3)}
` : ''}

----------------------------------------------------------
IMPACTO ECONÓMICO (Anualizado)
----------------------------------------------------------
Costo Total Estimado: $${result.economicBreakdown.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
  - Costo Directo (Médico): $${result.economicBreakdown.medical.toLocaleString()} USD
  - Pérdida Productividad: $${result.economicBreakdown.productivity.toLocaleString()} USD
  - Costo Social (Mortalidad): $${result.economicBreakdown.mortality.toLocaleString()} USD

----------------------------------------------------------
NOTAS METODOLÓGICAS
----------------------------------------------------------
Este reporte ha sido generado utilizando el motor de simulación probabilística ProbRisk QMRA. 
Los resultados son proyecciones basadas en modelos de dosis-respuesta y distribuciones 
teóricas (Weibull/Beta-Poisson) y deben utilizarse como apoyo a la toma de decisiones 
en inocuidad alimentaria.

SafeDigest Engine // QMRA-STOCHASTIC-V1
==========================================================`;

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  const filename = `ProbRisk_Resumen_${country.id}_${pair.id}_${new Date().toISOString().split('T')[0]}.txt`;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
