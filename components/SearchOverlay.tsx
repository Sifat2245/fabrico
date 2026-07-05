"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowRight } from "lucide-react";
import { featuredProducts } from "@/data/products";
import type { Product } from "@/types";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      // Delay focus to allow animation to start
      const timer = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return featuredProducts.filter(
      (p: Product) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-stone-950/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            className="fixed left-1/2 top-24 z-50 w-full max-w-xl -translate-x-1/2 px-4"
          >
            <div className="overflow-hidden rounded-2xl bg-white shadow-2xl">
              {/* Search Input */}
              <div className="flex items-center gap-3 border-b border-stone-100 px-5 py-4">
                <Search className="h-5 w-5 text-stone-400" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products..."
                  className="flex-1 bg-transparent text-base text-stone-950 placeholder:text-stone-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close search"
                  className="rounded-lg p-1.5 text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-950"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Results */}
              <div className="max-h-80 overflow-y-auto">
                {query.trim() && results.length === 0 && (
                  <div className="px-5 py-8 text-center">
                    <p className="text-sm text-stone-500">
                      No products found for &quot;{query}&quot;
                    </p>
                  </div>
                )}

                {results.length > 0 && (
                  <div className="p-2">
                    {results.map((product: Product) => (
                      <Link
                        key={product.id}
                        href={`/product/${product.id}`}
                        onClick={onClose}
                        className="flex items-center gap-4 rounded-xl px-3 py-3 transition-colors hover:bg-stone-50"
                      >
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-stone-100">
                          <span className="font-display text-lg font-bold text-stone-300">
                            {product.name.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-stone-950">
                            {product.name}
                          </p>
                          <p className="text-xs text-stone-500">
                            {product.category}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-stone-950">
                            ${product.price.toFixed(2)}
                          </p>
                          <ArrowRight className="h-3.5 w-3.5 text-stone-300" />
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {!query.trim() && (
                  <div className="px-5 py-6">
                    <p className="mb-3 text-xs font-medium uppercase tracking-wider text-stone-400">
                      Popular Searches
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {["T-Shirts", "Polo", "Hoodie", "Jacket"].map((term) => (
                        <button
                          key={term}
                          type="button"
                          onClick={() => setQuery(term)}
                          className="rounded-full border border-stone-200 px-3.5 py-1.5 text-xs font-medium text-stone-600 transition-colors hover:border-stone-400 hover:text-stone-950"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
