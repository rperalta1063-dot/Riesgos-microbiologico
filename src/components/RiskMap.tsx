import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  ComposableMap, 
  Geographies, 
  Geography, 
  Sphere, 
  Graticule,
  ZoomableGroup,
  Marker
} from "react-simple-maps";
import { geoCentroid } from "d3-geo";
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Globe2, Activity, DollarSign, Plus, Minus, RotateCcw, MapPin, MousePointer2, Loader2, AlertTriangle, Skull } from 'lucide-react';
import { Country, SimulationResult } from '../types';
import { Translation } from '../lib/translations';
import { formatCurrency, cn } from '../lib/utils';

const geoUrl = "https://raw.githubusercontent.com/lotusms/world-map-data/main/world.json";

interface RiskMapProps {
  selectedCountry: Country;
  onCountrySelect: (country: Country) => void;
  countries: Country[];
  t: Translation;
  isDark: boolean;
  isHighContrast?: boolean;
  result?: SimulationResult | null;
}

export default function RiskMap({ selectedCountry, onCountrySelect, countries, t, isDark, isHighContrast, result }: RiskMapProps) {
  const [tooltipContent, setTooltipContent] = useState<Country | null>(null);
  const [position, setPosition] = useState({ coordinates: [0, 0] as [number, number], zoom: 1 });
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const geographiesRef = useRef<any[]>([]);

  // Optimize lookup: Create an O(1) lookup map for countries
  const countryMap = useMemo(() => {
    const map: Record<string, Country> = {};
    countries.forEach(c => {
      if (c.id) map[c.id.toLowerCase()] = c;
      if (c.name) map[c.name.toLowerCase()] = c;
    });
    return map;
  }, [countries]);

  const getCountryData = (geo: any) => {
    const id = geo.id || geo.properties?.ISO_A2 || geo.properties?.iso_a2 || geo.properties?.name;
    if (!id) return null;
    
    const lowerId = id.toString().toLowerCase();
    const name = geo.properties?.name?.toLowerCase();

    return countryMap[lowerId] || countryMap[name] || null;
  };

  // Zoom to selected country effect
  useEffect(() => {
    if (selectedCountry && geographiesRef.current.length > 0) {
      const geo = geographiesRef.current.find(g => {
        const cData = getCountryData(g);
        return cData && cData.id === selectedCountry.id;
      });

      if (geo) {
        const centroid = geoCentroid(geo);
        setPosition({
          coordinates: centroid as [number, number],
          zoom: 3
        });
      }
    }
  }, [selectedCountry]);

  function handleMoveEnd(position: { coordinates: [number, number], zoom: number }) {
    setPosition(position);
  }

  function handleZoomIn() {
    if (position.zoom >= 4) return;
    setPosition((pos) => ({ ...pos, zoom: pos.zoom * 1.5 }));
  }

  function handleZoomOut() {
    if (position.zoom <= 1) return;
    setPosition((pos) => ({ ...pos, zoom: pos.zoom / 1.5 }));
  }

  function handleReset() {
    setPosition({ coordinates: [0, 0], zoom: 1 });
  }

  return (
    <div className="relative w-full h-full bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col transition-all duration-500 shadow-inner">
      {/* Map Header Overlay */}
      <div className="absolute top-6 left-6 z-10 flex flex-col gap-3 pointer-events-none">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl pointer-events-auto max-w-[240px]"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-500 p-1.5 rounded-lg shadow-lg shadow-blue-500/20">
              <Globe2 className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-xs font-black text-slate-800 dark:text-slate-100 uppercase tracking-tighter">Nodos de Riesgo</h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Análisis Geográfico {new Date().getFullYear()}</p>
            </div>
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-500 leading-tight border-t border-slate-100 dark:border-slate-700/50 pt-2 italic">
            Seleccione una región activa para cargar los parámetros de simulación específicos del nodo.
          </p>
        </motion.div>

        {/* Interaction Hint */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900/10 dark:bg-white/5 backdrop-blur-sm rounded-full w-fit">
           <MousePointer2 className="w-2.5 h-2.5 text-slate-500" />
           <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Click para Seleccionar</span>
        </div>
      </div>

      {/* Map Controls (Zoom/Reset) */}
      <div className="absolute top-6 right-6 z-10 flex flex-col gap-2">
        <div className="flex flex-col bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden self-end">
          <button 
            onClick={handleZoomIn}
            className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors border-b border-slate-100 dark:border-slate-700 active:bg-blue-50"
            title="Aumentar Zoom"
            aria-label="Aumentar Zoom"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button 
            onClick={handleZoomOut}
            className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors border-b border-slate-100 dark:border-slate-700 active:bg-blue-50"
            title="Disminuir Zoom"
            aria-label="Disminuir Zoom"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button 
            onClick={handleReset}
            className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors active:bg-blue-50"
            title="Resetear Vista"
            aria-label="Resetear Vista de Mapa"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Selected Status Overlay */}
        <AnimatePresence>
          {selectedCountry && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-blue-600 p-3 rounded-xl shadow-xl shadow-blue-500/20 text-white flex items-center gap-3 border border-blue-500"
            >
              <div className="p-1.5 bg-white/20 rounded-lg">
                <MapPin className="w-3.5 h-3.5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[8px] font-bold uppercase tracking-widest opacity-70 leading-none">Nodo Activo</span>
                <span className="text-xs font-bold leading-none mt-1">{selectedCountry.flag} {selectedCountry.name}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Map Content */}
      <div className="flex-1 cursor-grab active:cursor-grabbing relative">
        <AnimatePresence>
          {!isMapLoaded && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm"
            >
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Renderizando Geosfera...</span>
            </motion.div>
          )}
        </AnimatePresence>

        <ComposableMap
          projectionConfig={{
            rotate: [-10, 0, 0],
            scale: 147
          }}
          className="w-full h-full"
        >
          <ZoomableGroup
            zoom={position.zoom}
            center={position.coordinates}
            onMoveEnd={handleMoveEnd}
          >
            <Sphere stroke={isDark ? "#1e293b" : "#e2e8f0"} strokeWidth={0.5} fill="transparent" />
            <Graticule stroke={isDark ? "#1e293b" : "#e2e8f0"} strokeWidth={0.5} />
            <Geographies geography={geoUrl}>
              {({ geographies }) => {
                if (geographies.length > 0 && !isMapLoaded) {
                  geographiesRef.current = geographies;
                  setTimeout(() => setIsMapLoaded(true), 0);
                }
                return (
                  <>
                    {geographies.map((geo) => {
                      const countryData = getCountryData(geo);
                      const isSelected = selectedCountry && countryData && selectedCountry.id === countryData.id;
                      const isCovered = !!countryData;

                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          tabIndex={isCovered ? 0 : -1}
                          aria-label={`${geo.properties?.name || 'Región'}${countryData ? ': Activa para análisis' : ''}`}
                          role="button"
                          onMouseEnter={() => {
                            if (countryData) setTooltipContent(countryData);
                          }}
                          onMouseLeave={() => {
                            setTooltipContent(null);
                          }}
                          onClick={() => {
                            if (countryData && countries.some(c => c.id === countryData.id)) {
                              onCountrySelect(countryData);
                            }
                          }}
                          onKeyDown={(e) => {
                            if (countryData && countries.some(c => c.id === countryData.id) && (e.key === 'Enter' || e.key === ' ')) {
                              e.preventDefault();
                              onCountrySelect(countryData);
                            }
                          }}
                          style={{
                            default: {
                              fill: isSelected 
                                ? (isHighContrast ? "#0000FF" : "#3182f6") 
                                : isCovered 
                                  ? (isDark ? "#1e293b" : "#dbeafe") 
                                  : (isDark ? "#0f172a" : "#f1f5f9"),
                              stroke: isSelected 
                                ? (isHighContrast ? "#000000" : "#ffffff") 
                                : (isHighContrast ? "#000000" : (isDark ? "#334155" : "#cbd5e1")),
                              strokeWidth: (isSelected || isHighContrast) ? 1.5 : 0.5,
                              outline: "none",
                              transition: "fill 0.3s, stroke 0.3s"
                            },
                            hover: {
                              fill: isCovered ? (isHighContrast ? "#0000FF" : "#60a5fa") : (isDark ? "#1e293b" : "#e2e8f0"),
                              stroke: isSelected ? "#ffffff" : (isDark ? "#475569" : "#94a3b8"),
                              strokeWidth: isCovered ? 2 : 0.5,
                              outline: "none",
                              cursor: isCovered ? "pointer" : "default",
                            },
                            pressed: {
                              fill: isHighContrast ? "#0000FF" : "#2563eb",
                              outline: "none",
                            },
                          }}
                          className="transition-all duration-300"
                        />
                      );
                    })}
                    {selectedCountry && geographiesRef.current.length > 0 && (
                      (() => {
                        const geo = geographiesRef.current.find(g => {
                           const cData = getCountryData(g);
                           return cData && cData.id === selectedCountry.id;
                        });
                        if (!geo) return null;
                        const centroid = geoCentroid(geo);
                        
                        return (
                          <Marker coordinates={centroid as [number, number]}>
                            <g>
                              <foreignObject x="10" y="-40" width="160" height="80">
                                <motion.div 
                                  initial={{ opacity: 0, scale: 0.5, x: -20 }}
                                  animate={{ opacity: 1, scale: 1, x: 0 }}
                                  className="bg-slate-900/90 backdrop-blur-md p-3 rounded-xl border border-blue-500 shadow-2xl flex flex-col gap-1.5"
                                >
                                  <div className="flex items-center gap-2 border-b border-white/10 pb-1">
                                    <span className="text-sm">{selectedCountry.flag}</span>
                                    <span className="text-[9px] font-black text-white uppercase truncate">{selectedCountry.name}</span>
                                  </div>
                                  <div className="space-y-1">
                                    <div className="flex items-center justify-between gap-4">
                                      <div className="flex items-center gap-1">
                                        <AlertTriangle className="w-2.5 h-2.5 text-amber-500" />
                                        <span className="text-[7px] font-bold text-slate-400 uppercase tracking-tighter">Prob. Enfermedad</span>
                                      </div>
                                      <span className="text-[8px] font-bold text-white font-mono">
                                        {result?.summary ? (result.summary.probIllness * 100).toFixed(4) + "%" : "..."}
                                      </span>
                                    </div>
                                    <div className="flex items-center justify-between gap-4">
                                      <div className="flex items-center gap-1">
                                        <Skull className="w-2.5 h-2.5 text-slate-400" />
                                        <span className="text-[7px] font-bold text-slate-400 uppercase tracking-tighter">Muertes Est.</span>
                                      </div>
                                      <span className="text-[8px] font-bold text-rose-400 font-mono">
                                        {result?.summary ? Math.ceil(result.summary.annualDeaths || 0).toLocaleString() : "..."}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="absolute top-1/2 -left-1.5 transform -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[6px] border-r-blue-500" />
                                </motion.div>
                              </foreignObject>
                              <circle r={3} fill="#3182f6" stroke="#ffffff" strokeWidth={1} className="animate-pulse" />
                            </g>
                          </Marker>
                        );
                      })()
                    )}
                  </>
                );
              }}
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
      </div>

      {/* Country Detail Overlay (when selected or hovered) */}
      <AnimatePresence>
        {(tooltipContent || selectedCountry) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-6 right-6 z-10 w-72 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md p-5 rounded-2xl border border-blue-100 dark:border-slate-700 shadow-2xl transition-colors ring-1 ring-black/5"
          >
            {(() => {
              const displayCountry = tooltipContent || selectedCountry;
              const isActualSelected = selectedCountry && displayCountry.id === selectedCountry.id;
              
              return (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-blue-50 dark:border-slate-700 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl filter drop-shadow-sm">{displayCountry.flag}</span>
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-tighter leading-none">{displayCountry.name}</span>
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1 leading-none">{displayCountry.sub}</span>
                      </div>
                    </div>
                    {isActualSelected && (
                      <div className="bg-blue-100 dark:bg-blue-900/50 p-1.5 rounded-lg animate-pulse">
                        <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400 fill-blue-500/10" />
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Demografía</span>
                      <div className="text-xs font-mono font-bold text-slate-700 dark:text-slate-200">
                        {(displayCountry.pop / 1000000).toFixed(1)}M <span className="text-[8px] font-normal opacity-50">habs</span>
                      </div>
                    </div>
                    <div className="space-y-1 text-right">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest text-blue-500">Valor VSL</span>
                      <div className="text-xs font-mono font-bold text-slate-700 dark:text-slate-200">
                        {formatCurrency(displayCountry.vsl)}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2.5 pt-3 border-t border-blue-50 dark:border-slate-700">
                     <div className="flex items-center justify-between text-[10px]">
                        <span className="text-slate-400 flex items-center gap-2"><Activity className="w-3 h-3" /> Coste Hosp.</span>
                        <span className="font-mono font-bold text-slate-600 dark:text-slate-300">{formatCurrency(displayCountry.costHosp)}</span>
                     </div>
                     <div className="flex items-center justify-between text-[10px]">
                        <span className="text-slate-400 flex items-center gap-2"><DollarSign className="w-3 h-3" /> Ausentismo</span>
                        <span className="font-mono font-bold text-slate-600 dark:text-slate-300">{formatCurrency(displayCountry.costAbs)}</span>
                     </div>
                  </div>

                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onCountrySelect(displayCountry)}
                    className={cn(
                      "w-full py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-2",
                      isActualSelected 
                        ? "bg-slate-100 dark:bg-slate-700 text-slate-400 cursor-default" 
                        : "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20"
                    )}
                  >
                    {isActualSelected ? "Nodo ya Activo" : "Activar para Análisis"}
                  </motion.button>
                </div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Map Legend */}
      <div className="absolute bottom-6 left-6 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md p-3 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col gap-2 shadow-xl transition-all border-l-4" style={{ borderLeftColor: isHighContrast ? "#0000FF" : "#3182f6" }}>
        <div className="flex items-center gap-3">
          <div 
            className="w-2.5 h-2.5 rounded-full shadow-sm border border-black/10" 
            style={{ backgroundColor: isHighContrast ? "#0000FF" : "#3182f6" }}
          />
          <span className="text-[9px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest">{t.legendSelected}</span>
        </div>
        <div className="flex items-center gap-3">
          <div 
            className="w-2.5 h-2.5 rounded-full shadow-sm border border-slate-200 dark:border-slate-600" 
            style={{ backgroundColor: isDark ? "#1e293b" : "#dbeafe" }}
          />
          <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{t.legendData}</span>
        </div>
        <div className="flex items-center gap-3">
          <div 
            className="w-2.5 h-2.5 rounded-full shadow-sm border border-slate-200 dark:border-slate-800 opacity-50" 
            style={{ backgroundColor: isDark ? "#0f172a" : "#f1f5f9" }}
          />
          <span className="text-[9px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest">{t.legendNoData}</span>
        </div>
      </div>
    </div>
  );
}
