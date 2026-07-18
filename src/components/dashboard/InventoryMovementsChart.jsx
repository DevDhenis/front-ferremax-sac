import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";
import { CHART, MOVEMENT_LABEL, formatNumber } from "./dashboardConfig";
import CardTooltip from "./CardTooltip";

const TONE = {
  inbound: CHART.success,
  outbound: CHART.destructive,
  adjustment: CHART.warning,
};

export default function InventoryMovementsChart({ data }) {
  const rows = (data ?? []).map((r) => ({
    name: MOVEMENT_LABEL[r.movement_type] ?? r.movement_type,
    value: Number(r.count),
    color: TONE[r.movement_type] ?? CHART.muted,
  }));

  const total = rows.reduce((sum, r) => sum + r.value, 0);
  if (!total) {
    return (
      <p className="text-xs text-muted-foreground text-center py-10 m-0">
        Sin movimientos en este periodo.
      </p>
    );
  }

  return (
    <div className="h-[180px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={rows} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
          <XAxis
            dataKey="name"
            tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "var(--color-muted-foreground)", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip
            cursor={{ fill: "var(--color-muted)", fillOpacity: 0.4 }}
            content={<CardTooltip formatter={formatNumber} />}
          />
          <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={44}>
            {rows.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
