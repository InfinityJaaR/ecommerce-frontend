"use client";

export default function CheckoutError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <section className="page-shell error-page"><span className="eyebrow">Checkout · Error</span><h1>No pudimos preparar<br /><em>tu pago.</em></h1><p>Tu bolsa sigue guardada. Inténtalo de nuevo en unos segundos.</p><button className="button button-dark" onClick={reset}>Intentar de nuevo <span>↻</span></button></section>;
}
