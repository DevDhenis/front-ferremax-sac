import { useRef } from "react";
import { Avatar } from "primereact/avatar";
import { Menu } from "primereact/menu";
import { useAuth } from "@/services/auth/authContext";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const menuRef = useRef(null);
  const { user, logout } = useAuth();

  const profileMenu = [
    { label: "Perfil", icon: "pi pi-user" },
    { label: "Configuración", icon: "pi pi-cog" },
    { separator: true },
    {
      label: "Cerrar sesión",
      icon: "pi pi-sign-out",
      command: () => logout(),
    },
  ];

  return (
    <header className="flex items-center justify-between px-6 h-16 border-b border-border bg-card w-full">
      {/* Left side: Sidebar Trigger & System Title */}
      <div className="flex items-center gap-4">
        <SidebarTrigger className="size-9 text-muted-foreground hover:text-foreground md:hidden" />
        {/* En desktop el sidebar ya muestra la marca; aquí solo aparece en móvil */}
        <span className="text-sm font-semibold text-foreground md:hidden">
          BORAN S.A.C.
        </span>
      </div>

      {/* Right side: Actions & Profile */}
      <div className="flex items-center gap-4">
        {/* Notifications Icon Button */}
        <Button variant="ghost" size="icon" className="relative size-9 text-muted-foreground hover:text-foreground rounded-full">
          <Bell className="size-5" />
          <span className="absolute top-1.5 right-1.5 size-2.5 bg-destructive rounded-full ring-2 ring-card" />
        </Button>

        {/* User Profile Dropdown */}
        <div
          className="flex items-center gap-2 cursor-pointer hover:opacity-90 select-none transition-opacity"
          onClick={(e) => menuRef.current.toggle(e)}
        >
          <Avatar
            image={
              user?.person?.imagen ||
              "https://preview.redd.it/3wlrfietzzq31.jpg?width=640&crop=smart&auto=webp&s=fac76e26c430a104b182b73389c5ca0d951d46d8"
            }
            shape="circle"
            className="size-9 border border-border"
          />
          <div className="hidden md:flex flex-col text-left leading-tight min-w-0 max-w-[160px]">
            <span className="truncate text-xs font-semibold text-foreground">{user?.username || "Usuario"}</span>
            <span className="truncate text-[10px] text-muted-foreground">{user?.role || "Rol"}</span>
          </div>
          <i className="pi pi-angle-down text-muted-foreground text-xs hidden md:inline-block"></i>
          <Menu model={profileMenu} popup ref={menuRef} />
        </div>
      </div>
    </header>
  );
}
