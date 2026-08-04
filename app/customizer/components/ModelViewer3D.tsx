'use client';

import React, { Suspense, useMemo, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  OrbitControls,
  Environment,
  ContactShadows,
  useGLTF,
  Html,
  Center,
} from '@react-three/drei';
import * as THREE from 'three';
import { CustomizerState } from './types';
import { useJerseyTextures } from '../hooks/useJerseyTextures';

// ─── Piece classification for tshirt2.glb ────────────────────────────────────
// The garment is a multi-piece Clo3D-style export:
//   - `70_*`  : main FRONT torso panel      (design area)
//   - `28_*`  : main BACK torso panel       (design area)
//   - `71_*` / `29_*` : front / back collar bands
//   - `31_*` / `64_*` : side panels
//   - `2949190` / `30_*` : sleeves
//   - `4474558` / `4491756` : front / back hem bands
//   - `StitchMatShape_*` : stitching details (keep thread material)
type PieceRole = 'front' | 'back' | 'trimFront' | 'trimBack' | 'stitch';

const isPieceId = (name: string, id: string) => {
  const n = name.toLowerCase();
  return (
    n.startsWith(`${id}_`) || n.startsWith(`${id}.`) || n.startsWith(`${id} `)
  );
};

function classifyPiece(name: string): PieceRole {
  const n = name.toLowerCase();
  if (n.includes('stitchmatshape')) return 'stitch';
  // Back hem band → back trim
  if (n.includes('4491756')) return 'trimBack';
  // Back collar band → back trim
  if (isPieceId(n, '29')) return 'trimBack';
  // Front hem band → front trim
  if (n.includes('4474558')) return 'trimFront';
  // Sleeves + side panels + front collar → front trim
  if (n.includes('2949190')) return 'trimFront';
  if (isPieceId(n, '30') || isPieceId(n, '31') || isPieceId(n, '64')) return 'trimFront';
  if (isPieceId(n, '71')) return 'trimFront';
  // Main torso panels — the design print area
  if (isPieceId(n, '70')) return 'front';
  if (isPieceId(n, '28')) return 'back';
  return 'trimFront';
}

// ─── UV normalization ────────────────────────────────────────────────────────
// The GLB ships with pattern-layout UVs (e.g. [-3.2..3.2, -4.9..4.2]) instead
// of the [0,1] unit square, so a plain texture gets clamped/stretched into
// invisibility. We remap every piece's UVs to [0,1] per-piece so the design
// canvas maps cleanly onto the garment.
function normalizeUVs(geometry: THREE.BufferGeometry): THREE.BufferGeometry {
  const uv = geometry.getAttribute('uv') as THREE.BufferAttribute | undefined;
  if (!uv) return geometry;

  let minU = Infinity, maxU = -Infinity, minV = Infinity, maxV = -Infinity;
  for (let i = 0; i < uv.count; i++) {
    const u = uv.getX(i), v = uv.getY(i);
    if (u < minU) minU = u;
    if (u > maxU) maxU = u;
    if (v < minV) minV = v;
    if (v > maxV) maxV = v;
  }
  const du = maxU - minU || 1;
  const dv = maxV - minV || 1;

  const src = uv.array as ArrayLike<number>;
  const dst = new Float32Array(src.length);
  for (let i = 0; i < uv.count; i++) {
    dst[i * 2] = (src[i * 2] - minU) / du;
    dst[i * 2 + 1] = (src[i * 2 + 1] - minV) / dv;
  }

  const cloned = geometry.clone();
  cloned.setAttribute('uv', new THREE.BufferAttribute(dst, 2));
  return cloned;
}

// ─── Main model component ────────────────────────────────────────────────────
interface JerseyModelProps {
  customizerState: CustomizerState;
  shirtColor: string;
}

function JerseyModel({ customizerState, shirtColor }: JerseyModelProps) {
  const gltf = useGLTF('/models/tshirt2.glb');
  const { frontTex, backTex, trimFrontTex, trimBackTex } = useJerseyTextures(customizerState);

  const clonedScene = useMemo(() => gltf.scene.clone(true), [gltf.scene]);

  // One-time classification + UV normalization per mesh (pure computation)
  const pieceInfo = useMemo(() => {
    const info: { mesh: THREE.Mesh; role: PieceRole; geometry: THREE.BufferGeometry | null }[] = [];
    clonedScene.traverse((child) => {
      if (!(child as THREE.Mesh).isMesh) return;
      const mesh = child as THREE.Mesh;
      const role = classifyPiece(mesh.name);
      const geometry =
        role !== 'stitch' && mesh.geometry.getAttribute('uv')
          ? normalizeUVs(mesh.geometry)
          : null;
      info.push({ mesh, role, geometry });
    });
    return info;
  }, [clonedScene]);

  useEffect(() => {
    const color = new THREE.Color(shirtColor);

    pieceInfo.forEach(({ mesh, role, geometry }) => {
      if (geometry) mesh.geometry = geometry;

      const materials = Array.isArray(mesh.material)
        ? mesh.material
        : [mesh.material];

      materials.forEach((mat) => {
        const m = mat as THREE.MeshStandardMaterial;
        if (!m) return;

        // Stitching keeps its original thread material
        if (role === 'stitch') return;

        m.wireframe = false;
        m.metalness = 0;
        m.roughness = 0.85;

        const tex =
          role === 'front' ? frontTex
          : role === 'back' ? backTex
          : role === 'trimBack' ? trimBackTex
          : trimFrontTex;
        if (tex) {
          m.map = tex;
          m.color.set('#ffffff');
        } else {
          m.map = null;
          m.color.copy(color);
        }
        m.needsUpdate = true;
      });
    });

    return () => {
      frontTex?.dispose();
      backTex?.dispose();
      trimFrontTex?.dispose();
      trimBackTex?.dispose();
    };
  }, [pieceInfo, shirtColor, frontTex, backTex, trimFrontTex, trimBackTex]);

  return (
    <Center>
      <primitive object={clonedScene} />
    </Center>
  );
}

useGLTF.preload('/models/tshirt2.glb');

function Loader() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-3 bg-neutral-900/90 text-white px-6 py-4 rounded-2xl backdrop-blur-md shadow-2xl border border-white/10 min-w-[160px]">
        <div className="w-7 h-7 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        <span className="text-sm font-medium tracking-wide text-neutral-300">Loading Model...</span>
      </div>
    </Html>
  );
}

interface ModelViewer3DProps {
  customizerState: CustomizerState;
  shirtColor?: string;
  autoRotate?: boolean;
  wireframe?: boolean;
}

export default function ModelViewer3D({
  customizerState,
  shirtColor = '#FFFFFF',
  autoRotate = false,
}: ModelViewer3DProps) {
  return (
    <div className="relative w-full h-full min-h-[500px] select-none">
      <Canvas
        camera={{ position: [0, 0, 1.8], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        shadows
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow shadow-bias={-0.0001} />
        <directionalLight position={[-5, 3, -5]} intensity={0.4} />

        <Suspense fallback={<Loader />}>
          <JerseyModel customizerState={customizerState} shirtColor={shirtColor} />
          <Environment preset="city" />
          <ContactShadows position={[0, -0.6, 0]} opacity={0.5} scale={10} blur={2} far={4} />
        </Suspense>

        <OrbitControls
          makeDefault
          enablePan={false}
          enableZoom={true}
          minDistance={1.2}
          maxDistance={5}
          target={[0, 0.05, 0]}
          autoRotate={autoRotate}
          autoRotateSpeed={1.5}
          maxPolarAngle={Math.PI / 2 + 0.3}
        />
      </Canvas>
    </div>
  );
}
