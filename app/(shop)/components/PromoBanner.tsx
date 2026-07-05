"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

export function PromoBanner() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section ref={sectionRef} className="py-24 sm:py-32" aria-label="Promotion">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-3xl bg-stone-950 px-8 py-16 sm:px-16 sm:py-24"
        >
          {/* Background Elements */}
          <div className="absolute inset-0">
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
                backgroundSize: "32px 32px",
              }}
            />
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-stone-800/50 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-stone-700/30 blur-3xl" />
          </div>

          <div className="relative z-10 flex flex-col items-center text-center lg:flex-row lg:items-center lg:justify-between lg:text-left">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-stone-700/50 bg-stone-800/40 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-stone-300">
                <Sparkles className="h-3.5 w-3.5" />
                Custom Design Studio
              </div>
              <h2 className="mt-6 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                Make It{" "}
                <span className="italic text-stone-400">Uniquely</span> Yours
              </h2>
              <p className="mt-4 text-base leading-relaxed text-stone-400 sm:text-lg">
                Upload your designs, add custom text, and watch your vision come
                to life in real-time 3D. No design skills required.
              </p>
            </div>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row lg:mt-0">
              <Link
                href="/customize"
                className="group inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-semibold text-stone-950 transition-all hover:bg-stone-200 hover:shadow-lg hover:shadow-white/10"
              >
                Open Design Studio
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/shop?customizable=true"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-stone-600 px-8 py-4 text-sm font-semibold text-stone-300 transition-all hover:border-stone-400 hover:text-white"
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
