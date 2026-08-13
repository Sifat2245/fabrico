'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Upload, Trash2 } from 'lucide-react';
import { CustomizerState } from './types';

const FABRIC_PATTERNS = [
  { id: '/patterns/pattern_1.png', name: 'Knit Wave' },
  { id: '/patterns/pattern_2.png', name: 'Static Camo' },
  { id: '/patterns/pattern_3.png', name: 'Retro Grid' },
  { id: '/patterns/pattern_4.png', name: 'Tribal Stripe' },
  { id: '/patterns/pattern_5.png', name: 'Energy Slash' },
  { id: '/patterns/pattern_6.png', name: 'Toxic Flow' },
  { id: '/patterns/pattern_7.png', name: 'Aqua Splatter' },
  { id: '/patterns/pattern_8.png', name: 'Sunburst Grid' },
  { id: '/patterns/pattern_9.png', name: 'Wave Scroll' },
  { id: '/patterns/pattern_10.png', name: 'V-Gradient' },
  { id: '/patterns/pattern_11.png', name: 'Paint Brush' },
  { id: '/patterns/pattern_12.png', name: 'Diagonal Zebra' },
  { id: '/patterns/pattern_13.png', name: 'Center Track' },
];

interface PatternsSettingsProps {
  state: CustomizerState;
  onUpdate: (key: keyof CustomizerState, value: any) => void;
  preloadPattern: (src: string) => void;
}

