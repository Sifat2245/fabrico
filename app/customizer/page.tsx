'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, RotateCcw, Save, ShoppingCart, Download,
} from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import SettingsIconSidebar, { CustomizerTab } from './components/SettingsIconSidebar';
import ColorSettings from './components/ColorSettings';
import DesignsSettings from './components/DesignsSettings';
import PatternsSettings from './components/PatternsSettings';
import TextSettings from './components/TextSettings';
import LogoUploadSettings from './components/LogoUploadSettings';
import { useCustomizerState } from './hooks/useCustomizerState';
import { CustomizerState } from './components/types';

// Lazy-load the 3D viewer so SSR doesn't complain
const ModelViewer3D = dynamic(() => import('./components/ModelViewer3D'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-zinc-50">
      <div className="flex flex-col items-center gap-3 text-zinc-400">
        <div className="w-8 h-8 border-2 border-zinc-300 border-t-zinc-700 rounded-full animate-spin" />
        <span className="text-sm font-medium">Loading 3D…</span>
      </div>
    </div>
  ),
});

const PANEL_LABELS: Record<CustomizerTab, string> = {
  designs: 'Design Patterns',
  colors: 'Colors',
  patterns: 'Fabric Patterns',
  text: 'Text Layers',
  logos: 'Image / Logo Upload',
  settings: 'Settings',
};

export default function CustomizerPage() {
  const [activeTab, setActiveTab] = useState<CustomizerTab>('designs');
  const [autoRotate, setAutoRotate] = useState(false);

  const {
    state,
    update,
    updateMany,
    preloadImage,
    preloadPattern,
    addTextLayer,
    updateTextLayer,
    deleteTextLayer,
    addLogoLayer,
    updateLogoLayer,
    deleteLogoLayer,
    moveLayer,
    resetAll,
  } = useCustomizerState();

  // Compute the effective shirt body color for the 3D model
  const shirtColor = state.primary;

  const handleColorUpdate = (key: keyof CustomizerState, value: unknown) =>
    update(key, value as CustomizerState[typeof key]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-zinc-50 font-sans antialiased">
      {/* ── Left: Tab Icon Sidebar ─────────────────────────────────────────── */}
      <SettingsIconSidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* ── Middle: Settings Panel ─────────────────────────────────────────── */}
      <aside className="w-72 h-full border-r border-zinc-200 bg-white flex flex-col shrink-0 shadow-sm">
        {/* Panel header */}
        <div className="px-4 py-3.5 border-b border-zinc-100 flex items-center justify-between">
          <div>
            <Link href="/" className="flex items-center gap-1 text-[10px] text-zinc-400 hover:text-zinc-700 transition-colors mb-0.5">
              <ChevronLeft className="w-3 h-3" /> Back to Shop
            </Link>
            <h2 className="text-sm font-bold text-zinc-950">{PANEL_LABELS[activeTab]}</h2>
          </div>
          <button onClick={resetAll} title="Reset all to defaults"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-all">
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable panel content */}
        <div className="flex-1 overflow-y-auto p-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
            >
              {activeTab === 'colors' && (
                <ColorSettings
                  state={state}
                  onUpdate={handleColorUpdate}
                  onReset={resetAll}
                />
              )}
              {activeTab === 'designs' && (
                <DesignsSettings state={state} onUpdate={handleColorUpdate} />
              )}
              {activeTab === 'patterns' && (
                <PatternsSettings
                  state={state}
                  onUpdate={handleColorUpdate}
                  preloadPattern={preloadPattern}
                />
              )}
              {activeTab === 'text' && (
                <TextSettings
                  state={state}
                  onAddTextLayer={addTextLayer}
                  onUpdateTextLayer={updateTextLayer}
                  onDeleteTextLayer={deleteTextLayer}
                />
              )}
              {activeTab === 'logos' && (
                <LogoUploadSettings
                  state={state}
                  onAddLogoLayer={addLogoLayer}
                  onUpdateLogoLayer={updateLogoLayer}
                  onDeleteLogoLayer={deleteLogoLayer}
                  onMoveLayer={moveLayer}
                  preloadImage={preloadImage}
                />
              )}
              {activeTab === 'settings' && (
                <div className="space-y-4">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">3D Viewer</div>
                  <label className="flex items-center justify-between bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 cursor-pointer">
                    <span className="text-xs font-semibold text-zinc-700">Auto Rotate</span>
                    <input type="checkbox" checked={autoRotate} onChange={e => setAutoRotate(e.target.checked)} className="accent-zinc-950 w-4 h-4 cursor-pointer" />
                  </label>

                  <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 pt-3">Storage</div>
                  <button onClick={resetAll}
                    className="w-full py-2 px-4 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold transition-all">
                    Clear All & Reset
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* CTA bar */}
        <div className="px-4 py-3 border-t border-zinc-100 flex gap-2">
          <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-zinc-950 text-white text-xs font-semibold hover:bg-zinc-800 transition-all shadow-sm">
            <ShoppingCart className="w-3.5 h-3.5" /> Add to Cart
          </button>
          <button className="p-2 rounded-xl bg-zinc-100 border border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200 transition-all" title="Save design">
            <Save className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* ── Right: 3D Viewport ─────────────────────────────────────────────── */}
      <main className="flex-1 h-full relative bg-gradient-to-br from-zinc-100 via-zinc-50 to-slate-100 overflow-hidden">
        {/* Header overlay */}
        <div className="absolute top-5 left-0 right-0 z-10 flex items-center justify-center pointer-events-none">
          <div className="bg-white/70 backdrop-blur-md rounded-2xl px-5 py-2.5 shadow-sm border border-white/50 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold text-zinc-700 tracking-wide">Fabrico Design Studio</span>
            <span className="text-[10px] text-zinc-400 font-mono hidden sm:inline">|</span>
            <span className="text-[10px] text-zinc-500 font-mono hidden sm:inline">Live 3D Preview</span>
          </div>
        </div>

        {/* State badge */}
        <div className="absolute top-5 right-5 z-10 text-[9px] font-mono text-zinc-400 bg-white/60 backdrop-blur-sm rounded-lg px-2 py-1 border border-zinc-200/50">
          {state.textLayers.length} text · {state.logoLayers.length} logos
        </div>

        {/* 3D viewer */}
        <ModelViewer3D
          customizerState={state}
          shirtColor={shirtColor}
          autoRotate={autoRotate}
        />

        {/* Instruction hint */}
        <div className="absolute bottom-5 left-0 right-0 flex justify-center z-10 pointer-events-none">
          <div className="text-[10px] text-zinc-400 font-medium tracking-wider">
            Drag to rotate · Scroll to zoom
          </div>
        </div>
      </main>
    </div>
  );
}
