'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
  /** Called once the fake boot sequence finishes so the parent can unmount this screen */
  onComplete: () => void;
}

const STEPS = [
  'Initializing studio…',
  'Loading 3D engine…',
  'Preparing materials…',
  'Almost ready…',
];

const STEP_DURATION = 600; // ms per step

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Advance through each step
    const total = STEPS.length;
    let current = 0;

    const tick = () => {
      current += 1;
      setStepIndex(Math.min(current, total - 1));
      setProgress(Math.round((current / total) * 100));

      if (current >= total) {
        // Small pause at 100 % before exiting
        setTimeout(() => setDone(true), 300);
      }
    };

    const id = setInterval(tick, STEP_DURATION);
    return () => clearInterval(id);
  }, []);

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {!done && (
        <motion.div
          key="loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#09090b] select-none"
        >
          {/* Logo mark */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="flex flex-col items-center gap-5"
          >
            {/* Icon mark */}
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-indigo-400"
                  aria-hidden
                >
                  <path
                    d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              {/* Subtle glow */}
              <div className="absolute inset-0 rounded-2xl bg-indigo-500/10 blur-xl -z-10" />
            </div>

            {/* Wordmark */}
            <div className="text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-zinc-500">
                Fabrico
              </p>
              <p className="text-lg font-bold text-zinc-100 tracking-tight mt-0.5">
                Design Studio
              </p>
            </div>
          </motion.div>

          {/* Progress area */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.35, ease: 'easeOut' }}
            className="absolute bottom-14 left-1/2 -translate-x-1/2 w-56 flex flex-col items-center gap-3"
          >
            {/* Status text */}
            <AnimatePresence mode="wait">
              <motion.p
                key={STEPS[stepIndex]}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                className="text-[11px] text-zinc-500 font-medium tracking-wide"
              >
                {STEPS[stepIndex]}
              </motion.p>
            </AnimatePresence>

            {/* Progress bar */}
            <div className="w-full h-[2px] bg-zinc-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-indigo-500 rounded-full"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
