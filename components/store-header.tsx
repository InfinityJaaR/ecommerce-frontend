"use client";

import Link from "next/link";
import { useCart } from "@/components/cart-provider";

export function StoreHeader() {
  const { count, hydrated } = useCart();
  return (
    <header className="site-header">
      <div className="header-inner page-shell">
        <Link href="/" className="brand" aria-label="Forma — inicio">
          <span className="brand-mark">f.</span><span>forma<span className="brand-dot">.</span></span>
        </Link>
        <nav className="main-nav" aria-label="Navegación principal">
          <Link href="/#catalogo">Colección</Link>
          <Link href="/orders">Mis pedidos</Link>
        </nav>
        <div className="header-actions">
          <Link className="header-login" href="/login">Entrar</Link>
          <Link className="cart-link" href="/cart" aria-label={`Carrito, ${count} productos`}>
            <span>Bolsa</span><span className="cart-count">{hydrated ? count : 0}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
