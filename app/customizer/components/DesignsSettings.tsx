'use client';

import React from 'react';
import { CustomizerState } from './types';

// ─── Mini SVG preview for design patterns ─────────────────────────────────────
function PatternPreview({ pattern, primary }: { pattern: string; primary: string }) {
  const sec = 'rgba(0,0,0,0.2)';
  const w = 'rgba(255,255,255,0.25)';

  const getContent = () => {
    switch (pattern) {
      case 'plain': return <text x="50" y="58" textAnchor="middle" fill="rgba(0,0,0,0.3)" fontSize="14" fontWeight="bold">Solid</text>;
      case 'strike': return <polygon points="60,10 80,10 50,90 30,90" fill={sec} />;
      case 'save': return <rect x="0" y="0" width="45" height="100" fill={sec} />;
      case 'fastbreak': return <><polygon points="0,0 30,0 0,50" fill={sec}/><polygon points="100,50 100,100 70,100" fill={sec}/></>;
      case 'final': return <><rect x="0" y="0" width="35" height="100" fill={sec}/><rect x="65" y="0" width="35" height="100" fill={sec}/></>;
      case 'victory': return <polygon points="0,0 40,0 20,100 0,100" fill={sec} />;
      case 'city': return <><line x1="0" y1="25" x2="100" y2="25" stroke={sec} strokeWidth="4"/><line x1="0" y1="50" x2="100" y2="50" stroke={sec} strokeWidth="4"/><line x1="0" y1="75" x2="100" y2="75" stroke={sec} strokeWidth="4"/></>;
      case 'pure': return <polygon points="70,0 100,0 100,40" fill={sec} />;
      case 'level': return <polygon points="0,0 55,0 0,70" fill={sec} />;
      case 'vivo': return <polygon points="60,100 100,0 100,100" fill={sec} />;
      case 'avatar': return <polygon points="0,100 45,0 55,0 0,100" fill={sec} />;
      case 'league': return <><rect x="0" y="0" width="50" height="100" fill={sec}/><rect x="50" y="0" width="50" height="100" fill={primary} opacity="0.3"/></>;
      case 'raid': return <rect x="0" y="0" width="100" height="50" fill={sec} />;
      case 'rush': return <polygon points="0,0 0,100 40,100" fill={sec} />;
      case 'score': return <polygon points="0,0 100,0 100,100" fill={sec} />;

      case 'Stripes': return <><rect x="15" y="0" width="8" height="100" fill={w}/><rect x="27" y="0" width="2" height="100" fill={w}/><rect x="45" y="0" width="8" height="100" fill={w}/><rect x="57" y="0" width="2" height="100" fill={w}/><rect x="75" y="0" width="8" height="100" fill={w}/></>;
      case 'Diagonal': return <><line x1="-20" y1="20" x2="40" y2="-40" stroke={sec} strokeWidth="6"/><line x1="10" y1="50" x2="70" y2="-10" stroke={sec} strokeWidth="6"/><line x1="40" y1="80" x2="100" y2="20" stroke={sec} strokeWidth="6"/><line x1="70" y1="110" x2="130" y2="50" stroke={sec} strokeWidth="6"/></>;
      case 'Geometric': return <path d="M 0,0 L 20,20 L 40,0 L 60,20 L 80,0 L 100,20 M 0,30 L 20,50 L 40,30 L 60,50 L 80,30 L 100,50 M 0,60 L 20,80 L 40,60 L 60,80 L 80,60 L 100,80" stroke={w} strokeWidth="1.5" fill="none"/>;
      case 'BlueGrungeJersey': return <><rect x="0" y="0" width="30" height="100" fill="rgba(255,255,255,0.25)"/><rect x="70" y="0" width="30" height="100" fill="rgba(255,255,255,0.25)"/><rect x="30" y="0" width="40" height="100" fill="rgba(0,0,0,0.3)"/></>;
      case 'GreenChevronJersey': return <><path d="M 10,30 L 30,15 L 50,30 L 70,15 L 90,30" fill="none" stroke={w} strokeWidth="3" strokeLinejoin="round"/><path d="M 10,55 L 30,40 L 50,55 L 70,40 L 90,55" fill="none" stroke={sec} strokeWidth="2" strokeLinejoin="round"/><path d="M 10,80 L 30,65 L 50,80 L 70,65 L 90,80" fill="none" stroke={w} strokeWidth="3" strokeLinejoin="round"/></>;
      case 'RedCarbonJersey': return <><rect x="10" y="20" width="35" height="25" fill={sec} stroke={w} strokeWidth="1"/><rect x="55" y="20" width="35" height="25" fill={sec} stroke={w} strokeWidth="1"/><rect x="10" y="55" width="35" height="25" fill={sec} stroke={w} strokeWidth="1"/><rect x="55" y="55" width="35" height="25" fill={sec} stroke={w} strokeWidth="1"/></>;
      case 'FlameStripeJersey': return <><rect x="0" y="0" width="8" height="55" rx="2" fill={w} opacity="0.8"/><rect x="0" y="45" width="8" height="55" rx="2" fill={w} opacity="0.8"/><rect x="18" y="0" width="6" height="40" rx="2" fill={sec} opacity="0.7"/><rect x="32" y="0" width="8" height="60" rx="2" fill={w} opacity="0.8"/><rect x="48" y="0" width="8" height="50" rx="2" fill={w} opacity="0.8"/><rect x="64" y="0" width="6" height="40" rx="2" fill={sec} opacity="0.7"/><rect x="78" y="0" width="8" height="65" rx="2" fill={w} opacity="0.8"/></>;
      case 'GrungeTriangleJersey': return <><polygon points="8,10 42,70 20,78" fill={sec} opacity="0.5"/><rect x="32" y="0" width="36" height="100" fill="rgba(0,0,0,0.4)"/><polygon points="72,20 96,80 82,90" fill={sec} opacity="0.5"/></>;

      default: return null;
    }
  };

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full" style={{ backgroundColor: primary }}>
      {getContent()}
    </svg>
  );
}

