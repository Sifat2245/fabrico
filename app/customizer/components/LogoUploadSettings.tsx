'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Upload, Trash2, ChevronUp, ChevronDown, Image as ImageIcon, Layers } from 'lucide-react';
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

const CANVAS_SZ = 240;
const SCALE_FACTOR = 1024 / CANVAS_SZ; // 4.26666666667

export default function LogoUploadSettings({
  state,
  onAddLogoLayer,
  onUpdateLogoLayer,
  onDeleteLogoLayer,
  onMoveLayer,
  preloadImage,
}: LogoUploadSettingsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [addSide, setAddSide] = useState<'Front' | 'Back'>('Front');
  const [addType, setAddType] = useState<'logo' | 'image'>('logo');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  const [fabricInstance, setFabricInstance] = useState<any>(null);
  const isUpdatingFromFabric = useRef(false);

  // Keep callback refs stable to avoid recreating fabric canvas unnecessarily
  const onUpdateLogoLayerRef = useRef(onUpdateLogoLayer);
  useEffect(() => {
    onUpdateLogoLayerRef.current = onUpdateLogoLayer;
  }, [onUpdateLogoLayer]);

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
        x: 512,
        y: addSide === 'Front' ? 250 : 250,
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

  // 1. Initialize Fabric Canvas
  useEffect(() => {
    let active = true;
    let canvas: any = null;

    const initFabric = async () => {
      const fabric = await import('fabric');
      if (!active || !canvasRef.current) return;

      canvas = new fabric.Canvas(canvasRef.current, {
        width: CANVAS_SZ,
        height: CANVAS_SZ,
        backgroundColor: 'transparent',
        selection: false,
        stopContextMenu: true,
      });

      setFabricInstance(canvas);

      // Handle selections
      canvas.on('selection:created', (e: any) => {
        const obj = e.selected?.[0];
        if (obj && obj.id) {
          setSelectedId(obj.id);
        }
      });
      canvas.on('selection:updated', (e: any) => {
        const obj = e.selected?.[0];
        if (obj && obj.id) {
          setSelectedId(obj.id);
        }
      });
      canvas.on('selection:cleared', () => {
        setSelectedId(null);
      });

      // Handle modification events (moving, scaling, rotating)
      const handleModify = (e: any) => {
        const obj = e.target;
        if (!obj || !obj.id) return;

        isUpdatingFromFabric.current = true;

        const newX = obj.left * SCALE_FACTOR;
        const newY = obj.top * SCALE_FACTOR;
        const newScale = obj.scaleX * SCALE_FACTOR;
        const newRotation = obj.angle || 0;

        onUpdateLogoLayerRef.current(obj.id, {
          x: newX,
          y: newY,
          scale: newScale,
          rotation: newRotation,
        });

        setTimeout(() => {
          isUpdatingFromFabric.current = false;
        }, 50);
      };

      canvas.on('object:moving', handleModify);
      canvas.on('object:scaling', handleModify);
      canvas.on('object:rotating', handleModify);
    };

    initFabric();

    return () => {
      active = false;
      if (canvas) {
        canvas.dispose();
      }
    };
  }, [addSide]);

  // 2. Synchronize logo layers with Fabric Canvas objects
  useEffect(() => {
    if (!fabricInstance || isUpdatingFromFabric.current) return;

    const canvas = fabricInstance;
    const canvasObjects = canvas.getObjects();
    const activeLogos = state.logoLayers.filter((l) => l.side === addSide);

    // Remove objects that no longer exist in state
    canvasObjects.forEach((obj: any) => {
      if (!obj.id) return;
      const stillExists = activeLogos.some((l) => l.id === obj.id);
      if (!stillExists) {
        canvas.remove(obj);
      }
    });

    // Add or update objects
    activeLogos.forEach((layer) => {
      const existingObj = canvasObjects.find((obj: any) => obj.id === layer.id);

      const left = layer.x / SCALE_FACTOR;
      const top = layer.y / SCALE_FACTOR;
      const scale = layer.scale / SCALE_FACTOR;
      const angle = layer.rotation;

      if (existingObj) {
        existingObj.set({
          left,
          top,
          scaleX: scale,
          scaleY: scale,
          angle,
        });

        if (layer.id === selectedId) {
          canvas.setActiveObject(existingObj);
        } else if (canvas.getActiveObject() === existingObj && selectedId === null) {
          canvas.discardActiveObject();
        }

        existingObj.setCoords();
        canvas.requestRenderAll();
      } else {
        const element = document.createElement('img');
        element.src = layer.src;
        element.crossOrigin = 'anonymous';

        element.onload = async () => {
          const fabric = await import('fabric');
          const fabricImg = new fabric.FabricImage(element, {
            left,
            top,
            originX: 'center',
            originY: 'center',
            scaleX: scale,
            scaleY: scale,
            angle,
            cornerColor: '#6366f1',
            cornerStrokeColor: '#ffffff',
            borderColor: '#6366f1',
            cornerSize: 8,
            transparentCorners: false,
          });

          (fabricImg as any).id = layer.id;
          canvas.add(fabricImg);

          if (layer.id === selectedId) {
            canvas.setActiveObject(fabricImg);
          }
          canvas.requestRenderAll();
        };
      }
    });

    canvas.requestRenderAll();
  }, [fabricInstance, state.logoLayers, selectedId, addSide]);

  const selected = state.logoLayers.find(l => l.id === selectedId);

  // All layers sorted by layersOrder
  const sortedLayers = [...state.logoLayers].sort((a, b) => {
    const ia = state.layersOrder.indexOf(a.id);
    const ib = state.layersOrder.indexOf(b.id);
    return (ia === -1 ? 9999 : ia) - (ib === -1 ? 9999 : ib);
  });

  return (
    <div className="space-y-4 font-sans text-xs pb-4 text-zinc-350">
      <input type="file" ref={fileInputRef} onChange={handleFileUpload}
        accept="image/png,image/jpeg,image/svg+xml,image/webp" className="hidden" />

      {/* Side + type selector */}
      <div className="space-y-2">
        <div className="flex bg-[#16161c] p-0.5 rounded-lg border border-zinc-805 text-[10px]">
          {(['Front', 'Back'] as const).map(s => (
            <button key={s} onClick={() => setAddSide(s)}
              className={`flex-1 py-1 rounded-md font-semibold transition-all cursor-pointer ${addSide === s ? 'bg-indigo-600 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'}`}>
              {s}
            </button>
          ))}
        </div>

        {/* Type: logo (3D projection) vs image (canvas) */}
        <div className="flex bg-[#16161c] p-0.5 rounded-lg border border-zinc-805 text-[10px]">
          <button onClick={() => setAddType('logo')}
            className={`flex-1 py-1 rounded-md font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer ${addType === 'logo' ? 'bg-indigo-600 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'}`}>
            <Layers className="w-3 h-3" /> 3D Decal
          </button>
          <button onClick={() => setAddType('image')}
            className={`flex-1 py-1 rounded-md font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer ${addType === 'image' ? 'bg-indigo-600 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'}`}>
            <ImageIcon className="w-3 h-3" /> Flat Image
          </button>
        </div>
        <p className="text-[9px] text-zinc-550 leading-relaxed">
          {addType === 'logo' ? '3D Decal: rendered onto the shirt body texture.' : 'Flat Image: rendered directly on the fabric canvas texture.'}
        </p>
      </div>

      {/* Upload button */}
      <button onClick={() => fileInputRef.current?.click()}
        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-md shadow-indigo-650/10 transition-all active:scale-98 cursor-pointer">
        <Upload className="w-4 h-4" />
        <span>Upload Image</span>
      </button>

      {/* Layer list */}
      {sortedLayers.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-zinc-800">
          <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
            Logo Layers ({sortedLayers.length})
          </div>
          <div className="space-y-1.5 max-h-40 overflow-y-auto">
            {sortedLayers.map(l => {
              const isSelected = l.id === selectedId;
              return (
                <div key={l.id} onClick={() => setSelectedId(isSelected ? null : l.id)}
                  className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    isSelected ? 'bg-[#1e1e28] border-indigo-600 shadow-sm shadow-indigo-650/10' : 'bg-[#16161c] border-zinc-800 hover:bg-[#1a1a24]'
                  }`}>
                  <div className="flex items-center gap-2 min-w-0">
                    <img src={l.src} alt="Logo" className="w-6 h-6 object-contain rounded bg-[#131317] border border-zinc-800 flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="text-[10px] font-semibold text-zinc-200 truncate">{l.type === 'logo' ? '3D Decal' : 'Flat'} · {l.side}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5 flex-shrink-0">
                    <button onClick={e => { e.stopPropagation(); onMoveLayer(l.id, 'up'); }} className="p-0.5 text-zinc-500 hover:text-zinc-205 rounded"><ChevronUp className="w-3.5 h-3.5" /></button>
                    <button onClick={e => { e.stopPropagation(); onMoveLayer(l.id, 'down'); }} className="p-0.5 text-zinc-500 hover:text-zinc-205 rounded"><ChevronDown className="w-3.5 h-3.5" /></button>
                    <button onClick={e => { e.stopPropagation(); onDeleteLogoLayer(l.id); if (selectedId === l.id) setSelectedId(null); }} className="p-0.5 text-zinc-500 hover:text-red-400 rounded"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Selected layer controls */}
      {selected && (
        <div className="space-y-3 bg-[#16161c] rounded-xl p-3 border border-zinc-800">
          <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">Layer Controls</div>

          <div className="grid grid-cols-2 gap-3">
            {/* Position X */}
            <div className="space-y-1">
              <div className="flex justify-between text-[9px] text-zinc-450"><span>X Position</span><span className="font-mono font-bold text-zinc-300">{Math.round(selected.x)}</span></div>
              <input type="range" min="0" max="1024" value={selected.x} onChange={e => onUpdateLogoLayer(selected.id, { x: +e.target.value })} className="w-full accent-indigo-500 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer" />
            </div>

            {/* Position Y */}
            <div className="space-y-1">
              <div className="flex justify-between text-[9px] text-zinc-450"><span>Y Position</span><span className="font-mono font-bold text-zinc-300">{Math.round(selected.y)}</span></div>
              <input type="range" min="0" max="1024" value={selected.y} onChange={e => onUpdateLogoLayer(selected.id, { y: +e.target.value })} className="w-full accent-indigo-500 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer" />
            </div>

            {/* Scale */}
            <div className="space-y-1">
              <div className="flex justify-between text-[9px] text-zinc-450"><span>Scale</span><span className="font-mono font-bold text-zinc-300">{selected.scale.toFixed(2)}x</span></div>
              <input type="range" min="0.1" max="5" step="0.05" value={selected.scale} onChange={e => onUpdateLogoLayer(selected.id, { scale: +e.target.value })} className="w-full accent-indigo-500 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer" />
            </div>

            {/* Rotation */}
            <div className="space-y-1">
              <div className="flex justify-between text-[9px] text-zinc-450"><span>Rotation</span><span className="font-mono font-bold text-zinc-300">{Math.round(selected.rotation)}°</span></div>
              <input type="range" min="-180" max="180" value={selected.rotation} onChange={e => onUpdateLogoLayer(selected.id, { rotation: +e.target.value })} className="w-full accent-indigo-500 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer" />
            </div>
          </div>

          {/* Opacity */}
          <div className="space-y-1">
            <div className="flex justify-between text-[9px] text-zinc-450"><span>Opacity</span><span className="font-mono font-bold text-zinc-300">{Math.round((selected.opacity ?? 1) * 100)}%</span></div>
            <input type="range" min="0" max="1" step="0.01" value={selected.opacity ?? 1} onChange={e => onUpdateLogoLayer(selected.id, { opacity: +e.target.value })} className="w-full accent-indigo-500 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer" />
          </div>
        </div>
      )}

      {/* Visual Logo Editor Canvas */}
      <div className="space-y-2 pt-3 border-t border-zinc-800">
        <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
          Visual Logo Editor ({addSide === 'Front' ? 'Front View' : 'Back View'})
        </div>
        <div className="relative w-full aspect-square bg-[#16161a] border border-zinc-800 rounded-2xl overflow-hidden flex items-center justify-center pointer-events-auto">
          {/* Silhouette overlay vector path behind transparent Fabric.js layer */}
          <svg
            className="absolute w-4/5 h-4/5 text-zinc-800 pointer-events-none"
            viewBox="0 0 100 100"
            fill="none"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="1.2"
          >
            <defs>
              <pattern id="grid-upload" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255, 255, 255, 0.025)" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid-upload)" stroke="none" />

            {addSide === 'Front' ? (
              // Front Collar Outline
              <path
                d="M 50,16 C 43.5,16 38.5,10.5 38.5,10.5 H 24 L 6,26 L 19,38 L 29.5,31 V 88 H 70.5 V 31 L 81,38 L 94,26 L 79.5,10.5 H 61.5 C 61.5,10.5 56.5,16 50,16 Z"
                fill="rgba(255, 255, 255, 0.01)"
              />
            ) : (
              // Back Collar Outline (Higher horizontal ridge at neckline)
              <path
                d="M 50,11.5 C 44.5,11.5 38.5,10.5 38.5,10.5 H 24 L 6,26 L 19,38 L 29.5,31 V 88 H 70.5 V 31 L 81,38 L 94,26 L 79.5,10.5 H 61.5 C 61.5,10.5 55.5,11.5 50,11.5 Z"
                fill="rgba(255, 255, 255, 0.01)"
              />
            )}

            {/* Dotted target guide alignment lines */}
            <line x1="50" y1="10" x2="50" y2="90" stroke="rgba(255, 255, 255, 0.08)" strokeDasharray="2,2" />
            <line x1="20" y1="50" x2="80" y2="50" stroke="rgba(255, 255, 255, 0.08)" strokeDasharray="2,2" />
          </svg>

          {/* Fabric canvas element */}
          <div className="absolute z-10 w-[240px] h-[240px]">
            <canvas ref={canvasRef} />
          </div>
        </div>
      </div>
    </div>
  );
}
