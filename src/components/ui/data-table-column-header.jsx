import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Cabecera de columna ordenable para el DataTable (TanStack).
 * Úsala en la columna: header: ({ column }) => <DataTableColumnHeader column={column} title="Producto" />
 */
export function DataTableColumnHeader({ column, title, className }) {
  if (!column?.getCanSort?.()) {
    return (
      <span
        className={cn(
          "text-xs font-semibold uppercase tracking-wide text-muted-foreground",
          className
        )}
      >
        {title}
      </span>
    );
  }

  const sorted = column.getIsSorted();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => column.toggleSorting(sorted === "asc")}
      className={cn(
        "-ml-2 h-7 gap-1 px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground hover:text-foreground",
        className
      )}
    >
      {title}
      {sorted === "asc" ? (
        <ArrowUp className="size-3.5" />
      ) : sorted === "desc" ? (
        <ArrowDown className="size-3.5" />
      ) : (
        <ChevronsUpDown className="size-3.5 opacity-50" />
      )}
    </Button>
  );
}
