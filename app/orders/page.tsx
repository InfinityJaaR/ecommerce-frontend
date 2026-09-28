import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { logoutAction } from "@/app/actions/auth";
import { getOrders } from "@/lib/data";
import { formatDate, formatPrice, orderStatusLabel } from "@/lib/format";
import { SESSION_COOKIE } from "@/lib/session";

export const metadata: Metadata = { title: "Mis pedidos" };

function OrdersSkeleton() {
  return <div className="orders-skeleton" aria-label="Cargando pedidos">{Array.from({ length: 3 }, (_, index) => <div className="order-skeleton" key={index} />)}</div>;
}

async function OrdersList() {
  const orders = await getOrders();
  if (!orders || !orders.data.length) return <div className="empty-state orders-empty"><span className="empty-bag">○</span><h2>Tu historia empieza aquí.</h2><p>Cuando hagas tu primer pedido, lo encontrarás en este espacio.</p><Link className="button button-dark" href="/#catalogo">Descubrir la colección <span>↗</span></Link></div>;
  return <div className="orders-list">{orders.data.map((order) => <Link className="order-card" href={`/checkout/confirmation/${order.id}`} key={order.id}><div><span className="eyebrow">Pedido Nº {String(order.id).padStart(5, "0")}</span><p>{formatDate(order.created_at)}</p></div><div className="order-card-items">{order.items?.length ?? 0} {order.items?.length === 1 ? "pieza" : "piezas"}</div><span className={`order-status status-${order.status}`}>{orderStatusLabel(order.status)}</span><strong>{formatPrice(order.total)}</strong><span className="order-arrow">↗</span></Link>)}</div>;
}

export default async function OrdersPage() {
  if (!(await cookies()).has(SESSION_COOKIE)) redirect("/login");
  return <div className="page-shell orders-page"><div className="section-heading"><div><span className="eyebrow">Tu espacio · 03</span><h1>Mis pedidos<span>.</span></h1><p>Un registro de las cosas que elegiste para acompañarte.</p></div><form action={logoutAction}><button className="text-button" type="submit">Cerrar sesión ↗</button></form></div><Suspense fallback={<OrdersSkeleton />}><OrdersList /></Suspense></div>;
}
