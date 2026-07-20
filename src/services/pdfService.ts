import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { SimulationResult, SimulationParams, Country, PathogenPair } from '../types';
import { Translation } from '../lib/translations';

export const exportToPdf = (
  result: SimulationResult,
  params: SimulationParams,
  country: Country,
  pair: PathogenPair,
  t: Translation,
  formatCurrency: (v: number) => string
) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Helper for line breaks and headers
  let currentY = 20;
  const addHeader = (text: string, size = 14, color: [number, number, number] = [15, 23, 42]) => {
    doc.setFontSize(size);
    doc.setTextColor(color[0], color[1], color[2]);
    doc.setFont('helvetica', 'bold');
    doc.text(text, 20, currentY);
    currentY += size * 0.5 + 5;
  };

  const addText = (text: string, size = 10, color: [number, number, number] = [71, 85, 105]) => {
    doc.setFontSize(size);
    doc.setTextColor(color[0], color[1], color[2]);
    doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(text, pageWidth - 40);
    doc.text(lines, 20, currentY);
    currentY += (lines.length * (size * 0.4)) + 4;
  };

  // Header Section
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setFontSize(24);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text('ProbRisk QMRA System', 20, 20);
  
  doc.setFontSize(10);
  doc.setTextColor(148, 163, 184);
  doc.setFont('helvetica', 'normal');
  doc.text('REPORTE TÉCNICO DE EVALUACIÓN DE RIESGOS MICROBIANOS', 20, 28);
  
  doc.setFontSize(8);
  doc.text(`ID: MC_${Math.random().toString(36).substring(7).toUpperCase()} | Fecha: ${new Date().toLocaleString()}`, pageWidth - 20, 28, { align: 'right' });

  currentY = 55;

  // 1. Executive Summary
  addHeader('1. Resumen Ejecutivo del Escenario');
  addText(`Este reporte detalla los resultados de la simulación de Monte Carlo para la combinación de ${pair.pathogen} en ${pair.food}, evaluada para la región de ${country.name}. El modelo integra la variabilidad estocástica en la cadena de suministro, la virulencia del patógeno y los factores de susceptibilidad poblacional.`);

  // Summary Table (Top KPIs)
  autoTable(doc, {
    startY: currentY,
    head: [['Indicador Clave', 'Valor Estimado (Media)', 'Intervalo de Confianza (95%)']],
    body: [
      ['Riesgo de Enfermedad (por ración)', (result.summary.probIllness * 100).toExponential(2) + '%', `[${(result.summary.probIllnessCI[0] * 100).toExponential(1)}, ${(result.summary.probIllnessCI[1] * 100).toExponential(1)}]%`],
      ['Casos Clínicos Anuales', Math.round(result.summary.annualCases).toLocaleString(), `[${Math.round(result.summary.annualCasesCI[0]).toLocaleString()}, ${Math.round(result.summary.annualCasesCI[1]).toLocaleString()}]`],
      ['Fallecimientos Estimados', Math.round(result.summary.annualDeaths).toLocaleString(), `[${Math.round(result.summary.annualDeathsCI[0]).toLocaleString()}, ${Math.round(result.summary.annualDeathsCI[1]).toLocaleString()}]`],
      ['Impacto Económico Total', formatCurrency(result.economicBreakdown.total), `[${formatCurrency(result.economicBreakdown.totalCI[0])}, ${formatCurrency(result.economicBreakdown.totalCI[1])}]`],
    ],
    theme: 'grid',
    headStyles: { fillColor: [37, 99, 235], fontSize: 9 },
    styles: { fontSize: 8 },
    margin: { horizontal: 20 },
  });

  currentY = (doc as any).lastAutoTable.finalY + 15;

  // 2. Model Parameters
  addHeader('2. Configuración del Modelo de Simulación');
  
  const paramTableData = [
    ['Población Evaluada', country.name, 'Iteraciones', params.populationSize.toLocaleString()],
    ['Prevalencia (Inicial)', (params.prevalence * 100).toFixed(1) + '%', 'Carga Inicial (Log10)', `${params.initialLogMean.toFixed(1)} ± ${params.initialLogStd.toFixed(2)}`],
    ['Tamaño de Ración', `${params.servingSize}g`, 'Raciones/Año', params.servingsPerYear.toLocaleString()],
    ['Modelo Dosis-Respuesta', params.drModel?.toUpperCase() || 'BETA-POISSON', 'Parámetros DR', `a: ${params.alpha}, b: ${params.beta}`],
  ];

  autoTable(doc, {
    startY: currentY,
    head: [['Parámetro', 'Valor', 'Parámetro', 'Valor']],
    body: paramTableData,
    theme: 'plain',
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [241, 245, 249], textColor: [15, 23, 42], fontStyle: 'bold' },
    margin: { horizontal: 20 },
  });

  currentY = (doc as any).lastAutoTable.finalY + 15;

  // 3. Epidemiological Impact
  addHeader('3. Impacto Epidemiológico Detallado');
  
  const epiBody = [
    ['Infecciones Anuales', Math.round(result.summary.annualInfections).toLocaleString(), `IC: [${Math.round(result.summary.annualInfectionsCI[0]).toLocaleString()}, ${Math.round(result.summary.annualInfectionsCI[1]).toLocaleString()}]`],
    ['Hospitalizaciones', Math.round(result.summary.annualHospitalized).toLocaleString(), `IC: [${Math.round(result.summary.annualHospitalizedCI[0]).toLocaleString()}, ${Math.round(result.summary.annualHospitalizedCI[1]).toLocaleString()}]`],
    ['Ausentismo Laboral (Días)', Math.round(result.summary.annualAbsence).toLocaleString(), `IC: [${Math.round(result.summary.annualAbsenceCI[0]).toLocaleString()}, ${Math.round(result.summary.annualAbsenceCI[1]).toLocaleString()}]`],
    ['Carga de Morbilidad (DALYs)', result.summary.annualDALYs.toFixed(2), `IC: [${result.summary.annualDALYsCI[0].toFixed(1)}, ${result.summary.annualDALYsCI[1].toFixed(1)}]`],
  ];

  autoTable(doc, {
    startY: currentY,
    head: [['Métrica de Salud', 'Valor Medio', 'Rango de Incertidumbre']],
    body: epiBody,
    theme: 'striped',
    headStyles: { fillColor: [71, 85, 105], fontSize: 9 },
    styles: { fontSize: 8 },
    margin: { horizontal: 20 },
  });

  currentY = (doc as any).lastAutoTable.finalY + 15;

  // Check if we need a new page for Economic Impact
  if (currentY > pageHeight - 80) {
    doc.addPage();
    currentY = 20;
  }

  // 4. Economic Burden Analysis
  addHeader('4. Análisis de Carga Económica');
  
  const econBody = [
    ['Costos Médicos Directos', formatCurrency(result.economicBreakdown.medical), 'Hospitalización y atención ambulatoria'],
    ['Pérdida de Productividad', formatCurrency(result.economicBreakdown.productivity), 'Ausentismo laboral y cuidados familiares'],
    ['Costo de Mortalidad (VSL)', formatCurrency(result.economicBreakdown.mortality), 'Valor estadístico de la vida perdida'],
    ['Carga por Casos Crónicos', formatCurrency(result.economicBreakdown.chronic), 'Manejo de secuelas de largo plazo'],
    ['Intervenciones Sanitarias', formatCurrency(result.economicBreakdown.intervention), 'Vigilancia y respuesta del sistema'],
    ['COSTO TOTAL ESTIMADO', formatCurrency(result.economicBreakdown.total), 'Impacto sistémico consolidado'],
  ];

  autoTable(doc, {
    startY: currentY,
    head: [['Categoría de Costo', 'Impacto Económico', 'Descripción']],
    body: econBody,
    theme: 'grid',
    headStyles: { fillColor: [15, 23, 42], fontSize: 9 },
    styles: { fontSize: 8 },
    margin: { horizontal: 20 },
    columnStyles: {
      1: { fontStyle: 'bold', textColor: [22, 163, 74] }
    }
  });

  // Technical Footnote
  const footerY = pageHeight - 30;
  doc.setDrawColor(226, 232, 240);
  doc.line(20, footerY, pageWidth - 20, footerY);
  
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  const disclaimer = 'AVISO LEGAL Y TÉCNICO: Este informe es generado mediante modelos matemáticos de simulación y no constituye una medición directa en tiempo real. Los resultados deben ser interpretados como probabilidades estadísticas basadas en los parámetros ingresados. El sistema ProbRisk QMRA sigue las guías internacionales de FAO/WHO para la Evaluación de Riesgos Microbiológicos.';
  const disclaimerLines = doc.splitTextToSize(disclaimer, pageWidth - 40);
  doc.text(disclaimerLines, 20, footerY + 5);
  
  doc.text(`Generado por ProbRisk QMRA Engine v2.4 | Licencia: Académica/Gubernamental`, 20, pageHeight - 10);
  doc.text(`Página 1 de 1`, pageWidth - 20, pageHeight - 10, { align: 'right' });

  doc.save(`Reporte_QMRA_${country.id}_${pair.id}_${new Date().toISOString().split('T')[0]}.pdf`);
};

