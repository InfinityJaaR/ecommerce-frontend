import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { CheckoutForm } from "@/components/checkout-form";
import { SESSION_COOKIE } from "@/lib/session";

export const metadata: Metadata = { title: "Checkout seguro" };

export default async function CheckoutPage() {
  if (!(await cookies()).has(SESSION_COOKIE)) redirect("/login?next=/checkout");
  return <div className="page-shell checkout-page"><div className="breadcrumbs"><Link href="/">Inicio</Link><span>/</span><Link href="/cart">Tu bolsa</Link><span>/</span><span>Checkout</span></div><div className="section-heading checkout-heading"><div><span className="eyebrow">Compra segura · 03</span><h1>Un buen comienzo<span>.</span></h1></div><span className="checkout-lock">⌑ Conexión segura</span></div><CheckoutForm /></div>;
}
