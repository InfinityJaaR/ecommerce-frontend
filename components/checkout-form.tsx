"use client";

import { useActionState, useMemo, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { startCheckout, type CheckoutState } from "@/app/actions/checkout";
import { useCart } from "@/components/cart-provider";
import { formatPrice } from "@/lib/format";

const initialState: CheckoutState = {};
const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = stripeKey ? loadStripe(stripeKey) : null;

function PaymentForm({ orderId }: { orderId: number }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!stripe || !elements) return;
    setPending(true);
    setError(null);
    const result = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: `${window.location.origin}/checkout/confirmation/${orderId}` },
      redirect: "if_required",
    });
    if (result.error) {
      setError(result.error.message ?? "No se pudo confirmar el pago. Revisa tus datos e inténtalo de nuevo.");
      setPending(false);
      return;
    }
    router.push(`/checkout/confirmation/${orderId}`);
  }

  return (
    <form onSubmit={submit} className="payment-form">
      <PaymentElement options={{ layout: "tabs" }} />
      {error && <p className="form-message form-error" role="alert">{error}</p>}
      <button className="button button-dark button-wide payment-submit" type="submit" disabled={!stripe || pending}>{pending ? "Procesando pago…" : "Pagar de forma segura"}<span>↗</span></button>
      <p className="secure-note">⌑ Pago cifrado y procesado de forma segura por Stripe.</p>
    </form>
  );
}

export function CheckoutForm() {
  const { items, total, hydrated } = useCart();
  const [state, formAction, pending] = useActionState(startCheckout, initialState);
  const itemsPayload = useMemo(() => JSON.stringify(items.map(({ product, quantity }) => ({ product_id: product.id, quantity }))), [items]);
  const paymentReady = Boolean(state.clientSecret);

  if (!hydrated) return <div className="checkout-skeleton" aria-label="Cargando carrito" />;
  if (!items.length && !state.clientSecret) return <div className="empty-state"><h2>Tu bolsa está vacía.</h2><p>Encuentra un objeto que te acompañe cada día.</p><Link className="button button-dark" href="/#catalogo">Explorar colección</Link></div>;

  return (
    <div className="checkout-layout">
      <section className="checkout-panel">
        <span className="eyebrow">01 / Pago</span><h2>Detalles de pago</h2>
        {!paymentReady && (
          <form action={formAction} className="payment-start-form">
            <input type="hidden" name="items" value={itemsPayload} />
            {state.error && <p className="form-message form-error" role="alert">{state.error}</p>}
            {!stripePromise && <p className="form-message form-error" role="alert">Configura NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY para habilitar el pago.</p>}
            <p className="muted">Confirma tu pedido para reservar el stock y continuar con el pago seguro.</p>
            <button className="button button-dark button-wide" type="submit" disabled={pending || !stripePromise}>{pending ? "Preparando tu pedido…" : "Continuar al pago"}<span>↗</span></button>
          </form>
        )}
        {paymentReady && state.clientSecret && stripePromise && state.orderId && (
          <Elements stripe={stripePromise} options={{ clientSecret: state.clientSecret, appearance: { theme: "stripe", variables: { colorPrimary: "#173e32", borderRadius: "8px", fontFamily: "DM Sans, sans-serif" } } }}>
            <PaymentForm orderId={state.orderId} />
          </Elements>
        )}
      </section>
      <aside className="order-summary">
        <span className="eyebrow">Resumen del pedido</span><h2>Tu selección</h2>
        <div className="summary-items">{items.map(({ product, quantity }) => <div className="summary-item" key={product.id}><div><strong>{product.name}</strong><span>Cantidad · {quantity}</span></div><strong>{formatPrice(Number(product.price) * quantity)}</strong></div>)}</div>
        <div className="summary-total"><span>Total</span><strong>{formatPrice(total)}</strong></div>
        <p className="summary-footnote">Envío calculado y confirmado por la tienda al preparar tu pedido.</p>
      </aside>
    </div>
  );
}
