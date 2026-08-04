'use client';

import React from 'react';
import { Sliders, Target } from 'lucide-react';
import { DecalItem } from './types';

export const PRINT_ZONE_PRESETS = [
  {
    id: 'chest_center',
    name: 'Chest Center',
    position: [0, 0.15, 0.09] as [number, number, number],
    rotation: [0, 0, 0] as [number, number, number],
  },
  {
    id: 'left_chest',
    name: 'Left Pocket',
    position: [0.06, 0.16, 0.09] as [number, number, number],
    rotation: [0, 0, 0] as [number, number, number],
  },
  {
    id: 'upper_back',
    name: 'Upper Back',
    position: [0, 0.18, -0.09] as [number, number, number],
    rotation: [0, Math.PI, 0] as [number, number, number],
  },
  {
    id: 'lower_back',
    name: 'Lower Back',
    position: [0, -0.10, -0.09] as [number, number, number],
    rotation: [0, Math.PI, 0] as [number, number, number],
  },
];

interface DecalControlsProps {
  activeDecal: DecalItem;
  onUpdateDecal: (id: string, updates: Partial<DecalItem>) => void;
}

export default function DecalControls({ activeDecal, onUpdateDecal }: DecalControlsProps) {
  return (
    <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-650 space-y-3 font-sans text-xs">
      <div className="flex items-center justify-between text-zinc-800 font-bold uppercase tracking-wider text-[10px]">
        <span className="flex items-center gap-1.5">
          <Sliders className="w-3.5 h-3.5 text-zinc-700" /> Print Controls
        </span>
      </div>

      {/* Print Zone Quick Positioning Presets */}
      <div className="space-y-1.5">
        <div className="text-[10px] text-zinc-600 font-semibold flex items-center gap-1">
          <Target className="w-3 h-3 text-zinc-800" /> Core Print Zones
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {PRINT_ZONE_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => {
                onUpdateDecal(activeDecal.id, {
                  position: preset.position,
                  rotation: preset.rotation,
                });
              }}
              className="py-1.5 px-2 rounded-lg bg-white border border-zinc-200 hover:border-zinc-500 hover:bg-zinc-50 text-[10px] text-zinc-700 font-medium transition-all text-center"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Scale Slider */}
      <div className="space-y-1">
        <div className="flex justify-between items-center text-[10px] text-zinc-500 font-mono">
          <span>Width / Size</span>
          <span className="font-bold text-zinc-700">{(activeDecal.scale[0] * 100).toFixed(0)}cm</span>
        </div>
        <input
          type="range"
          min="0.05"
          max="0.8"
          step="0.01"
          value={activeDecal.scale[0]}
          onChange={(e) => {
            const val = parseFloat(e.target.value);
            onUpdateDecal(activeDecal.id, {
              scale: [val, val, val],
            });
          }}
          className="w-full accent-zinc-950"
        />
      </div>

      {/* Rotation Slider */}
      <div className="space-y-1">
        <div className="flex justify-between items-center text-[10px] text-zinc-500 font-mono">
          <span>Rotation Angle</span>
          <span className="font-bold text-zinc-700">{Math.round((activeDecal.rotation[2] * 180) / Math.PI)}°</span>
        </div>
        <input
          type="range"
          min="-3.14"
          max="3.14"
          step="0.05"
          value={activeDecal.rotation[2]}
          onChange={(e) => {
            const rotZ = parseFloat(e.target.value);
            onUpdateDecal(activeDecal.id, {
              rotation: [activeDecal.rotation[0], activeDecal.rotation[1], rotZ],
            });
          }}
          className="w-full accent-zinc-950"
        />
      </div>
    </div>
  );
}
