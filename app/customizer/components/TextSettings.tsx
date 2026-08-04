'use client';

import React, { useState } from 'react';
import { Type, Plus, Trash2, ChevronDown } from 'lucide-react';
import { TextLayer, CustomizerState } from './types';

const FONT_STYLES = [
  'Default', 'Italic', 'Script', 'Block', 'Varsity',
  'Serif Athletic', 'Cyberpunk', 'Neon Glow', 'Gothic', 'Outline'
];

function genId() { return `text_${Date.now()}_${Math.random().toString(36).slice(2,6)}`; }

interface TextSettingsProps {
  state: CustomizerState;
  onAddTextLayer: (layer: TextLayer) => void;
  onUpdateTextLayer: (id: string, patch: Partial<TextLayer>) => void;
  onDeleteTextLayer: (id: string) => void;
}

export default function TextSettings({ state, onAddTextLayer, onUpdateTextLayer, onDeleteTextLayer }: TextSettingsProps) {
  const [text, setText] = useState('TEAM NAME');
  const [font, setFont] = useState('Default');
  const [color, setColor] = useState('#09090B');
  const [size, setSize] = useState(80);
  const [side, setSide] = useState<'Front' | 'Back'>('Front');
  const [advanced, setAdvanced] = useState(false);
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [curveRadius, setCurveRadius] = useState(0);
  const [shadowEnabled, setShadowEnabled] = useState(false);
  const [outlineEnabled, setOutlineEnabled] = useState(false);
  const [outlineColor, setOutlineColor] = useState('#FFFFFF');
  const [outlineWidth, setOutlineWidth] = useState(4);

  const handleAdd = () => {
    if (!text.trim()) return;
    const layer: TextLayer = {
      id: genId(),
      type: 'text',
      side,
      text,
      font,
      textSize: size,
      color,
      x: 512, y: side === 'Front' ? 350 : 300,
      scale: 1,
      rotation: 0,
      letterSpacing,
      lineSpacing: 1.15,
      curveRadius,
      shadowEnabled,
      shadowColor: '#000000',
      shadowBlur: 10,
      shadowOffsetX: 4,
      shadowOffsetY: 4,
      outlineEnabled,
      outlineColor,
      outlineWidth,
    };
    onAddTextLayer(layer);
  };

  return (
    <div className="space-y-4 font-sans text-xs">
      <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
        <Type className="w-3.5 h-3.5" /> Custom Printed Text
      </div>

      {/* Side */}
      <div className="flex bg-zinc-100 p-0.5 rounded-lg border border-zinc-200 text-[10px]">
        {(['Front', 'Back'] as const).map(s => (
          <button key={s} onClick={() => setSide(s)}
            className={`flex-1 py-1 rounded-md font-semibold transition-all ${side === s ? 'bg-white text-zinc-950 shadow-sm' : 'text-zinc-500'}`}>
            {s}
          </button>
        ))}
      </div>

      {/* Text input */}
      <div className="space-y-1">
        <label className="text-[10px] text-zinc-500 font-semibold">Text</label>
        <textarea value={text} onChange={e => setText(e.target.value)} rows={2}
          placeholder="Enter text (use ↵ for new line)"
          className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:border-zinc-500 resize-none" />
      </div>

      {/* Font + Color */}
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <label className="text-[10px] text-zinc-500 font-semibold">Font Style</label>
          <select value={font} onChange={e => setFont(e.target.value)}
            className="w-full h-8 bg-zinc-50 border border-zinc-200 rounded-lg px-2 text-[11px] text-zinc-700 focus:outline-none">
            {FONT_STYLES.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] text-zinc-500 font-semibold">Color</label>
          <input type="color" value={color} onChange={e => setColor(e.target.value)}
            className="w-full h-8 border border-zinc-200 rounded-lg cursor-pointer" />
        </div>
      </div>

      {/* Font size */}
      <div className="space-y-1">
        <div className="flex justify-between text-[10px] text-zinc-500">
          <span>Size</span><span className="font-bold text-zinc-700">{size}px</span>
        </div>
        <input type="range" min="20" max="200" value={size} onChange={e => setSize(+e.target.value)} className="w-full accent-zinc-950" />
      </div>

      {/* Advanced toggle */}
      <button onClick={() => setAdvanced(!advanced)}
        className="flex items-center gap-1 text-[10px] text-zinc-500 hover:text-zinc-800 transition-colors">
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${advanced ? 'rotate-180' : ''}`} />
        Advanced Options
      </button>

      {advanced && (
        <div className="space-y-3 bg-zinc-50 rounded-xl p-3 border border-zinc-200">
          {/* Letter spacing */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-zinc-500">
              <span>Letter Spacing</span><span className="font-bold text-zinc-700">{letterSpacing}px</span>
            </div>
            <input type="range" min="-20" max="80" value={letterSpacing} onChange={e => setLetterSpacing(+e.target.value)} className="w-full accent-zinc-950" />
          </div>

          {/* Curve */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-zinc-500">
              <span>Curve</span><span className="font-bold text-zinc-700">{curveRadius}°</span>
            </div>
            <input type="range" min="-180" max="180" value={curveRadius} onChange={e => setCurveRadius(+e.target.value)} className="w-full accent-zinc-950" />
          </div>

          {/* Shadow */}
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-[10px] font-semibold text-zinc-700">Drop Shadow</span>
            <input type="checkbox" checked={shadowEnabled} onChange={e => setShadowEnabled(e.target.checked)} className="accent-zinc-950 w-4 h-4 cursor-pointer" />
          </label>

          {/* Outline */}
          <div className="space-y-2">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-[10px] font-semibold text-zinc-700">Outline</span>
              <input type="checkbox" checked={outlineEnabled} onChange={e => setOutlineEnabled(e.target.checked)} className="accent-zinc-950 w-4 h-4 cursor-pointer" />
            </label>
            {outlineEnabled && (
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <span className="text-[9px] text-zinc-500">Color</span>
                  <input type="color" value={outlineColor} onChange={e => setOutlineColor(e.target.value)} className="w-full h-7 border border-zinc-200 rounded-lg cursor-pointer" />
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] text-zinc-500">Width ({outlineWidth}px)</span>
                  <input type="range" min="1" max="20" value={outlineWidth} onChange={e => setOutlineWidth(+e.target.value)} className="w-full accent-zinc-950 mt-1" />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add button */}
      <button onClick={handleAdd}
        className="w-full py-2.5 px-4 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-semibold text-xs transition-all active:scale-98 shadow-sm flex items-center justify-center gap-1.5">
        <Plus className="w-3.5 h-3.5" /> Add to {side}
      </button>

      {/* List of existing text layers */}
      {state.textLayers.length > 0 && (
        <div className="space-y-1.5 pt-2 border-t border-zinc-100">
          <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
            Text Layers ({state.textLayers.length})
          </div>
          {state.textLayers.map(l => (
            <div key={l.id} className="flex items-center justify-between p-2 rounded-xl bg-zinc-50 border border-zinc-200">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-3 h-3 rounded-full border border-zinc-200 flex-shrink-0" style={{ backgroundColor: l.color }} />
                <span className="text-[10px] font-semibold text-zinc-700 truncate">{l.text}</span>
                <span className="text-[9px] text-zinc-400 flex-shrink-0">{l.side}</span>
              </div>
              <button onClick={() => onDeleteTextLayer(l.id)}
                className="p-1 text-zinc-400 hover:text-red-500 rounded transition-colors flex-shrink-0">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
