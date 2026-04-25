import ProductCard from "./ProductCard";

export default function ProductsGrid({ productos, onAddToCart }) {
  return (
    <div className="grid grid-cols-12">
      {productos.map((producto) => (
        <div key={producto.id} className="col-12 sm:col-6 md:col-4 lg:col-4">
          <ProductCard producto={producto} onAddToCart={onAddToCart} />
        </div>
      ))}
    </div>
  );
}