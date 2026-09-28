"use client";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <section className="page-shell error-page"><span className="eyebrow">Algo no salió como esperábamos</span><h1>No pudimos cargar<br /><em>esta página.</em></h1><p>Puede que la tienda no esté disponible por el momento. Inténtalo de nuevo.</p><button className="button button-dark" onClick={reset}>Volver a intentar <span>↻</span></button></section>;
}
