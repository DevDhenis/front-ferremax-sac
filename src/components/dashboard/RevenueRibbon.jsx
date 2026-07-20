import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { CHART, formatCurrency, formatNumber, formatTrendDate } from "./dashboardConfig";

function DeltaChip({ delta }) {
  const value = Number(delta) || 0;
  const Icon = value > 0 ? TrendingUp : value < 0 ? TrendingDown : Minus;
  const sign = value > 0 ? "+" : "";
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-primary-foreground/10 px-2.5 py-1 text-primary-foreground/90">
      <Icon className="size-3.5" />
      <span className="font-spec text-xs font-semibold">
        {sign}
        {value.toFixed(1)}%
      </span>
    </span>
  );
}

function Stat({ label, value }) {
  return (
    <div className="flex flex-col">
      <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-primary-foreground/50">
        {label}
      </span>
      <span className="font-spec text-lg font-bold text-primary-foreground mt-0.5">{value}</span>
    </div>
  );
}

function TrendTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 shadow-md">
      <p className="font-spec text-[11px] text-muted-foreground m-0">{formatTrendDate(point.date)}</p>
      <p className="font-spec text-sm font-bold text-foreground m-0">{formatCurrency(point.total)}</p>
    </div>
  );
}

export default function RevenueRibbon({ kpis, trend }) {
  const revenue = kpis?.revenue ?? { value: 0, delta_pct: 0 };
  const orders = kpis?.orders ?? { value: 0 };
  const avgTicket = kpis?.avg_ticket ?? { value: 0 };
  const lowStock = kpis?.low_stock_count ?? { value: 0 };

  return (
    <section className="relative overflow-hidden rounded-2xl bg-primary text-primary-foreground shadow-sm">
      <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Cifra hero + stats */}
        <div className="p-6 sm:p-7 lg:p-8 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary-foreground/60">
              Resumen del negocio
            </span>
            <div className="mt-3 flex items-end gap-3 flex-wrap">
              <span className="font-spec text-4xl sm:text-5xl font-extrabold tracking-tight leading-none">
                {formatCurrency(revenue.value)}
              </span>
              <DeltaChip delta={revenue.delta_pct} />
            </div>
            <p className="mt-2 text-sm text-primary-foreground/60 m-0">
              Ingresos del periodo · ventas no canceladas
            </p>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-4 border-t border-primary-foreground/10 pt-5">
            <Stat label="Pedidos" value={formatNumber(orders.value)} />
            <Stat label="Ticket prom." value={formatCurrency(avgTicket.value)} />
            <Stat label="Stock bajo" value={formatNumber(lowStock.value)} />
          </div>
        </div>

        {/* Área de tendencia embebida en la banda oscura */}
        <div className="h-[200px] lg:h-auto lg:min-h-[220px] pr-4 pb-4 lg:pr-6 lg:pb-6 pt-2 lg:pt-6">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trend ?? []} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
              <defs>
                <linearGradient id="ribbonFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={CHART.primaryFg} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={CHART.primaryFg} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                tickFormatter={formatTrendDate}
                tick={{ fill: "var(--color-primary-foreground)", fillOpacity: 0.45, fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                minTickGap={40}
              />
              <YAxis hide domain={[0, "dataMax + 100"]} />
              <Tooltip content={<TrendTooltip />} cursor={{ stroke: CHART.primaryFg, strokeOpacity: 0.3 }} />
              <Area
                type="monotone"
                dataKey="total"
                stroke={CHART.primaryFg}
                strokeWidth={2}
                fill="url(#ribbonFill)"
                dot={false}
                activeDot={{ r: 4, fill: CHART.primaryFg, stroke: CHART.primary, strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
