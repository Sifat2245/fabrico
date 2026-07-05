"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useCart, type CartItem } from "@/lib/cart-context";

export function CartSidebar() {
  const { items, isOpen, closeSidebar, totalItems, subtotal, removeItem, updateQuantity } =
    useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-stone-950/30 backdrop-blur-sm"
            onClick={closeSidebar}
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full flex-col bg-white shadow-2xl sm:w-96"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-stone-100 px-6 py-4">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-stone-950" />
                <h2 className="text-lg font-semibold text-stone-950">
                  Cart ({totalItems})
                </h2>
              </div>
              <button
                type="button"
                onClick={closeSidebar}
                aria-label="Close cart"
                className="rounded-full p-2 text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-950"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <ShoppingBag className="mb-4 h-12 w-12 text-stone-200" />
                  <p className="text-sm font-medium text-stone-500">
                    Your cart is empty
                  </p>
                  <p className="mt-1 text-xs text-stone-400">
                    Browse our collection and add something you love
                  </p>
                  <button
                    type="button"
                    onClick={closeSidebar}
                    className="mt-6 rounded-xl bg-stone-950 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-stone-800"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item: CartItem) => (
                    <div
                      key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}`}
                      className="flex gap-4 rounded-xl border border-stone-100 p-3"
                    >
                      {/* Thumbnail */}
                      <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-lg bg-stone-100">
                        <span className="font-display text-2xl font-bold text-stone-300">
                          {item.product.name.charAt(0)}
                        </span>
                      </div>

                      {/* Info */}
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <p className="text-sm font-medium text-stone-950">
                            {item.product.name}
                          </p>
                          <div className="mt-0.5 flex items-center gap-2 text-xs text-stone-500">
                            {item.selectedSize && (
                              <span>Size: {item.selectedSize}</span>
                            )}
                            {item.selectedColor && (
                              <span
                                className="inline-block h-3 w-3 rounded-full border border-stone-200"
                                style={{ backgroundColor: item.selectedColor }}
                              />
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.quantity - 1
                                )
                              }
                              aria-label="Decrease quantity"
                              className="flex h-7 w-7 items-center justify-center rounded-lg border border-stone-200 text-stone-500 transition-colors hover:border-stone-400 hover:text-stone-950"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-6 text-center text-sm font-medium text-stone-950">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.quantity + 1
                                )
                              }
                              aria-label="Increase quantity"
                              className="flex h-7 w-7 items-center justify-center rounded-lg border border-stone-200 text-stone-500 transition-colors hover:border-stone-400 hover:text-stone-950"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <p className="text-sm font-semibold text-stone-950">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>

                      {/* Remove */}
                      <button
                        type="button"
                        onClick={() => removeItem(item.product.id)}
                        aria-label="Remove item"
                        className="self-start text-stone-300 transition-colors hover:text-red-500"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-stone-100 px-6 py-5">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm text-stone-500">Subtotal</p>
                  <p className="text-lg font-bold text-stone-950">
                    ${subtotal.toFixed(2)}
                  </p>
                </div>
                <Link
                  href="/cart"
                  onClick={closeSidebar}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-stone-950 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-stone-800"
                >
                  Go to Cart
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <button
                  type="button"
                  onClick={closeSidebar}
                  className="mt-2 w-full rounded-xl border border-stone-200 px-6 py-3 text-sm font-medium text-stone-600 transition-colors hover:border-stone-400 hover:text-stone-950"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
