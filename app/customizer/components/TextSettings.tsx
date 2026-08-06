'use client';

import React, { useState, useEffect, useRef } from 'react';
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

const CANVAS_SZ = 240;
const SCALE_FACTOR = 1024 / CANVAS_SZ; // 4.26666666667

const getFabricFontFamily = (fontStyle: string): string => {
  if (fontStyle === 'Script') return '"Brush Script MT", cursive';
  if (fontStyle === 'Block' || fontStyle === 'Cyberpunk' || fontStyle === 'Neon Glow') return '"Courier New", monospace';
  if (fontStyle === 'Serif Athletic') return '"Georgia", serif';
  if (fontStyle === 'Gothic') return '"Times New Roman", serif';
  if (fontStyle === 'Varsity') return '"Arial Black", sans-serif';
  return 'Impact, sans-serif';
};

const getFabricFontWeight = (fontStyle: string): "normal" | "bold" => {
  if (fontStyle === 'Neon Glow' || fontStyle === 'Gothic') return 'normal';
  return 'bold';
};

const getFabricFontStyle = (fontStyle: string): "normal" | "italic" => {
  if (fontStyle === 'Italic') return 'italic';
  return 'normal';
};

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

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricInstance, setFabricInstance] = useState<any>(null);
  const isUpdatingFromFabric = useRef(false);

  const selected = state.textLayers.find(l => l.id === selectedId);

  // Bind values dynamically to selected layer if one exists, otherwise local state
  const currentText = selected ? selected.text : text;
  const currentFont = selected ? selected.font : font;
  const currentColor = selected ? selected.color : color;
  const currentSize = selected ? selected.textSize : size;
  const currentSide = selected ? selected.side : side;
  const currentLetterSpacing = selected ? selected.letterSpacing : letterSpacing;
  const currentCurveRadius = selected ? selected.curveRadius : curveRadius;
  const currentShadowEnabled = selected ? selected.shadowEnabled : shadowEnabled;
  const currentOutlineEnabled = selected ? selected.outlineEnabled : outlineEnabled;
  const currentOutlineColor = selected ? selected.outlineColor : outlineColor;
  const currentOutlineWidth = selected ? selected.outlineWidth : outlineWidth;

  const onUpdateTextLayerRef = useRef(onUpdateTextLayer);
  useEffect(() => {
    onUpdateTextLayerRef.current = onUpdateTextLayer;
  }, [onUpdateTextLayer]);

  const handleUpdate = (patch: Partial<TextLayer>) => {
    if (selectedId) {
      onUpdateTextLayerRef.current(selectedId, patch);
    }
  };

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
    setSelectedId(layer.id);
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
        const newScale = obj.scaleX;
        const newRotation = obj.angle || 0;

        onUpdateTextLayerRef.current(obj.id, {
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
  }, [currentSide]);

  // 2. Synchronize text layers with Fabric Canvas objects
  useEffect(() => {
    if (!fabricInstance || isUpdatingFromFabric.current) return;

    const canvas = fabricInstance;
    const canvasObjects = canvas.getObjects();
    const activeTextLayers = state.textLayers.filter((l) => l.side === currentSide);

    // Remove objects that no longer exist in state
    canvasObjects.forEach((obj: any) => {
      if (!obj.id) return;
      const stillExists = activeTextLayers.some((l) => l.id === obj.id);
      if (!stillExists) {
        canvas.remove(obj);
      }
    });

    // Add or update objects
    activeTextLayers.forEach(async (layer) => {
      const existingObj = canvasObjects.find((obj: any) => obj.id === layer.id);

      const left = layer.x / SCALE_FACTOR;
      const top = layer.y / SCALE_FACTOR;
      const scaleX = layer.scale;
      const scaleY = layer.scale;
      const angle = layer.rotation;
      const fontSize = layer.textSize / SCALE_FACTOR;

      if (existingObj) {
        existingObj.set({
          text: layer.text,
          left,
          top,
          scaleX,
          scaleY,
          angle,
          fontSize,
          fill: layer.color,
          fontFamily: getFabricFontFamily(layer.font),
          fontWeight: getFabricFontWeight(layer.font),
          fontStyle: getFabricFontStyle(layer.font),
        });

        if (layer.id === selectedId) {
          canvas.setActiveObject(existingObj);
        } else if (canvas.getActiveObject() === existingObj && selectedId === null) {
          canvas.discardActiveObject();
        }

        existingObj.setCoords();
        canvas.requestRenderAll();
      } else {
        const fabric = await import('fabric');
        const fabricText = new fabric.FabricText(layer.text, {
          left,
          top,
          originX: 'center',
          originY: 'center',
          scaleX,
          scaleY,
          angle,
          fontSize,
          fill: layer.color,
          fontFamily: getFabricFontFamily(layer.font),
          fontWeight: getFabricFontWeight(layer.font),
          fontStyle: getFabricFontStyle(layer.font),
          cornerColor: '#6366f1',
          cornerStrokeColor: '#ffffff',
          borderColor: '#6366f1',
          cornerSize: 8,
          transparentCorners: false,
        });

        (fabricText as any).id = layer.id;
        canvas.add(fabricText);

        if (layer.id === selectedId) {
          canvas.setActiveObject(fabricText);
        }
        canvas.requestRenderAll();
      }
    });

    canvas.requestRenderAll();
  }, [fabricInstance, state.textLayers, selectedId, currentSide]);

  return (
    <div className="space-y-4 font-sans text-xs pb-4 text-slate-300">
      <div className="text-[10px] font-bold uppercase tracking-wider text-violet-400 flex items-center gap-1.5">
        <Type className="w-3.5 h-3.5 text-indigo-450" /> Custom Printed Text
      </div>

      {/* Side Selector */}
      <div className="flex bg-[#1c1c26] p-0.5 rounded-lg border border-white/[0.06] text-[10px]">
        {(['Front', 'Back'] as const).map(s => (
          <button key={s}
            onClick={() => {
              if (selected) {
                handleUpdate({ side: s });
              } else {
                setSide(s);
              }
            }}
            className={`flex-1 py-1 rounded-md font-semibold transition-all cursor-pointer ${currentSide === s ? 'bg-violet-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}>
            {s}
          </button>
        ))}
      </div>

      {/* Text input */}
      <div className="space-y-1">
        <label className="text-[10px] text-slate-500 font-semibold">Text</label>
        <textarea
          value={currentText}
          onChange={e => {
            if (selected) {
              handleUpdate({ text: e.target.value });
            } else {
              setText(e.target.value);
            }
          }}
          rows={2}
          placeholder="Enter text (use ↵ for new line)"
          className="w-full bg-[#1c1c26] border border-white/[0.06] rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 resize-none"
        />
      </div>

      {/* Font + Color */}
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <label className="text-[10px] text-slate-500 font-semibold">Font Style</label>
          <select
            value={currentFont}
            onChange={e => {
              if (selected) {
                handleUpdate({ font: e.target.value });
              } else {
                setFont(e.target.value);
              }
            }}
            className="w-full h-8 bg-[#1c1c26] border border-white/[0.06] rounded-lg px-2 text-[11px] text-slate-300 focus:outline-none focus:border-violet-500"
          >
            {FONT_STYLES.map(f => <option key={f} value={f} className="bg-[#1c1c26]">{f}</option>)}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] text-slate-500 font-semibold">Color</label>
          <input
            type="color"
            value={currentColor}
            onChange={e => {
              if (selected) {
                handleUpdate({ color: e.target.value });
              } else {
                setColor(e.target.value);
              }
            }}
            className="w-full h-8 border border-white/[0.06] bg-[#1c1c26] rounded-lg cursor-pointer px-1 py-0.5"
          />
        </div>
      </div>

      {/* Font size */}
      <div className="space-y-1">
        <div className="flex justify-between text-[10px] text-slate-500">
          <span>Size</span><span className="font-bold text-slate-300">{currentSize}px</span>
        </div>
        <input
          type="range"
          min="20"
          max="200"
          value={currentSize}
          onChange={e => {
            const val = +e.target.value;
            if (selected) {
              handleUpdate({ textSize: val });
            } else {
              setSize(val);
            }
          }}
          className="w-full accent-violet-500 h-1.5 bg-[#1c1c26] rounded-lg appearance-none cursor-pointer"
        />
      </div>

      {/* Advanced toggle */}
      <button onClick={() => setAdvanced(!advanced)}
        className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-slate-200 transition-colors">
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${advanced ? 'rotate-180' : ''}`} />
        Advanced Options
      </button>

      {advanced && (
        <div className="space-y-3 bg-[#1c1c26] rounded-xl p-3 border border-white/[0.06]">
          {/* Letter spacing */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>Letter Spacing</span><span className="font-bold text-slate-300">{currentLetterSpacing}px</span>
            </div>
            <input
              type="range"
              min="-20"
              max="80"
              value={currentLetterSpacing}
              onChange={e => {
                const val = +e.target.value;
                if (selected) {
                  handleUpdate({ letterSpacing: val });
                } else {
                  setLetterSpacing(val);
                }
              }}
              className="w-full accent-violet-500 h-1.5 bg-[#1c1c26] rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Curve */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>Curve</span><span className="font-bold text-slate-300">{currentCurveRadius}°</span>
            </div>
            <input
              type="range"
              min="-180"
              max="180"
              value={currentCurveRadius}
              onChange={e => {
                const val = +e.target.value;
                if (selected) {
                  handleUpdate({ curveRadius: val });
                } else {
                  setCurveRadius(val);
                }
              }}
              className="w-full accent-violet-500 h-1.5 bg-[#1c1c26] rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Shadow */}
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-[10px] font-semibold text-slate-300">Drop Shadow</span>
            <input
              type="checkbox"
              checked={currentShadowEnabled}
              onChange={e => {
                const val = e.target.checked;
                if (selected) {
                  handleUpdate({ shadowEnabled: val });
                } else {
                  setShadowEnabled(val);
                }
              }}
              className="accent-violet-500 w-4 h-4 cursor-pointer"
            />
          </label>

          {/* Outline */}
          <div className="space-y-2">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-[10px] font-semibold text-slate-300">Outline</span>
              <input
                type="checkbox"
                checked={currentOutlineEnabled}
                onChange={e => {
                  const val = e.target.checked;
                  if (selected) {
                    handleUpdate({ outlineEnabled: val });
                  } else {
                    setOutlineEnabled(val);
                  }
                }}
                className="accent-violet-500 w-4 h-4 cursor-pointer"
              />
            </label>
            {currentOutlineEnabled && (
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <span className="text-[9px] text-slate-500">Color</span>
                  <input
                    type="color"
                    value={currentOutlineColor}
                    onChange={e => {
                      const val = e.target.value;
                      if (selected) {
                        handleUpdate({ outlineColor: val });
                      } else {
                        setOutlineColor(val);
                      }
                    }}
                    className="w-full h-7 border border-white/[0.06] rounded-lg cursor-pointer bg-[#1c1c26] px-1 py-0.5"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] text-slate-500">Width ({currentOutlineWidth}px)</span>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={currentOutlineWidth}
                    onChange={e => {
                      const val = +e.target.value;
                      if (selected) {
                        handleUpdate({ outlineWidth: val });
                      } else {
                        setOutlineWidth(val);
                      }
                    }}
                    className="w-full accent-violet-500 mt-1 h-1.5 bg-[#1c1c26] rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add button / Deselect button */}
      {selected ? (
        <button
          onClick={() => setSelectedId(null)}
          className="w-full py-2.5 px-4 rounded-xl border border-white/[0.06] hover:bg-[#20202e] text-slate-100 font-semibold text-xs transition-all active:scale-98 shadow-sm flex items-center justify-center gap-1.5 cursor-pointer bg-[#1c1c26]"
        >
          <span>Deselect / Create New Text</span>
        </button>
      ) : (
        <button
          onClick={handleAdd}
          className="w-full py-2.5 px-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs transition-all active:scale-98 shadow-md shadow-violet-600/15 flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> Add to {currentSide}
        </button>
      )}

      {/* List of existing text layers */}
      {state.textLayers.length > 0 && (
        <div className="space-y-1.5 pt-2 border-t border-white/[0.06]">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Text Layers ({state.textLayers.length})
          </div>
          <div className="space-y-1.5 max-h-40 overflow-y-auto">
            {state.textLayers.map(l => {
              const isSelected = l.id === selectedId;
              return (
                <div
                  key={l.id}
                  onClick={() => setSelectedId(isSelected ? null : l.id)}
                  className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer border transition-all ${
                    isSelected ? 'bg-[#1e1e2e] border-violet-600 shadow-sm shadow-violet-600/10' : 'bg-[#1c1c26] border-white/[0.06] hover:bg-[#20202e]'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-3 h-3 rounded-full border border-white/10 flex-shrink-0" style={{ backgroundColor: l.color }} />
                    <span className="text-[10px] font-semibold text-slate-200 truncate">{l.text}</span>
                    <span className="text-[9px] text-slate-500 flex-shrink-0">{l.side}</span>
                  </div>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      onDeleteTextLayer(l.id);
                      if (selectedId === l.id) setSelectedId(null);
                    }}
                    className="p-1 text-slate-500 hover:text-red-400 rounded transition-colors flex-shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Visual Text Editor Canvas */}
      <div className="space-y-2 pt-3 border-t border-white/[0.06]">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Visual Text Editor ({currentSide === 'Front' ? 'Front View' : 'Back View'})
        </div>
        <div className="relative w-full aspect-square bg-[#16161a] border border-zinc-800 rounded-2xl overflow-hidden flex items-center justify-center pointer-events-auto">
          {/* Silhouette overlay vector path behind transparent Fabric.js layer */}
          <svg
            className="absolute w-4/5 h-4/5 pointer-events-none"
            viewBox="0 0 100 100"
            fill="none"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="1.2"
          >
            <defs>
              <pattern id="grid-text" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255, 255, 255, 0.025)" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid-text)" stroke="none" />

            {currentSide === 'Front' ? (
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
