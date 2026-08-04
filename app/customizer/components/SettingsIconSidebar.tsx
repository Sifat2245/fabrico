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
    <aside className="w-20 h-full bg-white border-r border-zinc-200 flex flex-col items-center py-6 gap-6 shrink-0 select-none">
      {/* Studio Brand Icon */}
      <div className="w-10 h-10 rounded-xl bg-zinc-950 flex items-center justify-center shadow-lg shadow-zinc-950/20 text-white">
        <span className="text-base font-black tracking-tight select-none">F</span>
      </div>

      <div className="h-px w-8 bg-zinc-100" />

      {/* Navigation tabs */}
      <div className="flex-1 flex flex-col gap-3 w-full px-2 overflow-y-auto">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`w-full py-2.5 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                isActive
                  ? 'bg-zinc-950 text-white shadow-md shadow-zinc-950/15 scale-102 font-bold'
                  : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50'
              }`}
              title={tab.label}
            >
              <Icon className="w-4.5 h-4.5 shrink-0" />
              <span className="text-[9px] font-semibold tracking-wide">{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="text-[9px] font-mono text-zinc-400 font-medium">v1.3.0</div>
    </aside>
  );
}
