import type { Product } from "@/lib/types";

const palettes = ["art-clay", "art-cobalt", "art-lime", "art-peach", "art-ink"];

export function ProductArt({ product, compact = false }: { product: Product; compact?: boolean }) {
  const palette = palettes[product.id % palettes.length];
  return (
    <div className={`product-art ${palette}${compact ? " product-art-compact" : ""}`} aria-label={`Ilustración de ${product.name}`} role="img">
      <span className="art-index">OBJ / {String(product.id).padStart(2, "0")}</span>
      <span className="art-orbit art-orbit-one" />
      <span className="art-orbit art-orbit-two" />
      <span className="art-shape" />
      <span className="art-caption">FORMA<br />STUDIO</span>
    </div>
  );
}
