'use client';

import React, { useState } from 'react';
import LoadingScreen from './components/LoadingScreen';
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
import CheckoutSummaryPanel from './components/CheckoutSummaryPanel';
import { useCustomizerState } from '../../hooks/useCustomizerState';
import { CustomizerState } from './components/types';

// Lazy-load the 3D viewer so SSR doesn't complain
const ModelViewer3D = dynamic(() => import('./components/ModelViewer3D'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-[#0e0e11]">
      <div className="flex flex-col items-center gap-3 text-zinc-500">
        <div className="w-8 h-8 border-2 border-zinc-800 border-t-indigo-500 rounded-full animate-spin" />
        <span className="text-sm font-medium">Loading 3D Studio…</span>
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
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<CustomizerTab>('designs');
  const [autoRotate, setAutoRotate] = useState(false);
  const [qty, setQty] = useState(1);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

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
    <>
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      <div className="flex h-screen w-screen overflow-hidden bg-[#09090b] font-sans antialiased text-zinc-200">
      {/* ── Left: Tab Icon Sidebar ─────────────────────────────────────────── */}
      <SettingsIconSidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* ── Middle: Settings Panel ─────────────────────────────────────────── */}
      <aside className="w-72 h-full border-r border-zinc-800 bg-[#0e0e12] flex flex-col shrink-0 shadow-xl z-10">
        {/* Panel header */}
        <div className="px-4 py-3.5 border-b border-zinc-800 flex items-center justify-between bg-[#0b0b0d]">
          <div>
            <Link href="/" className="flex items-center gap-1 text-[10px] text-zinc-450 hover:text-zinc-200 transition-colors mb-0.5">
              <ChevronLeft className="w-3 h-3" /> Back to Shop
            </Link>
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-400">{PANEL_LABELS[activeTab]}</h2>
          </div>
          <button onClick={resetAll} title="Reset all to defaults"
            className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-950/20 transition-all">
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable panel content */}
        <div className="flex-1 overflow-y-auto p-4 bg-[#0e0e12]">
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
                  <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">3D Viewer</div>
                  <label className="flex items-center justify-between bg-[#16161c] border border-zinc-800 rounded-xl px-3 py-2 cursor-pointer hover:bg-[#1a1a24] transition-colors">
                    <span className="text-xs font-semibold text-zinc-300">Auto Rotate</span>
                    <input type="checkbox" checked={autoRotate} onChange={e => setAutoRotate(e.target.checked)} className="accent-indigo-500 w-4 h-4 cursor-pointer" />
                  </label>

                  <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 pt-3">Storage</div>
                  <button onClick={resetAll}
                    className="w-full py-2 px-4 rounded-xl border border-red-900/50 text-red-400 hover:bg-red-950/20 text-xs font-semibold transition-all">
                    Clear All & Reset
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </aside>

      {/* ── Right: 3D Viewport ─────────────────────────────────────────────── */}
      <main className="flex-1 h-full relative bg-gradient-to-b from-[#18181b] via-[#101012] to-[#070709] overflow-hidden">
        {/* Header overlay */}
        <div className="absolute top-5 left-0 right-0 z-10 flex items-center justify-center pointer-events-none">
          <div className="bg-zinc-900/85 backdrop-blur-md rounded-2xl px-5 py-2.5 shadow-xl border border-zinc-800/80 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-zinc-200 tracking-wide">Fabrico Design Studio</span>
            <span className="text-[10px] text-zinc-600 font-mono hidden sm:inline">|</span>
            <span className="text-[10px] text-zinc-400 font-mono hidden sm:inline">Live 3D Preview</span>
          </div>
        </div>

        {/* State badge */}
        <div className="absolute top-5 right-5 z-10 text-[9px] font-mono text-zinc-300 bg-zinc-900/85 backdrop-blur-sm rounded-lg px-2.5 py-1 border border-zinc-800/80">
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
          <div className="text-[10px] text-zinc-500 font-medium tracking-wider bg-zinc-900/40 backdrop-blur-sm px-3 py-1 rounded-full border border-zinc-800/30">
            Drag to rotate · Scroll to zoom
          </div>
        </div>

        {/* Floating checkout button on mobile */}
        <div className="absolute bottom-5 right-5 z-10 lg:hidden">
          <button
            onClick={() => setIsCheckoutOpen(true)}
            className="flex items-center gap-1.5 bg-indigo-600 text-white px-4 py-2.5 rounded-xl shadow-lg font-semibold text-xs hover:bg-indigo-500 transition-all active:scale-95"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Checkout</span>
          </button>
        </div>
      </main>

      {/* ── Rightmost Sidebar: Checkout Summary Drawer/Sidebar ─────────────────── */}
      <div
        className={`fixed inset-y-0 right-0 z-40 transform ${isCheckoutOpen ? 'translate-x-0' : 'translate-x-full'
          } transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 flex-shrink-0 h-full`}
      >
        <CheckoutSummaryPanel
          customizerState={state}
          qty={qty}
          onQtyChange={setQty}
          onClose={() => setIsCheckoutOpen(false)}
        />
      </div>

      {/* Backdrop for mobile drawer */}
      <AnimatePresence>
        {isCheckoutOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCheckoutOpen(false)}
            className="fixed inset-0 bg-black z-35 lg:hidden"
          />
        )}
      </AnimatePresence>
      </div>
    </>
  );
}
