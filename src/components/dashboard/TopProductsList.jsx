import { formatCurrency, formatNumber } from "./dashboardConfig";

export default function TopProductsList({ data }) {
  const rows = data ?? [];

  if (!rows.length) {
    return (
      <p className="text-xs text-muted-foreground text-center py-10 m-0">
        Aún no hay productos vendidos en este periodo.
      </p>
    );
  }

  const max = Math.max(...rows.map((r) => Number(r.quantity) || 0), 1);

  return (
    <ul className="space-y-3 m-0 p-0 list-none">
      {rows.map((r, i) => (
        <li key={r.product} className="flex items-center gap-3">
          <span className="font-spec text-xs font-bold text-muted-foreground w-5 shrink-0 text-right">
            {i + 1}
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-sm text-foreground truncate">{r.product}</span>
              <span className="font-spec text-xs text-muted-foreground shrink-0">
                {formatCurrency(r.revenue)}
              </span>
            </div>
            <div className="mt-1.5 h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${(Number(r.quantity) / max) * 100}%` }}
              />
            </div>
          </div>
          <span className="font-spec text-sm font-bold text-foreground shrink-0 w-10 text-right">
            {formatNumber(r.quantity)}
          </span>
        </li>
      ))}
    </ul>
  );
}