export default function PatternsSettings({ state, onUpdate, preloadPattern }: PatternsSettingsProps) {
  const [uploadedPatterns, setUploadedPatterns] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem('fabrico_uploaded_patterns');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [selectedUploadedSrc, setSelectedUploadedSrc] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Preload all pattern images on mount
  useEffect(() => {
    FABRIC_PATTERNS.forEach(p => preloadPattern(p.id));
    uploadedPatterns.forEach(p => preloadPattern(p));
  }, [preloadPattern, uploadedPatterns]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const src = ev.target?.result as string;
      if (!src) return;
      if (!uploadedPatterns.includes(src)) {
        const next = [...uploadedPatterns, src];
        setUploadedPatterns(next);
        if (typeof window !== 'undefined') {
          localStorage.setItem('fabrico_uploaded_patterns', JSON.stringify(next));
        }
      }
      preloadPattern(src);
      setSelectedUploadedSrc(src);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const deleteUploadedPattern = (src: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = uploadedPatterns.filter(p => p !== src);
    setUploadedPatterns(next);
    if (typeof window !== 'undefined') {
      localStorage.setItem('fabrico_uploaded_patterns', JSON.stringify(next));
    }
    // Reset if currently applied
    if (state.fabricPatternFront === src) {
      onUpdate('fabricPatternFront', 'None');
    }
    if (state.fabricPatternBack === src) {
      onUpdate('fabricPatternBack', 'None');
    }
  };

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
        <div className="grid grid-cols-4 gap-2">
          <button onClick={() => onUpdate(patternKey, 'None')}
            className={`rounded-xl border-2 aspect-square flex items-center justify-center text-[9px] font-bold transition-all cursor-pointer ${pattern === 'None' ? 'border-indigo-600 bg-indigo-600 text-white shadow-sm' : 'border-zinc-800 text-zinc-500 hover:border-zinc-700 bg-[#16161c] hover:text-zinc-300'}`}>
            None
          </button>
          
          {/* Default Patterns */}
          {FABRIC_PATTERNS.map(p => (
            <button key={p.id} onClick={() => { onUpdate(patternKey, p.id); preloadPattern(p.id); }}
              className={`rounded-xl border-2 overflow-hidden aspect-square transition-all hover:scale-[1.03] bg-[#16161c] cursor-pointer ${pattern === p.id ? 'border-indigo-600 shadow-lg shadow-indigo-650/15' : 'border-zinc-800 hover:border-zinc-700'}`}>
              <img src={p.id} alt={p.name} className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" />
            </button>
          ))}

          {/* Custom Uploaded Patterns */}
          {uploadedPatterns.map((src, idx) => (
            <button key={`uploaded-${side}-${idx}`} onClick={() => { onUpdate(patternKey, src); preloadPattern(src); }}
              className={`rounded-xl border-2 overflow-hidden aspect-square transition-all hover:scale-[1.03] bg-[#16161c] cursor-pointer ${pattern === src ? 'border-indigo-600 shadow-lg shadow-indigo-650/15' : 'border-zinc-800 hover:border-zinc-700'}`}>
              <img src={src} alt={`Uploaded ${idx + 1}`} className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" />
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

      {/* Pattern Upload Section */}
      <div className="space-y-2.5 p-3 bg-[#16161c] border border-zinc-800 rounded-xl">
        <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center justify-between">
          <span>Uploaded Custom Patterns</span>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1 py-1 px-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-[9px] transition-all cursor-pointer"
          >
            <Upload className="w-3 h-3" /> Upload Pattern
          </button>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept="image/*"
          className="hidden"
        />

        {uploadedPatterns.length === 0 ? (
          <div className="text-center py-4 border border-dashed border-zinc-800 rounded-lg text-zinc-500 text-[10px]">
            No custom patterns uploaded yet. Click Upload to add your own.
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-1.5 max-h-28 overflow-y-auto pr-1">
            {uploadedPatterns.map((src, idx) => {
              const isSelected = selectedUploadedSrc === src;
              const isAppliedFront = state.fabricPatternFront === src;
              const isAppliedBack = state.fabricPatternBack === src;
              return (
                <div
                  key={idx}
                  onClick={() => setSelectedUploadedSrc(isSelected ? null : src)}
                  className={`relative aspect-square rounded-lg border-2 overflow-hidden cursor-pointer transition-all hover:scale-[1.03] bg-[#0c0c0f] ${
                    isSelected ? 'border-indigo-500 ring-2 ring-indigo-500/20' : 'border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <img src={src} alt={`Uploaded ${idx}`} className="w-full h-full object-cover opacity-85 hover:opacity-100" />
                  
                  {/* Indicators for Front/Back applied */}
                  <div className="absolute bottom-0.5 left-0.5 right-0.5 flex gap-0.5">
                    {isAppliedFront && (
                      <span className="bg-indigo-600 text-white text-[7px] font-bold px-1 rounded-sm scale-90 origin-bottom-left">
                        F
                      </span>
                    )}
                    {isAppliedBack && (
                      <span className="bg-violet-600 text-white text-[7px] font-bold px-1 rounded-sm scale-90 origin-bottom-left">
                        B
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Selected Uploaded Pattern Actions */}
        {selectedUploadedSrc && (
          <div className="mt-2 pt-2 border-t border-zinc-800 space-y-2">
            <div className="text-[9px] text-zinc-400 font-semibold">Apply Custom Pattern:</div>
            <div className="flex gap-1.5">
              <button
                onClick={() => {
                  onUpdate('fabricPatternFront', selectedUploadedSrc);
                  preloadPattern(selectedUploadedSrc);
                }}
                className={`flex-1 py-1 rounded-lg text-[9px] font-bold cursor-pointer transition-all border ${
                  state.fabricPatternFront === selectedUploadedSrc
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow'
                    : 'bg-[#16161c] border-zinc-800 text-zinc-300 hover:border-zinc-700'
                }`}
              >
                Front Side
              </button>
              <button
                onClick={() => {
                  onUpdate('fabricPatternBack', selectedUploadedSrc);
                  preloadPattern(selectedUploadedSrc);
                }}
                className={`flex-1 py-1 rounded-lg text-[9px] font-bold cursor-pointer transition-all border ${
                  state.fabricPatternBack === selectedUploadedSrc
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow'
                    : 'bg-[#16161c] border-zinc-800 text-zinc-300 hover:border-zinc-700'
                }`}
              >
                Back Side
              </button>
              <button
                onClick={() => {
                  onUpdate('fabricPatternFront', selectedUploadedSrc);
                  onUpdate('fabricPatternBack', selectedUploadedSrc);
                  preloadPattern(selectedUploadedSrc);
                }}
                className="flex-1 py-1 rounded-lg text-[9px] font-bold cursor-pointer bg-[#20202e] border border-zinc-800 text-indigo-400 hover:bg-[#252538] transition-all"
              >
                Both
              </button>
              <button
                onClick={(e) => {
                  deleteUploadedPattern(selectedUploadedSrc, e);
                  setSelectedUploadedSrc(null);
                }}
                className="px-2 py-1 rounded-lg bg-red-950/20 border border-red-900/30 text-red-400 hover:bg-red-900/20 transition-all cursor-pointer"
                title="Delete pattern from gallery"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {renderSide('Front')}
      {renderSide('Back')}
    </div>
  );
}
