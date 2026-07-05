"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Type,
  Upload,
  Square,
  Triangle as TriangleIcon,
  Smile,
  Layers,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  LucideIcon,
} from "lucide-react";
import * as fabric from "fabric";
import { useStudio, PrintZone } from "./StudioContext";

type ToolId = "text" | "shapes" | "upload" | "clipart" | "templates" | "layers";

interface ToolItem {
  id: ToolId;
  label: string;
  icon: LucideIcon;
}

const TOOLS: ToolItem[] = [
  { id: "text", label: "Text", icon: Type },
  { id: "shapes", label: "Shapes", icon: Square },
  { id: "upload", label: "Upload", icon: Upload },
  { id: "clipart", label: "Clipart", icon: Smile },
  { id: "templates", label: "Brand", icon: Sparkles },
  { id: "layers", label: "Layers", icon: Layers },
];

const FONTS_LIST = [
  { name: "Outfit (Modern Sans)", family: "Outfit, sans-serif" },
  { name: "Playfair (Luxury Serif)", family: "var(--font-playfair), serif" },
  { name: "Courier New", family: "Courier New, monospace" },
];

export function LeftSidebar() {
  const { fabricRef } = useStudio();
  const [activeTool, setActiveTool] = useState<ToolId | null>("text");
  const [isCollapsed, setIsCollapsed] = useState(false);

  const [textVal, setTextVal] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<{ id: string; name: string; dataUrl: string }[]>([]);
  const [textColor, setTextColor] = useState("#000000");
  const [textFont, setTextFont] = useState(FONTS_LIST[0].family);

  const redraw = () => {
    const canvas = fabricRef.current;
    if (canvas) {
      canvas.renderAll();
      canvas.fire("object:modified");
    }
  };

  const handleToolClick = (id: ToolId) => {
    setActiveTool((prev) => (prev === id ? null : id));
  };

  const addText = () => {
    const canvas = fabricRef.current;
    if (!canvas || !textVal.trim()) return;

    const text = new fabric.Textbox(textVal, {
      left: 60,
      top: 100,
      width: 160,
      fontSize: 24,
      fill: textColor,
      fontFamily: textFont,
      textAlign: "center",
      cornerColor: "#e7e5e4",
      cornerSize: 8,
      transparentCorners: false,
      padding: 6,
    });

    canvas.add(text);
    canvas.setActiveObject(text);
    setTextVal("");
    redraw();
  };

  const addShape = (shapeType: "rect" | "circle" | "triangle") => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    let shapeObj;
    const baseOpt = {
      left: 100,
      top: 100,
      fill: "#e7e5e4",
      stroke: "#1c1917",
      strokeWidth: 2,
      cornerColor: "#e7e5e4",
      cornerSize: 8,
      transparentCorners: false,
    };

    if (shapeType === "rect") {
      shapeObj = new fabric.Rect({ ...baseOpt, width: 80, height: 80 });
    } else if (shapeType === "circle") {
      shapeObj = new fabric.Circle({ ...baseOpt, radius: 45 });
    } else {
      shapeObj = new fabric.Triangle({ ...baseOpt, width: 80, height: 80 });
    }

    canvas.add(shapeObj);
    canvas.setActiveObject(shapeObj);
    redraw();
  };

  const addTemplate = (style: "vintage" | "modern" | "luxury") => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    canvas.clear();

    if (style === "vintage") {
      const heading = new fabric.Textbox("ATHLETIC CLB", {
        left: 30, top: 60, width: 220, fontSize: 28,
        fontFamily: "Courier New", fontWeight: "bold",
        fill: "#1c1917", textAlign: "center",
      });
      const sub = new fabric.Textbox("1996 EST.", {
        left: 40, top: 110, width: 200, fontSize: 12,
        fontFamily: "Courier New", fill: "#78716c", textAlign: "center",
      });
      canvas.add(heading, sub);
    } else if (style === "modern") {
      const line = new fabric.Rect({
        left: 110, top: 70, width: 60, height: 4, fill: "#1c1917",
      });
      const text = new fabric.Textbox("FABRICO", {
        left: 20, top: 90, width: 240, fontSize: 22,
        fontFamily: "Outfit, sans-serif", fontWeight: "bold",
        charSpacing: 200, fill: "#1c1917", textAlign: "center",
      });
      canvas.add(line, text);
    } else {
      const bdr = new fabric.Rect({
        left: 50, top: 50, width: 180, height: 180,
        fill: "transparent", stroke: "#292524", strokeWidth: 2,
      });
      const text = new fabric.Textbox("L'ATELIER", {
        left: 60, top: 120, width: 160, fontSize: 18,
        fontFamily: "var(--font-playfair), serif", fontStyle: "italic",
        fill: "#1c1917", textAlign: "center",
      });
      canvas.add(bdr, text);
    }
    redraw();
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (uploadedFiles.length >= 5) {
      alert("Maximum 5 files allowed. Remove an existing file first.");
      e.target.value = "";
      return;
    }

    const rdr = new FileReader();
    rdr.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setUploadedFiles((prev) => [
        ...prev,
        { id: crypto.randomUUID(), name: file.name, dataUrl },
      ]);
    };
    rdr.readAsDataURL(file);
    e.target.value = "";
  };

  const addUploadedToCanvas = (dataUrl: string) => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    fabric.FabricImage.fromURL(dataUrl).then((img) => {
      const scale = 120 / (img.width || 120);
      img.set({
        left: 80, top: 80, scaleX: scale, scaleY: scale,
        cornerColor: "#e7e5e4", cornerSize: 8, transparentCorners: false,
      });
      canvas.add(img);
      canvas.setActiveObject(img);
      redraw();
    });
  };

  const removeUploadedFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const toggleButton = (
    <button
      onClick={() => setIsCollapsed(!isCollapsed)}
      className="absolute right-[-14px] top-1/2 -translate-y-1/2 h-10 w-[14px] rounded-r-md bg-white border-y border-r border-stone-200 hover:bg-stone-50 text-stone-500 flex items-center justify-center cursor-pointer transition-colors z-30"
      title={isCollapsed ? "Show panel" : "Hide panel"}
    >
      {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
    </button>
  );

  return (
    <div className="relative flex-shrink-0 h-full flex z-20">
      {/* Vertical Icon Strip - always visible */}
      <div className="w-14 flex-shrink-0 bg-white border-r border-stone-200 flex flex-col items-center pt-3 gap-1">
              {TOOLS.map((tool) => {
                const Icon = tool.icon;
                const isActive = activeTool === tool.id;
                return (
                  <button
                    key={tool.id}
                    onClick={() => handleToolClick(tool.id)}
                    title={tool.label}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-150 cursor-pointer group ${isActive
                        ? "bg-stone-950 text-white"
                        : "text-stone-500 hover:bg-stone-100 hover:text-stone-800"
                      }`}
                  >
                    <Icon className="h-4 w-4" />
                  </button>
                );
              })}
      </div>

      {/* Expandable Tool Panel - collapsible */}
      <AnimatePresence initial={false}>
        {!isCollapsed && activeTool && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 224, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "tween", duration: 0.2 }}
            className="flex-shrink-0 border-r border-stone-200 bg-white flex flex-col h-full overflow-hidden"
          >
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    <AnimatePresence mode="wait">
                      {/* ─── Text Tool ─── */}
                      {activeTool === "text" && (
                        <motion.div
                          key="text"
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.12 }}
                          className="space-y-3"
                        >
                          <label className="text-[10px] font-mono tracking-widest text-stone-500 uppercase block">
                            Add Text
                          </label>
                          <input
                            type="text"
                            placeholder="Say something bold..."
                            value={textVal}
                            onChange={(e) => setTextVal(e.target.value)}
                            className="w-full bg-stone-50 border border-stone-200 hover:border-stone-350 focus:border-stone-400 outline-none rounded-xl px-3 py-2 text-xs text-stone-800 transition-colors placeholder-stone-400"
                          />

                          <label className="text-[10px] font-mono tracking-widest text-stone-500 uppercase block">
                            Font
                          </label>
                          <div className="flex flex-col gap-0.5 bg-stone-50 border border-stone-200 rounded-xl p-1">
                            {FONTS_LIST.map((font) => (
                              <button
                                key={font.name}
                                onClick={() => {
                                  setTextFont(font.family);
                                  const canvas = fabricRef.current;
                                  if (canvas) {
                                    const active = canvas.getActiveObject();
                                    if (active && active.type === "textbox") {
                                      active.set("fontFamily", font.family);
                                      redraw();
                                    }
                                  }
                                }}
                                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] transition-colors cursor-pointer ${textFont === font.family
                                    ? "bg-stone-100 text-stone-950 font-bold"
                                    : "text-stone-500 hover:bg-stone-50"
                                  }`}
                                style={{ fontFamily: font.family }}
                              >
                                {font.name}
                              </button>
                            ))}
                          </div>

                          <label className="text-[10px] font-mono tracking-widest text-stone-500 uppercase block">
                            Color
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={textColor}
                              onChange={(e) => {
                                setTextColor(e.target.value);
                                const canvas = fabricRef.current;
                                if (canvas) {
                                  const active = canvas.getActiveObject();
                                  if (active) {
                                    active.set("fill", e.target.value);
                                    redraw();
                                  }
                                }
                              }}
                              className="bg-transparent border-0 cursor-pointer h-6 w-6 rounded outline-none"
                            />
                            <span className="text-[10px] font-mono text-stone-500 uppercase">
                              {textColor}
                            </span>
                          </div>

                          <button
                            onClick={addText}
                            className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-stone-950 text-white font-bold text-[11px] tracking-wider uppercase hover:bg-stone-850 transition-colors cursor-pointer"
                          >
                            <Plus className="h-3.5 w-3.5" /> Add Text
                          </button>
                        </motion.div>
                      )}

                      {/* ─── Shapes Tool ─── */}
                      {activeTool === "shapes" && (
                        <motion.div
                          key="shapes"
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.12 }}
                          className="space-y-3"
                        >
                          <label className="text-[10px] font-mono tracking-widest text-stone-500 uppercase block">
                            Geometry
                          </label>
                          <div className="grid grid-cols-3 gap-1.5">
                            <button
                              onClick={() => addShape("rect")}
                              className="py-2.5 bg-stone-50 border border-stone-200 hover:bg-stone-100 rounded-xl flex flex-col items-center gap-1 transition-colors cursor-pointer"
                            >
                              <Square className="h-3.5 w-3.5 text-stone-500" />
                              <span className="text-[8px] uppercase font-bold text-stone-500">Box</span>
                            </button>
                            <button
                              onClick={() => addShape("circle")}
                              className="py-2.5 bg-stone-50 border border-stone-200 hover:bg-stone-100 rounded-xl flex flex-col items-center gap-1 transition-colors cursor-pointer"
                            >
                              <div className="h-3.5 w-3.5 rounded-full border border-stone-500" />
                              <span className="text-[8px] uppercase font-bold text-stone-500">Circle</span>
                            </button>
                            <button
                              onClick={() => addShape("triangle")}
                              className="py-2.5 bg-stone-50 border border-stone-200 hover:bg-stone-100 rounded-xl flex flex-col items-center gap-1 transition-colors cursor-pointer"
                            >
                              <TriangleIcon className="h-3.5 w-3.5 text-stone-500" />
                              <span className="text-[8px] uppercase font-bold text-stone-500">Tri</span>
                            </button>
                          </div>
                        </motion.div>
                      )}

                      {/* ─── Upload Tool ─── */}
                      {activeTool === "upload" && (
                        <motion.div
                          key="upload"
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.12 }}
                          className="space-y-3"
                        >
                          <label className="text-[10px] font-mono tracking-widest text-stone-500 uppercase block">
                            Upload Graphic
                          </label>
                          <p className="text-[10px] text-stone-500 leading-normal">
                            PNG, JPG, or SVG supported.
                          </p>
                          <div className="relative border border-dashed border-stone-200 hover:border-stone-300 bg-stone-50/50 rounded-xl p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-colors">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleUpload}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              disabled={uploadedFiles.length >= 5}
                            />
                            <Upload className="h-5 w-5 text-stone-400 mb-1.5" />
                            <span className="text-[11px] font-bold text-stone-700">Choose File</span>
                            <span className="text-[9px] text-stone-455 mt-0.5">Click or drag</span>
                          </div>

                          {/* ─── Uploaded Files Gallery ─── */}
                          {uploadedFiles.length > 0 && (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <label className="text-[10px] font-mono tracking-widest text-stone-500 uppercase block">
                                  Uploaded Files
                                </label>
                                <span className="text-[9px] font-mono text-stone-400">
                                  {uploadedFiles.length}/5
                                </span>
                              </div>
                              <div className="flex flex-col gap-1.5">
                                {uploadedFiles.map((file) => (
                                  <div
                                    key={file.id}
                                    className="group flex items-center gap-2 bg-stone-50 border border-stone-200 hover:border-stone-300 rounded-xl p-1.5 transition-colors"
                                  >
                                    <button
                                      onClick={() => addUploadedToCanvas(file.dataUrl)}
                                      className="flex items-center gap-2 flex-1 min-w-0 cursor-pointer text-left"
                                      title="Add to design"
                                    >
                                      <div className="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0 bg-stone-100 border border-stone-200">
                                        <img
                                          src={file.dataUrl}
                                          alt={file.name}
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                      <span className="text-[10px] text-stone-600 truncate flex-1">
                                        {file.name}
                                      </span>
                                    </button>
                                    <button
                                      onClick={() => removeUploadedFile(file.id)}
                                      className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-stone-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                                      title="Remove file"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </motion.div>
                      )}

                      {/* ─── Clipart Tool ─── */}
                      {activeTool === "clipart" && (
                        <motion.div
                          key="clipart"
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.12 }}
                          className="space-y-3"
                        >
                          <label className="text-[10px] font-mono tracking-widest text-stone-500 uppercase block">
                            Graphics Presets
                          </label>
                          <div className="grid grid-cols-2 gap-1.5">
                            {[
                              { text: "✦", size: 36 },
                              { text: "▲", size: 36 },
                              { text: "★", size: 36 },
                              { text: "●", size: 36 },
                            ].map((sym, i) => (
                              <button
                                key={i}
                                onClick={() => {
                                  const canvas = fabricRef.current;
                                  if (canvas) {
                                    const badge = new fabric.Textbox(sym.text, {
                                      left: 100, top: 100, fontSize: sym.size,
                                      fill: "#1c1917", cornerColor: "#e7e5e4",
                                      cornerSize: 8, transparentCorners: false,
                                    });
                                    canvas.add(badge);
                                    canvas.setActiveObject(badge);
                                    redraw();
                                  }
                                }}
                                className="bg-stone-50 border border-stone-200 hover:bg-stone-100 py-3.5 rounded-xl font-bold flex items-center justify-center text-stone-500 transition-colors cursor-pointer"
                              >
                                <span className="text-base">{sym.text}</span>
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {/* ─── Templates Tool ─── */}
                      {activeTool === "templates" && (
                        <motion.div
                          key="templates"
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.12 }}
                          className="space-y-3"
                        >
                          <label className="text-[10px] font-mono tracking-widest text-stone-500 uppercase block">
                            Templates
                          </label>
                          <div className="flex flex-col gap-1.5">
                            <button
                              onClick={() => addTemplate("vintage")}
                              className="p-2.5 bg-stone-50 border border-stone-200 hover:border-stone-300 rounded-xl text-left transition-colors cursor-pointer"
                            >
                              <span className="text-[11px] font-bold text-stone-800 block">Vintage Club</span>
                              <span className="text-[9px] text-stone-500">Typewriter style</span>
                            </button>
                            <button
                              onClick={() => addTemplate("modern")}
                              className="p-2.5 bg-stone-50 border border-stone-200 hover:border-stone-300 rounded-xl text-left transition-colors cursor-pointer"
                            >
                              <span className="text-[11px] font-bold text-stone-800 block">Modernist</span>
                              <span className="text-[9px] text-stone-500">Clean tracking</span>
                            </button>
                            <button
                              onClick={() => addTemplate("luxury")}
                              className="p-2.5 bg-stone-50 border border-stone-200 hover:border-stone-300 rounded-xl text-left transition-colors cursor-pointer"
                            >
                              <span className="text-[11px] font-bold text-stone-800 block">Luxury Atelier</span>
                              <span className="text-[9px] text-stone-500">Serif border frame</span>
                            </button>
                          </div>
                        </motion.div>
                      )}

                      {/* ─── Layers Tool ─── */}
                      {activeTool === "layers" && (
                        <motion.div
                          key="layers"
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.12 }}
                          className="space-y-3"
                        >
                          <label className="text-[10px] font-mono tracking-widest text-stone-500 uppercase block">
                            Layer Stack
                          </label>
                          <div className="grid grid-cols-2 gap-1.5 text-center text-xs">
                            <button
                              onClick={() => {
                                const canvas = fabricRef.current;
                                if (canvas) {
                                  const act = canvas.getActiveObject();
                                  if (act) { canvas.bringObjectToFront(act); redraw(); }
                                }
                              }}
                              className="py-2 bg-stone-50 border border-stone-200 hover:bg-stone-100 rounded-xl font-bold uppercase text-[9px] tracking-wider text-stone-600 transition-colors cursor-pointer"
                            >
                              Bring Front
                            </button>
                            <button
                              onClick={() => {
                                const canvas = fabricRef.current;
                                if (canvas) {
                                  const act = canvas.getActiveObject();
                                  if (act) { canvas.sendObjectToBack(act); redraw(); }
                                }
                              }}
                              className="py-2 bg-stone-50 border border-stone-200 hover:bg-stone-100 rounded-xl font-bold uppercase text-[9px] tracking-wider text-stone-600 transition-colors cursor-pointer"
                            >
                              Send Back
                            </button>
                          </div>

                          <div className="pt-3 border-t border-stone-150 space-y-1.5">
                            <button
                              onClick={() => {
                                const canvas = fabricRef.current;
                                if (canvas) {
                                  const act = canvas.getActiveObjects();
                                  act.forEach((o: fabric.FabricObject) => canvas.remove(o));
                                  canvas.discardActiveObject();
                                  redraw();
                                }
                              }}
                              className="w-full py-2.5 bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 rounded-xl font-bold text-[10px] uppercase tracking-wider transition-colors cursor-pointer"
                            >
                              Delete Selection
                            </button>
                            <button
                              onClick={() => {
                                const canvas = fabricRef.current;
                                if (canvas) { canvas.clear(); redraw(); }
                              }}
                              className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-xl font-bold text-[10px] uppercase tracking-wider transition-colors cursor-pointer"
                            >
                              Clear All
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
      </AnimatePresence>

      {toggleButton}
    </div>
  );
}
