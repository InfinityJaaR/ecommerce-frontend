"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { apiFetch, getApiErrorMessage } from "@/lib/api";
import { getSessionToken } from "@/lib/session";
import type { Order } from "@/lib/types";

const cartSchema = z.array(z.object({ product_id: z.number().int().positive(), quantity: z.number().int().min(1).max(99) })).min(1);

export type CheckoutState = { error?: string; clientSecret?: string; orderId?: number };

export async function startCheckout(_state: CheckoutState, formData: FormData): Promise<CheckoutState> {
  const token = await getSessionToken();
  if (!token) return { error: "Inicia sesión para continuar con tu compra." };

  let parsedItems: unknown;
  try {
    parsedItems = JSON.parse(String(formData.get("items") ?? ""));
  } catch {
    return { error: "El carrito no tiene un formato válido." };
  }
  const validated = cartSchema.safeParse(parsedItems);
  if (!validated.success) return { error: "Añade al menos un producto disponible al carrito." };

  try {
    const order = await apiFetch<Order>("orders", {
      method: "POST",
      body: JSON.stringify({ items: validated.data }),
      token,
      cache: "no-store",
    });
    const payment = await apiFetch<{ client_secret: string }>(`orders/${order.id}/checkout`, {
      method: "POST",
      token,
      cache: "no-store",
    });
    revalidatePath("/orders");
    return { clientSecret: payment.client_secret, orderId: order.id };
  } catch (error) {
    return { error: getApiErrorMessage(error, "No se pudo iniciar el pago. Revisa tu conexión e inténtalo de nuevo.") };
  }
}
