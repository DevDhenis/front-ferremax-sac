const RANGES = [
  { value: "7d", label: "7 días" },
  { value: "30d", label: "30 días" },
  { value: "90d", label: "90 días" },
];

export default function RangeSelector({ value, onChange, disabled = false }) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-border bg-card p-1">
      {RANGES.map((r) => {
        const active = value === r.value;
        return (
          <button
            key={r.value}
            type="button"
            disabled={disabled}
            onClick={() => onChange(r.value)}
            className={`font-spec text-xs px-3 py-1.5 rounded-full transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:opacity-50 ${
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {r.label}
          </button>
        );
      })}
    </div>
  );
}
