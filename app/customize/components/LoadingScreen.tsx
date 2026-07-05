"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Cpu, Layers, Type, Hammer, CheckCircle2 } from "lucide-react";

interface LoadingScreenProps {
  onComplete?: () => void;
  isLoading: boolean;
}

const LOADING_STEPS = [
  { message: "Initializing Design Studio...", icon: Cpu, duration: 800 },
  { message: "Loading 3D Apparel Models...", icon: Sparkles, duration: 1200 },
  { message: "Preparing Editor Canvas...", icon: Layers, duration: 900 },
  { message: "Loading Creative Fonts...", icon: Type, duration: 700 },
  { message: "Optimizing Studio Workspace...", icon: Hammer, duration: 600 },
  { message: "Almost Ready...", icon: CheckCircle2, duration: 500 },
];

export function LoadingScreen({ onComplete, isLoading }: LoadingScreenProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (!isLoading) return;

    let stepTimer: NodeJS.Timeout;
    const runSteps = (index: number) => {
      if (index >= LOADING_STEPS.length) {
        setProgress(100);
        setIsDone(true);
        setTimeout(() => {
          if (onComplete) onComplete();
        }, 600);
        return;
      }

      setCurrentStepIndex(index);
      const step = LOADING_STEPS[index];

      // Smooth progress accretion during each step duration
      const increments = 20;
      const stepProgressAmount = 100 / LOADING_STEPS.length;
      const intervalTime = step.duration / increments;
      let tick = 0;

      const progressInterval = setInterval(() => {
        tick++;
        setProgress((prev) => {
          const nextVal = prev + stepProgressAmount / increments;
          return Math.min(nextVal, 100);
        });
        if (tick >= increments) {
          clearInterval(progressInterval);
        }
      }, intervalTime);

      stepTimer = setTimeout(() => {
        runSteps(index + 1);
      }, step.duration);
    };

    runSteps(0);

    return () => {
      clearTimeout(stepTimer);
    };
  }, [isLoading, onComplete]);

  const activeStep = LOADING_STEPS[currentStepIndex] || LOADING_STEPS[LOADING_STEPS.length - 1];
  const StepIcon = activeStep.icon;

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: [0.65, 0, 0.35, 1] } }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-stone-50 text-stone-950 font-body"
        >
          {/* Subtle noise/grid texture */}
          <div
            className="absolute inset-0 opacity-[0.02] pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, #292524 1px, transparent 0)",
              backgroundSize: "32px 32px",
            }}
          />

          <div className="relative z-10 w-full max-w-md px-6 text-center">
            {/* Branded Logo Animation */}
            <div className="flex flex-col items-center mb-16">
              <motion.div
                initial={{ scale: 0.8, opacity: 0, filter: "blur(4px)" }}
                animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="flex items-center gap-2 mb-2"
              >
                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-stone-950 text-white font-display font-black text-2xl tracking-tighter shadow-xl shadow-black/5">
                  F
                </div>
                <span className="font-display text-4xl font-extrabold tracking-tight text-stone-950">
                  Fabrico
                </span>
                <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest border border-stone-300 rounded px-1.5 py-0.5 ml-2">
                  v1.0
                </span>
              </motion.div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                transition={{ delay: 0.4, duration: 1 }}
                className="text-xs tracking-widest uppercase text-stone-400 font-medium"
              >
                Interactive Design Atelier
              </motion.p>
            </div>

            {/* Progress Bar Container */}              <div className="relative h-1 w-full bg-stone-200 rounded-full overflow-hidden mb-8">
              <motion.div
                className="absolute inset-y-0 left-0 bg-stone-950 rounded-full shadow-[0_0_8px_rgba(41,37,36,0.3)]"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1, ease: "easeOut" }}
              />
            </div>

            {/* Active loading log */}
            <div className="h-6 flex items-center justify-center gap-2.5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStepIndex}
                  initial={{ opacity: 0, y: 10, filter: "blur(2px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -10, filter: "blur(2px)" }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-2 text-sm text-stone-500 font-medium tracking-wide"
                >
                  <StepIcon className="h-4 w-4 text-stone-400 animate-pulse" />
                  {activeStep.message}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Percentage Indicator */}
            <motion.span
              animate={{ opacity: isDone ? 1 : 0.6 }}
              className="block mt-16 font-mono text-xs text-stone-400 tracking-wider"
            >
              {Math.min(Math.round(progress), 100)}%
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
