import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ProductCard({ producto, onAddToCart }) {
  const precio = parseFloat(producto.unit_price);
  const descuento = Number(producto.discount) || 0;
  const precioFinal = producto.on_promotion
    ? precio - (precio * descuento) / 100
    : precio;

  const stock = parseFloat(producto.stock);
  const minimo = parseFloat(producto.minimum_quantity) || 0;
  const unidad = producto.unit?.abbreviation ?? "u";

  const tieneStock = stock > 0;
  const bajoStock = tieneStock && stock <= minimo;

  const estadoStock = !tieneStock
    ? { dot: "bg-destructive", text: "text-destructive", label: "Agotado" }
    : bajoStock
      ? { dot: "bg-warning", text: "text-warning", label: "Pocas unidades" }
      : { dot: "bg-success", text: "text-success", label: "Disponible" };

  const handleAddToCart = () => {
    if (tieneStock && onAddToCart) onAddToCart(producto);
  };

  return (
    <div className="group flex flex-col h-full bg-card rounded-xl border border-border shadow-sm hover:shadow-lg hover:border-border/60 transition-all duration-200 overflow-hidden">
      {/* Imagen */}
      <div className="relative bg-white h-52 shrink-0 flex items-center justify-center p-5">
        {producto.on_promotion && (
          <Badge variant="destructive" className="absolute top-3 left-3 z-10 rounded-md px-2 py-0.5">
            −{descuento}%
          </Badge>
        )}
        {!tieneStock && (
          <span className="absolute top-3 right-3 z-10 rounded-md bg-secondary text-muted-foreground text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 border border-border">
            Agotado
          </span>
        )}
        <img
          src={producto.image}
          alt={producto.name}
          className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
      </div>

      {/* Contenido */}
      <div className="flex flex-col flex-1 p-4">
        <span className="text-[11px] uppercase font-semibold tracking-wider text-muted-foreground truncate">
          {producto.category?.name}
        </span>

        <h3 className="mt-1 text-sm font-semibold text-foreground leading-snug line-clamp-2 min-h-[2.5rem] m-0">
          {producto.name}
        </h3>

        {/* Disponibilidad */}
        <div className={`mt-2 flex items-center gap-1.5 text-xs font-medium ${estadoStock.text}`}>
          <span className={`size-2 rounded-full ${estadoStock.dot}`} />
          <span>{estadoStock.label}</span>
          {tieneStock && (
            <span className="font-spec text-muted-foreground/80">· {stock} {unidad}</span>
          )}
        </div>

        {/* Precio */}
        <div className="mt-auto pt-3">
          <div className="flex items-baseline gap-2">
            <span className="font-spec text-2xl font-extrabold text-foreground tracking-tight">
              S/ {precioFinal.toFixed(2)}
            </span>
            {producto.on_promotion && (
              <span className="font-bold text-xs text-success">−{descuento}%</span>
            )}
          </div>
          {producto.on_promotion ? (
            <span className="font-spec text-xs text-muted-foreground line-through">
              Antes S/ {precio.toFixed(2)}
            </span>
          ) : (
            <span className="text-xs text-muted-foreground">Precio unitario</span>
          )}

          <Button
            onClick={handleAddToCart}
            disabled={!tieneStock}
            className="mt-3 w-full h-11 gap-2 text-sm font-semibold"
          >
            <ShoppingCart className="size-4" />
            {tieneStock ? "Agregar al carrito" : "Sin stock"}
          </Button>
        </div>
      </div>
    </div>
  );
}
