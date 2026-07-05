"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Search, Menu, X, User } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { SearchOverlay } from "./SearchOverlay";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/customize", label: "Customize" },
  { href: "/about", label: "About" },
] as const;

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { openSidebar, totalItems } = useCart();

  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/80 backdrop-blur-xl border-b border-stone-200/60 shadow-sm"
            : "bg-transparent"
        }`}
      >
        <nav
          className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8"
          aria-label="Main navigation"
        >
          {/* Logo */}
          <Link
            href="/"
            className={`font-display text-2xl font-bold tracking-tight transition-colors hover:opacity-70 ${
              isScrolled ? "text-stone-950" : "text-white"
            }`}
            aria-label="Fabrico home"
          >
            Fabrico
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden items-center gap-8 md:flex" role="list">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`relative text-sm font-medium tracking-wide transition-colors ${
                    isScrolled
                      ? "text-stone-600 hover:text-stone-950"
                      : "text-stone-300 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-4 md:flex">
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search products"
              className={`rounded-full p-2 transition-colors ${
                isScrolled
                  ? "text-stone-600 hover:bg-stone-100 hover:text-stone-950"
                  : "text-stone-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Search className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={openSidebar}
              aria-label="Shopping cart"
              className={`relative rounded-full p-2 transition-colors ${
                isScrolled
                  ? "text-stone-600 hover:bg-stone-100 hover:text-stone-950"
                  : "text-stone-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <span className={`absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-semibold ${
                  isScrolled
                    ? "bg-stone-950 text-white"
                    : "bg-white text-stone-950"
                }`}>
                  {totalItems}
                </span>
              )}
            </button>
            <Link
              href="/auth/login"
              aria-label="Account"
              className={`rounded-full p-2 transition-colors ${
                isScrolled
                  ? "text-stone-600 hover:bg-stone-100 hover:text-stone-950"
                  : "text-stone-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              <User className="h-5 w-5" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            aria-label={isMobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileOpen}
            className={`rounded-full p-2 transition-colors md:hidden ${
              isScrolled
                ? "text-stone-600 hover:bg-stone-100 hover:text-stone-950"
                : "text-stone-300 hover:bg-white/10 hover:text-white"
            }`}
            onClick={() => setIsMobileOpen(!isMobileOpen)}
          >
            {isMobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </nav>
      </motion.header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-stone-950/30 backdrop-blur-sm md:hidden"
              onClick={() => setIsMobileOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 z-50 flex h-full w-80 flex-col bg-white shadow-2xl md:hidden"
            >
              <div className="flex items-center justify-between border-b border-stone-100 px-6 py-4">
                <span className="font-display text-xl font-bold text-stone-950">
                  Fabrico
                </span>
                <button
                  type="button"
                  aria-label="Close menu"
                  className="rounded-full p-2 text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-950"
                  onClick={() => setIsMobileOpen(false)}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="flex-1 px-6 py-8" aria-label="Mobile navigation">
                <ul className="flex flex-col gap-1" role="list">
                  {NAV_LINKS.map((link, index) => (
                    <motion.li
                      key={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        className="block rounded-xl px-4 py-3 text-lg font-medium text-stone-700 transition-colors hover:bg-stone-50 hover:text-stone-950"
                        onClick={() => setIsMobileOpen(false)}
                      >
                        {link.label}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </nav>

              <div className="border-t border-stone-100 px-6 py-6 font-body">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setIsMobileOpen(false);
                        setIsSearchOpen(true);
                      }}
                      aria-label="Search products"
                      className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-stone-200 px-4 py-3 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-50 hover:text-stone-950"
                    >
                      <Search className="h-4 w-4" />
                      Search
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsMobileOpen(false);
                        openSidebar();
                      }}
                      aria-label="Shopping cart"
                      className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-stone-950 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-stone-800"
                    >
                      <ShoppingBag className="h-4 w-4" />
                      Cart ({totalItems})
                    </button>
                  </div>
                  <Link
                    href="/auth/login"
                    onClick={() => setIsMobileOpen(false)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-stone-200 px-4 py-3 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-50 hover:text-stone-950"
                  >
                    <User className="h-4 w-4" />
                    Sign In
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

    </>
  );
}
