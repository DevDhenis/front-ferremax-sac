import { useRef } from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Flame, ShoppingCart } from "lucide-react";

export default function PromoCarousel({ productos, onAddToCart }) {
  const autoplay = useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true })
  );

  if (!productos || productos.length === 0) return null;

  const slide = (p) => {
    const price = Number(p.unit_price);
    const discount = Number(p.discount);
    const finalPrice = price - (price * discount) / 100;

    return (
      <div className="grid md:grid-cols-2 items-center gap-5 lg:gap-8 p-5 sm:p-6 lg:p-7">
        {/* Texto */}
        <div className="order-2 md:order-1 flex flex-col items-start">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-primary-foreground/70">
            <Flame className="size-3.5" />
            Oferta de la semana
          </span>

          <h2 className="mt-2 text-xl sm:text-2xl lg:text-3xl font-extrabold leading-tight tracking-tight m-0">
            {p.name}
          </h2>

          <p className="mt-1.5 text-sm text-primary-foreground/70 line-clamp-2 max-w-md">
            {p.description || "Aprovecha esta oferta por tiempo limitado."}
          </p>

          <div className="mt-3 flex items-end gap-3">
            <span className="font-spec text-2xl lg:text-3xl font-extrabold tracking-tight">
              S/ {finalPrice.toFixed(2)}
            </span>
            <span className="font-spec text-sm text-primary-foreground/50 line-through mb-0.5">
              S/ {price.toFixed(2)}
            </span>
            <Badge variant="destructive" className="mb-1 rounded-md">−{discount}%</Badge>
          </div>

          <Button
            variant="secondary"
            onClick={() => onAddToCart?.(p)}
            className="mt-4 h-10 px-4 gap-2 text-sm font-semibold"
          >
            <ShoppingCart className="size-4" />
            Agregar al carrito
          </Button>
        </div>

        {/* Imagen */}
        <div className="order-1 md:order-2 flex justify-center md:justify-end">
          <div className="bg-white rounded-xl w-full max-w-[11rem] sm:max-w-[12rem] aspect-square flex items-center justify-center p-4 shadow-lg">
            <img
              src={p.image}
              alt={p.name}
              className="max-h-full max-w-full object-contain"
            />
          </div>
        </div>
      </div>
    );
  };

  const navBtnClass =
    "static top-auto left-auto right-auto translate-y-0 size-8 rounded-full bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20";

  return (
    <div className="mb-5">
      <Carousel opts={{ loop: true, align: "start" }} plugins={[autoplay.current]}>
        <div className="relative rounded-2xl bg-primary text-primary-foreground overflow-hidden shadow-sm">
          <CarouselContent>
            {productos.map((p) => (
              <CarouselItem key={p.id} className="basis-full">
                {slide(p)}
              </CarouselItem>
            ))}
          </CarouselContent>

          {productos.length > 1 && (
            <div className="absolute bottom-4 right-4 flex items-center gap-2">
              <CarouselPrevious className={navBtnClass} />
              <CarouselNext className={navBtnClass} />
            </div>
          )}
        </div>
      </Carousel>
    </div>
  );
}
