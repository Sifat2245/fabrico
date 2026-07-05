"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";
import { useStudio, PrintZone, ProductSize } from "./StudioContext";
import { useCart } from "@/lib/cart-context";
import { featuredProducts } from "@/data/products";

const PRESET_COLORS = [
  { name: "Off-White", hex: "#f5f5f4" },
  { name: "Stone", hex: "#e7e5e4" },
  { name: "Pebble", hex: "#78716c" },
  { name: "Charcoal", hex: "#292524" },
  { name: "Obsidian", hex: "#0c0a09" },
  { name: "Olive", hex: "#44403c" },
];

export function RightSidebar() {
  const router = useRouter();
  const { addItem } = useCart();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const {
    modelType,
    setModelType,
    baseColor,
    setBaseColor,
    activeZone,
    setActiveZone,
    size,
    setSize,
    quantity,
    setQuantity,
  } = useStudio();

  // Find baseline product info matching model type
  const isPolo = modelType === "polo_tshirt";
  const baseProduct = featuredProducts.find((p) => p.id === (isPolo ? "prod-2" : "prod-1")) || featuredProducts[0];
  const customPrice = baseProduct.price + 15.0; // Custom surcharge

  // Handle adding order to cart
  const handleAddToCart = () => {
    addItem({
      product: {
        ...baseProduct,
        id: `${baseProduct.id}-custom-${Date.now()}`,
        name: `Custom ${baseProduct.name}`,
        price: customPrice,
        colors: [baseColor],
      },
      quantity,
      selectedColor: baseColor,
      selectedSize: size,
    });

    toast.success("Design successfully added to cart!");
    router.push("/cart");
  };

  return (
    <div className="absolute lg:relative right-0 top-0 bottom-0 z-20 flex-shrink-0 h-full flex">
      {/* Collapsed Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute left-[-14px] top-1/2 -translate-y-1/2 h-10 w-[14px] rounded-l-md bg-white border-y border-l border-stone-200 hover:bg-stone-50 text-stone-500 flex items-center justify-center cursor-pointer transition-colors z-20"
      >
        {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </button>

      <AnimatePresence initial={false}>
        {!isCollapsed && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "tween", duration: 0.2, ease: "easeInOut" }}
            className="flex-shrink-0 overflow-hidden"
          >
          <div className="w-[280px] border-l border-stone-200 bg-white flex flex-col h-full overflow-hidden select-none">
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            
            {/* Active Apparel Swap */}
            <div>
              <h4 className="text-[10px] font-mono tracking-widest text-stone-500 uppercase mb-3">
                Apparel Silhouette
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setModelType("tshirt")}
                  className={`py-3 px-3.5 border rounded-xl text-left transition-all cursor-pointer ${
                    modelType === "tshirt"
                      ? "border-stone-950 bg-stone-50"
                      : "border-stone-200 bg-stone-50/50 hover:border-stone-300"
                  }`}
                >
                  <span className="text-xs font-bold text-stone-850 block">V-Neck Shirt</span>
                  <span className="text-[9px] text-stone-500 mt-0.5 block">Off-cut silhouette</span>
                </button>
                <button
                  onClick={() => setModelType("polo_tshirt")}
                  className={`py-3 px-3.5 border rounded-xl text-left transition-all cursor-pointer ${
                    modelType === "polo_tshirt"
                      ? "border-stone-950 bg-stone-50"
                      : "border-stone-200 bg-stone-50/50 hover:border-stone-300"
                  }`}
                >
                  <span className="text-xs font-bold text-stone-850 block">Sport Polo</span>
                  <span className="text-[9px] text-stone-500 mt-0.5 block">Collared pique cut</span>
                </button>
              </div>
            </div>

            {/* Base Shading Palette */}
            <div>
              <h4 className="text-[10px] font-mono tracking-widest text-stone-500 uppercase mb-3">
                Base Color Shade
              </h4>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {PRESET_COLORS.map((color) => {
                  const isSelected = baseColor === color.hex;
                  return (
                    <button
                      key={color.name}
                      onClick={() => setBaseColor(color.hex)}
                      className={`flex flex-col items-center py-2.5 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? "border-stone-950 bg-stone-50"
                          : "border-stone-200 bg-stone-50/20 hover:border-stone-300"
                      }`}
                    >
                      <span
                        className="h-4.5 w-4.5 rounded-full border border-stone-200"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span className="text-[9px] font-semibold text-stone-600 mt-1">
                        {color.name}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Color Shadepicker */}
              <div className="flex items-center gap-3 bg-stone-50 border border-stone-200 rounded-xl p-2.5">
                <input
                  type="color"
                  value={baseColor}
                  onChange={(e) => setBaseColor(e.target.value)}
                  className="bg-transparent border-0 cursor-pointer h-6 w-6 rounded"
                />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-stone-700">Custom Dye hex</span>
                  <span className="text-[9px] font-mono text-stone-450 uppercase">{baseColor}</span>
                </div>
              </div>
            </div>

            {/* Active editing print zones */}
            <div>
              <h4 className="text-[10px] font-mono tracking-widest text-stone-500 uppercase mb-3">
                Print Area Selection
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "front", label: "Front Body" },
                  { id: "back", label: "Back Body" },
                  { id: "left", label: "Left Sleeve" },
                  { id: "right", label: "Right Sleeve" },
                ].map((zone) => {
                  const isSel = activeZone === zone.id;
                  return (
                    <button
                      key={zone.id}
                      onClick={() => setActiveZone(zone.id as PrintZone)}
                      className={`py-3 rounded-xl border transition-all truncate text-xs font-bold text-center cursor-pointer ${
                        isSel ? "border-stone-950 bg-stone-950 text-white" : "border-stone-200 bg-stone-50 text-stone-605 hover:border-stone-300"
                      }`}
                    >
                      {zone.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sizes selector */}
            <div>
              <h4 className="text-[10px] font-mono tracking-widest text-stone-500 uppercase mb-3">
                Apparel Size selection
              </h4>
              <div className="flex bg-stone-50 border border-stone-200 p-1.5 rounded-xl gap-1">
                {(["S", "M", "L", "XL"] as ProductSize[]).map((sz) => {
                  const isSel = size === sz;
                  return (
                    <button
                      key={sz}
                      onClick={() => setSize(sz)}
                      className={`flex-1 h-9 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        isSel ? "bg-white text-stone-950 shadow-sm border border-stone-250" : "text-stone-500 hover:text-stone-850"
                      }`}
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Selector */}
            <div>
              <h4 className="text-[10px] font-mono tracking-widest text-stone-500 uppercase mb-3">
                Order Quantity
              </h4>
              <div className="flex items-center gap-1.5 bg-stone-50 border border-stone-200 p-1 rounded-xl w-[140px]">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="h-8 w-8 rounded-lg flex items-center justify-center text-stone-500 hover:bg-stone-200 hover:text-stone-800 transition-colors cursor-pointer"
                >
                  -
                </button>
                <span className="flex-1 text-center font-bold text-xs text-stone-805">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="h-8 w-8 rounded-lg flex items-center justify-center text-stone-500 hover:bg-stone-200 hover:text-stone-800 transition-colors cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            {/* Product description outline summary */}
            <div className="border-t border-stone-150 pt-6 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-500">Apparel Base</span>
                <span className="font-semibold text-stone-705">${baseProduct.price.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-500">Customization Surcharge</span>
                <span className="font-semibold text-stone-705">+$15.00</span>
              </div>
              <div className="flex items-center justify-between text-sm border-t border-dashed border-stone-200 pt-3">
                <span className="font-bold text-stone-705">Total Edition Cost</span>
                <div className="text-right">
                  <span className="font-bold text-stone-950 text-base">${(customPrice * quantity).toFixed(2)}</span>
                  {quantity > 1 && (
                    <span className="text-[10px] text-stone-500 block font-mono">(${customPrice.toFixed(2)} each)</span>
                  )}
                </div>
              </div>
            </div>

          </div>

          {/* Checkout add-to-cart strip */}
          <div className="border-t border-stone-200 p-4 bg-white flex flex-col gap-3">
            <button
              onClick={handleAddToCart}
              className="w-full py-4 rounded-full bg-stone-950 hover:bg-stone-850 text-white font-bold text-xs tracking-wider uppercase transition-colors inline-flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-stone-900/10"
            >
              <ShoppingBag className="h-4 w-4" />
              Add Design to Cart
            </button>
          </div>
          </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