const DESIGN_PATTERNS = [
  { id: 'plain', name: 'Plain' },
  { id: 'strike', name: 'Strike' },
  { id: 'save', name: 'Save' },
  { id: 'fastbreak', name: 'Fastbreak' },
  { id: 'final', name: 'Final' },
  { id: 'victory', name: 'Victory' },
  { id: 'city', name: 'City' },
  { id: 'pure', name: 'Pure' },
  { id: 'level', name: 'Level' },
  { id: 'vivo', name: 'Vivo' },
  { id: 'avatar', name: 'Avatar' },
  { id: 'league', name: 'League' },
  { id: 'raid', name: 'Raid' },
  { id: 'rush', name: 'Rush' },
  { id: 'score', name: 'Score' },
  { id: 'Stripes', name: 'Stripes' },
  { id: 'Diagonal', name: 'Diagonal' },
  { id: 'Geometric', name: 'Geometric' },
  { id: 'BlueGrungeJersey', name: 'Grunge' },
  { id: 'GreenChevronJersey', name: 'Chevron' },
  { id: 'RedCarbonJersey', name: 'Carbon' },
  { id: 'FlameStripeJersey', name: 'Flame' },
  { id: 'GrungeTriangleJersey', name: 'Triangle' },
];

interface DesignsSettingsProps {
  state: CustomizerState;
  onUpdate: (key: keyof CustomizerState, value: any) => void;
}

export default function DesignsSettings({ state, onUpdate }: DesignsSettingsProps) {
  return (
    <div className="space-y-4 font-sans text-xs text-zinc-300">
      {/* Side selector */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">Apply To</label>
        <div className="flex bg-[#16161c] p-0.5 rounded-lg border border-zinc-800 text-[10px] gap-0.5">
          {(['Both', 'Front', 'Back'] as const).map(side => (
            <button key={side} onClick={() => onUpdate('designSide', side)}
              className={`flex-1 py-1 rounded-md font-semibold transition-all ${state.designSide === side ? 'bg-indigo-600 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-250'}`}>
              {side}
            </button>
          ))}
        </div>
      </div>

      {/* Pattern grid */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">Pattern</label>
        <div className="grid grid-cols-3 gap-2">
          {DESIGN_PATTERNS.map(p => (
            <button key={p.id} onClick={() => onUpdate('designPattern', p.id)}
              className={`rounded-xl overflow-hidden border-2 transition-all hover:scale-[1.03] active:scale-95 bg-[#16161c] ${
                state.designPattern === p.id ? 'border-indigo-600 shadow-lg shadow-indigo-650/15' : 'border-zinc-800 hover:border-zinc-700'
              }`}
              title={p.name}>
              <div className="w-full aspect-square">
                <PatternPreview pattern={p.id} primary={state.primary} />
              </div>
              <div className={`text-[9px] font-semibold py-1 text-center ${state.designPattern === p.id ? 'bg-indigo-600 text-white' : 'bg-[#1e1e24] text-zinc-400'}`}>
                {p.name}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Design color hint */}
      {state.designPattern !== 'plain' && (
        <div className="text-[10px] text-zinc-400 flex items-center gap-1.5 py-2 px-3 bg-[#16161c] rounded-xl border border-zinc-850">
          <div className="w-3 h-3 rounded-full border border-zinc-700" style={{ backgroundColor: state.designColor }} />
          <span>Pattern uses design color from <strong className="text-indigo-400 font-semibold">Colors</strong> tab</span>
        </div>
      )}
    </div>
  );
}
