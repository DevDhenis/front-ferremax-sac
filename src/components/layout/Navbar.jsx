import { SidebarTrigger } from "@/components/ui/sidebar";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <header className="flex items-center justify-between px-6 h-16 border-b border-border bg-card w-full">
      {/* Izquierda: disparador del sidebar (móvil) y marca */}
      <div className="flex items-center gap-4">
        <SidebarTrigger className="size-9 text-muted-foreground hover:text-foreground md:hidden" />
        {/* En desktop el sidebar ya muestra la marca; aquí solo aparece en móvil */}
        <span className="text-sm font-semibold text-foreground md:hidden">
          FERREMAX S.A.C.
        </span>
      </div>

      {/* Derecha: notificaciones (la cuenta y cerrar sesión viven en el sidebar) */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="relative size-9 text-muted-foreground hover:text-foreground rounded-full"
        >
          <Bell className="size-5" />
          <span className="absolute top-1.5 right-1.5 size-2.5 bg-destructive rounded-full ring-2 ring-card" />
        </Button>
      </div>
    </header>
  );
}
