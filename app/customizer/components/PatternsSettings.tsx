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
      <div key={side} className="space-y-2.5 pb-4 border-b border-zinc-100 last:border-0">
        <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">{side}</div>

        {/* None button + pattern grid */}
        <div className="grid grid-cols-3 gap-2">
          <button onClick={() => onUpdate(patternKey, 'None')}
            className={`rounded-xl border-2 aspect-square flex items-center justify-center text-[9px] font-bold transition-all ${pattern === 'None' ? 'border-zinc-950 bg-zinc-950 text-white' : 'border-zinc-200 text-zinc-400 hover:border-zinc-400 bg-zinc-50'}`}>
            None
          </button>
          {FABRIC_PATTERNS.map(p => (
            <button key={p.id} onClick={() => { onUpdate(patternKey, p.id); preloadPattern(p.id); }}
              className={`rounded-xl border-2 overflow-hidden aspect-square transition-all hover:scale-[1.03] ${pattern === p.id ? 'border-zinc-950 shadow-lg' : 'border-transparent hover:border-zinc-300'}`}>
              <img src={p.id} alt={p.name} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>

        {/* Customize colors */}
        {pattern !== 'None' && (
          <div className="space-y-2 bg-zinc-50 rounded-xl p-3 border border-zinc-200">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-[10px] font-semibold text-zinc-700">Customize Colors</span>
              <input type="checkbox" checked={customize} onChange={e => onUpdate(customizeKey, e.target.checked)} className="accent-zinc-950 w-3.5 h-3.5 cursor-pointer" />
            </label>
            {customize && (
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <span className="text-[9px] text-zinc-500">Design Color</span>
                  <input type="color" value={color} onChange={e => onUpdate(colorKey, e.target.value)} className="w-full h-7 border border-zinc-200 rounded-lg cursor-pointer" />
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] text-zinc-500">Background</span>
                  <input type="color" value={bg === 'transparent' ? '#ffffff' : bg} onChange={e => onUpdate(bgKey, e.target.value)} className="w-full h-7 border border-zinc-200 rounded-lg cursor-pointer" />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4 font-sans text-xs">
      <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Fabric Patterns</div>
      {renderSide('Front')}
      {renderSide('Back')}
    </div>
  );
}
