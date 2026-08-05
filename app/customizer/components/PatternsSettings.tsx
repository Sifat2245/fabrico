'use client';

import React, { useEffect } from 'react';
import { CustomizerState } from './types';

const FABRIC_PATTERNS = [
  { id: '/patterns/pattern_1.png', name: 'Knit 1' },
  { id: '/patterns/pattern_2.png', name: 'Knit 2' },
  { id: '/patterns/pattern_3.png', name: 'Knit 3' },
  { id: '/patterns/pattern_4.png', name: 'Knit 4' },
  { id: '/patterns/pattern_5.png', name: 'Knit 5' },
];

interface PatternsSettingsProps {
  state: CustomizerState;
  onUpdate: (key: keyof CustomizerState, value: any) => void;
  preloadPattern: (src: string) => void;
}

export default function PatternsSettings({ state, onUpdate, preloadPattern }: PatternsSettingsProps) {
  // Preload all pattern images on mount
  useEffect(() => {
    FABRIC_PATTERNS.forEach(p => preloadPattern(p.id));
  }, [preloadPattern]);

  const renderSide = (side: 'Front' | 'Back') => {
    const pattern = side === 'Front' ? state.fabricPatternFront : state.fabricPatternBack;
    const color = side === 'Front' ? state.fabricPatternColorFront : state.fabricPatternColorBack;
    const bg = side === 'Front' ? state.fabricPatternBgFront : state.fabricPatternBgBack;
    const customize = side === 'Front' ? state.fabricPatternCustomizeFront : state.fabricPatternCustomizeBack;

    const patternKey = side === 'Front' ? 'fabricPatternFront' : 'fabricPatternBack';
    const colorKey = side === 'Front' ? 'fabricPatternColorFront' : 'fabricPatternColorBack';
    const bgKey = side === 'Front' ? 'fabricPatternBgFront' : 'fabricPatternBgBack';
    const customizeKey = side === 'Front' ? 'fabricPatternCustomizeFront' : 'fabricPatternCustomizeBack';

    return (
      <div key={side} className="space-y-2.5 pb-4 border-b border-zinc-800/60 last:border-0">
        <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">{side} Panel</div>

        {/* None button + pattern grid */}
        <div className="grid grid-cols-3 gap-2">
          <button onClick={() => onUpdate(patternKey, 'None')}
            className={`rounded-xl border-2 aspect-square flex items-center justify-center text-[9px] font-bold transition-all cursor-pointer ${pattern === 'None' ? 'border-indigo-600 bg-indigo-600 text-white shadow-sm' : 'border-zinc-800 text-zinc-500 hover:border-zinc-700 bg-[#16161c] hover:text-zinc-300'}`}>
            None
          </button>
          {FABRIC_PATTERNS.map(p => (
            <button key={p.id} onClick={() => { onUpdate(patternKey, p.id); preloadPattern(p.id); }}
              className={`rounded-xl border-2 overflow-hidden aspect-square transition-all hover:scale-[1.03] bg-[#16161c] cursor-pointer ${pattern === p.id ? 'border-indigo-600 shadow-lg shadow-indigo-650/15' : 'border-zinc-800 hover:border-zinc-700'}`}>
              <img src={p.id} alt={p.name} className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>

        {/* Customize colors */}
        {pattern !== 'None' && (
          <div className="space-y-2 bg-[#16161c] rounded-xl p-3 border border-zinc-800">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-[10px] font-semibold text-zinc-300">Customize Colors</span>
              <input type="checkbox" checked={customize} onChange={e => onUpdate(customizeKey, e.target.checked)} className="accent-indigo-500 w-3.5 h-3.5 cursor-pointer" />
            </label>
            {customize && (
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <span className="text-[9px] text-zinc-500">Design Color</span>
                  <input type="color" value={color} onChange={e => onUpdate(colorKey, e.target.value)} className="w-full h-7 border border-zinc-800 rounded-lg cursor-pointer bg-[#1e1e24]" />
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] text-zinc-500">Background</span>
                  <input type="color" value={bg === 'transparent' ? '#ffffff' : bg} onChange={e => onUpdate(bgKey, e.target.value)} className="w-full h-7 border border-zinc-800 rounded-lg cursor-pointer bg-[#1e1e24]" />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4 font-sans text-xs text-zinc-300">
      <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">Fabric Texture Patterns</div>
      {renderSide('Front')}
      {renderSide('Back')}
    </div>
  );
}
