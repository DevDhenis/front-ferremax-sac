import { Tags, LayoutGrid, Tag, ListFilter } from "lucide-react";

export default function CategorySidebar({
  categorias,
  categoriaSeleccionada,
  onCategoriaChange,
  conteoProductosPorCategoria
}) {
  return (
    <>
      {/* Vista de Escritorio: Sidebar Clásica */}
      <div className="hidden md:block bg-card rounded-xl p-5 border border-border/80 shadow-sm">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border/40">
          <Tags className="size-4 text-primary/85" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">Categorías</h3>
        </div>

        <div className="flex flex-col gap-1.5">
          <button
            onClick={() => onCategoriaChange("todas")}
            className={`flex justify-between items-center w-full px-3 py-2 text-sm rounded-lg transition-all duration-200 cursor-pointer text-left outline-none focus-visible:ring-2 focus-visible:ring-primary/30 ${
              categoriaSeleccionada === "todas"
                ? "bg-primary text-primary-foreground font-medium shadow-sm"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            <div className="flex items-center gap-2 text-left">
              <LayoutGrid className="size-3.5 shrink-0" />
              <span>Todos los productos</span>
            </div>
            <span className={`font-spec text-xs px-2 py-0.5 rounded-full shrink-0 ${
              categoriaSeleccionada === "todas"
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}>
              {conteoProductosPorCategoria.todas}
            </span>
          </button>

          {categorias.map(categoria => {
            const isSelected = categoriaSeleccionada === categoria.id.toString();
            return (
              <button
                key={categoria.id}
                onClick={() => onCategoriaChange(categoria.id.toString())}
                className={`flex justify-between items-start w-full px-3 py-2.5 text-sm rounded-lg transition-all duration-200 cursor-pointer text-left outline-none focus-visible:ring-2 focus-visible:ring-primary/30 ${
                  isSelected
                    ? "bg-primary text-primary-foreground font-medium shadow-sm"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <div className="flex items-start gap-2 text-left">
                  <Tag className="size-3.5 mt-0.5 shrink-0" />
                  <span className="leading-tight">{categoria.nombre}</span>
                </div>
                <span className={`font-spec text-xs px-2 py-0.5 rounded-full shrink-0 ml-2 ${
                  isSelected
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}>
                  {conteoProductosPorCategoria[categoria.id] || 0}
                </span>
              </button>
            );
          })}
        </div>

        {/* Información adicional */}
        <div className="mt-5 pt-4 border-t border-border/60">
          <div className="text-xs text-muted-foreground/80 space-y-2">
            <div className="flex justify-between">
              <span>Total productos:</span>
              <span className="font-spec font-semibold text-foreground">{conteoProductosPorCategoria.todas}</span>
            </div>
            <div className="flex justify-between">
              <span>Categorías:</span>
              <span className="font-spec font-semibold text-foreground">{categorias.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Vista de Móvil: Barra Desplazable Horizontal de Píldoras */}
      <div className="block md:hidden mb-4">
        <div className="flex items-center gap-2 mb-2">
          <ListFilter className="size-3.5 text-muted-foreground" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Filtrar por Categoría</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 snap-x scrollbar-none">
          <button
            onClick={() => onCategoriaChange("todas")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 snap-start cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/30 ${
              categoriaSeleccionada === "todas"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-card text-muted-foreground border border-border hover:bg-secondary"
            }`}
          >
            <span>Todos</span>
            <span className={`font-spec text-[10px] px-1.5 py-0.2 rounded-full ${
              categoriaSeleccionada === "todas"
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}>
              {conteoProductosPorCategoria.todas}
            </span>
          </button>

          {categorias.map(categoria => {
            const isSelected = categoriaSeleccionada === categoria.id.toString();
            return (
              <button
                key={categoria.id}
                onClick={() => onCategoriaChange(categoria.id.toString())}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 snap-start cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/30 ${
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-card text-muted-foreground border border-border hover:bg-secondary"
                }`}
              >
                <span>{categoria.nombre}</span>
                <span className={`font-spec text-[10px] px-1.5 py-0.2 rounded-full ${
                  isSelected
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}>
                  {conteoProductosPorCategoria[categoria.id] || 0}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}