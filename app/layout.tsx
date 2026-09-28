import type { Metadata } from "next";
import Link from "next/link";
import { CartProvider } from "@/components/cart-provider";
import { StoreHeader } from "@/components/store-header";
import { VitalsReporter } from "@/components/vitals-reporter";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "forma. — Objetos para todos los días", template: "%s · forma." },
  description: "Objetos funcionales, diseño consciente y piezas para hacer más bonito lo cotidiano.",
  applicationName: "forma.",
  openGraph: { title: "forma. — Objetos para todos los días", description: "Diseño consciente para lo cotidiano.", type: "website" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>
        <CartProvider>
          <VitalsReporter />
          <div className="announcement"><span>Diseñado para durar.</span><span>Envío gratis en pedidos superiores a $75</span><span>Objetos de uso diario, hechos con intención.</span></div>
          <StoreHeader />
          <main>{children}</main>
          <footer className="site-footer">
            <div className="page-shell footer-top"><Link href="/" className="brand footer-brand"><span className="brand-mark">f.</span><span>forma<span className="brand-dot">.</span></span></Link><p>Menos, pero mejor.<br />Objetos para la vida real.</p><nav aria-label="Enlaces de pie"><Link href="/#catalogo">Colección</Link><Link href="/orders">Pedidos</Link><Link href="/login">Tu cuenta</Link></nav></div>
            <div className="page-shell footer-bottom"><span>© {new Date().getFullYear()} forma. Studio</span><span>Hecho con intención · Diseñado para durar</span></div>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
