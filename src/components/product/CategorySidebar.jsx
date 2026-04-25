import { Badge } from "primereact/badge";
import { Button } from "primereact/button";

export default function CategorySidebar({
  categorias,
  categoriaSeleccionada,
  onCategoriaChange,
  conteoProductosPorCategoria
}) {
  return (
    <div className="surface-section border-round p-3 shadow-2">
      <div className="flex align-items-center gap-2 mb-4">
        <i className="pi pi-tags text-primary"></i>
        <h3 className="text-lg font-semibold m-0">Categorías</h3>
      </div>

      <div className="flex flex-column gap-2">
        <Button
          label={
            <div className="flex justify-content-between align-items-center w-full">
              <span>Todos los productos</span>
              <Badge
                value={conteoProductosPorCategoria.todas}
                severity="info"
                size="small"
              />
            </div>
          }
          severity={categoriaSeleccionada === "todas" ? "primary" : "secondary"}
          size="small"
          onClick={() => onCategoriaChange("todas")}
          className="w-full justify-content-start"
          icon="pi pi-th-large"
        />

        {categorias.map(categoria => (
          <Button
            key={categoria.id}
            label={
              <div className="flex justify-content-between align-items-center w-full">
                <span>{categoria.nombre}</span>
                <Badge
                  value={conteoProductosPorCategoria[categoria.id] || 0}
                  severity="info"
                  size="small"
                />
              </div>
            }
            severity={categoriaSeleccionada === categoria.id.toString() ? "primary" : "secondary"}
            size="small"
            onClick={() => onCategoriaChange(categoria.id.toString())}
            className="w-full justify-content-start"
            icon="pi pi-tag"
          />
        ))}
      </div>

      {/* Información adicional */}
      <div className="mt-4 pt-3 border-top-1 surface-border">
        <div className="text-sm text-600">
          <div className="flex justify-content-between">
            <span>Total de productos:</span>
            <span className="font-semibold">{conteoProductosPorCategoria.todas}</span>
          </div>
          <div className="flex justify-content-between mt-1">
            <span>Categorías:</span>
            <span className="font-semibold">{categorias.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}