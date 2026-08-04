'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Target, RefreshCw } from 'lucide-react';
import { DecalItem } from './types';

interface PrintAreaEditorProps {
  decals: DecalItem[];
  selectedDecalId: string | null;
  onSelectDecal: (id: string | null) => void;
  onUpdateDecal: (id: string, updates: Partial<DecalItem>) => void;
  activePlacementLogoUrl: string | null;
  onSetActivePlacementLogoUrl: (url: string | null) => void;
  activeSide: 'front' | 'back';
  onActiveSideChange: (side: 'front' | 'back') => void;
}

export default function PrintAreaEditor({
  decals,
  selectedDecalId,
  onSelectDecal,
  onUpdateDecal,
  activePlacementLogoUrl,
  onSetActivePlacementLogoUrl,
  activeSide,
  onActiveSideChange,
}: PrintAreaEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricInstance, setFabricInstance] = useState<any>(null);
  const isUpdatingFromFabric = useRef(false);

  // Constants mapping canvas coordinates to 3D
  const CANVAS_SZ = 260; // 260px square
  const CENTER = CANVAS_SZ / 2; // 130px

  // 3D Bounds
  const BOUNDS_X = 0.18; // Maps Canvas X center->edge to 18cm
  const BOUNDS_Y = 0.32; // Maps Canvas Y center->edge to 32cm

  // Convert 2D Fabric coordinates to 3D World space
  const map2DTo3D = (
    left: number,
    top: number,
    scaleX: number,
    scaleY: number,
    angle: number
  ): { position: [number, number, number]; scale: [number, number, number]; rotation: [number, number, number] } => {
    // X mapping
    let x3d = ((left - CENTER) / CENTER) * BOUNDS_X;
    if (activeSide === 'back') {
      x3d = -x3d; // Invert in back view
    }

    // Y mapping
    const y3d = ((CENTER - top) / CENTER) * BOUNDS_Y;

    // Z mapping (front surface vs back surface)
    const z3d = activeSide === 'front' ? 0.09 : -0.09;

    // Scale mapping (approximate based on canvas size)
    const widthMetres = scaleX * 80 * 0.0015; // standard width multiplier
    const heightMetres = scaleY * 80 * 0.0015;
    const finalScale: [number, number, number] = [widthMetres, heightMetres, 0.2];

    // Rotation mapping (around Z axis in world coords)
    const rad = angle * (Math.PI / 180);
    const rotation: [number, number, number] =
      activeSide === 'front' ? [0, 0, -rad] : [0, Math.PI, rad];

    return {
      position: [x3d, y3d, z3d],
      scale: finalScale,
      rotation,
    };
  };

  // Convert 3D World space to 2D Fabric coordinates
  const map3DTo2D = (
    position: [number, number, number],
    scale: [number, number, number],
    rotation: [number, number, number]
  ): { left: number; top: number; scaleX: number; scaleY: number; angle: number } => {
    const x3d = position[0];
    const y3d = position[1];

    // X mapping
    let left = CENTER + (x3d / BOUNDS_X) * CENTER;
    if (activeSide === 'back') {
      left = CENTER - (x3d / BOUNDS_X) * CENTER;
    }

    // Y mapping
    const top = CENTER - (y3d / BOUNDS_Y) * CENTER;

    // Scale mapping
    const scaleX = scale[0] / (80 * 0.0015);
    const scaleY = scale[1] / (80 * 0.0015);

    // Rotation mapping
    let angle = 0;
    if (activeSide === 'front') {
      angle = -rotation[2] * (180 / Math.PI);
    } else {
      angle = rotation[2] * (180 / Math.PI);
    }

    return {
      left,
      top,
      scaleX,
      scaleY,
      angle,
    };
  };

  // Dynamic initialization of Fabric.js canvas
  useEffect(() => {
    let active = true;
    let canvas: any = null;

    const init = async () => {
      // Dynamic import to prevent SSR compiler errors in NextJS
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

      // Connect selections, moving, and scaling events
      canvas.on('selection:created', (e: any) => {
        const obj = e.selected?.[0];
        if (obj && obj.id) {
          onSelectDecal(obj.id);
        }
      });
      canvas.on('selection:updated', (e: any) => {
        const obj = e.selected?.[0];
        if (obj && obj.id) {
          onSelectDecal(obj.id);
        }
      });
      canvas.on('selection:cleared', () => {
        onSelectDecal(null);
      });

      const handleFabricModify = (e: any) => {
        const obj = e.target;
        if (!obj || !obj.id) return;

        isUpdatingFromFabric.current = true;
        const { position, scale, rotation } = map2DTo3D(
          obj.left,
          obj.top,
          obj.scaleX || 1,
          obj.scaleY || 1,
          obj.angle || 0
        );

        onUpdateDecal(obj.id, { position, scale, rotation });
        setTimeout(() => {
          isUpdatingFromFabric.current = false;
        }, 50);
      };

      canvas.on('object:moving', handleFabricModify);
      canvas.on('object:scaling', handleFabricModify);
      canvas.on('object:rotating', handleFabricModify);
    };

    init();

    return () => {
      active = false;
      if (canvas) {
        canvas.dispose();
      }
    };
  }, [activeSide]);

  // Synchronize 3D decal state changes to 2D Fabric Canvas objects
  useEffect(() => {
    if (!fabricInstance || isUpdatingFromFabric.current) return;

    const activeDecals = decals.filter((d) =>
      activeSide === 'front' ? d.position[2] > 0 : d.position[2] < 0
    );

    const canvas = fabricInstance;
    const canvasObjects = canvas.getObjects();

    // 1. Remove objects that no longer exist in decals state
    canvasObjects.forEach((obj: any) => {
      if (!obj.id) return;
      const stillExists = activeDecals.some((d) => d.id === obj.id);
      if (!stillExists) {
        canvas.remove(obj);
      }
    });

    // 2. Add or update objects from activeDecals state
    activeDecals.forEach(async (decal) => {
      const existingObj = canvasObjects.find((obj: any) => obj.id === decal.id);
      const coord2D = map3DTo2D(decal.position, decal.scale, decal.rotation);

      if (existingObj) {
        // Update existing element properties
        existingObj.set({
          left: coord2D.left,
          top: coord2D.top,
          scaleX: coord2D.scaleX,
          scaleY: coord2D.scaleY,
          angle: coord2D.angle,
        });

        // Highlight if selected
        if (decal.id === selectedDecalId) {
          canvas.setActiveObject(existingObj);
        } else if (canvas.getActiveObject() === existingObj && selectedDecalId === null) {
          canvas.discardActiveObject();
        }

        existingObj.setCoords();
        canvas.requestRenderAll();
      } else {
        // Async constructor for new Fabric.js elements
        const element = document.createElement('img');
        element.src = decal.url;
        element.crossOrigin = 'anonymous';

        element.onload = async () => {
          const fabric = await import('fabric');
          const fabricImg = new fabric.FabricImage(element, {
            left: coord2D.left,
            top: coord2D.top,
            originX: 'center',
            originY: 'center',
            scaleX: coord2D.scaleX,
            scaleY: coord2D.scaleY,
            angle: coord2D.angle,
            cornerColor: '#3b82f6',
            cornerStrokeColor: '#ffffff',
            borderColor: '#3b82f6',
            cornerSize: 8,
            transparentCorners: false,
          });

          // Tag with identity metadata
          (fabricImg as any).id = decal.id;

          canvas.add(fabricImg);

          if (decal.id === selectedDecalId) {
            canvas.setActiveObject(fabricImg);
          }
          canvas.requestRenderAll();
        };
      }
    });

    canvas.requestRenderAll();
  }, [fabricInstance, decals, selectedDecalId, activeSide]);

  // Clean layout render
  return (
    <div className="space-y-3 pt-3 border-t border-zinc-150" ref={containerRef}>
      {/* Visual Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
          <Target className="w-3.5 h-3.5 text-zinc-500" />
          <span>2D Print Area Guide</span>
        </div>

        {/* View Toggle Pill */}
        <div className="flex p-0.5 rounded-lg bg-zinc-100 border border-zinc-200 text-[9px] font-medium leading-none">
          <button
            onClick={() => onActiveSideChange('front')}
            className={`px-2.5 py-1 rounded transition-all cursor-pointer ${
              activeSide === 'front' ? 'bg-white text-zinc-900 border border-zinc-200/50 shadow-sm' : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            FRONT
          </button>
          <button
            onClick={() => onActiveSideChange('back')}
            className={`px-2.5 py-1 rounded transition-all cursor-pointer ${
              activeSide === 'back' ? 'bg-white text-zinc-900 border border-zinc-200/50 shadow-sm' : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            BACK
          </button>
        </div>
      </div>

      {/* Editor Screen Canvas */}
      <div className="relative w-full aspect-square bg-[#0c0c0e] border border-zinc-200 rounded-2xl overflow-hidden flex items-center justify-center pointer-events-auto">
        {/* Silhouette overlay vector path behind transparent Fabric.js layer */}
        <svg
          className="absolute w-4/5 h-4/5 text-zinc-900 pointer-events-none opacity-60"
          viewBox="0 0 100 100"
          fill="none"
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth="1.5"
        >
          {activeSide === 'front' ? (
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
          <line x1="50" y1="10" x2="50" y2="90" stroke="rgba(255, 255, 255, 0.06)" strokeDasharray="3,3" />
          <line x1="20" y1="50" x2="80" y2="50" stroke="rgba(255, 255, 255, 0.06)" strokeDasharray="3,3" />
        </svg>

        {/* The overlay interactive Canvas element */}
        <div className="absolute z-10 w-[260px] h-[260px]">
          <canvas ref={canvasRef} />
        </div>
      </div>
    </div>
  );
}
