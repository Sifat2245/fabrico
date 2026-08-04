'use client';

import React, { useRef, useState } from 'react';
import { Upload, Trash2, ChevronUp, ChevronDown, Eraser, Image as ImageIcon, Layers } from 'lucide-react';
import { LogoLayer, CustomizerState } from './types';

function genId() { return `logo_${Date.now()}_${Math.random().toString(36).slice(2,6)}`; }

interface LogoUploadSettingsProps {
  state: CustomizerState;
  onAddLogoLayer: (layer: LogoLayer) => void;
  onUpdateLogoLayer: (id: string, patch: Partial<LogoLayer>) => void;
  onDeleteLogoLayer: (id: string) => void;
  onMoveLayer: (id: string, dir: 'up' | 'down') => void;
  preloadImage: (src: string) => void;
}

export default function LogoUploadSettings({
  state,
  onAddLogoLayer,
  onUpdateLogoLayer,
  onDeleteLogoLayer,
  onMoveLayer,
  preloadImage,
}: LogoUploadSettingsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [addSide, setAddSide] = useState<'Front' | 'Back'>('Front');
  const [addType, setAddType] = useState<'logo' | 'image'>('logo');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const src = ev.target?.result as string;
      if (!src) return;
      const layer: LogoLayer = {
        id: genId(),
        type: addType,
        side: addSide,
        src,
        x: 512, y: addSide === 'Front' ? 250 : 250,
        scale: 1,
        rotation: 0,
        opacity: 1,
        eraserPaths: [],
      };
      preloadImage(src);
      onAddLogoLayer(layer);
      setSelectedId(layer.id);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const selected = state.logoLayers.find(l => l.id === selectedId);

  // All layers sorted by layersOrder
  const sortedLayers = [...state.logoLayers].sort((a, b) => {
    const ia = state.layersOrder.indexOf(a.id);
    const ib = state.layersOrder.indexOf(b.id);
    return (ia === -1 ? 9999 : ia) - (ib === -1 ? 9999 : ib);
  });

  return (
    <div className="space-y-4 font-sans text-xs">
      <input type="file" ref={fileInputRef} onChange={handleFileUpload}
        accept="image/png,image/jpeg,image/svg+xml,image/webp" className="hidden" />

      {/* Side + type selector */}
      <div className="space-y-2">
        <div className="flex bg-zinc-100 p-0.5 rounded-lg border border-zinc-200 text-[10px]">
          {(['Front', 'Back'] as const).map(s => (
            <button key={s} onClick={() => setAddSide(s)}
              className={`flex-1 py-1 rounded-md font-semibold transition-all ${addSide === s ? 'bg-white text-zinc-950 shadow-sm' : 'text-zinc-500'}`}>
              {s}
            </button>
          ))}
        </div>

        {/* Type: logo (3D projection) vs image (canvas) */}
        <div className="flex bg-zinc-100 p-0.5 rounded-lg border border-zinc-200 text-[10px]">
          <button onClick={() => setAddType('logo')}
            className={`flex-1 py-1 rounded-md font-semibold flex items-center justify-center gap-1 transition-all ${addType === 'logo' ? 'bg-white text-zinc-950 shadow-sm' : 'text-zinc-500'}`}>
            <Layers className="w-3 h-3" /> 3D Decal
          </button>
          <button onClick={() => setAddType('image')}
            className={`flex-1 py-1 rounded-md font-semibold flex items-center justify-center gap-1 transition-all ${addType === 'image' ? 'bg-white text-zinc-950 shadow-sm' : 'text-zinc-500'}`}>
            <ImageIcon className="w-3 h-3" /> Flat Image
          </button>
        </div>
        <p className="text-[9px] text-zinc-400 leading-relaxed">
          {addType === 'logo' ? '3D Decal: rendered onto the shirt body texture.' : 'Flat Image: rendered directly on the fabric canvas texture.'}
        </p>
      </div>

      {/* Upload button */}
      <button onClick={() => fileInputRef.current?.click()}
        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-semibold shadow-sm transition-all active:scale-98 cursor-pointer">
        <Upload className="w-4 h-4" />
        <span>Upload Image</span>
      </button>

      {/* Layer list */}
      {sortedLayers.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-zinc-100">
          <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
            Logo Layers ({sortedLayers.length})
          </div>
          <div className="space-y-1.5 max-h-40 overflow-y-auto">
            {sortedLayers.map(l => {
              const isSelected = l.id === selectedId;
              return (
                <div key={l.id} onClick={() => setSelectedId(isSelected ? null : l.id)}
                  className={`p-2 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    isSelected ? 'bg-zinc-50 border-zinc-800' : 'bg-white border-zinc-200 hover:bg-zinc-50'
                  }`}>
                  <div className="flex items-center gap-2 min-w-0">
                    <img src={l.src} alt="Logo" className="w-6 h-6 object-contain rounded bg-zinc-100 border border-zinc-200 flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="text-[10px] font-semibold text-zinc-700 truncate">{l.type === 'logo' ? '3D Decal' : 'Flat'} · {l.side}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5 flex-shrink-0">
                    <button onClick={e => { e.stopPropagation(); onMoveLayer(l.id, 'up'); }} className="p-0.5 text-zinc-400 hover:text-zinc-700 rounded"><ChevronUp className="w-3 h-3" /></button>
                    <button onClick={e => { e.stopPropagation(); onMoveLayer(l.id, 'down'); }} className="p-0.5 text-zinc-400 hover:text-zinc-700 rounded"><ChevronDown className="w-3 h-3" /></button>
                    <button onClick={e => { e.stopPropagation(); onDeleteLogoLayer(l.id); if (selectedId === l.id) setSelectedId(null); }} className="p-0.5 text-zinc-400 hover:text-red-500 rounded"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Selected layer controls */}
      {selected && (
        <div className="space-y-3 bg-zinc-50 rounded-xl p-3 border border-zinc-200">
          <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Layer Controls</div>

          <div className="grid grid-cols-2 gap-3">
            {/* Position X */}
            <div className="space-y-1">
              <div className="flex justify-between text-[9px] text-zinc-500"><span>X Position</span><span className="font-mono font-bold">{Math.round(selected.x)}</span></div>
              <input type="range" min="0" max="1024" value={selected.x} onChange={e => onUpdateLogoLayer(selected.id, { x: +e.target.value })} className="w-full accent-zinc-950" />
            </div>

            {/* Position Y */}
            <div className="space-y-1">
              <div className="flex justify-between text-[9px] text-zinc-500"><span>Y Position</span><span className="font-mono font-bold">{Math.round(selected.y)}</span></div>
              <input type="range" min="0" max="1024" value={selected.y} onChange={e => onUpdateLogoLayer(selected.id, { y: +e.target.value })} className="w-full accent-zinc-950" />
            </div>

            {/* Scale */}
            <div className="space-y-1">
              <div className="flex justify-between text-[9px] text-zinc-500"><span>Scale</span><span className="font-mono font-bold">{selected.scale.toFixed(2)}x</span></div>
              <input type="range" min="0.1" max="5" step="0.05" value={selected.scale} onChange={e => onUpdateLogoLayer(selected.id, { scale: +e.target.value })} className="w-full accent-zinc-950" />
            </div>

            {/* Rotation */}
            <div className="space-y-1">
              <div className="flex justify-between text-[9px] text-zinc-500"><span>Rotation</span><span className="font-mono font-bold">{Math.round(selected.rotation)}°</span></div>
              <input type="range" min="-180" max="180" value={selected.rotation} onChange={e => onUpdateLogoLayer(selected.id, { rotation: +e.target.value })} className="w-full accent-zinc-950" />
            </div>
          </div>

          {/* Opacity */}
          <div className="space-y-1">
            <div className="flex justify-between text-[9px] text-zinc-500"><span>Opacity</span><span className="font-mono font-bold">{Math.round((selected.opacity ?? 1) * 100)}%</span></div>
            <input type="range" min="0" max="1" step="0.01" value={selected.opacity ?? 1} onChange={e => onUpdateLogoLayer(selected.id, { opacity: +e.target.value })} className="w-full accent-zinc-950" />
          </div>

          {/* Preview */}
          <div className="rounded-lg border border-zinc-200 overflow-hidden bg-zinc-100 flex items-center justify-center h-20">
            <img src={selected.src} alt="Preview" className="max-h-full max-w-full object-contain" />
          </div>
        </div>
      )}
    </div>
  );
}
