import { useState } from "react";
import { CalendarDays } from "lucide-react";
import { format, parse, isValid } from "date-fns";
import { es } from "date-fns/locale";

import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

/**
 * Reusable shadcn-style date picker (Popover + Calendar).
 * value / onChange use a "yyyy-MM-dd" string ("" = sin fecha).
 */
export default function DatePicker({
  value,
  onChange,
  placeholder = "Seleccionar fecha",
  id,
  disabled = false,
  className,
}) {
  const [open, setOpen] = useState(false);

  const selected = value ? parse(value, "yyyy-MM-dd", new Date()) : undefined;
  const label = selected && isValid(selected) ? format(selected, "dd/MM/yyyy") : "";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        id={id}
        disabled={disabled}
        className={cn(
          "h-9 w-full inline-flex items-center gap-2 rounded-lg border border-input bg-card px-3 text-sm text-left outline-none transition-colors hover:bg-secondary/40 focus-visible:ring-2 focus-visible:ring-primary/30 disabled:opacity-50 disabled:pointer-events-none",
          className
        )}
      >
        <CalendarDays className="size-4 text-muted-foreground shrink-0" />
        <span className={cn("font-spec flex-1 truncate", !label && "text-placeholder")}>
          {label || placeholder}
        </span>
      </PopoverTrigger>
      <PopoverContent>
        <Calendar
          mode="single"
          selected={selected}
          defaultMonth={selected}
          locale={es}
          onSelect={(d) => {
            onChange?.(d ? format(d, "yyyy-MM-dd") : "");
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
