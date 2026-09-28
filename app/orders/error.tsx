"use client";

export default function OrdersError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <section className="page-shell error-page"><span className="eyebrow">Mis pedidos</span><h1>No pudimos cargar<br /><em>tu historial.</em></h1><p>Tu compra está segura. Prueba a cargar tus pedidos de nuevo.</p><button className="button button-dark" onClick={reset}>Volver a intentar <span>↻</span></button></section>;
}
