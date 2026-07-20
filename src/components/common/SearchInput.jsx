import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function SearchInput({
  value: externalValue = "",
  onChange,
  placeholder = "Buscar...",
  className = "",
  debounceMs = 500,
}) {
  const [localValue, setLocalValue] = useState(externalValue);

  useEffect(() => {
    setLocalValue(externalValue);
  }, [externalValue]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (onChange) {
        onChange(localValue);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [localValue, onChange, debounceMs]);

  return (
    <div className={`relative flex items-center w-full ${className}`}>
      <Search className="absolute left-4 size-4 text-muted-foreground pointer-events-none" />
      <Input
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        className="w-full h-11 pl-11 pr-10 py-2.5 text-sm bg-card border-border/80 focus-visible:ring-primary/30"
      />
      {localValue && (
        <button
          onClick={() => setLocalValue("")}
          className="absolute right-4 text-muted-foreground hover:text-foreground text-xs p-1 rounded-full hover:bg-muted transition-colors cursor-pointer"
          title="Limpiar búsqueda"
        >
          <X className="size-3" />
        </button>
      )}
    </div>
  );
}
