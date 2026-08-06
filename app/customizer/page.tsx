'use client';

import React, { useState } from 'react';
import LoadingScreen from './components/LoadingScreen';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, ChevronRight, RotateCcw, ShoppingCart,
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
    <div className="w-full h-full flex items-center justify-center bg-[#111115]">
      <div className="flex flex-col items-center gap-3 text-slate-500">
        <div className="w-8 h-8 border-2 border-slate-700 border-t-violet-500 rounded-full animate-spin" />
        <span className="text-sm font-medium tracking-wide">Loading 3D Studio…</span>
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
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false);
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false);

  const {
    state,
    update,
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

  const shirtColor = state.primary;

  const handleColorUpdate = (key: keyof CustomizerState, value: unknown) =>
    update(key, value as CustomizerState[typeof key]);

  return (
    <>
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      <div className="flex h-screen w-screen overflow-hidden bg-[#0f0f13] font-sans antialiased text-slate-200">

        {/* ── Far Left: Tab Icon Sidebar ──────────────────────────────────────── */}
        <SettingsIconSidebar activeTab={activeTab} onTabChange={setActiveTab} />

        {/* ── Left: Collapsible Settings Panel ───────────────────────────────── */}
        <div className="relative flex shrink-0 h-full">
          <motion.aside
            animate={{ width: leftPanelCollapsed ? 0 : 288 }}
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            className="h-full border-r border-white/[0.06] bg-[#14141a] flex flex-col overflow-hidden shadow-xl z-10"
          >
            <div className="w-72 flex flex-col h-full">
              {/* Panel header */}
              <div className="px-4 py-3.5 border-b border-white/[0.06] flex items-center justify-between bg-[#111115] shrink-0">
                <div>
                  <Link href="/" className="flex items-center gap-1 text-[10px] text-slate-500 hover:text-slate-200 transition-colors mb-0.5">
                    <ChevronLeft className="w-3 h-3" /> Back to Shop
                  </Link>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-violet-400">{PANEL_LABELS[activeTab]}</h2>
                </div>
                <button
                  onClick={resetAll}
                  title="Reset all to defaults"
                  className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable panel content */}
              <div className="flex-1 overflow-y-auto p-4 bg-[#14141a]">
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
                        <div className="text-[10px] font-bold uppercase tracking-wider text-violet-400">3D Viewer</div>
                        <label className="flex items-center justify-between bg-[#1c1c24] border border-white/[0.06] rounded-xl px-3 py-2 cursor-pointer hover:bg-[#202030] transition-colors">
                          <span className="text-xs font-semibold text-slate-300">Auto Rotate</span>
                          <input type="checkbox" checked={autoRotate} onChange={e => setAutoRotate(e.target.checked)} className="accent-violet-500 w-4 h-4 cursor-pointer" />
                        </label>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-violet-400 pt-3">Storage</div>
                        <button onClick={resetAll}
                          className="w-full py-2 px-4 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 text-xs font-semibold transition-all">
                          Clear All & Reset
                        </button>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.aside>

          {/* Left collapse toggle — box tab attached to right edge of sidebar */}
          <button
            onClick={() => setLeftPanelCollapsed(prev => !prev)}
            title={leftPanelCollapsed ? 'Expand panel' : 'Collapse panel'}
            className="absolute -right-[22px] top-1/2 -translate-y-1/2 z-20 w-[22px] h-14 bg-[#14141a] border-t border-r border-b border-white/[0.08] rounded-r-lg text-slate-500 hover:text-violet-400 hover:bg-[#1c1c28] flex items-center justify-center transition-all duration-200 shadow-[2px_0_8px_rgba(0,0,0,0.3)]"
          >
            {leftPanelCollapsed
              ? <ChevronRight className="w-3 h-3" />
              : <ChevronLeft className="w-3 h-3" />
            }
          </button>
        </div>

        {/* ── Center: 3D Viewport ─────────────────────────────────────────────── */}
        <main className="flex-1 h-full relative overflow-hidden" style={{ background: 'radial-gradient(ellipse at 50% 30%, #1a1a2e 0%, #0f0f13 60%, #07070a 100%)' }}>

          {/* State badge */}
          <div className="absolute top-5 right-5 z-10 text-[9px] font-mono text-slate-300 bg-[#16161e]/90 backdrop-blur-sm rounded-lg px-2.5 py-1 border border-white/[0.07]">
            {state.textLayers.length} text · {state.logoLayers.length} logos
          </div>

          {/* 3D viewer */}
          <ModelViewer3D
            customizerState={state}
            shirtColor={shirtColor}
            autoRotate={autoRotate}
          />

          {/* Bottom hint */}
          <div className="absolute bottom-5 left-0 right-0 flex justify-center z-10 pointer-events-none">
            <div className="text-[10px] text-slate-500 font-medium tracking-wider bg-[#16161e]/50 backdrop-blur-sm px-3 py-1 rounded-full border border-white/[0.05]">
              Drag to rotate · Scroll to zoom
            </div>
          </div>

          {/* Floating checkout button on mobile */}
          <div className="absolute bottom-5 right-5 z-10 lg:hidden">
            <button
              onClick={() => setIsCheckoutOpen(true)}
              className="flex items-center gap-1.5 bg-violet-600 text-white px-4 py-2.5 rounded-xl shadow-lg font-semibold text-xs hover:bg-violet-500 transition-all active:scale-95"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Checkout</span>
            </button>
          </div>
        </main>

        {/* ── Right: Collapsible Checkout Sidebar ─────────────────────────────── */}
        <div className="relative flex shrink-0 h-full">
          {/* Right collapse toggle — box tab attached to left edge of sidebar */}
          <button
            onClick={() => setRightPanelCollapsed(prev => !prev)}
            title={rightPanelCollapsed ? 'Expand order summary' : 'Collapse order summary'}
            className="absolute -left-[22px] top-1/2 -translate-y-1/2 z-20 w-[22px] h-14 bg-[#13131a] border-t border-l border-b border-white/[0.08] rounded-l-lg text-slate-500 hover:text-violet-400 hover:bg-[#1c1c28] flex items-center justify-center transition-all duration-200 shadow-[-2px_0_8px_rgba(0,0,0,0.3)]"
          >
            {rightPanelCollapsed
              ? <ChevronLeft className="w-3 h-3" />
              : <ChevronRight className="w-3 h-3" />
            }
          </button>

          {/* Mobile drawer wrapper */}
          <div
            className={`fixed inset-y-0 right-0 z-40 transform ${isCheckoutOpen ? 'translate-x-0' : 'translate-x-full'
              } transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 flex-shrink-0 h-full`}
          >
            <motion.div
              animate={{ width: rightPanelCollapsed ? 0 : 288 }}
              transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
              className="h-full overflow-hidden"
            >
              <CheckoutSummaryPanel
                customizerState={state}
                qty={qty}
                onQtyChange={setQty}
                onClose={() => setIsCheckoutOpen(false)}
              />
            </motion.div>
          </div>
        </div>

        {/* Backdrop for mobile drawer */}
        <AnimatePresence>
          {isCheckoutOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
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
