import { Carousel } from "primereact/carousel";
import { Tag } from "primereact/tag";

export default function PromoCarousel({ productos }) {
  if (!productos || productos.length === 0) return null;

  const responsive = [
    { breakpoint: "1400px", numVisible: 2, numScroll: 1 },
    { breakpoint: "768px", numVisible: 1, numScroll: 1 }
  ];

  const template = (p) => {
    const price = Number(p.pre_uni);
    const discount = Number(p.descuento);
    const finalPrice = price - (price * discount) / 100;

    return (
      <div className="p-3 flex align-items-center justify-content-center">
        <div className="border-round surface-card shadow-2 w-full p-4 flex gap-4 flex-column md:flex-row">

          {/* Imagen grande */}
          <div className="flex align-items-center justify-content-center w-full md:w-4">
            <img
              src={p.imagen}
              alt={p.nombre}
              style={{
                width: "180px",
                height: "180px",
                objectFit: "contain"
              }}
            />
          </div>

          {/* Texto */}
          <div className="flex flex-column justify-content-between w-full md:w-8">
            <div>
              <Tag
                severity="danger"
                value={`-${discount}%`}
                className="mb-2 text-sm"
              />

              <div className="text-900 text-3xl font-bold">
                S/ {finalPrice.toFixed(2)}
              </div>

              <div className="text-600 line-through text-sm">
                S/ {price.toFixed(2)}
              </div>

              <div className="mt-2 text-xl font-semibold">
                {p.nombre}
              </div>

              <div className="text-sm text-600 mt-1">
                {p.descripcion}
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  };

  return (
    <div className="mb-4">
      <Carousel
        value={productos}
        itemTemplate={template}
        numVisible={2}
        numScroll={1}
        circular
        autoplayInterval={3500}
        responsiveOptions={responsive}
      />
    </div>
  );
}
