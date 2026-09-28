import type { Metadata } from "next";
import Link from "next/link";
import { AuthForm } from "@/components/auth-form";

export const metadata: Metadata = { title: "Crear cuenta" };

export default function RegisterPage() {
  return <div className="auth-page page-shell"><aside className="auth-story auth-story-register"><span className="eyebrow">Una forma nueva de ver</span><p>Empieza por las cosas que <em>sí importan.</em></p><span className="auth-story-index">FORMA / CUENTA 02</span></aside><section className="auth-panel"><span className="eyebrow">Tu espacio · 02</span><h1>Bienvenido<br /><em>a forma.</em></h1><p className="muted">Crea tu cuenta y guarda tus piezas favoritas.</p><AuthForm mode="register" /><Link className="back-link" href="/">← Volver a la tienda</Link></section></div>;
}
