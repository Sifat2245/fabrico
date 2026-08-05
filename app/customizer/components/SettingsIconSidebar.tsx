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
    <aside className="w-20 h-full bg-[#0a0a0c] border-r border-zinc-800 flex flex-col items-center py-6 gap-6 shrink-0 select-none z-20">
      {/* Studio Brand Icon */}
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-600/25 text-white">
        <span className="text-base font-black tracking-tight select-none">F</span>
      </div>

      <div className="h-px w-8 bg-zinc-800/60" />

      {/* Navigation tabs */}
      <div className="flex-1 flex flex-col gap-3 w-full px-2 overflow-y-auto">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`w-full py-2.5 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 scale-102 font-bold'
                  : 'text-zinc-500 hover:text-zinc-200 hover:bg-[#16161a]'
                }`}
              title={tab.label}
            >
              <Icon className="w-4.5 h-4.5 shrink-0" />
              <span className="text-[9px] font-semibold tracking-wide">{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="text-[9px] font-mono text-zinc-600 font-medium">v1.3.0</div>
    </aside>
  );
}
