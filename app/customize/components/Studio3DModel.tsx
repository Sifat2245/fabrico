/* eslint-disable react-hooks/immutability */
"use client";

import { useEffect, useRef, useMemo, Suspense, useCallback, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { Monitor, RefreshCw } from "lucide-react";
import { useStudio, PrintZone } from "./StudioContext";
import { ModelErrorBoundary } from "./ErrorBoundary";

function ApparelModel({ modelPath }: { modelPath: string }) {
  const { scene } = useGLTF(modelPath);
  const { baseColor, canvasTextures, canvasVersion } = useStudio();

  // Use simple scene.clone() for static apparel — avoids the heavy
  // SkeletonUtils dependency and is sufficient for non-skinned meshes.
  // We automatically calculate bounding box, scale, and center the model
  // to ensure it aligns with the 3D studio viewport and shadow floor.
  const clonedScene = useMemo(() => {
    const clone = scene.clone();
    
    // Apply orientation correction: rotate model 90 degrees around Y so the front faces the camera
    clone.rotation.y = Math.PI / 2;
    // Force matrix update to apply the rotation before computing the bounding box
    clone.updateMatrixWorld(true);
    
    const box = new THREE.Box3().setFromObject(clone);
    const size = new THREE.Vector3();
    box.getSize(size);
    const center = new THREE.Vector3();
    box.getCenter(center);
    
    // Scale the model to a standard height (~0.95 units)
    const targetHeight = 0.95;
    const scaleFactor = targetHeight / (size.y || 1);
    clone.scale.set(scaleFactor, scaleFactor, scaleFactor);
    
    // Position the model: center X & Z, and place the bottom (box.min.y) at Y = -0.47.
    // This aligns the shirt base perfectly on the floor shadows.
    const targetBottom = -0.47;
    clone.position.set(
      -center.x * scaleFactor,
      -box.min.y * scaleFactor + targetBottom,
      -center.z * scaleFactor
    );
    
    return clone;
  }, [scene]);

  const texturesRef = useRef<Record<PrintZone, THREE.Texture | null>>({
    front: null,
    back: null,
    left: null,
    right: null,
  });

  const applyTextures = useCallback(() => {
    let meshIndex = 0;
    clonedScene.traverse((child: THREE.Object3D) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const name = mesh.name.toLowerCase();

        let activeTexture: THREE.Texture | null = null;
        let shouldApplyTexture = false;

        // tshirt.glb mesh indices:
        // Index 0: Front Body
        // Index 1: Back Body
        // Index 2: Left & Right Sleeves
        // Index 3: Collars & Piping
        if (modelPath.includes("tshirt.glb")) {
          if (meshIndex === 0) {
            activeTexture = texturesRef.current.front;
            shouldApplyTexture = true;
          } else if (meshIndex === 1) {
            activeTexture = texturesRef.current.back;
            shouldApplyTexture = true;
          } else if (meshIndex === 2) {
            activeTexture = texturesRef.current.left;
            shouldApplyTexture = true;
          }
        } 
        // polo_tshirt.glb mesh indices:
        // Index 0: Front Body & Sleeves
        // Index 1: Back Body
        // Index 2: Collar
        // Index 3: Button Placket
        else {
          if (meshIndex === 0) {
            activeTexture = texturesRef.current.front;
            shouldApplyTexture = true;
          } else if (meshIndex === 1) {
            activeTexture = texturesRef.current.back;
            shouldApplyTexture = true;
          }
        }

        const originalMat = mesh.material as THREE.MeshStandardMaterial;

        // Conditionally build material props
        const materialProps: Record<string, unknown> = {
          color: (shouldApplyTexture && activeTexture) ? new THREE.Color("#ffffff") : new THREE.Color(baseColor),
          roughness: 0.8,
          metalness: 0.05,
        };

        if (originalMat) {
          if (originalMat.normalMap) materialProps.normalMap = originalMat.normalMap;
          if (originalMat.roughnessMap) materialProps.roughnessMap = originalMat.roughnessMap;
          if (originalMat.aoMap) materialProps.aoMap = originalMat.aoMap;
        }

        if (shouldApplyTexture && activeTexture) {
          materialProps.map = activeTexture;
        }

        mesh.material = new THREE.MeshStandardMaterial(
          materialProps as THREE.MeshStandardMaterialParameters
        );

        meshIndex++;
      }
    });
  }, [clonedScene, baseColor, modelPath]);

  useEffect(() => {
    const loader = new THREE.TextureLoader();

    Object.keys(canvasTextures).forEach((zoneKey) => {
      const zone = zoneKey as PrintZone;
      const dataUrl = canvasTextures[zone];

      if (dataUrl) {
        loader.load(
          dataUrl,
          (texture) => {
            texture.colorSpace = THREE.SRGBColorSpace;
            texture.flipY = false;
            texture.needsUpdate = true;
            texturesRef.current[zone] = texture;
            applyTextures();
          },
          undefined,
          (err) => console.error(`Error loading texture for ${zone}:`, err)
        );
      } else {
        texturesRef.current[zone] = null;
        applyTextures();
      }
    });
  }, [canvasTextures, canvasVersion, applyTextures]);

  useEffect(() => {
    applyTextures();
  }, [applyTextures]);

  return <primitive object={clonedScene} />;
}

