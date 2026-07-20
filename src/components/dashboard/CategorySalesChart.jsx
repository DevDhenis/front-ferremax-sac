import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";
import { CATEGORY_SERIES, formatCurrency } from "./dashboardConfig";
import CardTooltip from "./CardTooltip";

export default function CategorySalesChart({ data }) {
  const rows = (data ?? []).slice(0, 6);

  if (!rows.length) {
    return (
      <p className="text-xs text-muted-foreground text-center py-10 m-0">
        Sin ventas por categoría en este periodo.
      </p>
    );
  }

  return (
    <div className="h-[260px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={rows} layout="vertical" margin={{ top: 0, right: 12, left: 0, bottom: 0 }}>
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="category"
            width={120}
            tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: "var(--color-muted)", fillOpacity: 0.4 }}
            content={<CardTooltip formatter={formatCurrency} />}
          />
          <Bar dataKey="revenue" radius={[0, 6, 6, 0]} barSize={18}>
            {rows.map((_, i) => (
              <Cell key={i} fill={CATEGORY_SERIES[i % CATEGORY_SERIES.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
