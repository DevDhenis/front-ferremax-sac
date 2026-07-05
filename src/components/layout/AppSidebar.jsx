import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/services/auth/authContext";
import IconLogo from "@/assets/icons/icon.svg";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  LayoutGrid,
  Users,
  Key,
  Package,
  Info,
  History,
  TrendingUp,
  ShoppingBag,
  Layout,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// El tamaño lo controla SidebarMenuButton ([&_svg]:size-4), no hace falta fijarlo aquí.
function getLucideIcon(iconName) {
  if (!iconName) return <Layout />;
  const name = iconName.toLowerCase();
  if (name.includes("th-large") || name.includes("catalog")) return <LayoutGrid />;
  if (name.includes("shopping-bag") || name.includes("bag")) return <ShoppingBag />;
  if (name.includes("users") || name.includes("user")) return <Users />;
  if (name.includes("lock") || name.includes("key") || name.includes("shield")) return <Key />;
  if (name.includes("box") || name.includes("inventory")) return <Package />;
  if (name.includes("info")) return <Info />;
  if (name.includes("history")) return <History />;
  if (name.includes("chart") || name.includes("line") || name.includes("dollar")) return <TrendingUp />;
  return <Layout />;
}

export default function AppSidebar() {
  const { accesses } = useAuth();
  const location = useLocation();
  const { toggleSidebar, state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon">
      {/* Brand Header — el texto se oculta solo en modo ícono vía CSS de ShadCN */}
      <SidebarHeader className="h-16 justify-center border-b border-sidebar-border">
        <NavLink
          to="/catalogo"
          className="flex items-center gap-2 overflow-hidden group-data-[collapsible=icon]:justify-center"
        >
          <img alt="Boran Logo" src={IconLogo} className="size-8 shrink-0" />
          <div className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden!">
            <span className="truncate text-sm font-semibold tracking-tight text-sidebar-foreground">
              BORAN S.A.C.
            </span>
            <span className="truncate text-xs text-muted-foreground">
              Sistema de Gestión
            </span>
          </div>
        </NavLink>
      </SidebarHeader>

      <SidebarContent className="overflow-x-hidden! group-data-[collapsible=icon]:overflow-hidden!">
        <SidebarGroup>
          <SidebarGroupLabel>Menú Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {accesses.map((acc) => (
                <SidebarMenuItem key={acc.path}>
                  <SidebarMenuButton
                    isActive={location.pathname === acc.path}
                    tooltip={acc.nombre}
                    render={<NavLink to={acc.path} />}
                    className="group-data-[collapsible=icon]:w-full! group-data-[collapsible=icon]:h-9! group-data-[collapsible=icon]:justify-center"
                  >
                    {getLucideIcon(acc.icon)}
                    <span className="group-data-[collapsible=icon]:hidden!">{acc.nombre}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Flecha flotante para colapsar/expandir (solo desktop; en móvil se usa
          el botón del navbar). Va sobre el borde derecho, centrada vertical. */}
      <button
        type="button"
        onClick={toggleSidebar}
        aria-label={isCollapsed ? "Expandir menú" : "Colapsar menú"}
        title={isCollapsed ? "Expandir menú" : "Colapsar menú"}
        className="absolute top-1/2 -right-3 z-20 hidden size-6 -translate-y-1/2 items-center justify-center rounded-full border border-sidebar-border bg-sidebar text-muted-foreground shadow-sm transition-colors hover:bg-sidebar-accent hover:text-foreground md:flex"
      >
        {isCollapsed ? (
          <ChevronRight className="size-4" />
        ) : (
          <ChevronLeft className="size-4" />
        )}
      </button>
    </Sidebar>
  );
}
