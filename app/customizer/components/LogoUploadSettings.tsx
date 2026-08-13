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
  
  const [uploadedImages, setUploadedImages] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem('fabrico_uploaded_images');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  
  const [selectedUploadedImg, setSelectedUploadedImg] = useState<string | null>(null);
  const [fabricInstance, setFabricInstance] = useState<any>(null);
  const isUpdatingFromFabric = useRef(false);

  // Keep callback refs stable to avoid recreating fabric canvas unnecessarily
  const onUpdateLogoLayerRef = useRef(onUpdateLogoLayer);
  useEffect(() => {
    onUpdateLogoLayerRef.current = onUpdateLogoLayer;
  }, [onUpdateLogoLayer]);

  // Preload uploaded images on mount
  useEffect(() => {
    uploadedImages.forEach(src => preloadImage(src));
  }, [preloadImage, uploadedImages]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const src = ev.target?.result as string;
      if (!src) return;
      if (!uploadedImages.includes(src)) {
        const next = [...uploadedImages, src];
        setUploadedImages(next);
        if (typeof window !== 'undefined') {
          localStorage.setItem('fabrico_uploaded_images', JSON.stringify(next));
        }
      }
      preloadImage(src);
      setSelectedUploadedImg(src);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const deleteUploadedImage = (src: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = uploadedImages.filter(p => p !== src);
    setUploadedImages(next);
    if (typeof window !== 'undefined') {
      localStorage.setItem('fabrico_uploaded_images', JSON.stringify(next));
    }
    if (selectedUploadedImg === src) {
      setSelectedUploadedImg(null);
    }
  };

  const addLayerToSide = (side: 'Front' | 'Back') => {
    if (!selectedUploadedImg) return;
    const id = genId();
    const layer: LogoLayer = {
      id,
      type: addType,
      side: side,
      src: selectedUploadedImg,
      x: 512,
      y: 250,
      scale: 1,
      rotation: 0,
      opacity: 1,
      eraserPaths: [],
    };
    onAddLogoLayer(layer);
    setSelectedId(id);
    setAddSide(side); // auto-switch visual canvas editor view
  };

  const addLayerToBoth = () => {
    if (!selectedUploadedImg) return;
    const frontId = genId();
    const frontLayer: LogoLayer = {
      id: frontId,
      type: addType,
      side: 'Front',
      src: selectedUploadedImg,
      x: 512,
      y: 250,
      scale: 1,
      rotation: 0,
      opacity: 1,
      eraserPaths: [],
    };
    const backId = genId();
    const backLayer: LogoLayer = {
      id: backId,
      type: addType,
      side: 'Back',
      src: selectedUploadedImg,
      x: 512,
      y: 250,
      scale: 1,
      rotation: 0,
      opacity: 1,
      eraserPaths: [],
    };
    onAddLogoLayer(frontLayer);
    onAddLogoLayer(backLayer);
    setSelectedId(addSide === 'Front' ? frontId : backId);
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

      {/* Asset Library Uploader */}
      <div className="space-y-2.5 p-3 bg-[#16161c] border border-zinc-800 rounded-xl">
        <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
          Upload Image Library
        </div>

        {/* Beautiful upload dropzone button */}
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="w-full border-2 border-dashed border-zinc-800 hover:border-indigo-500/50 hover:bg-[#1c1c28]/40 transition-all rounded-xl p-4 flex flex-col items-center justify-center gap-1.5 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-full bg-[#111115] border border-zinc-800 flex items-center justify-center group-hover:bg-indigo-650/10 group-hover:border-indigo-500/30 transition-all">
            <Upload className="w-4 h-4 text-zinc-500 group-hover:text-indigo-400 transition-all" />
          </div>
          <div className="text-[10px] font-semibold text-zinc-450 group-hover:text-zinc-200 transition-all">
            Upload Image asset
          </div>
          <div className="text-[8px] text-zinc-600">
            PNG, JPEG, SVG, WebP
          </div>
        </div>

        {/* Uploaded assets grid */}
        {uploadedImages.length > 0 && (
          <div className="space-y-1.5 mt-2">
            <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Uploaded Assets</div>
            <div className="grid grid-cols-4 gap-1.5 max-h-28 overflow-y-auto pr-1">
              {uploadedImages.map((src, idx) => {
                const isSelected = selectedUploadedImg === src;
                const appliedFront = state.logoLayers.some(l => l.src === src && l.side === 'Front');
                const appliedBack = state.logoLayers.some(l => l.src === src && l.side === 'Back');
                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedUploadedImg(isSelected ? null : src)}
                    className={`relative aspect-square rounded-lg border-2 overflow-hidden cursor-pointer transition-all hover:scale-[1.03] bg-[#0c0c0f] ${
                      isSelected ? 'border-indigo-500 ring-2 ring-indigo-500/20' : 'border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <img src={src} alt="Uploaded logo" className="w-full h-full object-contain p-1 opacity-85 hover:opacity-100" />
                    
                    {/* Indicators for Front/Back applied */}
                    <div className="absolute bottom-0.5 left-0.5 right-0.5 flex gap-0.5">
                      {appliedFront && (
                        <span className="bg-indigo-600 text-white text-[7px] font-bold px-1 rounded-sm scale-90 origin-bottom-left">
                          F
                        </span>
                      )}
                      {appliedBack && (
                        <span className="bg-violet-650 text-white text-[7px] font-bold px-1 rounded-sm scale-90 origin-bottom-left">
                          B
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Selected asset action box */}
        {selectedUploadedImg && (
          <div className="mt-2.5 pt-2.5 border-t border-zinc-800 space-y-2.5">
            {/* Placement Type choice */}
            <div className="space-y-1">
              <span className="text-[9px] text-zinc-500 font-semibold uppercase">Placement Type</span>
              <div className="flex bg-[#111115] p-0.5 rounded-lg border border-zinc-800 text-[9px]">
                <button 
                  onClick={() => setAddType('logo')}
                  className={`flex-1 py-1 rounded-md font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer ${addType === 'logo' ? 'bg-indigo-600 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'}`}
                >
                  <Layers className="w-2.5 h-2.5" /> 3D Decal
                </button>
                <button 
                  onClick={() => setAddType('image')}
                  className={`flex-1 py-1 rounded-md font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer ${addType === 'image' ? 'bg-indigo-600 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'}`}
                >
                  <ImageIcon className="w-2.5 h-2.5" /> Flat Image
                </button>
              </div>
            </div>

            {/* Placement target actions */}
            <div className="space-y-1">
              <span className="text-[9px] text-zinc-500 font-semibold uppercase">Place on Shirt</span>
              <div className="flex gap-1.5">
                <button
                  onClick={() => addLayerToSide('Front')}
                  className="flex-1 py-1 rounded-lg text-[9px] font-bold bg-[#16161c] border border-zinc-800 text-zinc-300 hover:border-zinc-700 transition-all cursor-pointer"
                >
                  Front
                </button>
                <button
                  onClick={() => addLayerToSide('Back')}
                  className="flex-1 py-1 rounded-lg text-[9px] font-bold bg-[#16161c] border border-zinc-800 text-zinc-300 hover:border-zinc-700 transition-all cursor-pointer"
                >
                  Back
                </button>
                <button
                  onClick={addLayerToBoth}
                  className="flex-1 py-1 rounded-lg text-[9px] font-bold bg-[#20202e] border border-zinc-800 text-indigo-400 hover:bg-[#252538] transition-all cursor-pointer"
                >
                  Both
                </button>
                <button
                  onClick={(e) => deleteUploadedImage(selectedUploadedImg, e)}
                  className="px-2 py-1 rounded-lg bg-red-950/20 border border-red-900/30 text-red-400 hover:bg-red-900/25 transition-all cursor-pointer animate-pulse"
                  title="Remove asset from gallery"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Side selector for visual positioning editor */}
      <div className="space-y-1 pt-2 border-t border-zinc-800">
        <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
          Select View to Position
        </div>
        <div className="flex bg-[#16161c] p-0.5 rounded-lg border border-zinc-800 text-[10px]">
          {(['Front', 'Back'] as const).map(s => (
            <button key={s} onClick={() => setAddSide(s)}
              className={`flex-1 py-1 rounded-md font-semibold transition-all cursor-pointer ${addSide === s ? 'bg-indigo-600 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'}`}>
              {s} View Editor
            </button>
          ))}
        </div>
      </div>

      {/* Layer list */}
      {sortedLayers.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-zinc-800">
          <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
            Placed Layers ({sortedLayers.length})
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
                    <img src={l.src} alt="Placed logo" className="w-6 h-6 object-contain rounded bg-[#131317] border border-zinc-800 flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="text-[10px] font-semibold text-zinc-200 truncate">{l.type === 'logo' ? '3D Decal' : 'Flat'} · {l.side}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5 flex-shrink-0">
                    <button onClick={e => { e.stopPropagation(); onMoveLayer(l.id, 'up'); }} className="p-0.5 text-zinc-500 hover:text-zinc-200 rounded cursor-pointer"><ChevronUp className="w-3.5 h-3.5" /></button>
                    <button onClick={e => { e.stopPropagation(); onMoveLayer(l.id, 'down'); }} className="p-0.5 text-zinc-500 hover:text-zinc-200 rounded cursor-pointer"><ChevronDown className="w-3.5 h-3.5" /></button>
                    <button onClick={e => { e.stopPropagation(); onDeleteLogoLayer(l.id); if (selectedId === l.id) setSelectedId(null); }} className="p-0.5 text-zinc-500 hover:text-red-400 rounded cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
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
          Visual Placement Editor ({addSide === 'Front' ? 'Front View' : 'Back View'})
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
