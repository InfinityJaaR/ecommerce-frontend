"use client";

import Link from "next/link";
import { useActionState } from "react";
import { loginAction, registerAction, type ActionState } from "@/app/actions/auth";

const initialState: ActionState = {};

export function AuthForm({ mode, nextPath }: { mode: "login" | "register"; nextPath?: string }) {
  const isRegister = mode === "register";
  const action = isRegister ? registerAction : loginAction;
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="auth-form">
      {!isRegister && nextPath && <input type="hidden" name="next" value={nextPath} />}
      {isRegister && <label>Nombre completo<input name="name" type="text" autoComplete="name" required minLength={2} maxLength={255} placeholder="Tu nombre" /></label>}
      <label>Correo electrónico<input name="email" type="email" autoComplete="email" required placeholder="hola@ejemplo.com" /></label>
      <label>Contraseña<input name="password" type="password" autoComplete={isRegister ? "new-password" : "current-password"} required minLength={8} placeholder="Mínimo 8 caracteres" /></label>
      {isRegister && <label>Repite tu contraseña<input name="password_confirmation" type="password" autoComplete="new-password" required minLength={8} placeholder="Confirma tu contraseña" /></label>}
      {state.error && <p className="form-message form-error" role="alert">{state.error}</p>}
      <button className="button button-dark button-wide" type="submit" disabled={pending}>{pending ? "Un momento…" : isRegister ? "Crear mi cuenta" : "Iniciar sesión"}<span aria-hidden="true">↗</span></button>
      <p className="auth-switch">{isRegister ? "¿Ya tienes una cuenta?" : "¿Todavía no tienes cuenta?"} <Link href={isRegister ? "/login" : "/register"}>{isRegister ? "Entra aquí" : "Regístrate"}</Link></p>
    </form>
  );
}
