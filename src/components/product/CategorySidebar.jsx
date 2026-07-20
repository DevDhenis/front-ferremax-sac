import { LayoutGrid } from "lucide-react";

export default function CategorySidebar({
  categorias,
  categoriaSeleccionada,
  onCategoriaChange,
  conteoProductosPorCategoria
}) {
  const chipCls = (active) =>
    active
      ? "bg-primary text-primary-foreground border-primary"
      : "bg-card text-muted-foreground border-border hover:bg-secondary hover:text-foreground";

  const countCls = (active) =>
    active
      ? "bg-primary-foreground/20 text-primary-foreground"
      : "bg-muted text-muted-foreground";

  return (
    <div className="w-full">
      <div className="flex flex-nowrap md:flex-wrap items-center gap-2 overflow-x-auto md:overflow-x-visible pb-1 -mx-1 px-1 md:mx-0 md:px-0 snap-x md:snap-none scrollbar-none">
        <button
          onClick={() => onCategoriaChange("todas")}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full border text-sm font-medium whitespace-nowrap transition-colors duration-150 snap-start cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/30 ${chipCls(
            categoriaSeleccionada === "todas"
          )}`}
        >
          <LayoutGrid className="size-3.5 shrink-0" />
          <span>Todos</span>
          <span className={`font-spec text-[10px] px-1.5 py-0.5 rounded-full ${countCls(categoriaSeleccionada === "todas")}`}>
            {conteoProductosPorCategoria.todas}
          </span>
        </button>

        {categorias.map(categoria => {
          const isSelected = categoriaSeleccionada === categoria.id.toString();
          return (
            <button
              key={categoria.id}
              onClick={() => onCategoriaChange(categoria.id.toString())}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full border text-sm font-medium whitespace-nowrap transition-colors duration-150 snap-start cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/30 ${chipCls(isSelected)}`}
            >
              <span>{categoria.name}</span>
              <span className={`font-spec text-[10px] px-1.5 py-0.5 rounded-full ${countCls(isSelected)}`}>
                {conteoProductosPorCategoria[categoria.id] || 0}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