function CameraController() {
  const { activeZone, studioMode } = useStudio();
  const { camera } = useThree();
  const lookAtRef = useRef(new THREE.Vector3(0, 0.1, 0));

  useFrame(() => {
    // Only animate camera in design mode — in orbit mode, let OrbitControls
    // handle the camera freely.
    if (studioMode === "orbit") return;

    let targetX = 0;
    let targetY = 0.1;
    let targetZ = 1.8;
    let lookTargetX = 0;
    let lookTargetY = 0.05;
    let lookTargetZ = 0;

    switch (activeZone) {
      case "front":
        targetX = 0; targetY = 0.1; targetZ = 1.8;
        break;
      case "back":
        targetX = 0; targetY = 0.1; targetZ = -1.8;
        break;
      case "left":
        targetX = -2.0; targetY = 0.15; targetZ = 0;
        lookTargetX = -0.22;
        break;
      case "right":
        targetX = 2.0; targetY = 0.15; targetZ = 0;
        lookTargetX = 0.22;
        break;
    }

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.07);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.07);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.07);

    const targetLookAt = new THREE.Vector3(lookTargetX, lookTargetY, lookTargetZ);
    lookAtRef.current.lerp(targetLookAt, 0.07);
    camera.lookAt(lookAtRef.current);
  });

  return null;
}

function CameraResetHelper() {
  const { activeZone } = useStudio();
  const { camera } = useThree();

  useEffect(() => {
    const handleDblClick = () => {
      let targetX = 0;
      let targetY = 0.1;
      let targetZ = 1.8;

      if (activeZone === "back") targetZ = -1.8;
      if (activeZone === "left") { targetX = -2.0; targetY = 0.15; targetZ = 0; }
      if (activeZone === "right") { targetX = 2.0; targetY = 0.15; targetZ = 0; }

      camera.position.set(targetX, targetY, targetZ);
    };

    window.addEventListener("dblclick", handleDblClick);
    return () => window.removeEventListener("dblclick", handleDblClick);
  }, [camera, activeZone]);

  return null;
}

// Preload both models
useGLTF.preload("/models/tshirt.glb");
useGLTF.preload("/models/polo_tshirt.glb");

/**
 * Fallback shown when the WebGL context is lost.
 * Includes a retry button that remounts the entire Canvas.
 */
function ViewerNotAvailable({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-stone-950">
      <div className="text-center max-w-xs px-6">
        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-stone-900 border border-stone-800 flex items-center justify-center">
          <Monitor className="w-6 h-6 text-stone-400" />
        </div>
        <p className="text-sm font-semibold text-stone-200 mb-1">
          3D Viewer Not Available
        </p>
        <p className="text-xs text-stone-500 leading-relaxed mb-3">
          The WebGL context was lost. This can happen when the GPU driver
          resets or when the system switches between integrated and dedicated
          graphics.
        </p>
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-stone-950 text-xs font-bold uppercase tracking-wider hover:bg-stone-200 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Restart Viewer
        </button>
        <details className="text-left mt-4">
          <summary className="text-[10px] text-stone-600 cursor-pointer hover:text-stone-400 font-mono">
            Technical details
          </summary>
          <p className="text-[10px] text-stone-600 mt-1 font-mono leading-relaxed">
            WebGL2 is required by React Three Fiber. If this issue persists,
            try disabling hardware acceleration in your browser settings, or
            use a device with a dedicated GPU.
          </p>
        </details>
      </div>
    </div>
  );
}

