'use client';

import React from 'react';
import { Palette, Pipette, RefreshCw, Check } from 'lucide-react';

export interface ColorPreset {
  name: string;
  hex: string;
}

export const PRESET_COLORS: ColorPreset[] = [
  { name: 'Pure White', hex: '#FFFFFF' },
  { name: 'Onyx Black', hex: '#18181B' },
  { name: 'Navy Blue', hex: '#1E293B' },
  { name: 'Heather Gray', hex: '#64748B' },
  { name: 'Crimson Red', hex: '#991B1B' },
  { name: 'Forest Green', hex: '#166534' },
  { name: 'Sunset Amber', hex: '#D97706' },
  { name: 'Royal Purple', hex: '#581C87' },
  { name: 'Sand Beige', hex: '#D6D3D1' },
  { name: 'Olive Green', hex: '#3F6212' },
];

interface ColorPickerBarProps {
  shirtColor: string;
  onShirtColorChange: (color: string) => void;
  selectedMeshName: string | null;
  targetMode: 'all' | 'selected';
  onTargetModeChange: (mode: 'all' | 'selected') => void;
  onResetColors: () => void;
}

export default function ColorPickerBar({
  shirtColor,
  onShirtColorChange,
  selectedMeshName,
  targetMode,
  onTargetModeChange,
  onResetColors,
}: ColorPickerBarProps) {
  return (
    <div className="absolute bottom-28 z-20 flex flex-col items-center gap-2 max-w-lg w-full px-4 pointer-events-auto">
      {/* Target Selector pill */}
      <div className="flex items-center gap-1.5 p-1 bg-neutral-900/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl text-xs">
        <button
          onClick={() => onTargetModeChange('all')}
          className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
            targetMode === 'all'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          All Parts
        </button>
        <button
          onClick={() => onTargetModeChange('selected')}
          disabled={!selectedMeshName}
          className={`px-3 py-1.5 rounded-xl font-medium transition-all flex items-center gap-1.5 ${
            targetMode === 'selected'
              ? 'bg-purple-600 text-white shadow-md'
              : selectedMeshName
              ? 'text-neutral-400 hover:text-white'
              : 'text-neutral-600 cursor-not-allowed opacity-50'
          }`}
          title={selectedMeshName ? `Targeting ${selectedMeshName}` : 'Click a mesh in 3D to select part'}
        >
          <span>Selected Mesh</span>
          {selectedMeshName && <span className="font-mono text-[10px] text-purple-200">({selectedMeshName})</span>}
        </button>

        <button
          onClick={onResetColors}
          className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-xl transition-colors ml-1"
          title="Reset to Original Colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Color Swatches Container */}
      <div className="flex items-center gap-2 p-2.5 bg-neutral-900/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-x-auto max-w-full">
        <div className="flex items-center gap-1.5 pr-2 border-r border-white/10">
          <Palette className="w-4 h-4 text-blue-400 ml-1" />
          <span className="text-xs font-semibold text-neutral-200 uppercase tracking-wider font-mono">Color</span>
        </div>

        {/* Preset Swatches */}
        <div className="flex items-center gap-2">
          {PRESET_COLORS.map((c) => {
            const isActive = shirtColor.toUpperCase() === c.hex.toUpperCase();
            return (
              <button
                key={c.hex}
                onClick={() => onShirtColorChange(c.hex)}
                className={`w-7 h-7 rounded-full transition-all duration-200 relative flex items-center justify-center border hover:scale-110 active:scale-95 shadow-md ${
                  isActive ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-neutral-900 border-white' : 'border-white/20'
                }`}
                style={{ backgroundColor: c.hex }}
                title={c.name}
              >
                {isActive && (
                  <Check className={`w-3.5 h-3.5 ${c.hex === '#FFFFFF' || c.hex === '#F5F5F4' ? 'text-black' : 'text-white'}`} />
                )}
              </button>
            );
          })}
        </div>

        {/* Custom Color Input */}
        <div className="flex items-center gap-2 pl-2 border-l border-white/10">
          <label
            className="relative w-7 h-7 rounded-full cursor-pointer overflow-hidden border border-white/30 flex items-center justify-center hover:scale-110 transition-transform bg-gradient-to-tr from-rose-500 via-emerald-500 to-sky-500 shadow-md"
            title="Choose Custom Color"
          >
            <input
              type="color"
              value={shirtColor}
              onChange={(e) => onShirtColorChange(e.target.value)}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <Pipette className="w-3.5 h-3.5 text-white drop-shadow" />
          </label>

          <span className="text-xs font-mono text-neutral-300 font-semibold uppercase">{shirtColor}</span>
        </div>
      </div>
    </div>
  );
}
