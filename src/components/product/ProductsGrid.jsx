import ProductCard from "./ProductCard";

export default function ProductsGrid({ productos, onAddToCart }) {
  return (
    <div className="grid grid-cols-12 gap-5">
      {productos.map((producto) => (
        <div key={producto.id} className="col-span-12 sm:col-span-6 lg:col-span-4">
          <ProductCard producto={producto} onAddToCart={onAddToCart} />
        </div>
      ))}
    </div>
  );
}
