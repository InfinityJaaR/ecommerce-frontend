import "server-only";

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly fields?: Record<string, string[]>,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type ApiOptions = RequestInit & { token?: string; tags?: string[] };

export async function apiFetch<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const baseUrl = process.env.API_BASE_URL;
  if (!baseUrl) throw new Error("Falta configurar API_BASE_URL en el entorno del servidor.");

  const { token, tags, headers: incomingHeaders, ...requestOptions } = options;
  const headers = new Headers(incomingHeaders);
  headers.set("Accept", "application/json");
  if (requestOptions.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(`${baseUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`, {
    ...requestOptions,
    headers,
    ...(tags ? { next: { tags } } : {}),
  });

  if (!response.ok) {
    let body: { message?: string; errors?: Record<string, string[]> } = {};
    try {
      body = await response.json();
    } catch {
      // Some upstream failures have no JSON response body.
    }
    throw new ApiError(body.message ?? `La API respondió con estado ${response.status}.`, response.status, body.errors);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export function getApiErrorMessage(error: unknown, fallback = "No se pudo completar la solicitud.") {
  if (error instanceof ApiError) {
    if (error.status === 401) return "Tu sesión venció. Inicia sesión de nuevo.";
    if (error.status === 403) return "No tienes permiso para consultar este recurso.";
    if (error.status === 404) return "No encontramos el recurso solicitado.";
    return error.message;
  }
  return fallback;
}
