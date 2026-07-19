import { Routes, Route, Navigate } from "react-router-dom";
import AppSidebar from "../layout/AppSidebar";
import Navbar from "../layout/Navbar";
import Dashboard from "@/pages/dashboard/Dashboard";
import Catalog from "@/pages/catalog/Catalog";
import RolesListPage from "@/pages/roles/RolesListPage";
import Workers from "@/pages/workers/workers";
import Inventory from "@/pages/inventory/Inventory";
import NosotrosPage from "@/pages/nosotros/nosotrosPage";
import SalesPage from "@/pages/sales/SalesPage";
import ReturnsPage from "@/pages/returns/ReturnsPage";
import SuppliersPage from "@/pages/suppliers/SuppliersPage";
import PurchasesPage from "@/pages/purchases/PurchasesPage";
import PurchaseHistoryPage from "@/pages/shopping/PurchaseHistoryPage";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/context/CartContext";

export default function PrivateLayout() {
  return (
    <TooltipProvider>
      <SidebarProvider
        className="h-screen w-screen overflow-hidden bg-background"
        style={{ "--sidebar-width": "18rem", "--sidebar-width-icon": "3rem" }}
      >
        {/* Official Shadcn Sidebar */}
        <AppSidebar />

        {/* Main Content Area using SidebarInset */}
        <SidebarInset className="flex flex-col flex-1 h-full min-w-0 overflow-hidden bg-background">
          {/* Top Navbar Header */}
          <Navbar />

          {/* Dynamic Pages Area */}
          <main className="flex-1 overflow-auto bg-background">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route
                path="/catalogo"
                element={
                  <CartProvider>
                    <Catalog />
                  </CartProvider>
                }
              />
              <Route path="/roles" element={<RolesListPage />} />
              <Route path="/trabajadores" element={<Workers />} />
              <Route path="/inventario" element={<Inventory />} />
              <Route path="/acerca" element={<NosotrosPage />} />
              <Route path="/historial" element={<PurchaseHistoryPage />} />
              <Route path="/ventas" element={<SalesPage />} />
              <Route path="/devoluciones" element={<ReturnsPage />} />
              <Route path="/proveedores" element={<SuppliersPage />} />
              <Route path="/compras" element={<PurchasesPage />} />
            </Routes>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
