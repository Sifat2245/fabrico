'use client';

// ─── Core Layer Types ─────────────────────────────────────────────────────────

export interface EraserPath {
  size: number;
  points: { x: number; y: number }[];
}

export interface TextLayer {
  id: string;
  type: 'text';
  side: 'Front' | 'Back';
  text: string;
  font: string;
  textSize: number;
  color: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  letterSpacing: number;
  lineSpacing: number;
  curveRadius: number;
  shadowEnabled: boolean;
  shadowColor: string;
  shadowBlur: number;
  shadowOffsetX: number;
  shadowOffsetY: number;
  outlineEnabled: boolean;
  outlineColor: string;
  outlineWidth: number;
}

export interface LogoLayer {
  id: string;
  type: 'logo' | 'image'; // logo = 3D projected decal, image = flat canvas texture
  side: 'Front' | 'Back';
  src: string; // data URL or /path
  x: number;
  y: number;
  scale: number;
  rotation: number;
  opacity: number;
  eraserPaths: EraserPath[];
  zOrder?: 'above-text' | 'below-text';
}

// ─── Main Customizer State ────────────────────────────────────────────────────

export interface CustomizerState {
  // Colors
  primary: string;
  secondary: string;
  designColor: string;
  primaryFront: string;
  primaryBack: string;
  primaryColorSide: 'Both' | 'Front' | 'Back' | '';

  // Collar
  collarType: 'None' | 'Round' | 'V-Neck' | 'Polo' | 'Henley';
  zipper: boolean;

  // Design patterns
  designPattern: string;
  designSide: 'Front' | 'Back' | 'Both' | '';

  // Fabric patterns
  fabricPatternFront: string;
  fabricPatternBack: string;
  fabricPatternColorFront: string;
  fabricPatternColorBack: string;
  fabricPatternBgFront: string;
  fabricPatternBgBack: string;
  fabricPatternCustomizeFront: boolean;
  fabricPatternCustomizeBack: boolean;

  // Logo / text layers
  textLayers: TextLayer[];
  logoLayers: LogoLayer[];
  layersOrder: string[]; // ordered ids

  // Logo (single chest logo from older API — kept for backward compat)
  logo?: string;
  logoSize?: number;
  logoPosition?: string;

  // Cache (not persisted)
  loadedLogoImages: Record<string, HTMLImageElement>;
  loadedPatterns: Record<string, HTMLImageElement>;
}

export const DEFAULT_STATE: Omit<CustomizerState, 'loadedLogoImages' | 'loadedPatterns'> = {
  primary: '#FFFFFF',
  secondary: '#1A1A2E',
  designColor: '#1A1A2E',
  primaryFront: '#FFFFFF',
  primaryBack: '#FFFFFF',
  primaryColorSide: 'Both',

  collarType: 'Round',
  zipper: false,

  designPattern: 'plain',
  designSide: 'Both',

  fabricPatternFront: 'None',
  fabricPatternBack: 'None',
  fabricPatternColorFront: '#000000',
  fabricPatternColorBack: '#000000',
  fabricPatternBgFront: '#FFFFFF',
  fabricPatternBgBack: '#FFFFFF',
  fabricPatternCustomizeFront: false,
  fabricPatternCustomizeBack: false,

  textLayers: [],
  logoLayers: [],
  layersOrder: [],

  logo: undefined,
  logoSize: 0.15,
  logoPosition: 'Chest Center',
};

export const FABRICO_STORAGE_KEY = 'fabrico_customizer_v2';

// ─── Legacy DecalItem (kept for PrintAreaEditor compat) ───────────────────────
export interface DecalItem {
  id: string;
  name: string;
  url: string;
  meshUuid?: string;
  meshName?: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
}

export interface SampleLogoItem {
  id: string;
  name: string;
  url: string;
}

export const SAMPLE_LOGOS: SampleLogoItem[] = [
  { id: 'logo1', name: 'Sample A', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/320px-Cat03.jpg' },
  { id: 'logo2', name: 'Sample B', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Gatto_europeo4.jpg/320px-Gatto_europeo4.jpg' },
];
