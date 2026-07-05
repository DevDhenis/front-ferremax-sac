import { cn } from "@/lib/utils";

const TONES = {
  success: "bg-success-bg text-success border-success/20",
  danger: "bg-destructive-bg text-destructive border-destructive/20",
  warning: "bg-warning-bg text-warning border-warning/20",
  primary: "bg-primary/10 text-primary border-primary/25",
  muted: "bg-secondary text-muted-foreground border-border",
};

/**
 * Píldora de estado con los tonos semánticos de la paleta.
 */
export default function StatusBadge({ tone = "muted", className, children }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap",
        TONES[tone],
        className
      )}
    >
      <span className="size-1.5 rounded-full bg-current opacity-80" />
      {children}
    </span>
  );
}
