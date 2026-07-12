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
import { Zap, Tag } from "lucide-react";

export default function PromoCarousel({ productos }) {
  const autoplay = useRef(
    Autoplay({ delay: 3500, stopOnInteraction: false, stopOnMouseEnter: true })
  );

  if (!productos || productos.length === 0) return null;

  const template = (p) => {
    const price = Number(p.unit_price);
    const discount = Number(p.discount);
    const finalPrice = price - (price * discount) / 100;

    return (
      <div className="p-1.5 h-full">
        <div className="group/card h-full rounded-xl border border-border/80 bg-card shadow-sm hover:shadow-md hover:border-border transition-all p-3 flex gap-3.5 items-center">

          {/* Imagen */}
          <div className="flex items-center justify-center shrink-0 size-24 rounded-lg bg-card border border-border/60 overflow-hidden p-2">
            <img
              src={p.image}
              alt={p.name}
              className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover/card:scale-105 motion-reduce:transition-none motion-reduce:group-hover/card:scale-100"
            />
          </div>

          {/* Texto */}
          <div className="flex flex-col justify-center w-full min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="destructive" className="w-fit gap-1 px-2 py-0 text-[11px]">
                <Tag className="size-3" />
                {`-${discount}%`}
              </Badge>
              <span className="text-sm font-semibold text-foreground truncate">
                {p.name}
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="font-spec text-foreground text-2xl font-bold tracking-tight">
                S/ {finalPrice.toFixed(2)}
              </span>
              <span className="font-spec text-muted-foreground line-through text-xs">
                S/ {price.toFixed(2)}
              </span>
            </div>

            <div className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
              {p.description}
            </div>
          </div>

        </div>
      </div>
    );
  };

  const navBtnClass =
    "static top-auto left-auto right-auto translate-y-0 size-7 rounded-lg bg-card border border-border/80 text-muted-foreground shadow-sm hover:bg-secondary hover:text-foreground";

  return (
    <div className="mb-8">
      <Carousel
        opts={{ loop: true, align: "start" }}
        plugins={[autoplay.current]}
      >
        <div className="flex items-center gap-2 mb-3 px-1">
          <span className="inline-flex size-6 items-center justify-center rounded-full bg-destructive-bg text-destructive">
            <Zap className="size-3.5" />
          </span>
          <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground m-0">
            En promoción
          </h2>
          <span className="h-px flex-1 bg-border/60" />
          <div className="flex items-center gap-1.5">
            <CarouselPrevious className={navBtnClass} />
            <CarouselNext className={navBtnClass} />
          </div>
        </div>
        <CarouselContent>
          {productos.map((p) => (
            <CarouselItem key={p.id} className="md:basis-1/2">
              {template(p)}
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
