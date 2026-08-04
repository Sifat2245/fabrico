'use client';

import React from 'react';
import { ShoppingCart } from 'lucide-react';

interface CheckoutSummaryPanelProps {
  shirtColor: string;
  decalsCount: number;
  qty: number;
  onQtyChange: (val: number) => void;
}

export default function CheckoutSummaryPanel({
  shirtColor,
  decalsCount,
  qty,
  onQtyChange,
}: CheckoutSummaryPanelProps) {
  const BASE_PRICE = 49.0;
  const PRINT_SURCHARGE = 5.0;
  
  const customizationPrice = decalsCount * PRINT_SURCHARGE;
  const unitPrice = BASE_PRICE + customizationPrice;
  const subtotal = unitPrice * qty;

  const handleCheckout = () => {
    alert(`Proceeding to checkout for ${qty} customized shirt(s) config! Total: $${subtotal.toFixed(2)}`);
  };

  return (
    <aside className="w-72 h-full bg-white border-l border-zinc-200 flex flex-col h-full shrink-0 shadow-sm font-sans select-none z-10">
      {/* Panel Title Header */}
      <div className="p-4 border-b border-zinc-200/60 bg-zinc-50/50">
        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Order Summary</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Specifications */}
        <div className="space-y-2">
          <h3 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Specifications</h3>
          <div className="space-y-1.5 bg-zinc-50 rounded-xl p-3 border border-zinc-200/40 text-xs">
            <div className="flex justify-between">
              <span className="text-zinc-500">Apparel Type</span>
              <span className="font-semibold text-zinc-800">Modern T-Shirt</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Base Fabric Color</span>
              <span className="font-semibold text-zinc-800 flex items-center gap-1.5">
                <span
                  className="w-3 h-3 rounded-full border border-zinc-300"
                  style={{ backgroundColor: shirtColor }}
                />
                <span className="uppercase text-[10px] font-mono">{shirtColor}</span>
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Decal Prints</span>
              <span className="font-semibold text-zinc-800">{decalsCount} placed</span>
            </div>
          </div>
        </div>

        {/* Quantity selector */}
        <div className="flex justify-between items-center bg-zinc-50 border border-zinc-200/60 rounded-xl p-3">
          <span className="text-xs font-semibold text-zinc-600">Quantity</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onQtyChange(Math.max(1, qty - 1))}
              className="w-8 h-8 rounded-lg bg-white border border-zinc-200 flex items-center justify-center text-zinc-650 hover:bg-zinc-50 active:scale-95 transition-all text-sm font-semibold shadow-sm"
            >
              -
            </button>
            <span className="text-sm font-bold text-zinc-800 min-w-[20px] text-center">{qty}</span>
            <button
              onClick={() => onQtyChange(qty + 1)}
              className="w-8 h-8 rounded-lg bg-white border border-zinc-200 flex items-center justify-center text-zinc-650 hover:bg-zinc-50 active:scale-95 transition-all text-sm font-semibold shadow-sm"
            >
              +
            </button>
          </div>
        </div>

        {/* Price list items */}
        <div className="space-y-2 pt-2 border-t border-zinc-100">
          <h3 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Pricing</h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-zinc-500">Base Shirt (Relaxed Fit)</span>
              <span className="text-zinc-800 font-semibold">${BASE_PRICE.toFixed(2)}</span>
            </div>
            {decalsCount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Print Surcharges ({decalsCount} × $5)</span>
                <span className="font-semibold">+${customizationPrice.toFixed(2)}</span>
              </div>
            )}
            <div className="h-px bg-zinc-100 my-1" />
            <div className="flex justify-between text-zinc-900 font-bold text-sm">
              <span>Total Price</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout primary button */}
      <div className="p-4 border-t border-zinc-100 bg-zinc-50/50">
        <button
          onClick={handleCheckout}
          className="w-full bg-zinc-950 hover:bg-zinc-900 text-white rounded-xl py-3 px-4 font-semibold text-xs tracking-wider transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>PROCEED TO CHECKOUT</span>
        </button>
      </div>
    </aside>
  );
}
