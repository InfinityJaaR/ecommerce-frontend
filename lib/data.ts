import "server-only";

import { notFound, redirect } from "next/navigation";
import { apiFetch, ApiError } from "@/lib/api";
import { getSessionToken } from "@/lib/session";
import type { Order, Paginated, Product } from "@/lib/types";

export async function getProducts(page = 1) {
  const result = await apiFetch<Paginated<Product>>(`products?page=${page}`, {
    method: "GET",
    cache: "force-cache",
    next: { revalidate: 60, tags: ["products"] },
  });
  return { ...result, data: result.data.filter((product) => product.is_active) };
}

export async function getProduct(id: string): Promise<Product> {
  try {
    const product = await apiFetch<Product>(`products/${encodeURIComponent(id)}`, {
      method: "GET",
      cache: "force-cache",
      next: { revalidate: 60, tags: ["products", `product-${id}`] },
    });
    if (!product.is_active) notFound();
    return product;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }
}

export async function getOrders() {
  const token = await getSessionToken();
  if (!token) return null;
  try {
    return await apiFetch<Paginated<Order>>("orders", { method: "GET", token, cache: "no-store" });
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) redirect("/login?next=/orders");
    throw error;
  }
}

export async function getOrder(id: string) {
  const token = await getSessionToken();
  if (!token) return null;
  try {
    return await apiFetch<Order>(`orders/${encodeURIComponent(id)}`, { method: "GET", token, cache: "no-store" });
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) redirect("/login");
    if (error instanceof ApiError && (error.status === 403 || error.status === 404)) notFound();
    throw error;
  }
}
