import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Paginación en Tailwind/shadcn que reemplaza a PrimeReact <Paginator />.
 * Mantiene la misma API: first, rows, totalRecords, rowsPerPageOptions y
 * onPageChange({ first, rows }).
 */
export default function Pagination({
  first = 0,
  rows = 10,
  totalRecords = 0,
  rowsPerPageOptions = [],
  onPageChange,
}) {
  const totalPages = Math.max(1, Math.ceil(totalRecords / rows));
  const currentPage = Math.floor(first / rows);

  const emit = (page, newRows = rows) => {
    const lastPage = Math.max(0, Math.ceil(totalRecords / newRows) - 1);
    const clamped = Math.min(Math.max(0, page), lastPage);
    onPageChange?.({ first: clamped * newRows, rows: newRows });
  };

  const windowSize = 5;
  let start = Math.max(0, currentPage - Math.floor(windowSize / 2));
  const end = Math.min(totalPages, start + windowSize);
  start = Math.max(0, end - windowSize);
  const pages = [];
  for (let i = start; i < end; i++) pages.push(i);

  const navBtn = "size-8 rounded-lg";
  const isFirst = currentPage === 0;
  const isLast = currentPage >= totalPages - 1;

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Button
        variant="outline"
        size="icon"
        className={navBtn}
        disabled={isFirst}
        onClick={() => emit(0)}
        aria-label="Primera página"
      >
        <ChevronsLeft className="size-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className={navBtn}
        disabled={isFirst}
        onClick={() => emit(currentPage - 1)}
        aria-label="Página anterior"
      >
        <ChevronLeft className="size-4" />
      </Button>

      {pages.map((p) => (
        <Button
          key={p}
          variant={p === currentPage ? "default" : "outline"}
          size="icon"
          className={cn(navBtn, "font-spec text-xs font-semibold")}
          onClick={() => emit(p)}
          aria-current={p === currentPage ? "page" : undefined}
        >
          {p + 1}
        </Button>
      ))}

      <Button
        variant="outline"
        size="icon"
        className={navBtn}
        disabled={isLast}
        onClick={() => emit(currentPage + 1)}
        aria-label="Página siguiente"
      >
        <ChevronRight className="size-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className={navBtn}
        disabled={isLast}
        onClick={() => emit(totalPages - 1)}
        aria-label="Última página"
      >
        <ChevronsRight className="size-4" />
      </Button>

      {rowsPerPageOptions.length > 0 && (
        <select
          value={rows}
          onChange={(e) => emit(0, Number(e.target.value))}
          className="font-spec h-8 rounded-lg border border-input bg-card px-2 text-xs text-foreground outline-none cursor-pointer focus-visible:ring-3 focus-visible:ring-ring/50"
          aria-label="Productos por página"
        >
          {rowsPerPageOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt} / pág
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
