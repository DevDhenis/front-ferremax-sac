import { useState, useEffect } from "react";
import { CalendarDays } from "lucide-react";
import { format, parse, isValid } from "date-fns";
import { es } from "date-fns/locale";

import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

/**
 * Reusable date picker: se puede ESCRIBIR la fecha (dd/mm/aaaa) o elegirla en el
 * calendario. value / onChange usan un string "yyyy-MM-dd" ("" = sin fecha).
 */
export default function DatePicker({
  value,
  onChange,
  placeholder = "dd/mm/aaaa",
  id,
  disabled = false,
  className,
}) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");

  const toDate = (v) => (v ? parse(v, "yyyy-MM-dd", new Date()) : null);
  const selected = (() => {
    const d = toDate(value);
    return d && isValid(d) ? d : undefined;
  })();

  // Keep the visible text in sync with the value (unless the user is mid-typing).
  useEffect(() => {
    setText(selected ? format(selected, "dd/MM/yyyy") : "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const commitText = (raw) => {
    const t = raw.trim();
    if (t === "") {
      onChange?.("");
      return;
    }
    const parsed = parse(t, "dd/MM/yyyy", new Date());
    if (isValid(parsed)) {
      onChange?.(format(parsed, "yyyy-MM-dd"));
    } else {
      // Invalid input: revert to the current value.
      setText(selected ? format(selected, "dd/MM/yyyy") : "");
    }
  };

  return (
    <div className={cn("relative", className)}>
      <input
        id={id}
        type="text"
        inputMode="numeric"
        value={text}
        disabled={disabled}
        onChange={(e) => setText(e.target.value)}
        onBlur={(e) => commitText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            commitText(e.target.value);
          }
        }}
        placeholder={placeholder}
        className="h-9 w-full rounded-lg border border-input bg-card pl-3 pr-10 text-sm font-spec text-foreground outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary/30 disabled:opacity-50 placeholder:text-placeholder"
      />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          type="button"
          disabled={disabled}
          className="absolute right-1 top-1/2 -translate-y-1/2 inline-flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:opacity-50"
          aria-label="Abrir calendario"
        >
          <CalendarDays className="size-4" />
        </PopoverTrigger>
        <PopoverContent align="end">
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
    </div>
  );
}
