'use client';

import React from 'react';
import { Check, Pipette, RefreshCw } from 'lucide-react';
import { CustomizerState } from './types';

export const PRESET_COLORS = [
  { hex: '#FFFFFF', name: 'White' },
  { hex: '#09090b', name: 'Black' },
  { hex: '#1d4ed8', name: 'Royal Blue' },
  { hex: '#b91c1c', name: 'Crimson' },
  { hex: '#047857', name: 'Forest Green' },
  { hex: '#eab308', name: 'Yellow' },
  { hex: '#6366f1', name: 'Indigo' },
  { hex: '#a855f7', name: 'Purple' },
  { hex: '#f97316', name: 'Orange' },
  { hex: '#64748b', name: 'Slate' },
  { hex: '#1e3a8a', name: 'Navy' },
  { hex: '#be123c', name: 'Rose' },
];

const COLLAR_TYPES: Array<CustomizerState['collarType']> = ['None', 'Round', 'V-Neck', 'Polo', 'Henley'];

interface ColorSettingsProps {
  state: CustomizerState;
  onUpdate: (key: keyof CustomizerState, value: any) => void;
  onReset: () => void;
}

export default function ColorSettings({ state, onUpdate, onReset }: ColorSettingsProps) {
  const isSplit = state.primaryColorSide && state.primaryColorSide !== 'Both';

  return (
    <div className="space-y-5 font-sans text-xs text-zinc-300">
      {/* ── Primary Color ─────────────────────────────────────────────────── */}
      <div className="space-y-2">
        <label className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">Body Color</label>

        {/* Split or unified */}
        <div className="flex bg-[#16161c] p-0.5 rounded-lg border border-zinc-800 text-[10px] gap-0.5">
          {(['Both', 'Front', 'Back'] as const).map(side => (
            <button
              key={side}
              onClick={() => onUpdate('primaryColorSide', side)}
              className={`flex-1 py-1 px-1.5 rounded-md font-semibold transition-all ${
                state.primaryColorSide === side ? 'bg-indigo-600 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {side}
            </button>
          ))}
        </div>

        {/* Front color */}
        {(!isSplit || state.primaryColorSide === 'Front' || state.primaryColorSide === 'Both') && (
          <div className="space-y-1.5">
            {isSplit && <span className="text-[10px] text-zinc-450 font-semibold">Front</span>}
            <div className="grid grid-cols-7 gap-1.5">
              {PRESET_COLORS.map(c => {
                const active = state.primaryColorSide === 'Back'
                  ? false
                  : (isSplit ? state.primaryFront : state.primary).toUpperCase() === c.hex.toUpperCase();
                return (
                  <button
                    key={c.hex}
                    onClick={() => isSplit ? onUpdate('primaryFront', c.hex) : onUpdate('primary', c.hex)}
                    title={c.name}
                    className={`w-7 h-7 rounded-full border transition-all hover:scale-110 active:scale-95 flex items-center justify-center shadow-sm ${
                      active ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-[#0e0e12] border-transparent' : 'border-zinc-800'
                    }`}
                    style={{ backgroundColor: c.hex }}
                  >
                    {active && <Check className={`w-3 h-3 ${c.hex === '#FFFFFF' ? 'text-zinc-950' : 'text-white'}`} />}
                  </button>
                );
              })}
              <label className="w-7 h-7 rounded-full cursor-pointer overflow-hidden border border-zinc-800 flex items-center justify-center hover:scale-110 transition-transform bg-gradient-to-tr from-rose-550 via-emerald-500 to-sky-500 shadow-sm" title="Custom">
                <input type="color" value={isSplit ? state.primaryFront : state.primary}
                  onChange={e => isSplit ? onUpdate('primaryFront', e.target.value) : onUpdate('primary', e.target.value)}
                  className="absolute opacity-0 w-0 h-0" />
                <Pipette className="w-3 h-3 text-white drop-shadow" />
              </label>
            </div>
          </div>
        )}

        {/* Back color (split mode) */}
        {isSplit && (state.primaryColorSide === 'Back' || state.primaryColorSide === 'Front') && (
          <div className="space-y-1.5">
            <span className="text-[10px] text-zinc-450 font-semibold">
              {state.primaryColorSide === 'Front' ? 'Back' : 'Front'}
            </span>
            <div className="grid grid-cols-7 gap-1.5">
              {PRESET_COLORS.map(c => {
                const active = (state.primaryBack || state.primary).toUpperCase() === c.hex.toUpperCase();
                return (
                  <button key={c.hex} onClick={() => onUpdate('primaryBack', c.hex)} title={c.name}
                    className={`w-7 h-7 rounded-full border transition-all hover:scale-110 active:scale-95 flex items-center justify-center shadow-sm ${active ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-[#0e0e12] border-transparent' : 'border-zinc-800'}`}
                    style={{ backgroundColor: c.hex }}>
                    {active && <Check className={`w-3 h-3 ${c.hex === '#FFFFFF' ? 'text-zinc-950' : 'text-white'}`} />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── Secondary Color ────────────────────────────────────────────────── */}
      <div className="space-y-2">
        <label className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">Accent / Text Color</label>
        <div className="grid grid-cols-7 gap-1.5">
          {PRESET_COLORS.map(c => {
            const active = state.secondary.toUpperCase() === c.hex.toUpperCase();
            return (
              <button key={c.hex} onClick={() => onUpdate('secondary', c.hex)} title={c.name}
                className={`w-7 h-7 rounded-full border transition-all hover:scale-110 active:scale-95 flex items-center justify-center shadow-sm ${active ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-[#0e0e12] border-transparent' : 'border-zinc-800'}`}
                style={{ backgroundColor: c.hex }}>
                {active && <Check className={`w-3 h-3 ${c.hex === '#FFFFFF' ? 'text-zinc-950' : 'text-white'}`} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Collar Type ────────────────────────────────────────────────────── */}
      <div className="space-y-2 pt-3 border-t border-zinc-800/80">
        <label className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">Collar Style</label>
        <div className="grid grid-cols-3 gap-1.5">
          {COLLAR_TYPES.map(t => (
            <button key={t} onClick={() => onUpdate('collarType', t)}
              className={`py-1.5 px-2 rounded-lg border text-[10px] font-semibold transition-all ${
                state.collarType === t ? 'bg-indigo-650 border-indigo-600 text-white shadow-sm' : 'bg-[#16161c] border-zinc-800 text-zinc-350 hover:border-zinc-700 hover:text-zinc-100'
              }`}>
              {t}
            </button>
          ))}
        </div>

        {(state.collarType === 'Polo' || state.collarType === 'Henley') && (
          <label className="flex items-center justify-between bg-[#16161c] border border-zinc-800 rounded-xl px-3 py-2 cursor-pointer hover:bg-[#1a1a24] transition-colors">
            <span className="text-[10px] font-semibold text-zinc-300">Zipper / Placket</span>
            <input type="checkbox" checked={state.zipper}
              onChange={e => onUpdate('zipper', e.target.checked)}
              className="accent-indigo-500 w-4 h-4 cursor-pointer rounded" />
          </label>
        )}
      </div>

      {/* ── Design Color ──────────────────────────────────────────────────── */}
      <div className="space-y-2 pt-3 border-t border-zinc-800/80">
        <label className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">Pattern / Design Color</label>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full border border-zinc-800 shadow-sm flex-shrink-0" style={{ backgroundColor: state.designColor }} />
          <input type="color" value={state.designColor} onChange={e => onUpdate('designColor', e.target.value)}
            className="flex-1 h-8 bg-[#16161c] border border-zinc-800 rounded-lg cursor-pointer px-1 py-0.5" />
        </div>
      </div>

      {/* ── Reset ─────────────────────────────────────────────────────────── */}
      <button onClick={onReset}
        className="w-full flex items-center justify-center gap-1.5 py-2 px-4 border border-zinc-800 hover:border-red-900/50 rounded-xl text-red-400 hover:bg-red-955/20 text-xs font-semibold bg-[#16161c] transition-all cursor-pointer">
        <RefreshCw className="w-3.5 h-3.5" />
        <span>Reset Colors</span>
      </button>
    </div>
  );
}
