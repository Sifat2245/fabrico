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
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
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
            <div className="overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl shadow-black/50">
              {/* Search Input */}
              <div className="flex items-center gap-3 border-b border-zinc-800 px-5 py-4">
                <Search className="h-5 w-5 text-zinc-500" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products..."
                  className="flex-1 bg-transparent text-base text-zinc-100 placeholder:text-zinc-600 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close search"
                  className="rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Results */}
              <div className="max-h-80 overflow-y-auto">
                {query.trim() && results.length === 0 && (
                  <div className="px-5 py-8 text-center">
                    <p className="text-sm text-zinc-500">
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
                        className="flex items-center gap-4 rounded-xl px-3 py-3 transition-colors hover:bg-zinc-800"
                      >
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-zinc-800">
                          <span className="font-display text-lg font-bold text-zinc-600">
                            {product.name.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-zinc-200">
                            {product.name}
                          </p>
                          <p className="text-xs text-zinc-500">
                            {product.category}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-zinc-100">
                            ${product.price.toFixed(2)}
                          </p>
                          <ArrowRight className="h-3.5 w-3.5 text-zinc-600" />
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {!query.trim() && (
                  <div className="px-5 py-6">
                    <p className="mb-3 text-xs font-medium uppercase tracking-wider text-zinc-600">
                      Popular Searches
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {["T-Shirts", "Polo", "Hoodie", "Jacket"].map((term) => (
                        <button
                          key={term}
                          type="button"
                          onClick={() => setQuery(term)}
                          className="rounded-full border border-zinc-700 px-3.5 py-1.5 text-xs font-medium text-zinc-400 transition-colors hover:border-indigo-500/50 hover:bg-indigo-500/10 hover:text-indigo-400"
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
