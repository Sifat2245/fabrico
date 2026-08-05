'use client';

import React, { useState } from 'react';
import { ShoppingCart, X, Check } from 'lucide-react';
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
    // Generate a unique dynamic ID based on the customizer configuration
    const configHash = `${customizerState.primary.replace('#', '')}-${selectedSize}-${decalsCount}`;
    const customProduct = {
      id: `custom-tshirt-${configHash}-${Date.now()}`,
      name: 'Customized Premium T-Shirt',
      price: unitPrice,
      category: 'Custom Apparel',
      image: '/images/products/crew-tee.jpg', // Fallback local image or design preview
      customizable: true,
      colors: [customizerState.primary],
      sizes: [...AVAILABLE_SIZES],
      description: `Customized Modern T-Shirt. Color: ${customizerState.primary}, Collar: ${customizerState.collarType}, Decals: ${decalsCount} placed.`,
    };

    // Add to cart using the context method
    addItem({
      product: customProduct,
      quantity: qty,
      selectedColor: customizerState.primary,
      selectedSize: selectedSize,
    });

    // Navigate to the cart page
    router.push('/cart');
  };

  return (
    <aside className="w-72 h-full bg-white border-l border-zinc-200 flex flex-col shrink-0 shadow-sm font-sans select-none z-30">
      {/* Panel Title Header */}
      <div className="p-4 border-b border-zinc-150 bg-zinc-50/50 flex items-center justify-between">
        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Order Summary</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-all lg:hidden"
            title="Close summary"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Specifications */}
        <div className="space-y-2">
          <h3 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Specifications</h3>
          <div className="space-y-1.5 bg-zinc-50 rounded-xl p-3 border border-zinc-200/40 text-xs">
            <div className="flex justify-between">
              <span className="text-zinc-500">Apparel Type</span>
              <span className="font-semibold text-zinc-800">Modern T-Shirt</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Collar Style</span>
              <span className="font-semibold text-zinc-800 capitalize">{customizerState.collarType}</span>
            </div>
            {customizerState.zipper && (
              <div className="flex justify-between">
                <span className="text-zinc-500">Zipper Detail</span>
                <span className="font-semibold text-zinc-800">Front Zipper</span>
              </div>
            )}
            {customizerState.primaryColorSide === 'Both' || !customizerState.primaryColorSide ? (
              <div className="flex justify-between">
                <span className="text-zinc-500">Base Color</span>
                <span className="font-semibold text-zinc-800 flex items-center gap-1.5">
                  <span
                    className="w-3 h-3 rounded-full border border-zinc-300"
                    style={{ backgroundColor: customizerState.primary }}
                  />
                  <span className="uppercase text-[10px] font-mono">{customizerState.primary}</span>
                </span>
              </div>
            ) : (
              <>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Front Color</span>
                  <span className="font-semibold text-zinc-800 flex items-center gap-1.5">
                    <span
                      className="w-3 h-3 rounded-full border border-zinc-300"
                      style={{ backgroundColor: customizerState.primaryFront || customizerState.primary }}
                    />
                    <span className="uppercase text-[10px] font-mono">{customizerState.primaryFront || customizerState.primary}</span>
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Back Color</span>
                  <span className="font-semibold text-zinc-800 flex items-center gap-1.5">
                    <span
                      className="w-3 h-3 rounded-full border border-zinc-300"
                      style={{ backgroundColor: customizerState.primaryBack || customizerState.primary }}
                    />
                    <span className="uppercase text-[10px] font-mono">{customizerState.primaryBack || customizerState.primary}</span>
                  </span>
                </div>
              </>
            )}
            {customizerState.designPattern && customizerState.designPattern !== 'plain' && (
              <div className="flex justify-between">
                <span className="text-zinc-500">Body Pattern</span>
                <span className="font-semibold text-zinc-800 capitalize">{customizerState.designPattern}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-zinc-500">Custom Decals</span>
              <span className="font-semibold text-zinc-800">{decalsCount} placed</span>
            </div>
          </div>
        </div>

        {/* Selected custom elements list */}
        {decalsCount > 0 && (
          <div className="space-y-2">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Custom Layers</h3>
            <div className="space-y-1.5 bg-zinc-50 rounded-xl p-3 border border-zinc-200/40 text-[11px] max-h-32 overflow-y-auto">
              {customizerState.textLayers.map((layer) => (
                <div key={layer.id} className="flex justify-between items-center text-zinc-600">
                  <span className="truncate max-w-[140px] font-medium">&ldquo;{layer.text}&rdquo;</span>
                  <span className="font-mono text-[9px] bg-zinc-200/50 text-zinc-700 px-1 rounded uppercase">{layer.side}</span>
                </div>
              ))}
              {customizerState.logoLayers.map((layer) => (
                <div key={layer.id} className="flex justify-between items-center text-zinc-600">
                  <span className="truncate max-w-[140px] font-medium">Uploaded Graphic</span>
                  <span className="font-mono text-[9px] bg-zinc-200/50 text-zinc-700 px-1 rounded uppercase">{layer.side}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Size Selection */}
        <div className="space-y-2">
          <h3 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Select Size</h3>
          <div className="grid grid-cols-5 gap-1.5 bg-zinc-50 rounded-xl p-2 border border-zinc-200/40">
            {AVAILABLE_SIZES.map((sz) => (
              <button
                key={sz}
                onClick={() => setSelectedSize(sz)}
                className={`py-2 text-xs font-bold rounded-lg transition-all ${
                  selectedSize === sz
                    ? 'bg-zinc-950 text-white shadow-sm scale-[1.03]'
                    : 'bg-white border border-zinc-250/60 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 active:scale-95'
                }`}
              >
                {sz}
              </button>
            ))}
          </div>
        </div>

        {/* Quantity selector */}
        <div className="flex justify-between items-center bg-zinc-50 border border-zinc-200/40 rounded-xl p-3">
          <span className="text-xs font-semibold text-zinc-650">Quantity</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onQtyChange(Math.max(1, qty - 1))}
              className="w-8 h-8 rounded-lg bg-white border border-zinc-200 flex items-center justify-center text-zinc-650 hover:bg-zinc-100 hover:text-zinc-900 active:scale-95 transition-all text-sm font-bold shadow-sm"
            >
              -
            </button>
            <span className="text-sm font-bold text-zinc-800 min-w-[20px] text-center">{qty}</span>
            <button
              onClick={() => onQtyChange(qty + 1)}
              className="w-8 h-8 rounded-lg bg-white border border-zinc-200 flex items-center justify-center text-zinc-650 hover:bg-zinc-100 hover:text-zinc-900 active:scale-95 transition-all text-sm font-bold shadow-sm"
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
              <span className="text-zinc-850 font-semibold">${BASE_PRICE.toFixed(2)}</span>
            </div>
            {decalsCount > 0 && (
              <div className="flex justify-between text-zinc-700">
                <span className="flex items-center gap-1">
                  Custom Surcharge <span className="text-[10px] text-zinc-400">({decalsCount} &times; $5.00)</span>
                </span>
                <span className="font-semibold">+${customizationPrice.toFixed(2)}</span>
              </div>
            )}
            <div className="h-px bg-zinc-100 my-1" />
            <div className="flex justify-between text-zinc-950 font-bold text-sm">
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
          className="w-full bg-zinc-950 hover:bg-zinc-900 active:scale-[0.98] text-white rounded-xl py-3 px-4 font-bold text-xs tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          <span>PROCEED TO CHECKOUT</span>
        </button>
      </div>
    </aside>
  );
}
