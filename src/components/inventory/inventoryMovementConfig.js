import { ArrowDownToLine, ArrowUpFromLine, SlidersHorizontal } from "lucide-react";

// Manual movement types (registrable in the inventory module): direction + palette tone.
export const MOVEMENT_TYPE = {
  inbound: { label: "Entrada", tone: "success", direction: "in", icon: ArrowDownToLine },
  outbound: { label: "Salida", tone: "danger", direction: "out", icon: ArrowUpFromLine },
  adjustment: { label: "Ajuste", tone: "warning", direction: "adj", icon: SlidersHorizontal },
};

// Automatic origins (system-generated: no manual button). Their label wins over the
// direction label so the kardex reads "Venta"/"Cancelación"/"Devolución".
export const MOVEMENT_ORIGIN = {
  sale: { label: "Venta", tone: "danger" },
  sale_cancellation: { label: "Cancelación", tone: "success" },
  customer_return: { label: "Devolución", tone: "primary" },
};

// Only manual types can be registered by hand.
export const MOVEMENT_OPTIONS = Object.entries(MOVEMENT_TYPE).map(([value, cfg]) => ({
  value,
  label: cfg.label,
}));

// Badge (label + tone) for a movement: automatic origin wins, else manual direction.
export const movementBadge = (m) => {
  if (m?.origin && m.origin !== "manual" && MOVEMENT_ORIGIN[m.origin]) {
    return MOVEMENT_ORIGIN[m.origin];
  }
  return MOVEMENT_TYPE[m?.movement_type] ?? { label: m?.movement_type ?? "—", tone: "muted" };
};

// +/−/± direction comes from movement_type (inbound/outbound/adjustment).
export const movementDirection = (m) => MOVEMENT_TYPE[m?.movement_type]?.direction ?? "adj";

export const formatQty = (value) => {
  const n = Number(value) || 0;
  // Trim trailing zeros (stock is decimal but usually whole units).
  return Number.isInteger(n) ? String(n) : n.toFixed(3).replace(/\.?0+$/, "");
};

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
