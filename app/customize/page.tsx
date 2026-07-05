import { Suspense } from "react";
import { CustomizeWorkspace } from "./components/CustomizeWorkspace";

export default function CustomizePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center text-stone-400 font-body">
          <div className="flex items-center gap-2 mb-4 animate-pulse">
            <span className="font-display text-2xl font-extrabold tracking-tight text-white">
              Fabrico
            </span>
            <span className="text-[10px] font-semibold text-stone-500 uppercase tracking-widest border border-stone-800 rounded px-1.5 py-0.5 ml-2">
              Studio
            </span>
          </div>
          <span className="text-xs tracking-widest uppercase text-stone-600 font-semibold animate-pulse">
            Loading Studio Instruments...
          </span>
        </div>
      }
    >
      <CustomizeWorkspace />
    </Suspense>
  );
}
