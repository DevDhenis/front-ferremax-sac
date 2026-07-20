// Return request status -> Spanish label + palette tone (StatusBadge).
export const RETURN_STATUS = {
  requested: { label: "Solicitada", tone: "warning" },
  approved: { label: "Aprobada", tone: "success" },
  rejected: { label: "Rechazada", tone: "danger" },
};

export const REFUND_STATUS = {
  pending: { label: "Reembolso pendiente", tone: "muted" },
  refunded: { label: "Reembolsado", tone: "success" },
};

export const RETURN_STATUS_FILTER = [
  { value: "all", label: "Todas" },
  { value: "requested", label: "Solicitadas" },
  { value: "approved", label: "Aprobadas" },
  { value: "rejected", label: "Rechazadas" },
];

export const formatDateTime = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("es-PE", {
    timeZone: "America/Lima",
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const currency = new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" });
export const formatCurrency = (v) => currency.format(Number(v) || 0);
