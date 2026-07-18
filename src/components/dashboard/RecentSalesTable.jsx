import StatusBadge from "@/components/common/StatusBadge";
import { SALE_STATUS, formatCurrency, formatDate } from "./dashboardConfig";

export default function RecentSalesTable({ data }) {
  const rows = data ?? [];

  if (!rows.length) {
    return (
      <p className="text-xs text-muted-foreground text-center py-10 m-0">
        No hay ventas registradas todavía.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto -mx-5 px-5">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="text-left border-b border-border/60">
            <th className="font-semibold text-[10px] uppercase tracking-[0.12em] text-muted-foreground pb-2 pr-3">
              #
            </th>
            <th className="font-semibold text-[10px] uppercase tracking-[0.12em] text-muted-foreground pb-2 pr-3">
              Cliente
            </th>
            <th className="font-semibold text-[10px] uppercase tracking-[0.12em] text-muted-foreground pb-2 pr-3">
              Fecha
            </th>
            <th className="font-semibold text-[10px] uppercase tracking-[0.12em] text-muted-foreground pb-2 pr-3 text-right">
              Total
            </th>
            <th className="font-semibold text-[10px] uppercase tracking-[0.12em] text-muted-foreground pb-2 text-right">
              Estado
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((s) => {
            const cfg = SALE_STATUS[s.status];
            return (
              <tr key={s.id} className="border-b border-border/40 last:border-0">
                <td className="font-spec text-xs text-muted-foreground py-2.5 pr-3">#{s.id}</td>
                <td className="text-foreground py-2.5 pr-3 max-w-[10rem] truncate">{s.customer}</td>
                <td className="font-spec text-xs text-muted-foreground py-2.5 pr-3 whitespace-nowrap">
                  {formatDate(s.sale_date)}
                </td>
                <td className="font-spec font-semibold text-foreground py-2.5 pr-3 text-right whitespace-nowrap">
                  {formatCurrency(s.total)}
                </td>
                <td className="py-2.5 text-right">
                  <StatusBadge tone={cfg?.tone ?? "muted"}>{cfg?.label ?? s.status}</StatusBadge>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
