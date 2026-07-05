"use client";

import Link from "next/link";
import { ChevronLeft, Info, HelpCircle } from "lucide-react";
import { useStudio } from "./StudioContext";
import { featuredProducts } from "@/data/products";

export function TopMenu() {
  const { modelType } = useStudio();
  const isPolo = modelType === "polo_tshirt";
  const baseProduct = featuredProducts.find((p) => p.id === (isPolo ? "prod-2" : "prod-1")) || featuredProducts[0];

  return (
    <header className="flex items-center justify-between border-b border-stone-200 bg-white px-6 py-4 z-20 select-none">
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="group flex items-center gap-1.5 text-xs text-stone-500 font-semibold tracking-wider hover:text-stone-850 transition-colors uppercase"
        >
          <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          Exit Studio
        </Link>
        <div className="h-4 w-px bg-stone-200" />
        <div className="flex flex-col">
          <span className="text-[10px] font-mono tracking-widest text-stone-400 uppercase leading-none">
            Active Workspace
          </span>
          <span className="text-xs font-bold text-stone-900 mt-1 uppercase tracking-wider">
            {baseProduct.name} Customization
          </span>
        </div>
      </div>

      {/* Center Logo branding */}
      <div className="flex items-center gap-1.5">
        <span className="font-display font-extrabold text-stone-900 text-base tracking-tight leading-none">
          Fabrico
        </span>
        <span className="text-[8px] font-mono font-bold px-1.5 py-0.5 border border-stone-200 text-stone-500 rounded leading-none">
          STUDIO v1.0
        </span>
      </div>

      <div className="flex items-center gap-4 text-stone-500">
        <div className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider hover:text-stone-800 transition-colors cursor-pointer">
          <Info className="h-4 w-4" /> Layout Guide
        </div>
        <div className="h-4 w-px bg-stone-200" />
        <div className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider hover:text-stone-800 transition-colors cursor-pointer">
          <HelpCircle className="h-4 w-4" /> Support
        </div>
      </div>
    </header>
  );
}
