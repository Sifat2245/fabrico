'use client';

import React, { useState } from 'react';
import { ShoppingCart, X, Check, Tag } from 'lucide-react';
import { CustomizerState } from './types';
import { useCart } from '@/lib/cart-context';
import { useRouter } from 'next/navigation';

interface CheckoutSummaryPanelProps {
  customizerState: CustomizerState;
  qty: number;
  onQtyChange: (val: number) => void;
  onClose?: () => void;
}

const AVAILABLE_SIZES = ['S', 'M', 'L', 'XL', 'XXL'] as const;
type SizeType = (typeof AVAILABLE_SIZES)[number];

export default function CheckoutSummaryPanel({
  customizerState,
  qty,
  onQtyChange,
  onClose,
}: CheckoutSummaryPanelProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState<SizeType>('M');

  const BASE_PRICE = 49.0;
  const PRINT_SURCHARGE = 5.0;

  const decalsCount = customizerState.textLayers.length + customizerState.logoLayers.length;
  const customizationPrice = decalsCount * PRINT_SURCHARGE;
  const unitPrice = BASE_PRICE + customizationPrice;
  const subtotal = unitPrice * qty;

  const handleCheckout = () => {
    const configHash = `${customizerState.primary.replace('#', '')}-${selectedSize}-${decalsCount}`;
    const customProduct = {
      id: `custom-tshirt-${configHash}-${Date.now()}`,
      name: 'Customized Premium T-Shirt',
      price: unitPrice,
      category: 'Custom Apparel',
      image: '/images/products/crew-tee.jpg',
      customizable: true,
      colors: [customizerState.primary],
      sizes: [...AVAILABLE_SIZES],
      description: `Customized Modern T-Shirt. Color: ${customizerState.primary}, Collar: ${customizerState.collarType}, Decals: ${decalsCount} placed.`,
    };

    addItem({
      product: customProduct,
      quantity: qty,
      selectedColor: customizerState.primary,
      selectedSize: selectedSize,
    });

    router.push('/cart');
  };

  return (
    <aside className="w-72 h-full bg-[#13131a] border-l border-white/[0.06] flex flex-col shrink-0 shadow-2xl font-sans select-none z-30">
      {/* Panel Title Header */}
      <div className="px-4 py-3.5 border-b border-white/[0.06] bg-[#111115] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Tag className="w-3.5 h-3.5 text-violet-400" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-violet-400">Order Summary</h2>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/[0.06] transition-all lg:hidden"
            title="Close summary"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Specifications */}
        <div className="space-y-2">
          <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Specifications</h3>
          <div className="space-y-2 bg-[#1b1b24] rounded-xl p-3 border border-white/[0.05] text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Apparel Type</span>
              <span className="font-semibold text-slate-200">Modern T-Shirt</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Collar Style</span>
              <span className="font-semibold text-slate-200 capitalize">{customizerState.collarType}</span>
            </div>
            {customizerState.zipper && (
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Zipper Detail</span>
                <span className="font-semibold text-slate-200">Front Zipper</span>
              </div>
            )}
            {customizerState.primaryColorSide === 'Both' || !customizerState.primaryColorSide ? (
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Base Color</span>
                <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                  <span
                    className="w-3 h-3 rounded-full border border-white/10 shadow-sm"
                    style={{ backgroundColor: customizerState.primary }}
                  />
                  <span className="uppercase text-[10px] font-mono text-slate-400">{customizerState.primary}</span>
                </span>
              </div>
            ) : (
              <>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Front Color</span>
                  <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                    <span
                      className="w-3 h-3 rounded-full border border-white/10 shadow-sm"
                      style={{ backgroundColor: customizerState.primaryFront || customizerState.primary }}
                    />
                    <span className="uppercase text-[10px] font-mono text-slate-400">{customizerState.primaryFront || customizerState.primary}</span>
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Back Color</span>
                  <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                    <span
                      className="w-3 h-3 rounded-full border border-white/10 shadow-sm"
                      style={{ backgroundColor: customizerState.primaryBack || customizerState.primary }}
                    />
                    <span className="uppercase text-[10px] font-mono text-slate-400">{customizerState.primaryBack || customizerState.primary}</span>
                  </span>
                </div>
              </>
            )}
            {customizerState.designPattern && customizerState.designPattern !== 'plain' && (
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Body Pattern</span>
                <span className="font-semibold text-slate-200 capitalize">{customizerState.designPattern}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Custom Decals</span>
              <span className="font-semibold text-slate-200">{decalsCount} placed</span>
            </div>
          </div>
        </div>

        {/* Custom layers list */}
        {decalsCount > 0 && (
          <div className="space-y-2">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Custom Layers</h3>
            <div className="space-y-1.5 bg-[#1b1b24] rounded-xl p-3 border border-white/[0.05] text-[11px] max-h-32 overflow-y-auto">
              {customizerState.textLayers.map((layer) => (
                <div key={layer.id} className="flex justify-between items-center text-slate-300">
                  <span className="truncate max-w-[140px] font-medium">&ldquo;{layer.text}&rdquo;</span>
                  <span className="font-mono text-[9px] bg-violet-600/20 text-violet-300 px-1.5 py-0.5 rounded uppercase font-semibold">{layer.side}</span>
                </div>
              ))}
              {customizerState.logoLayers.map((layer) => (
                <div key={layer.id} className="flex justify-between items-center text-slate-300">
                  <span className="truncate max-w-[140px] font-medium">Uploaded Graphic</span>
                  <span className="font-mono text-[9px] bg-violet-600/20 text-violet-300 px-1.5 py-0.5 rounded uppercase font-semibold">{layer.side}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Size Selection */}
        <div className="space-y-2">
          <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Select Size</h3>
          <div className="grid grid-cols-5 gap-1.5 bg-[#1b1b24] rounded-xl p-2 border border-white/[0.05]">
            {AVAILABLE_SIZES.map((sz) => (
              <button
                key={sz}
                onClick={() => setSelectedSize(sz)}
                className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  selectedSize === sz
                    ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
                    : 'bg-[#22222e] border border-white/[0.05] text-slate-400 hover:bg-[#28283a] hover:text-slate-200 active:scale-95'
                }`}
              >
                {sz}
              </button>
            ))}
          </div>
        </div>

        {/* Quantity selector */}
        <div className="flex justify-between items-center bg-[#1b1b24] border border-white/[0.05] rounded-xl p-3">
          <span className="text-xs font-semibold text-slate-400">Quantity</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onQtyChange(Math.max(1, qty - 1))}
              className="w-8 h-8 rounded-lg bg-[#22222e] border border-white/[0.05] flex items-center justify-center text-slate-400 hover:bg-violet-600/20 hover:text-slate-100 active:scale-95 transition-all text-sm font-bold cursor-pointer"
            >
              -
            </button>
            <span className="text-sm font-bold text-slate-100 min-w-[20px] text-center">{qty}</span>
            <button
              onClick={() => onQtyChange(qty + 1)}
              className="w-8 h-8 rounded-lg bg-[#22222e] border border-white/[0.05] flex items-center justify-center text-slate-400 hover:bg-violet-600/20 hover:text-slate-100 active:scale-95 transition-all text-sm font-bold cursor-pointer"
            >
              +
            </button>
          </div>
        </div>

        {/* Pricing breakdown */}
        <div className="space-y-2 pt-2 border-t border-white/[0.05]">
          <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Pricing</h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Base Shirt (Relaxed Fit)</span>
              <span className="text-slate-300 font-semibold">${BASE_PRICE.toFixed(2)}</span>
            </div>
            {decalsCount > 0 && (
              <div className="flex justify-between text-slate-300">
                <span className="flex items-center gap-1 text-slate-500 font-medium">
                  Custom Surcharge <span className="text-[10px] text-slate-600 font-normal">({decalsCount} &times; $5.00)</span>
                </span>
                <span className="font-semibold text-slate-200">+${customizationPrice.toFixed(2)}</span>
              </div>
            )}
            <div className="h-px bg-white/[0.06] my-1" />
            <div className="flex justify-between text-slate-100 font-bold text-sm">
              <span>Total</span>
              <span className="text-violet-300">${subtotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout CTA */}
      <div className="p-4 border-t border-white/[0.06] bg-[#111115] shrink-0">
        <button
          onClick={handleCheckout}
          className="w-full bg-violet-600 hover:bg-violet-500 active:scale-[0.98] text-white rounded-xl py-3 px-4 font-bold text-xs tracking-wider transition-all shadow-lg shadow-violet-600/20 flex items-center justify-center gap-2 cursor-pointer"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          <span>PROCEED TO CHECKOUT</span>
        </button>
      </div>
    </aside>
  );
}
