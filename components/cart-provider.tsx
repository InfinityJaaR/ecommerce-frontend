"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { Product } from "@/lib/types";

export type CartItem = { product: Product; quantity: number };
type CartContextValue = {
  items: CartItem[];
  hydrated: boolean;
  count: number;
  total: number;
  add: (product: Product) => void;
  setQuantity: (productId: number, quantity: number) => void;
  remove: (productId: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "forma-cart-v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let restoredItems: CartItem[] = [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as CartItem[];
        if (Array.isArray(parsed)) restoredItems = parsed
          .filter((item) => item.product?.id && item.quantity > 0 && item.product.stock > 0)
          .map((item) => ({ ...item, quantity: Math.min(item.quantity, item.product.stock, 99) }));
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
    const timer = window.setTimeout(() => {
      setItems((currentItems) => {
        const merged = new Map(restoredItems.map((item) => [item.product.id, item]));
        for (const item of currentItems) {
          const storedItem = merged.get(item.product.id);
          merged.set(item.product.id, storedItem
            ? { ...storedItem, product: item.product, quantity: Math.min(storedItem.quantity + item.quantity, item.product.stock, 99) }
            : item);
        }
        return [...merged.values()];
      });
      setHydrated(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [hydrated, items]);

  const add = useCallback((product: Product) => {
    setItems((current) => {
      const existing = current.find((item) => item.product.id === product.id);
      if (existing) return current.map((item) => item.product.id === product.id
        ? { ...item, product, quantity: Math.min(item.quantity + 1, product.stock, 99) }
        : item);
      return [...current, { product, quantity: 1 }];
    });
  }, []);
  const setQuantity = useCallback((productId: number, quantity: number) => {
    setItems((current) => current.map((item) => item.product.id === productId
      ? { ...item, quantity: Math.max(1, Math.min(quantity, item.product.stock, 99)) }
      : item));
  }, []);
  const remove = useCallback((productId: number) => setItems((current) => current.filter((item) => item.product.id !== productId)), []);
  const clear = useCallback(() => setItems([]), []);

  const value = useMemo(() => ({
    items,
    hydrated,
    count: items.reduce((sum, item) => sum + item.quantity, 0),
    total: items.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0),
    add,
    setQuantity,
    remove,
    clear,
  }), [items, hydrated, add, setQuantity, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart debe usarse dentro de CartProvider.");
  return context;
}
