// Builds an on-demand, printable traceability document (HTML that looks like a PDF)
// from the report endpoint data and opens it in a new tab. Nothing is stored: the
// user saves it as PDF via the browser's print dialog.

const C = {
  bg: "#F7F6F3",
  card: "#FCFBF8",
  fg: "#22201C",
  muted: "#6A665E",
  border: "#E8E5DF",
  primary: "#2B2620",
  primaryFg: "#FAF9F6",
  secondary: "#EFEDE8",
  success: "#4C8368",
  warning: "#A97F42",
  destructive: "#BE5449",
};

const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );

const fmtDateTime = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("es-PE", {
    timeZone: "America/Lima",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const fmtDate = (d) => {
  if (!d) return "—";
  // d is a yyyy-mm-dd string from the date input.
  const [y, m, day] = d.split("-");
  return day && m && y ? `${day}/${m}/${y}` : d;
};

const num = (n) => {
  const v = Number(n) || 0;
  return Number.isInteger(v) ? String(v) : v.toFixed(2).replace(/\.?0+$/, "");
};

// Label + direction for a movement (origin wins over direction).
const movementLabel = (m) => {
  if (m.origin === "sale") return "Venta";
  if (m.origin === "sale_cancellation") return "Cancelación";
  if (m.origin === "customer_return") return "Devolución";
  return { inbound: "Entrada", outbound: "Salida", adjustment: "Ajuste" }[m.movement_type] ?? m.movement_type;
};

const signedQty = (m) => {
  const q = num(m.quantity);
  if (m.movement_type === "inbound") return { text: `+${q}`, color: C.success };
  if (m.movement_type === "outbound") return { text: `−${q}`, color: C.destructive };
  return { text: `±${q}`, color: C.warning };
};

const styles = `
  * { box-sizing: border-box; }
  body { margin: 0; background: ${C.bg}; color: ${C.fg};
    font-family: "Poppins", system-ui, "Segoe UI", Roboto, sans-serif; font-size: 12px; }
  .mono { font-family: "JetBrains Mono", ui-monospace, "Cascadia Code", Consolas, monospace; }
  .toolbar { position: sticky; top: 0; background: ${C.primary}; padding: 12px 24px; display: flex;
    justify-content: space-between; align-items: center; }
  .toolbar span { color: ${C.primaryFg}; font-weight: 600; font-size: 13px; }
  .toolbar button { background: ${C.primaryFg}; color: ${C.primary}; border: 0; border-radius: 8px;
    padding: 8px 16px; font-weight: 600; cursor: pointer; font-size: 13px; }
  .doc { max-width: 960px; margin: 0 auto; padding: 28px 32px 60px; }
  header.rep { border-bottom: 3px solid ${C.primary}; padding-bottom: 16px; margin-bottom: 20px;
    display: flex; justify-content: space-between; align-items: flex-end; }
  header.rep .eyebrow { font-size: 10px; letter-spacing: .16em; text-transform: uppercase; color: ${C.muted}; }
  header.rep h1 { margin: 4px 0 0; font-size: 22px; }
  header.rep .company { text-align: right; font-size: 11px; color: ${C.muted}; }
  header.rep .company strong { color: ${C.fg}; font-size: 14px; display: block; }
  .meta { display: flex; gap: 24px; flex-wrap: wrap; font-size: 11px; color: ${C.muted}; margin-bottom: 22px; }
  .meta b { color: ${C.fg}; }
  .summary { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 26px; }
  .card { background: ${C.card}; border: 1px solid ${C.border}; border-radius: 10px; padding: 12px 14px; }
  .card .k { font-size: 10px; letter-spacing: .1em; text-transform: uppercase; color: ${C.muted}; }
  .card .v { font-size: 20px; font-weight: 800; margin-top: 4px; }
  .prod { margin-top: 22px; page-break-inside: avoid; }
  .prod-head { display: flex; justify-content: space-between; align-items: baseline; gap: 12px;
    background: ${C.secondary}; border-radius: 8px; padding: 8px 12px; }
  .prod-head .name { font-weight: 700; font-size: 13px; }
  .prod-head .code { color: ${C.muted}; font-size: 11px; }
  .prod-head .stock { font-size: 11px; color: ${C.muted}; }
  .prod-head .stock b { color: ${C.fg}; }
  table { width: 100%; border-collapse: collapse; margin-top: 8px; }
  th { text-align: left; font-size: 9px; letter-spacing: .1em; text-transform: uppercase; color: ${C.muted};
    border-bottom: 1px solid ${C.border}; padding: 6px 8px; }
  td { padding: 6px 8px; border-bottom: 1px solid ${C.border}; font-size: 11px; vertical-align: top; }
  td.r, th.r { text-align: right; }
  .badge { display: inline-block; padding: 1px 8px; border-radius: 999px; font-size: 10px; font-weight: 700; border: 1px solid; }
  footer.rep { margin-top: 34px; padding-top: 12px; border-top: 1px solid ${C.border};
    font-size: 10px; color: ${C.muted}; text-align: center; }
  @media print {
    .no-print { display: none !important; }
    body { background: #fff; }
    .doc { padding: 0; max-width: none; }
    .card { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  }
`;

const badgeStyle = (m) => {
  const label = movementLabel(m);
  const map = {
    Entrada: C.success,
    Devolución: C.success,
    Salida: C.destructive,
    Venta: C.destructive,
    Cancelación: C.success,
    Ajuste: C.warning,
  };
  const color = map[label] ?? C.muted;
  return `<span class="badge" style="color:${color};border-color:${color}33;background:${color}12">${esc(label)}</span>`;
};

const summaryCards = (data) => {
  const t = data.by_type ?? {};
  const o = data.by_origin ?? {};
  const cards = [
    { k: "Movimientos", v: data.total_movements ?? 0 },
    { k: "Entradas", v: t.inbound?.count ?? 0 },
    { k: "Salidas / Ventas", v: (t.outbound?.count ?? 0) },
    { k: "Devoluciones", v: o.customer_return ?? 0 },
  ];
  return `<section class="summary">${cards
    .map((c) => `<div class="card"><div class="k">${esc(c.k)}</div><div class="v mono">${esc(c.v)}</div></div>`)
    .join("")}</section>`;
};

const productBlock = (group) => {
  const p = group.product ?? {};
  const rows = (group.movements ?? [])
    .map((m) => {
      const sq = signedQty(m);
      return `<tr>
        <td class="mono">${esc(fmtDateTime(m.movement_date))}</td>
        <td>${badgeStyle(m)}</td>
        <td class="r mono" style="color:${sq.color};font-weight:700">${esc(sq.text)}</td>
        <td class="r mono" style="font-weight:700">${esc(num(m.stock_after))}</td>
        <td>${esc(m.employee ?? "—")}</td>
        <td>${esc(m.reason ?? "")}${m.sale_id ? ` <span class="mono" style="color:${C.muted}">(Venta #${esc(m.sale_id)})</span>` : ""}</td>
      </tr>`;
    })
    .join("");

  return `<div class="prod">
    <div class="prod-head">
      <div><span class="name">${esc(p.name ?? "")}</span> <span class="code mono">${esc(p.internal_code ?? "")}</span>
        ${p.category ? `<span class="code">· ${esc(p.category)}</span>` : ""}</div>
      <div class="stock">Stock actual <b class="mono">${esc(num(p.stock))} ${esc(p.unit ?? "")}</b> · mínimo <b class="mono">${esc(num(p.minimum_quantity))}</b></div>
    </div>
    <table>
      <thead><tr>
        <th>Fecha</th><th>Tipo</th><th class="r">Cant.</th><th class="r">Saldo</th><th>Responsable</th><th>Motivo</th>
      </tr></thead>
      <tbody>${rows || `<tr><td colspan="6" style="color:${C.muted}">Sin movimientos.</td></tr>`}</tbody>
    </table>
  </div>`;
};

export const buildTraceabilityReportHtml = (data) => {
  const range = data.range ?? {};
  const rangeText =
    range.from || range.to
      ? `${range.from ? fmtDate(range.from) : "inicio"} — ${range.to ? fmtDate(range.to) : "hoy"}`
      : "Todo el historial";
  const groups = (data.groups ?? []).map(productBlock).join("");

  return `<!doctype html><html lang="es"><head><meta charset="utf-8">
  <title>Reporte de trazabilidad de inventario — FERREMAX</title>
  <style>${styles}</style></head>
  <body>
    <div class="toolbar no-print">
      <span>Reporte de trazabilidad de inventario</span>
      <button onclick="window.print()">Imprimir / Guardar PDF</button>
    </div>
    <div class="doc">
      <header class="rep">
        <div>
          <div class="eyebrow">Reporte de inventario</div>
          <h1>Trazabilidad de movimientos</h1>
        </div>
        <div class="company"><strong>FERREMAX S.A.C.</strong>Sistema de Gestión</div>
      </header>
      <div class="meta">
        <span>Periodo: <b>${esc(rangeText)}</b></span>
        <span>Emitido: <b>${esc(fmtDateTime(data.generated_at))}</b></span>
        <span>Productos: <b>${esc((data.groups ?? []).length)}</b></span>
      </div>
      ${summaryCards(data)}
      ${groups || `<p style="color:${C.muted}">No hay movimientos para los filtros seleccionados.</p>`}
      <footer class="rep">Documento generado por el sistema FERREMAX S.A.C. · Los saldos reflejan el kardex de cada producto.</footer>
    </div>
  </body></html>`;
};

export const openTraceabilityReport = (data) => {
  const html = buildTraceabilityReportHtml(data);
  const win = window.open("", "_blank");
  if (!win) return false; // popup blocked
  win.document.open();
  win.document.write(html);
  win.document.close();
  return true;
};
