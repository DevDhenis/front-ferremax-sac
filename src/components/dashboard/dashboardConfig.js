// Chart colors reference the palette tokens (never hardcoded hex) so the
// dashboard stays on the "Quiet" palette even inside recharts SVG.
export const CHART = {
  primary: "var(--color-primary)",
  primaryFg: "var(--color-primary-foreground)",
  success: "var(--color-success)",
  warning: "var(--color-warning)",
  destructive: "var(--color-destructive)",
  muted: "var(--color-muted-foreground)",
  accent: "var(--color-accent-foreground)",
  border: "var(--color-border)",
};

// Ordered, on-palette series for multi-category charts.
export const CATEGORY_SERIES = [
  CHART.primary,
  CHART.success,
  CHART.warning,
  CHART.destructive,
  CHART.accent,
  CHART.muted,
];

// Spanish labels + palette tone for each sale status (internal EN -> UI ES).
export const SALE_STATUS = {
  pending_shipment: { label: "Por enviar", tone: "muted", color: CHART.muted },
  in_preparation: { label: "En preparación", tone: "warning", color: CHART.warning },
  in_transit: { label: "En tránsito", tone: "primary", color: CHART.accent },
  delivered: { label: "Entregado", tone: "success", color: CHART.success },
  cancelled: { label: "Cancelado", tone: "danger", color: CHART.destructive },
};

export const MOVEMENT_LABEL = {
  inbound: "Entradas",
  outbound: "Salidas",
  adjustment: "Ajustes",
};

const currency = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const compactNumber = new Intl.NumberFormat("es-PE", { maximumFractionDigits: 0 });

export const formatCurrency = (value) => currency.format(Number(value) || 0);

export const formatNumber = (value) => compactNumber.format(Number(value) || 0);

export const formatDate = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("es-PE", { timeZone: "America/Lima", day: "2-digit", month: "short" });
};

// Short weekday+day for the revenue trend axis.
export const formatTrendDate = (iso) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("es-PE", { timeZone: "America/Lima", day: "2-digit", month: "2-digit" });
};
