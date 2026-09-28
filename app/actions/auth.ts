"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { apiFetch, ApiError } from "@/lib/api";
import { SESSION_COOKIE } from "@/lib/session";
import type { AuthResponse } from "@/lib/types";

export type ActionState = { error?: string; success?: string };

const loginSchema = z.object({
  email: z.string().trim().email("Introduce un correo válido."),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres.").max(255),
});

const registerSchema = loginSchema.extend({
  name: z.string().trim().min(2, "Introduce tu nombre.").max(255),
  password_confirmation: z.string().min(8),
}).refine((value) => value.password === value.password_confirmation, {
  path: ["password_confirmation"],
  message: "Las contraseñas no coinciden.",
});

async function saveSession(session: AuthResponse) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, session.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: Math.max(60, session.expires_in),
  });
}

function friendlyError(error: unknown) {
  if (error instanceof ApiError) {
    if (error.status === 401) return "El correo o la contraseña no son correctos.";
    if (error.status === 422) return Object.values(error.fields ?? {}).flat()[0] ?? error.message;
    if (error.status === 429) return "Demasiados intentos. Espera un momento e inténtalo de nuevo.";
  }
  return "No se pudo conectar con la tienda. Inténtalo de nuevo.";
}

export async function loginAction(_state: ActionState, formData: FormData): Promise<ActionState> {
  const input = loginSchema.safeParse(Object.fromEntries(formData));
  if (!input.success) return { error: input.error.issues[0]?.message ?? "Revisa los datos." };
  try {
    const session = await apiFetch<AuthResponse>("auth/login", {
      method: "POST",
      body: JSON.stringify(input.data),
      cache: "no-store",
    });
    await saveSession(session);
  } catch (error) {
    return { error: friendlyError(error) };
  }
  const requestedPath = String(formData.get("next") ?? "");
  const nextPath = requestedPath.startsWith("/") && !requestedPath.startsWith("//") && !requestedPath.includes("\\")
    ? requestedPath
    : "/orders";
  redirect(nextPath);
}

export async function registerAction(_state: ActionState, formData: FormData): Promise<ActionState> {
  const input = registerSchema.safeParse(Object.fromEntries(formData));
  if (!input.success) return { error: input.error.issues[0]?.message ?? "Revisa los datos." };
  try {
    const session = await apiFetch<AuthResponse>("auth/register", {
      method: "POST",
      body: JSON.stringify(input.data),
      cache: "no-store",
    });
    await saveSession(session);
  } catch (error) {
    return { error: friendlyError(error) };
  }
  redirect("/orders");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token) {
    try {
      await apiFetch("auth/logout", { method: "POST", token, cache: "no-store" });
    } catch {
      // Clear the browser session even if the upstream token is already expired.
    }
  }
  cookieStore.delete(SESSION_COOKIE);
  redirect("/");
}
