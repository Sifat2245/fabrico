'use client';

import React from 'react';
import { Palette, Type, Image as ImageIcon, Sliders, Sparkles, Grid, LucideIcon } from 'lucide-react';

export type CustomizerTab = 'designs' | 'colors' | 'patterns' | 'text' | 'logos' | 'settings';

interface TabItem {
  id: CustomizerTab;
  icon: LucideIcon;
  label: string;
}

const TABS: TabItem[] = [
  { id: 'designs', icon: Sparkles, label: 'Designs' },
  { id: 'colors', icon: Palette, label: 'Colors' },
  { id: 'patterns', icon: Grid, label: 'Patterns' },
  { id: 'text', icon: Type, label: 'Text' },
  { id: 'logos', icon: ImageIcon, label: 'Uploads' },
  { id: 'settings', icon: Sliders, label: 'Settings' },
];

interface SettingsIconSidebarProps {
  activeTab: CustomizerTab;
  onTabChange: (tab: CustomizerTab) => void;
}

export default function SettingsIconSidebar({
  activeTab,
  onTabChange,
}: SettingsIconSidebarProps) {
  return (
    <aside className="w-[72px] h-full bg-[#0e0e12] border-r border-white/[0.05] flex flex-col items-center py-5 gap-5 shrink-0 select-none z-20">
      {/* Studio Brand Icon */}
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-violet-600/30 text-white shrink-0">
        <span className="text-sm font-black tracking-tight select-none">F</span>
      </div>

      <div className="h-px w-7 bg-white/[0.07] shrink-0" />

      {/* Navigation tabs */}
      <div className="flex-1 flex flex-col gap-1.5 w-full px-2 overflow-y-auto">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`w-full py-2.5 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-violet-600/90 text-white shadow-md shadow-violet-600/25'
                  : 'text-slate-500 hover:text-slate-200 hover:bg-white/[0.06]'
              }`}
              title={tab.label}
            >
              <Icon className="w-[18px] h-[18px] shrink-0" />
              <span className="text-[9px] font-semibold tracking-wide leading-none">{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="text-[8px] font-mono text-slate-700 font-medium pb-1">v1.3</div>
    </aside>
  );
}
