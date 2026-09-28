"use client";

import { useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { refreshOrder } from "@/app/actions/order";
import { useCart } from "@/components/cart-provider";

export function OrderStatusRefresh({ orderId, status }: { orderId: number; status: string }) {
  const router = useRouter();
  const { clear } = useCart();
  const [, startTransition] = useTransition();

  useEffect(() => {
    if (status === "paid") {
      clear();
      startTransition(async () => { await refreshOrder(orderId).catch(() => null); });
      return;
    }
    if (status !== "processing") return;
    let attempts = 0;
    const timer = window.setInterval(async () => {
      attempts += 1;
      startTransition(async () => {
        await refreshOrder(orderId).catch(() => null);
        router.refresh();
      });
      if (attempts >= 12) window.clearInterval(timer);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [clear, orderId, router, status]);

  return status === "processing" ? <p className="status-refresh">Estamos confirmando el pago con Stripe. Esta página se actualizará automáticamente.</p> : null;
}
