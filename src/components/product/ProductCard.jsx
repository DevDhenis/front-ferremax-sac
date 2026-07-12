import { ShoppingCart } from "lucide-react";

export default function ProductCard({ producto, onAddToCart }) {
  const precio = parseFloat(producto.pre_uni);
  const descuento = Number(producto.descuento) || 0;
  const precioFinal = producto.en_promocion
    ? precio - (precio * descuento) / 100
    : precio;

  const stock = parseFloat(producto.stock);
  const minimo = parseFloat(producto.cantidad_minima) || 0;
  const unidad = producto.unit?.abreviatura ?? "u";

  const tieneStock = stock > 0;
  const bajoStock = tieneStock && stock <= minimo;

  const estadoStock = !tieneStock
    ? { dot: "bg-destructive", text: "text-destructive", label: "Agotado" }
    : bajoStock
      ? { dot: "bg-warning", text: "text-warning", label: "Últimas unidades" }
      : { dot: "bg-success", text: "text-success", label: "En stock" };

  const handleAddToCart = () => {
    if (tieneStock && onAddToCart) onAddToCart(producto);
  };

  return (
    <div className="group bg-card rounded-xl border border-border/80 shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-border transition-all duration-300 overflow-hidden flex flex-col h-[28rem] motion-reduce:transition-none motion-reduce:hover:translate-y-0">
      {/* Imagen + etiquetas de almacén */}
      <div className="relative bg-secondary/30 h-44 border-b border-border/50 shrink-0">
        {/* SKU: etiqueta tipo pick-label */}
        <span className="absolute top-3 left-3 z-10 font-spec text-[10px] tracking-wide text-muted-foreground bg-card/85 backdrop-blur-sm px-1.5 py-0.5 rounded border border-border/60">
          {producto.codigo_interno}
        </span>

        {producto.en_promocion && (
          <span className="absolute top-3 right-3 z-10 inline-flex items-center bg-destructive-bg text-destructive border border-destructive/20 font-spec text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">
            −{descuento}%
          </span>
        )}

        <div className="h-full flex items-center justify-center p-5">
          <img
            src={producto.imagen}
            alt={producto.nombre}
            className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        </div>
      </div>

      {/* Contenido */}
      <div className="p-4 flex flex-col flex-1 gap-1.5">
        <span className="text-[10px] uppercase font-semibold tracking-[0.16em] text-muted-foreground truncate">
          {producto.category?.name}
        </span>

        <h3 className="text-sm font-bold text-foreground line-clamp-2 leading-snug m-0">
          {producto.nombre}
        </h3>

        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed m-0">
          {producto.descripcion || "Sin descripción."}
        </p>

        {/* Pie: precio, stock y acción */}
        <div className="mt-auto pt-3 space-y-2.5">
          <div className="flex items-baseline gap-2">
            <span className="font-spec text-xl font-bold text-foreground">
              S/ {precioFinal.toFixed(2)}
            </span>
            {producto.en_promocion && (
              <span className="font-spec text-xs text-muted-foreground line-through">
                S/ {precio.toFixed(2)}
              </span>
            )}
          </div>

          <div className={`flex items-center gap-1.5 text-[11px] font-medium ${estadoStock.text}`}>
            <span className={`size-1.5 rounded-full ${estadoStock.dot}`} />
            <span>{estadoStock.label}</span>
            {tieneStock && (
              <span className="font-spec text-muted-foreground/90">· {stock} {unidad}</span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!tieneStock}
            className={`w-full py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all duration-200 outline-none focus-visible:ring-3 focus-visible:ring-primary/30 ${
              tieneStock
                ? "bg-primary text-primary-foreground hover:bg-primary/90 active:translate-y-px shadow-sm cursor-pointer"
                : "bg-secondary text-muted-foreground border border-border/80 cursor-not-allowed"
            }`}
          >
            <ShoppingCart className="size-3.5" />
            <span>{tieneStock ? "Agregar al carrito" : "Sin stock"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
