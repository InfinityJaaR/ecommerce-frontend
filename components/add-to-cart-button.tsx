"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";
import { useCart } from "@/components/cart-provider";

export function AddToCartButton({ product, compact = false }: { product: Product; compact?: boolean }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const unavailable = product.stock < 1;

  function addItem() {
    add(product);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1500);
  }

  return (
    <button type="button" className={`button ${compact ? "button-icon" : "button-primary"}`} onClick={addItem} disabled={unavailable}>
      {unavailable ? "Agotado" : added ? "Añadido ✓" : compact ? "+ Añadir" : "Añadir a la bolsa"}
    </button>
  );
}
