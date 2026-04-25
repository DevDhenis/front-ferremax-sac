import { Button } from "primereact/button";

export default function CategoryFilters({
  categorias,
  categoriaSeleccionada,
  onCategoriaChange
}) {
  return (
    <div className="flex flex-wrap gap-2 justify-content-center mb-5">
      <Button
        label="Todos los productos"
        severity={categoriaSeleccionada === "todas" ? "primary" : "secondary"}
        size="small"
        onClick={() => onCategoriaChange("todas")}
        className={categoriaSeleccionada === "todas" ? "shadow-2" : ""}
      />
      {categorias.map(categoria => (
        <Button
          key={categoria.id}
          label={categoria.nombre}
          severity={categoriaSeleccionada === categoria.id.toString() ? "primary" : "secondary"}
          size="small"
          onClick={() => onCategoriaChange(categoria.id.toString())}
          className={categoriaSeleccionada === categoria.id.toString() ? "shadow-2" : ""}
        />
      ))}
    </div>
  );
}