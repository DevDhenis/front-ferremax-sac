import { formatCurrency, formatNumber } from "./dashboardConfig";

export default function PaymentsPanel({ data }) {
  const rows = data ?? [];
  const confirmed = rows.find((r) => r.status === "confirmed") ?? { count: 0, total: 0 };
  const failed = rows.find((r) => r.status === "failed") ?? { count: 0, total: 0 };
  const totalCount = Number(confirmed.count) + Number(failed.count);
  const successRate = totalCount > 0 ? (confirmed.count / totalCount) * 100 : 0;

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-end justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Tasa de aprobación
          </span>
          <span className="font-spec text-lg font-extrabold text-foreground">
            {successRate.toFixed(0)}%
          </span>
        </div>
        <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
          <div className="h-full rounded-full bg-success" style={{ width: `${successRate}%` }} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-success-bg p-3">
          <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-success">
            Confirmados
          </span>
          <p className="font-spec text-base font-bold text-foreground m-0 mt-1">
            {formatNumber(confirmed.count)}
          </p>
          <p className="font-spec text-xs text-muted-foreground m-0">{formatCurrency(confirmed.total)}</p>
        </div>
        <div className="rounded-lg bg-destructive-bg p-3">
          <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-destructive">
            Fallidos
          </span>
          <p className="font-spec text-base font-bold text-foreground m-0 mt-1">
            {formatNumber(failed.count)}
          </p>
          <p className="font-spec text-xs text-muted-foreground m-0">{formatCurrency(failed.total)}</p>
        </div>
      </div>
    </div>
  );
}