export const exportManualToPdf = (t: Translation, pairs: PathogenPair[]) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let currentY = 20;

  const checkPage = (h: number) => {
    if (currentY + h > pageHeight - 20) {
      doc.addPage();
      currentY = 20;
      return true;
    }
    return false;
  };

  const addText = (text: string, size: number = 10, color: [number, number, number] = [71, 85, 105], bold = false, spacing = 5) => {
    doc.setFontSize(size);
    doc.setTextColor(color[0], color[1], color[2]);
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    const lines = doc.splitTextToSize(text, pageWidth - 40);
    doc.text(lines, 20, currentY);
    currentY += (lines.length * (size * 0.4)) + spacing;
  };

  // 1. Front Page
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.setTextColor(30, 41, 59);
  doc.text(t.appName, pageWidth / 2, 80, { align: 'center' });
  
  doc.setFontSize(14);
  doc.setTextColor(37, 99, 235);
  doc.text('QMRA Quantitative Microbial Risk Assessment', pageWidth / 2, 90, { align: 'center' });

  doc.setFontSize(10);
  doc.setTextColor(148, 163, 184);
  doc.setFont('helvetica', 'normal');
  doc.text(`${t.appSubtitle} | Technical Reference Manual v2025`, pageWidth / 2, 100, { align: 'center' });

  doc.setDrawColor(37, 99, 235);
  doc.setLineWidth(1);
  doc.line(pageWidth / 2 - 20, 110, pageWidth / 2 + 20, 110);

  doc.setFontSize(18);
  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'bold');
  doc.text(t.manualHeader || 'Manual de Referencia Técnica', pageWidth / 2, 130, { align: 'center' });

  doc.setFontSize(11);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(100, 116, 139);
  const targetText = doc.splitTextToSize(t.manualTarget, pageWidth - 80);
  doc.text(targetText, pageWidth / 2, 140, { align: 'center' });

  doc.addPage();
  currentY = 20;

  // 2. Introduction
  doc.setFontSize(18);
  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'bold');
  doc.text(t.introTitle, 20, currentY);
  currentY += 12;
  addText(t.introBody, 10, [71, 85, 105], false, 15);

  // 3. Interface & Controls
  checkPage(80);
  doc.setFontSize(16);
  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'bold');
  doc.text('Interface y Controles', 20, currentY);
  currentY += 10;
  
  addText('Modo de Selección de Raciones:', 10, [30, 41, 59], true, 2);
  addText('• Frecuencia Semanal: Define el consumo promedio semanal por persona. El sistema proyecta el impacto anual usando el censo poblacional.', 9, [71, 85, 105], false, 3);
  addText('• Total por Año: Permite auditorías directas de lotes industriales específicos.', 9, [71, 85, 105], false, 8);

  addText('Selección Dual (Pestañas):', 10, [30, 41, 59], true, 2);
  addText('Sistema de navegación que permite seleccionar primero el Patógeno y luego asociarlo con el Alimento vector específico, optimizando la búsqueda técnica.', 9, [71, 85, 105], false, 5);
  
  addText('Control de Simulación y Reinicio:', 10, [30, 41, 59], true, 2);
  addText('Botón de "Resetear Parámetros" para volver instantáneamente a los valores base recomendados por la literatura científica.', 9, [71, 85, 105], false, 15);

  // 4. Results Interpretation
  checkPage(40);
  doc.setFontSize(16);
  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'bold');
  doc.text(t.resultsTitle, 20, currentY);
  currentY += 10;
  addText(t.riskExceedance + ' (CCDF):', 10, [30, 41, 59], true, 2);
  addText(t.riskExceedanceDesc + ' La curva CCDF permite evaluar la probabilidad de que ocurran brotes de gran magnitud.', 9, [71, 85, 105], false, 10);
  addText(t.resultsBody, 9, [71, 85, 105], false, 15);

  // 4.5 Algorithm & Biological Models
  checkPage(60);
  doc.setFontSize(16);
  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'bold');
  doc.text(t.simulationTitle, 20, currentY);
  currentY += 10;
  addText('Algoritmo de Simulación Monte Carlo:', 10, [30, 41, 59], true, 2);
  addText(t.algorithmLogic || 'Simulación estocástica que integra la variabilidad de la prevalencia, carga inicial y procesos de mitigación mediante 10,000 iteraciones.', 9, [71, 85, 105], false, 10);

  doc.setFontSize(14);
  doc.text(t.modelsTitle, 20, currentY);
  currentY += 8;
  addText(t.doseResponseTitle + ':', 9, [30, 41, 59], true, 1);
  addText(t.doseResponseDesc, 8, [100, 116, 139], false, 5);
  addText('Perfil de Gravedad (Bio-Matrix):', 9, [30, 41, 59], true, 1);
  addText('Consolidación de indicadores de peligrosidad: Letalidad, Hospitalización y Cronicidad por cada par patógeno-alimento.', 8, [100, 116, 139], false, 15);

  // 5. Economic Assessment
  checkPage(80);
  doc.setFontSize(16);
  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'bold');
  doc.text(t.economyTitle, 20, currentY);
  currentY += 10;
  addText('El impacto económico se evalúa mediante un modelo de coste de la enfermedad que incluye:', 9, [71, 85, 105], false, 6);
  
  const econItems = [
    { h: t.medicalCosts, d: 'Gastos directos en hospitalización y atención ambulatoria.' },
    { h: t.productivityLoss, d: 'Días de trabajo perdidos por enfermedad y cuidados.' },
    { h: t.interventionCosts, d: 'Gastos del sistema de salud pública en vigilancia e intervenciones.' },
    { h: t.mortalityCost, d: 'Pérdida de valor estadístico de la vida (VSL) por fallecimientos prematuros.' }
  ];

  econItems.forEach(item => {
    addText(`• ${item.h}:`, 9, [30, 41, 59], true, 1);
    addText(item.d, 8, [100, 116, 139], false, 3);
  });

  currentY += 5;
  doc.setFillColor(249, 250, 251);
  doc.rect(20, currentY, pageWidth - 40, 25, 'F');
  doc.setFontSize(9);
  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'bold');
  doc.text('Metodología DALY (Años de Vida Ajustados por Discapacidad):', 25, currentY + 8);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Fórmula: DALY = YLL (Muertes) + YLD_agudo + YLD_crónico', 25, currentY + 14);
  doc.setTextColor(100, 116, 139);
  doc.text('Se aplica una tasa de descuento social del 3% para secuelas de largo plazo.', 25, currentY + 19);
  currentY += 35;

  // 6. Regional Update Info
  checkPage(30);
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(240, 249, 255);
  doc.rect(20, currentY, pageWidth - 40, 18, 'FD');
  doc.setFontSize(9);
  doc.setTextColor(12, 74, 110);
  doc.setFont('helvetica', 'bold');
  doc.text('Actualización Regional: América del Norte (México)', 25, currentY + 7);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Valores de VSL ajustados a $2.2M USD y costes de hospitalización a $5,500 USD.', 25, currentY + 13);
  currentY += 25;

  // 7. Pathogen Database Table
  doc.addPage();
  currentY = 20;
  doc.setFontSize(16);
  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'bold');
  doc.text(t.specSectionTitle, 20, currentY);
  currentY += 10;
  addText(t.specSectionDesc, 9, [100, 116, 139], false, 10);

  const tableBody = pairs.map(p => [
    p.pathogen,
    p.food,
    `a: ${p.alpha}\n b: ${p.beta < 1000 ? p.beta : p.beta.toExponential(1)}`,
    `${(p.mortalityRate * 100).toFixed(2)}%\n(${p.absenceDays}d)`,
    `${(p.chronicRate! * 100).toFixed(0)}%\n(${p.chronicDalyWeight!.toFixed(2)} DW)`
  ]);

  autoTable(doc, {
    startY: currentY,
    head: [[t.pathogenCol, t.foodCol, t.infectivityCol, t.severityCol, t.chronicCol]],
    body: tableBody,
    theme: 'striped',
    headStyles: { fillColor: [37, 99, 235], fontSize: 8 },
    styles: { fontSize: 7, cellPadding: 2 },
    margin: { horizontal: 20 },
  });

  // 8. Warning Section
  currentY = (doc as any).lastAutoTable.finalY + 15;
  checkPage(40);
  doc.setDrawColor(254, 226, 226);
  doc.setFillColor(254, 242, 242);
  doc.rect(20, currentY, pageWidth - 40, 30, 'FD');
  doc.setFontSize(12);
  doc.setTextColor(153, 27, 27);
  doc.setFont('helvetica', 'bold');
  doc.text(t.warningTitle, 25, currentY + 10);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(185, 28, 28);
  const warnText = doc.splitTextToSize(t.warningBody, pageWidth - 50);
  doc.text(warnText, 25, currentY + 16);

  // Footer for all pages
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(`ProbRisk QMRA System | Technical Manual | Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
  }

  doc.save(`ProbRisk_Manual_Tecnico_Completo_${new Date().toISOString().split('T')[0]}.pdf`);
};

