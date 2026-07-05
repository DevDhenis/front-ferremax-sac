import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Buscador reutilizable con debounce (500 ms por defecto).
 * Emite el valor ya "debounceado" a través de onChange(value: string).
 *
 * Props:
 *  - value: valor controlado externo (opcional, para sincronizar/limpiar)
 *  - onChange: (value) => void  — se llama tras el debounce
 *  - placeholder, className, debounceMs, autoFocus, disabled
 */
export default function CustomSearch({
  value: externalValue = "",
  onChange,
  placeholder = "Buscar...",
  className = "",
  debounceMs = 500,
  autoFocus = false,
  disabled = false,
}) {
  const [localValue, setLocalValue] = useState(externalValue);
  const inputRef = useRef(null);
  // Evita disparar onChange en el primer render (o al sincronizar desde fuera).
  const skipNextEmit = useRef(true);

  // Sincroniza cuando el valor externo cambia (ej. reset al cambiar categoría).
  useEffect(() => {
    setLocalValue((prev) => {
      if (prev === externalValue) return prev;
      skipNextEmit.current = true;
      return externalValue;
    });
  }, [externalValue]);

  useEffect(() => {
    if (skipNextEmit.current) {
      skipNextEmit.current = false;
      return;
    }
    const timer = setTimeout(() => {
      onChange?.(localValue);
    }, debounceMs);
    return () => clearTimeout(timer);
  }, [localValue, onChange, debounceMs]);

  const clear = () => {
    setLocalValue("");
    inputRef.current?.focus();
  };

  return (
    <div
      className={cn(
        "group relative flex items-center w-full rounded-xl border border-border/80 bg-card shadow-sm transition-all",
        "focus-within:border-ring focus-within:ring-3 focus-within:ring-primary/20 focus-within:shadow-md",
        disabled && "opacity-60 pointer-events-none",
        className
      )}
    >
      <Search className="absolute left-4 size-4 text-muted-foreground pointer-events-none transition-colors group-focus-within:text-primary" />
      <input
        ref={inputRef}
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        disabled={disabled}
        className="w-full h-11 pl-11 pr-10 bg-transparent text-sm text-foreground placeholder:text-placeholder outline-none rounded-xl"
      />
      {localValue && (
        <button
          type="button"
          onClick={clear}
          aria-label="Limpiar búsqueda"
          className="absolute right-3 flex items-center justify-center size-6 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
        >
          <X className="size-3" />
        </button>
      )}
    </div>
  );
}
