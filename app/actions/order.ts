"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { getSessionToken } from "@/lib/session";
import { apiFetch } from "@/lib/api";
import type { Order } from "@/lib/types";

export async function refreshOrder(id: number): Promise<Order | null> {
  const token = await getSessionToken();
  if (!token) return null;
  const order = await apiFetch<Order>(`orders/${id}`, { method: "GET", token, cache: "no-store" });
  revalidatePath("/orders");
  if (order.status === "paid") revalidateTag("products", "max");
  return order;
}
