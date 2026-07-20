// Small palette-consistent tooltip for the light-surface charts.
export default function CardTooltip({ active, payload, label, formatter }) {
  if (!active || !payload?.length) return null;
  const entry = payload[0];
  const heading = label ?? entry?.name ?? "";
  const value = formatter ? formatter(entry.value) : entry.value;
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 shadow-md">
      {heading !== "" && <p className="text-[11px] text-muted-foreground m-0">{heading}</p>}
      <p className="font-spec text-sm font-bold text-foreground m-0">{value}</p>
    </div>
  );
}
