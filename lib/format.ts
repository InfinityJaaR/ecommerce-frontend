export function formatPrice(value: number | string) {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "USD" }).format(Number(value));
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-ES", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

export function orderStatusLabel(status: string) {
  const labels: Record<string, string> = {
    pending: "Pendiente",
    processing: "Procesando pago",
    paid: "Pagado",
    failed: "Pago fallido",
    cancelled: "Cancelado",
  };
  return labels[status] ?? status;
}
