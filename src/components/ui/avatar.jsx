import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Avatar simple: muestra la imagen y, si no hay o falla la carga, un fallback
 * (iniciales). Reemplaza al Avatar de PrimeReact.
 */
function Avatar({ src, alt = "", fallback, className }) {
  const [errored, setErrored] = React.useState(false)
  const showImg = src && !errored

  return (
    <span
      data-slot="avatar"
      className={cn(
        "inline-flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border/60 bg-secondary text-xs font-semibold text-muted-foreground select-none",
        className
      )}
    >
      {showImg ? (
        <img
          src={src}
          alt={alt}
          className="size-full object-cover"
          onError={() => setErrored(true)}
        />
      ) : (
        <span className="uppercase">{fallback}</span>
      )}
    </span>
  )
}

export { Avatar }
