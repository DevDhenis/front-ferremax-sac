import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";

export default function ProductCard({ producto, onAddToCart }) {
  const calcularPrecioConDescuento = (precio, descuento) => {
    return precio - (precio * descuento / 100);
  };

  const precioFinal = producto.en_promocion
    ? calcularPrecioConDescuento(parseFloat(producto.pre_uni), producto.descuento)
    : parseFloat(producto.pre_uni);

  const tieneStock = parseFloat(producto.stock) > 0;

  const handleAddToCart = () => {
    if (tieneStock && onAddToCart) {
      onAddToCart(producto);
    }
  };

  return (
    <Card
      className="shadow-4 border-round-xl hover:shadow-8 transition-all transition-duration-300 overflow-hidden border-1 surface-border">
      <div className="flex flex-column h-30rem">
        <div className="relative">
          <div className="bg-gray-100 p-4 border-round-top-xl flex justify-content-center align-items-center">
            <img
              src={producto.imagen}
              alt={producto.nombre}
              className="w-8rem h-8rem object-contain"
            />
          </div>

          <div className="absolute top-0 right-0 p-2 flex justify-content-between">
            {producto.en_promocion && (
              <Tag
                value={`-${producto.descuento}%`}
                severity="danger"
                className="shadow-2 font-bold"
              />
            )}

            {!tieneStock && (
              <Tag
                value="AGOTADO"
                severity="secondary"
                className="shadow-2 font-bold"
              />
            )}
          </div>
        </div>

        <div className="flex flex-column flex-1 justify-content-between p-3">
          <div className="flex justify-content-center">
            <Tag
              value={producto.category?.nombre}
              severity="info"
              className="text-xs"
            />
          </div>

          <h3 className="text-lg m-0 font-bold text-900">
            {producto.nombre}
          </h3>

          <p className="text-sm text-600 m-0 text-ellipsis-4">
            {producto.descripcion || "Sin descripción"}
          </p>

          <small className="text-500 flex gap-1">
            Stock:
            <span className={tieneStock ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
              {parseFloat(producto.stock)} {producto.unit?.abreviatura}
            </span>
          </small>

          <div className="flex align-items-center gap-2">
            {producto.en_promocion ? (
              <>
                <span className="text-xl font-bold text-green-600">
                  S/ {precioFinal.toFixed(2)}
                </span>
                <span className="text-sm text-500 line-through">
                  S/ {parseFloat(producto.pre_uni).toFixed(2)}
                </span>
              </>
            ) : (
              <span className="text-xl font-bold text-900">
                S/ {parseFloat(producto.pre_uni).toFixed(2)}
              </span>
            )}
          </div>

          <Button
            label={tieneStock ? "Agregar al carrito" : "Sin stock"}
            icon="pi pi-shopping-cart"
            className={`w-full ${tieneStock ? 'p-button-success' : 'p-button-secondary'}`}
            size="small"
            disabled={!tieneStock}
            severity={tieneStock ? "success" : "secondary"}
            onClick={handleAddToCart}
          />
        </div>
      </div>
    </Card>
  );
}