import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { SALE_STATUS, formatNumber } from "./dashboardConfig";
import CardTooltip from "./CardTooltip";

export default function OrdersStatusChart({ data }) {
  const rows = (data ?? []).filter((r) => r.count > 0);
  const total = (data ?? []).reduce((sum, r) => sum + Number(r.count || 0), 0);

  if (!total) {
    return (
      <p className="text-xs text-muted-foreground text-center py-10 m-0">
        Sin pedidos en este periodo.
      </p>
    );
  }

  const chartData = rows.map((r) => ({
    name: SALE_STATUS[r.status]?.label ?? r.status,
    value: Number(r.count),
    color: SALE_STATUS[r.status]?.color ?? "var(--color-muted-foreground)",
  }));

  return (
    <div className="flex items-center gap-4">
      <div className="relative h-[150px] w-[150px] shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<CardTooltip formatter={formatNumber} />} />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={48}
              outerRadius={70}
              paddingAngle={2}
              strokeWidth={0}
            >
              {chartData.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="font-spec text-2xl font-extrabold text-foreground leading-none">
            {formatNumber(total)}
          </span>
          <span className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground mt-1">
            pedidos
          </span>
        </div>
      </div>

      <ul className="flex-1 space-y-2 m-0 p-0 list-none">
        {(data ?? []).map((r) => {
          const cfg = SALE_STATUS[r.status];
          return (
            <li key={r.status} className="flex items-center gap-2 text-xs">
              <span className="size-2.5 rounded-full shrink-0" style={{ backgroundColor: cfg?.color }} />
              <span className="text-muted-foreground flex-1">{cfg?.label ?? r.status}</span>
              <span className="font-spec font-semibold text-foreground">{formatNumber(r.count)}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
