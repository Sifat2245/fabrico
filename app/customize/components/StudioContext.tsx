/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { createContext, useContext, useState, useRef } from "react";

export type ModelType = "tshirt" | "polo_tshirt";
export type PrintZone = "front" | "back" | "left" | "right";
export type ProductSize = "S" | "M" | "L" | "XL";
export type StudioMode = "design" | "orbit";

interface StudioContextProps {
  modelType: ModelType;
  setModelType: (type: ModelType) => void;
  baseColor: string;
  setBaseColor: (color: string) => void;
  activeZone: PrintZone;
  setActiveZone: (zone: PrintZone) => void;
  size: ProductSize;
  setSize: (size: ProductSize) => void;
  quantity: number;
  setQuantity: (qty: number) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  studioMode: StudioMode;
  setStudioMode: (mode: StudioMode) => void;
  
  // Cache of Fabric.js serialization state per zone
  canvasStates: Record<PrintZone, any>;
  updateCanvasState: (zone: PrintZone, state: any) => void;
  
  // DataURLs mapped as textures
  canvasTextures: Record<PrintZone, string | null>;
  updateCanvasTexture: (zone: PrintZone, dataUrl: string | null) => void;
  
  canvasVersion: number;
  triggerCanvasUpdate: () => void;
  
  // Shared Fabric.js canvas context reference
  fabricRef: React.MutableRefObject<any>;
}

const StudioContext = createContext<StudioContextProps | undefined>(undefined);

export function StudioProvider({ children }: { children: React.ReactNode }) {
  const [modelType, setModelType] = useState<ModelType>("tshirt");
  const [baseColor, setBaseColor] = useState("#f5f5f4"); // Start Off-White
  const [activeZone, setActiveZone] = useState<PrintZone>("front");
  const [size, setSize] = useState<ProductSize>("M");
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [canvasVersion, setCanvasVersion] = useState(0);
  const [studioMode, setStudioMode] = useState<StudioMode>("design");

  const [canvasStates, setCanvasStates] = useState<Record<PrintZone, any>>({
    front: null,
    back: null,
    left: null,
    right: null,
  });

  const [canvasTextures, setCanvasTextures] = useState<Record<PrintZone, string | null>>({
    front: null,
    back: null,
    left: null,
    right: null,
  });

  const fabricRef = useRef<any>(null);

  const updateCanvasState = (zone: PrintZone, state: any) => {
    setCanvasStates((prev) => ({ ...prev, [zone]: state }));
  };

  const updateCanvasTexture = (zone: PrintZone, dataUrl: string | null) => {
    setCanvasTextures((prev) => ({ ...prev, [zone]: dataUrl }));
  };

  const triggerCanvasUpdate = () => {
    setCanvasVersion((prev) => prev + 1);
  };

  return (
    <StudioContext.Provider
      value={{
        modelType,
        setModelType,
        baseColor,
        setBaseColor,
        activeZone,
        setActiveZone,
        size,
        setSize,
        quantity,
        setQuantity,
        isLoading,
        setIsLoading,
        studioMode,
        setStudioMode,
        canvasStates,
        updateCanvasState,
        canvasTextures,
        updateCanvasTexture,
        canvasVersion,
        triggerCanvasUpdate,
        fabricRef,
      }}
    >
      {children}
    </StudioContext.Provider>
  );
}

export function useStudio() {
  const context = useContext(StudioContext);
  if (!context) {
    throw new Error("useStudio must be used within a StudioProvider");
  }
  return context;
}
