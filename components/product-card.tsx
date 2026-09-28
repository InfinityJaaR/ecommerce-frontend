import Link from "next/link";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";
import { ProductArt } from "@/components/product-art";
import { AddToCartButton } from "@/components/add-to-cart-button";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  return (
    <article className="product-card" style={{ "--card-index": index } as React.CSSProperties}>
      <Link href={`/products/${product.id}`} className="product-card-art-link" aria-label={`Ver ${product.name}`}>
        <ProductArt product={product} />
        <span className="product-number">Nº {String(product.id).padStart(2, "0")}</span>
      </Link>
      <div className="product-card-info">
        <div><p className="product-category">Objeto cotidiano · Serie 01</p><Link href={`/products/${product.id}`} className="product-name">{product.name}</Link></div>
        <span className="product-price">{formatPrice(product.price)}</span>
      </div>
      <div className="product-card-footer">
        <span className="stock-note">{product.stock > 0 ? `${product.stock} disponibles` : "Agotado"}</span>
        <AddToCartButton product={product} compact />
      </div>
    </article>
  );
}
