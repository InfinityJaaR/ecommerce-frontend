import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { OrderStatusRefresh } from "@/components/order-status-refresh";
import { getOrder } from "@/lib/data";
import { formatDate, formatPrice, orderStatusLabel } from "@/lib/format";
import { SESSION_COOKIE } from "@/lib/session";

export const metadata: Metadata = { title: "Confirmación de compra" };

export default async function ConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
  if (!(await cookies()).has(SESSION_COOKIE)) redirect("/login");
  const { id } = await params;
  if (!/^\d+$/.test(id)) notFound();
  const order = await getOrder(id);
  if (!order) redirect("/login");
  const paid = order.status === "paid";
  return <div className="page-shell confirmation-page"><div className={`confirmation-mark ${paid ? "is-paid" : ""}`}>{paid ? "✓" : "…"}</div><span className="eyebrow">Pedido Nº {String(order.id).padStart(5, "0")} · {orderStatusLabel(order.status)}</span><h1>{paid ? <>Gracias por elegir<br /><em>con intención.</em></> : order.status === "failed" ? <>El pago no pudo<br /><em>completarse.</em></> : <>Tu pago está<br /><em>en revisión.</em></>}</h1><p className="confirmation-copy">{paid ? "Tu compra está confirmada. En breve recibirás todos los detalles." : order.status === "failed" ? "Puedes volver a tu pedido para intentarlo de nuevo o revisar tu historial." : order.status === "pending" ? "Tu pedido está guardado. Completa el pago para que podamos confirmarlo." : "Recibimos la confirmación del pago. Estamos verificando los últimos detalles de tu compra."}</p><OrderStatusRefresh orderId={order.id} status={order.status} /><div className="confirmation-card"><div className="confirmation-card-head"><span>Resumen de compra</span><span>{formatDate(order.created_at)}</span></div>{order.items.map((item) => <div className="confirmation-item" key={item.id}><span>{item.product?.name ?? `Producto #${item.product_id}`} <small>× {item.quantity}</small></span><strong>{formatPrice(item.subtotal)}</strong></div>)}<div className="summary-total"><span>Total</span><strong>{formatPrice(order.total)}</strong></div></div><div className="confirmation-actions"><Link className="button button-dark" href="/orders">Ver mis pedidos <span>↗</span></Link><Link className="text-link" href="/">Volver a la tienda</Link></div></div>;
}
