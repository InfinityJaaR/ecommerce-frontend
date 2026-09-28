import Link from "next/link";
import { getProducts } from "@/lib/data";
import { ProductCard } from "@/components/product-card";

export async function ProductGrid({ page = 1 }: { page?: number }) {
  const products = await getProducts(page);
  if (!products.data.length) {
    return <div className="empty-state"><span className="eyebrow">Próximamente</span><h2>Estamos preparando la colección.</h2><p>Vuelve pronto para descubrir nuevos objetos.</p></div>;
  }
  return (
    <>
      <div className="product-grid">{products.data.map((product, index) => <ProductCard key={product.id} product={product} index={index} />)}</div>
      {products.last_page > 1 && (
        <nav className="pagination" aria-label="Páginas del catálogo">
          {products.current_page > 1 && <Link href={`/?page=${products.current_page - 1}#catalogo`}>← Anterior</Link>}
          <span>Página {products.current_page} de {products.last_page}</span>
          {products.current_page < products.last_page && <Link href={`/?page=${products.current_page + 1}#catalogo`}>Siguiente →</Link>}
        </nav>
      )}
    </>
  );
}
