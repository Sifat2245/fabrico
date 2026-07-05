"use client";

import React, { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import * as fabric from "fabric";

interface CanvasEditorProps {
  onCanvasChange: () => void;
  baseColor: string;
  width?: number;
  height?: number;
}

export interface CanvasEditorRef {
  addText: (text: string, color?: string, fontFamily?: string) => void;
  addImage: (url: string) => void;
  changeActiveTextColor: (color: string) => void;
  changeActiveTextFont: (fontFamily: string) => void;
  deleteSelected: () => void;
  bringToFront: () => void;
  sendToBack: () => void;
  getCanvasElement: () => HTMLCanvasElement | null;
  clearCanvas: () => void;
}

export const CanvasEditor = forwardRef<CanvasEditorRef, CanvasEditorProps>(
  ({ onCanvasChange, baseColor, width = 1024, height = 1024 }, ref) => {
    const containerRef = useRef<HTMLCanvasElement>(null);
    const fabricCanvasRef = useRef<fabric.Canvas | null>(null);

    // Initialize fabric canvas inside browser environment
    useEffect(() => {
      if (!containerRef.current) return;

      const canvas = new fabric.Canvas(containerRef.current, {
        width,
        height,
        backgroundColor: baseColor,
        preserveObjectStacking: true,
      });

      fabricCanvasRef.current = canvas;

      // Event listeners to flags parent about content modifies
      const handleEvents = () => {
        onCanvasChange();
      };

      canvas.on("object:added", handleEvents);
      canvas.on("object:removed", handleEvents);
      canvas.on("object:modified", handleEvents);
      canvas.on("object:skewing", handleEvents);
      canvas.on("selection:cleared", handleEvents);
      canvas.on("selection:updated", handleEvents);

      return () => {
        canvas.off("object:added", handleEvents);
        canvas.off("object:removed", handleEvents);
        canvas.off("object:modified", handleEvents);
        canvas.off("object:skewing", handleEvents);
        canvas.off("selection:cleared", handleEvents);
        canvas.off("selection:updated", handleEvents);
        canvas.dispose();
      };
    }, []);

    // Update backgroundColor when baseColor changes
    useEffect(() => {
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.set("backgroundColor", baseColor);
        fabricCanvasRef.current.renderAll();
        onCanvasChange();
      }
    }, [baseColor]);

    // Handle incoming controls from parent through ref bindings
    useImperativeHandle(ref, () => ({
      addText: (text: string, color = "#000000", fontFamily = "sans-serif") => {
        if (!fabricCanvasRef.current) return;

        const textBox = new fabric.Textbox(text, {
          left: width / 2 - 150,
          top: height / 2 - 50,
          width: 300,
          fontSize: 48,
          fill: color,
          fontFamily: fontFamily,
          textAlign: "center",
          cornerColor: "#1c1917",
          cornerSize: 10,
          transparentCorners: false,
          padding: 8,
        });

        fabricCanvasRef.current.add(textBox);
        fabricCanvasRef.current.setActiveObject(textBox);
        fabricCanvasRef.current.renderAll();
        onCanvasChange();
      },

      addImage: (url: string) => {
        if (!fabricCanvasRef.current) return;

        fabric.FabricImage.fromURL(url)
          .then((img) => {
            // Resize image to fit nicely within canvas limits
            const maxDimension = Math.min(width, height) * 0.5;
            const size = Math.max(img.width || 1, img.height || 1);
            const scale = maxDimension / size;

            img.set({
              left: width / 2 - ((img.width || 0) * scale) / 2,
              top: height / 2 - ((img.height || 0) * scale) / 2,
              scaleX: scale,
              scaleY: scale,
              cornerColor: "#1c1917",
              cornerSize: 10,
              transparentCorners: false,
            });

            fabricCanvasRef.current?.add(img);
            fabricCanvasRef.current?.setActiveObject(img);
            fabricCanvasRef.current?.renderAll();
            onCanvasChange();
          })
          .catch((err) => {
            console.error("Failed to load image helper: ", err);
          });
      },

      changeActiveTextColor: (color: string) => {
        if (!fabricCanvasRef.current) return;
        const activeObject = fabricCanvasRef.current.getActiveObject();
        if (activeObject && activeObject.type === "textbox") {
          activeObject.set("fill", color);
          fabricCanvasRef.current.renderAll();
          onCanvasChange();
        }
      },

      changeActiveTextFont: (fontFamily: string) => {
        if (!fabricCanvasRef.current) return;
        const activeObject = fabricCanvasRef.current.getActiveObject();
        if (activeObject && activeObject.type === "textbox") {
          activeObject.set("fontFamily", fontFamily);
          fabricCanvasRef.current.renderAll();
          onCanvasChange();
        }
      },

      deleteSelected: () => {
        if (!fabricCanvasRef.current) return;
        const activeObjects = fabricCanvasRef.current.getActiveObjects();
        activeObjects.forEach((obj) => {
          fabricCanvasRef.current?.remove(obj);
        });
        fabricCanvasRef.current.discardActiveObject();
        fabricCanvasRef.current.renderAll();
        onCanvasChange();
      },

      bringToFront: () => {
        if (!fabricCanvasRef.current) return;
        const activeObject = fabricCanvasRef.current.getActiveObject();
        if (activeObject) {
          fabricCanvasRef.current.bringObjectToFront(activeObject);
          fabricCanvasRef.current.renderAll();
          onCanvasChange();
        }
      },

      sendToBack: () => {
        if (!fabricCanvasRef.current) return;
        const activeObject = fabricCanvasRef.current.getActiveObject();
        if (activeObject) {
          fabricCanvasRef.current.sendObjectToBack(activeObject);
          fabricCanvasRef.current.renderAll();
          onCanvasChange();
        }
      },

      getCanvasElement: () => {
        if (!fabricCanvasRef.current) return null;
        return fabricCanvasRef.current.getElement();
      },

      clearCanvas: () => {
        if (!fabricCanvasRef.current) return;
        const objects = fabricCanvasRef.current.getObjects();
        // Remove all objects except static base layer setups
        while (objects.length > 0) {
          fabricCanvasRef.current.remove(objects[0]);
        }
        fabricCanvasRef.current.renderAll();
        onCanvasChange();
      },
    }));

    return (
      <div className="absolute top-[-9999px] left-[-9999px] pointer-events-none opacity-0">
        <canvas ref={containerRef} />
      </div>
    );
  }
);

CanvasEditor.displayName = "CanvasEditor";
