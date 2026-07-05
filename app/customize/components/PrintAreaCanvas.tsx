"use client";

import React, { useEffect, useRef } from "react";
import * as fabric from "fabric";
import { useStudio } from "./StudioContext";

export function PrintAreaCanvas() {
  const {
    activeZone,
    canvasStates,
    updateCanvasState,
    updateCanvasTexture,
    triggerCanvasUpdate,
    fabricRef,
    studioMode,
    baseColor,
  } = useStudio();

  const canvasElRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize Fabric.js Canvas
  useEffect(() => {
    if (!canvasElRef.current || !containerRef.current) return;

    // Use standard square coordinates for texture mapping
    const width = 500;
    const height = 500;

    const canvas = new fabric.Canvas(canvasElRef.current, {
      width,
      height,
      backgroundColor: baseColor,
      preserveObjectStacking: true,
    });

    fabricRef.current = canvas;

    // Define change listener to update dataURL and JSON states
    const handleCanvasChange = () => {
      // Export base64 texture
      const dataUrl = canvas.toDataURL({
        format: "png",
        multiplier: 2, // High resolution texture output
      });

      updateCanvasTexture(activeZone, dataUrl);
      
      // Save JSON configuration
      const json = canvas.toJSON();
      updateCanvasState(activeZone, json);
      
      triggerCanvasUpdate();
    };

    // Attach listeners
    canvas.on("object:added", handleCanvasChange);
    canvas.on("object:removed", handleCanvasChange);
    canvas.on("object:modified", handleCanvasChange);
    canvas.on("selection:cleared", handleCanvasChange);
    canvas.on("selection:updated", handleCanvasChange);

    // Initial load texture if empty
    handleCanvasChange();

    return () => {
      canvas.off("object:added", handleCanvasChange);
      canvas.off("object:removed", handleCanvasChange);
      canvas.off("object:modified", handleCanvasChange);
      canvas.off("selection:cleared", handleCanvasChange);
      canvas.off("selection:updated", handleCanvasChange);
      canvas.dispose();
      fabricRef.current = null;
    };
  }, []);

  // Update canvas background color and re-export texture when baseColor changes
  useEffect(() => {
    const canvas = fabricRef.current;
    if (canvas) {
      canvas.set("backgroundColor", baseColor);
      canvas.renderAll();
      const dataUrl = canvas.toDataURL({ format: "png", multiplier: 2 });
      updateCanvasTexture(activeZone, dataUrl);
      triggerCanvasUpdate();
    }
  }, [baseColor, activeZone]);

  // Sync canvas contents when the active print zone changes
  const activeZoneRef = useRef(activeZone);
  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    // Transition state from previous zone to new zone
    const prevZone = activeZoneRef.current;
    activeZoneRef.current = activeZone;

    // Export and save current zone before loading new zone
    const currentJson = canvas.toJSON();
    updateCanvasState(prevZone, currentJson);

    // Clear active selections
    canvas.discardActiveObject();

    // Check if new zone has saved state
    const savedState = canvasStates[activeZone];
    if (savedState) {
      canvas.loadFromJSON(savedState).then(() => {
        canvas.set("backgroundColor", baseColor);
        canvas.renderAll();
        // Export loaded texture
        const dataUrl = canvas.toDataURL({ format: "png", multiplier: 2 });
        updateCanvasTexture(activeZone, dataUrl);
        triggerCanvasUpdate();
      });
    } else {
      // Load empty state
      canvas.clear();
      canvas.set("backgroundColor", baseColor);
      canvas.renderAll();
      const dataUrl = canvas.toDataURL({ format: "png", multiplier: 2 });
      updateCanvasTexture(activeZone, dataUrl);
      triggerCanvasUpdate();
    }
  }, [activeZone]);

  return (
    <div
      ref={containerRef}
      className={`relative z-10 w-[500px] h-[500px] transition-all duration-300 bg-transparent flex items-center justify-center ${
        studioMode === "orbit"
          ? "pointer-events-none opacity-20 filter blur-[1px]"
          : "pointer-events-auto opacity-100"
      }`}
    >
      <canvas ref={canvasElRef} className="z-10" />
    </div>
  );
}