export default function Studio3DModel() {
  const { modelType, studioMode } = useStudio();
  const modelPath = modelType === "tshirt" ? "/models/tshirt.glb" : "/models/polo_tshirt.glb";
  const [contextLost, setContextLost] = useState(false);
  // Increment this key to force a full Canvas remount (needed because
  // a context loss destroys all WebGL resources — textures, shaders,
  // buffers — even after the context is restored).
  const [canvasKey, setCanvasKey] = useState(0);
  // Mount-generation ref to ignore stale event listeners from a previous
  // Canvas instance (unlikely, but possible with certain GPU drivers).
  const mountGenRef = useRef(0);

  const handleCreated = useCallback((state: { gl: THREE.WebGLRenderer }) => {
    // Bump mount generation so stale listener callbacks are no-ops.
    const currentGen = ++mountGenRef.current;

    // Listen for WebGL context loss. If the context is lost, show an
    // informative message and let the user force-remount the Canvas.
    const canvas = state.gl.domElement;

    const onContextLost = (e: Event) => {
      if (currentGen !== mountGenRef.current) return; // stale listener
      e.preventDefault();
      console.warn("WebGL context lost. Browser attempting restore…");
      setContextLost(true);
    };

    const onContextRestored = () => {
      if (currentGen !== mountGenRef.current) return; // stale listener
      console.log("WebGL context restored. Remounting Canvas…");
      setContextLost(false);
      // Auto-remount the Canvas on restore since all GPU resources are gone.
      setCanvasKey((k) => k + 1);
    };

    canvas.addEventListener("webglcontextlost", onContextLost);
    canvas.addEventListener("webglcontextrestored", onContextRestored);
  }, []);

  const handleRetry = useCallback(() => {
    setContextLost(false);
    setCanvasKey((k) => k + 1);
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Show fallback whenever WebGL context is lost */}
      {contextLost && <ViewerNotAvailable onRetry={handleRetry} />}

      {/*
        key={canvasKey} forces React to unmount + remount the entire
        <Canvas> subtree, giving Three.js a fresh WebGL context.
      */}
      <Canvas
        key={canvasKey}
        // Limit pixel ratio to 1.5x max — full 2x on retina displays
        // quadruples the render target size and adds significant GPU
        // pressure on laptops with integrated graphics.
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1,
          outputColorSpace: THREE.SRGBColorSpace,
          preserveDrawingBuffer: false,
          // Force high-performance GPU upfront to prevent the browser
          // from switching adapters mid-render, which drops the context.
          powerPreference: "high-performance",
          // Allow the renderer to initialise even on underpowered GPUs.
          failIfMajorPerformanceCaveat: false,
        }}
        camera={{ position: [0, 0.1, 1.8], fov: 45, near: 0.1, far: 10 }}
        style={{ background: "#a8a29e" }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onCreated={handleCreated}
      >
        <ambientLight intensity={0.4} />
        <color attach="background" args={["#a8a29e"]} />

        {/*
          Hemisphere light gives us two-tone ambient + directional fill
          without expensive shadow maps or HDR environment maps, avoiding
          the GPU readPixels stall that causes WebGL context loss on some
          hardware.
        */}
        <hemisphereLight
          args={["#f5f0eb", "#57534e", 0.6]}
          position={[0, 2, 0]}
        />
        <directionalLight
          position={[5, 8, 5]}
          intensity={1.2}
        />
        <directionalLight
          position={[-3, 2, -5]}
          intensity={0.3}
        />

        <Suspense fallback={
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-stone-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-mono text-stone-500 tracking-widest uppercase">
                Loading Model…
              </span>
            </div>
          </div>
        }>
          <ModelErrorBoundary>
            <ApparelModel key={modelPath} modelPath={modelPath} />
          </ModelErrorBoundary>
        </Suspense>

        {/*
          ContactShadows and Environment are omitted because:
          - ContactShadows uses readPixels, triggering GPU stalls on some GL drivers
          - HDR environment maps consume significant GPU memory
          The hemisphereLight + dual directional lights provide sufficient
          studio-quality lighting without the overhead.
        */}

        <CameraController />
        <CameraResetHelper />

        <OrbitControls
          enabled={studioMode === "orbit"}
          enableZoom={studioMode === "orbit"}
          enablePan={false}
          minDistance={1.0}
          maxDistance={3.0}
          enableDamping={true}
          dampingFactor={0.06}
          makeDefault
        />
      </Canvas>
    </div>
  );
}
