import React, { useState } from 'react';
import { Save, FolderOpen, Trash2, Clock, Check, X } from 'lucide-react';
import { useSimulation } from '../hooks/useSimulation';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function PresetManager() {
  const { presets, savePreset, loadPreset, deletePreset, country, pair } = useSimulation();
  const [isSaving, setIsSaving] = useState(false);
  const [presetName, setPresetName] = useState('');
  const [showList, setShowList] = useState(false);

  const handleSave = () => {
    if (!presetName.trim()) return;
    savePreset(presetName);
    setPresetName('');
    setIsSaving(false);
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <button 
          onClick={() => setShowList(!showList)}
          className={cn(
            "flex items-center gap-2 px-4 py-2 border rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
            showList 
              ? "bg-slate-900 border-slate-900 text-white" 
              : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
          )}
        >
          <FolderOpen className="w-3.5 h-3.5" />
          Escenarios Guardados ({presets.length})
        </button>

        <AnimatePresence>
          {showList && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowList(false)}
                className="fixed inset-0 z-40"
              />
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute top-full left-0 mt-2 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden"
              >
                <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Mis Configuraciones</h4>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {presets.length === 0 ? (
                    <div className="p-8 text-center">
                      <Clock className="w-8 h-8 text-slate-200 dark:text-slate-700 mx-auto mb-2" />
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-tight">No hay escenarios<br/>guardados</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                      {presets.map(preset => (
                        <div key={preset.id} className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 group transition-colors flex items-center justify-between gap-3">
                          <button 
                            onClick={() => {
                              loadPreset(preset.id);
                              setShowList(false);
                            }}
                            className="flex-1 text-left"
                          >
                            <div className="text-[11px] font-black text-slate-700 dark:text-slate-200 uppercase tracking-tight truncate">{preset.name}</div>
                            <div className="text-[8px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                              {preset.countryId} • {preset.pairId}
                            </div>
                          </button>
                          <button 
                            onClick={() => deletePreset(preset.id)}
                            className="p-1.5 text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-800 mx-1" />

      {isSaving ? (
        <motion.div 
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 'auto', opacity: 1 }}
          className="flex items-center gap-1.5"
        >
          <input 
            autoFocus
            type="text"
            placeholder="Nombre del escenario..."
            className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-[10px] text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500/30 transition-all font-mono"
            value={presetName}
            onChange={(e) => setPresetName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave();
              if (e.key === 'Escape') setIsSaving(false);
            }}
          />
          <button 
            onClick={handleSave}
            className="p-2 bg-teal-600 text-white rounded-lg hover:bg-teal-500 transition-colors"
          >
            <Check className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={() => setIsSaving(false)}
            className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      ) : (
        <button 
          onClick={() => setIsSaving(true)}
          className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-teal-500/50 hover:text-teal-600 transition-all"
        >
          <Save className="w-3.5 h-3.5" />
          Guardar Escenario
        </button>
      )}
    </div>
  );
}
