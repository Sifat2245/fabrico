"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

export function PromoBanner() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section ref={sectionRef} className="py-24 sm:py-32 bg-[#09090b]" aria-label="Promotion">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0f0f1a] via-[#12122a] to-[#0a0a1a] border border-indigo-500/15 px-8 py-16 sm:px-16 sm:py-24"
        >
          {/* Background Elements */}
          <div className="absolute inset-0">
            <div
              className="absolute inset-0 opacity-[0.025]"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
                backgroundSize: "32px 32px",
              }}
            />
            {/* Indigo glow orbs */}
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-600/20 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-indigo-700/5 blur-[80px]" />
          </div>

          <div className="relative z-10 flex flex-col items-center text-center lg:flex-row lg:items-center lg:justify-between lg:text-left">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-indigo-400">
                <Sparkles className="h-3.5 w-3.5" />
                Custom Design Studio
              </div>
              <h2 className="mt-6 font-display text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl lg:text-5xl">
                Make It{" "}
                <span className="italic text-indigo-400">Uniquely</span> Yours
              </h2>
              <p className="mt-4 text-base leading-relaxed text-zinc-400 sm:text-lg">
                Upload your designs, add custom text, and watch your vision come
                to life in real-time 3D. No design skills required.
              </p>
            </div>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row lg:mt-0">
              <Link
                href="/customizer"
                className="group inline-flex items-center gap-2 rounded-full bg-indigo-600 px-8 py-4 text-sm font-semibold text-white transition-all hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/25 active:scale-95"
              >
                Open Design Studio
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/shop?customizable=true"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-zinc-700 px-8 py-4 text-sm font-semibold text-zinc-300 transition-all hover:border-zinc-500 hover:text-white"
              >
                Browse Customizable
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
