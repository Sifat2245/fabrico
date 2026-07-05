"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  type ReactNode,
} from "react";
import type { Product } from "@/types";

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { productId: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "TOGGLE_SIDEBAR" }
  | { type: "OPEN_SIDEBAR" }
  | { type: "CLOSE_SIDEBAR" }
  | { type: "HYDRATE"; payload: CartItem[] };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingIndex = state.items.findIndex(
        (item) =>
          item.product.id === action.payload.product.id &&
          item.selectedColor === action.payload.selectedColor &&
          item.selectedSize === action.payload.selectedSize
      );

      if (existingIndex >= 0) {
        const updated = [...state.items];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + action.payload.quantity,
        };
        return { ...state, items: updated, isOpen: true };
      }

      return {
        ...state,
        items: [...state.items, action.payload],
        isOpen: true,
      };
    }
    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((item) => item.product.id !== action.payload),
      };
    case "UPDATE_QUANTITY":
      return {
        ...state,
        items: state.items.map((item) =>
          item.product.id === action.payload.productId
            ? { ...item, quantity: Math.max(0, action.payload.quantity) }
            : item
        ).filter((item) => item.quantity > 0),
      };
    case "CLEAR_CART":
      return { ...state, items: [] };
    case "TOGGLE_SIDEBAR":
      return { ...state, isOpen: !state.isOpen };
    case "OPEN_SIDEBAR":
      return { ...state, isOpen: true };
    case "CLOSE_SIDEBAR":
      return { ...state, isOpen: false };
    case "HYDRATE":
      return { ...state, items: action.payload };
    default:
      return state;
  }
}

interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  totalItems: number;
  subtotal: number;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleSidebar: () => void;
  openSidebar: () => void;
  closeSidebar: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "fabrico-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    isOpen: false,
  });

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as CartItem[];
        dispatch({ type: "HYDRATE", payload: parsed });
      }
    } catch {
      // Ignore parse errors
    }
  }, []);

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    } catch {
      // Ignore storage errors
    }
  }, [state.items]);

  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = state.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const value: CartContextValue = {
    items: state.items,
    isOpen: state.isOpen,
    totalItems,
    subtotal,
    addItem: (item) => dispatch({ type: "ADD_ITEM", payload: item }),
    removeItem: (id) => dispatch({ type: "REMOVE_ITEM", payload: id }),
    updateQuantity: (id, qty) =>
      dispatch({ type: "UPDATE_QUANTITY", payload: { productId: id, quantity: qty } }),
    clearCart: () => dispatch({ type: "CLEAR_CART" }),
    toggleSidebar: () => dispatch({ type: "TOGGLE_SIDEBAR" }),
    openSidebar: () => dispatch({ type: "OPEN_SIDEBAR" }),
    closeSidebar: () => dispatch({ type: "CLOSE_SIDEBAR" }),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
