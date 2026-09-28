import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { ProductArt } from "@/components/product-art";
import { getProduct } from "@/lib/data";
import { formatPrice } from "@/lib/format";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  try {
    const product = await getProduct(id);
    return { title: product.name, description: product.description ?? `${product.name} · Diseño funcional de forma.` };
  } catch {
    return { title: "Producto" };
  }
}

export default async function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^\d+$/.test(id)) notFound();
  const product = await getProduct(id);
  return (
    <div className="page-shell product-detail">
      <div className="breadcrumbs"><Link href="/">Inicio</Link><span>/</span><Link href="/#catalogo">Colección</Link><span>/</span><span>{product.name}</span></div>
      <div className="detail-layout"><div className="detail-art"><ProductArt product={product} /></div><section className="detail-copy"><span className="eyebrow">Objeto cotidiano · Serie 01</span><h1>{product.name}<em>.</em></h1><p className="detail-sku">Ref. {product.sku}</p><p className="detail-description">{product.description || "Diseñado con atención al detalle y fabricado para acompañar tu día a día durante mucho tiempo."}</p><div className="detail-price">{formatPrice(product.price)} <span>USD</span></div><div className="detail-stock"><span className={product.stock > 0 ? "stock-dot" : "stock-dot stock-dot-off"} />{product.stock > 0 ? `${product.stock} unidades disponibles` : "Agotado temporalmente"}</div><AddToCartButton product={product} /><div className="detail-assurances"><div><span>01</span><p>Diseño consciente<br />y funcional</p></div><div><span>02</span><p>Pago seguro<br />con Stripe</p></div><div><span>03</span><p>Hecho para<br />durar</p></div></div></section></div>
    </div>
  );
}
