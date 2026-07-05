"use client";

import { motion } from "framer-motion";
import { toast } from "sonner";

import { StudioProvider, useStudio } from "./StudioContext";
import { LoadingScreen } from "./LoadingScreen";
import { TopMenu } from "./TopMenu";
import { LeftSidebar } from "./LeftSidebar";
import { RightSidebar } from "./RightSidebar";
import Studio3DModel from "./Studio3DModel";
import { PrintAreaCanvas } from "./PrintAreaCanvas";

function MainStudioWorkspace() {
  const { isLoading, setIsLoading, studioMode, setStudioMode } = useStudio();

  return (
    <div className="relative w-screen h-screen flex flex-col bg-stone-50 text-stone-900 font-body overflow-hidden">
      {/* Loading overlay */}
      <LoadingScreen
        isLoading={isLoading}
        onComplete={() => {
          setIsLoading(false);
          toast.success("Studio environment ready.");
        }}
      />

      {!isLoading && (
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Header */}
          <TopMenu />

          {/* Workbench */}
          <div className="flex-1 flex overflow-hidden relative">
            
            {/* Left Sidebar */}
            <LeftSidebar />

            {/* 3D Studio Canvas (Center) */}
            <div className="flex-1 relative overflow-hidden" style={{ backgroundColor: "#a8a29e" }}>

              {/* Floating Mode Switcher */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex items-center bg-white/95 border border-stone-200 p-1 rounded-full shadow-md backdrop-blur select-none">
                <button
                  onClick={() => setStudioMode("design")}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all uppercase tracking-wider cursor-pointer ${
                    studioMode === "design"
                      ? "bg-stone-950 text-white"
                      : "text-stone-500 hover:text-stone-800"
                  }`}
                >
                  Edit Layout
                </button>
                <button
                  onClick={() => setStudioMode("orbit")}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all uppercase tracking-wider cursor-pointer ${
                    studioMode === "orbit"
                      ? "bg-stone-950 text-white"
                      : "text-stone-500 hover:text-stone-800"
                  }`}
                >
                  3D Rotate
                </button>
              </div>

              {/* 3D Model (Full Bleed) */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 z-0"
              >
                <Studio3DModel />
              </motion.div>

              {/* Fabric.js Overlay */}
              <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                <PrintAreaCanvas />
              </div>
            </div>

            {/* Right Sidebar */}
            <RightSidebar />

          </div>
        </div>
      )}
    </div>
  );
}

export function CustomizeWorkspace() {
  return (
    <StudioProvider>
      <MainStudioWorkspace />
    </StudioProvider>
  );
}
