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
  purchase: { label: "Compra", tone: "success" },
  supplier_return: { label: "Dev. proveedor", tone: "danger" },
};

// Manually registrable types: NO "Entrada" — los ingresos de stock entran por Compras
// (o por Ajuste para correcciones/conteo). Así no choca con el módulo de Compras.
export const REGISTER_MOVEMENT_OPTIONS = [
  { value: "outbound", label: MOVEMENT_TYPE.outbound.label },
  { value: "adjustment", label: MOVEMENT_TYPE.adjustment.label },
];

// Filter the movements table by the SAME "kind" shown in the badges (origin-based),
// so filtro y etiquetas hablan el mismo idioma. Each maps to query params.
export const MOVEMENT_FILTERS = [
  { value: "all", label: "Todos los tipos", params: {} },
  { value: "purchase", label: "Compra", params: { origin: "purchase" } },
  { value: "sale", label: "Venta", params: { origin: "sale" } },
  { value: "customer_return", label: "Devolución de cliente", params: { origin: "customer_return" } },
  { value: "supplier_return", label: "Devolución a proveedor", params: { origin: "supplier_return" } },
  { value: "sale_cancellation", label: "Cancelación", params: { origin: "sale_cancellation" } },
  { value: "manual_outbound", label: "Salida", params: { origin: "manual", movement_type: "outbound" } },
  { value: "manual_adjustment", label: "Ajuste", params: { origin: "manual", movement_type: "adjustment" } },
];

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
