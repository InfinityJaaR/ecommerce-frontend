import type { Metadata } from "next";
import { Suspense } from "react";
import { ProductGrid } from "@/components/product-grid";

export const metadata: Metadata = { title: "Objetos para todos los días" };

function CatalogSkeleton() {
  return <div className="product-grid" aria-label="Cargando productos">{Array.from({ length: 6 }, (_, index) => <div className="product-skeleton" key={index}><div /><span /><span /></div>)}</div>;
}

export default async function Home({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  return (
    <>
      <section className="hero page-shell">
        <div className="hero-copy"><span className="eyebrow"><span className="eyebrow-line" />Diseño para la vida real</span><h1>Lo cotidiano,<br /><em>con intención.</em></h1><p>Objetos honestos, hechos para durar y pensados para acompañarte todos los días.</p><a className="button button-dark" href="#catalogo">Explorar colección <span>↓</span></a></div>
        <div className="hero-art" aria-label="Composición editorial de objetos de diseño" role="img"><span className="hero-orbit" /><span className="hero-object hero-object-one" /><span className="hero-object hero-object-two" /><span className="hero-object hero-object-three" /><span className="hero-label hero-label-top">SERIE 01 / OBJETOS</span><span className="hero-label hero-label-bottom">F. STUDIO<br />EST. 2024</span><span className="hero-spark">✳</span></div>
        <div className="hero-aside"><span>01 — 04</span><span>Una colección pequeña,<br />una intención grande.</span><span className="vertical-label">FORMA STUDIO · 2026</span></div>
        <div className="hero-index">001<span>—</span>015</div>
      </section>
      <section className="ticker" aria-label="Valores de forma"><div className="ticker-track"><span>Diseño consciente</span><i>✳</i><span>Hecho para durar</span><i>✳</i><span>Menos, pero mejor</span><i>✳</i><span>Diseño consciente</span><i>✳</i><span>Hecho para durar</span><i>✳</i><span>Menos, pero mejor</span><i>✳</i></div></section>
      <section className="catalog-section page-shell" id="catalogo">
        <div className="section-heading"><div><span className="eyebrow">La colección / 01</span><h2>Piezas que <em>permanecen.</em></h2></div><p>Diseño funcional para hacer más simple y más bello cada día.</p></div>
        <Suspense fallback={<CatalogSkeleton />}><ProductGrid page={page} /></Suspense>
      </section>
      <section className="manifesto"><div className="page-shell manifesto-inner"><span className="eyebrow">Nuestra forma de pensar</span><p>Creemos que un buen objeto no pide atención. <em>Se gana un lugar.</em></p><a href="#catalogo" className="text-link">Conoce la colección <span>↗</span></a><span className="manifesto-stamp">FORM<br />A.</span></div></section>
    </>
  );
}
