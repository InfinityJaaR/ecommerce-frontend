"use client";

import Link from "next/link";
import { ProductArt } from "@/components/product-art";
import { useCart } from "@/components/cart-provider";
import { formatPrice } from "@/lib/format";

export default function CartPage() {
  const { items, total, hydrated, setQuantity, remove } = useCart();
  if (!hydrated) return <div className="page-shell route-loading"><div className="checkout-skeleton" /></div>;
  return <div className="page-shell cart-page"><div className="breadcrumbs"><Link href="/">Inicio</Link><span>/</span><span>Tu bolsa</span></div><div className="section-heading cart-heading"><div><span className="eyebrow">Tu selección · {items.length} referencias</span><h1>La bolsa<span>.</span></h1></div><Link className="text-link" href="/#catalogo">← Seguir explorando</Link></div>
    {!items.length ? <div className="empty-state cart-empty"><span className="empty-bag">○</span><h2>Tu bolsa está esperando.</h2><p>Empieza con una pieza que te acompañe todos los días.</p><Link className="button button-dark" href="/#catalogo">Explorar la colección <span>↗</span></Link></div> :
      <div className="cart-layout"><section className="cart-items">{items.map(({ product, quantity }) => <article className="cart-item" key={product.id}><Link href={`/products/${product.id}`} className="cart-art"><ProductArt product={product} compact /></Link><div className="cart-item-details"><span className="eyebrow">Serie 01 · {product.sku}</span><Link href={`/products/${product.id}`} className="cart-item-name">{product.name}</Link><span className="cart-unit-price">{formatPrice(product.price)}</span><span className="cart-availability">{product.stock > 0 ? "En stock" : "Consultar disponibilidad"}</span></div><div className="quantity-control"><button aria-label="Reducir cantidad" onClick={() => quantity === 1 ? remove(product.id) : setQuantity(product.id, quantity - 1)}>−</button><span>{quantity}</span><button aria-label="Aumentar cantidad" disabled={quantity >= product.stock} onClick={() => setQuantity(product.id, quantity + 1)}>+</button></div><strong className="cart-line-total">{formatPrice(Number(product.price) * quantity)}</strong><button className="remove-item" aria-label={`Quitar ${product.name}`} onClick={() => remove(product.id)}>×</button></article>)}</section><aside className="order-summary cart-summary"><span className="eyebrow">Resumen</span><h2>Tu pedido</h2><div className="summary-total"><span>Subtotal</span><strong>{formatPrice(total)}</strong></div><div className="summary-total summary-shipping"><span>Envío</span><span>Calculado al continuar</span></div><p className="summary-footnote">Impuestos y coste final confirmados por la tienda antes del pago.</p><Link className="button button-dark button-wide" href="/checkout">Continuar al checkout <span>↗</span></Link><p className="secure-note">⌑ Pago seguro con Stripe</p></aside></div>}
  </div>;
}
