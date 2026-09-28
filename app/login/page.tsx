import type { Metadata } from "next";
import Link from "next/link";
import { AuthForm } from "@/components/auth-form";

export const metadata: Metadata = { title: "Iniciar sesión" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const params = await searchParams;
  return <div className="auth-page page-shell"><aside className="auth-story"><span className="eyebrow">Bienvenido de nuevo</span><p>Los objetos que elegiste <em>te están esperando.</em></p><span className="auth-story-index">FORMA / CUENTA 01</span></aside><section className="auth-panel"><span className="eyebrow">Tu espacio · 01</span><h1>Hola <em>otra vez.</em></h1><p className="muted">Entra a tu cuenta para revisar tus pedidos y seguir descubriendo.</p><AuthForm mode="login" nextPath={params.next} /><Link className="back-link" href="/">← Volver a la tienda</Link></section></div>;
}
