import { PackageCheck, TriangleAlert } from "lucide-react";
import { formatNumber } from "./dashboardConfig";

export default function LowStockList({ data }) {
  const rows = data ?? [];

  if (!rows.length) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-8">
        <span className="inline-flex size-11 items-center justify-center rounded-full bg-success-bg text-success mb-3">
          <PackageCheck className="size-5" />
        </span>
        <p className="text-sm font-semibold text-foreground m-0">Stock saludable</p>
        <p className="text-xs text-muted-foreground m-0 mt-1">
          Ningún producto está por debajo de su mínimo.
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-2.5 m-0 p-0 list-none">
      {rows.map((r) => (
        <li key={r.name} className="flex items-center gap-3">
          <span className="inline-flex size-8 items-center justify-center rounded-lg bg-warning-bg text-warning shrink-0">
            <TriangleAlert className="size-4" />
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-foreground truncate m-0">{r.name}</p>
            <p className="font-spec text-[11px] text-muted-foreground m-0">
              mínimo {formatNumber(r.minimum_quantity)} {r.unit}
            </p>
          </div>
          <span className="font-spec text-sm font-bold text-warning shrink-0">
            {formatNumber(r.stock)} {r.unit}
          </span>
        </li>
      ))}
    </ul>
  );
}
