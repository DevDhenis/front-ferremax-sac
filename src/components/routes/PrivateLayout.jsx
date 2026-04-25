import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "../layout/Navbar";
import Catalog from "@/pages/catalog/Catalog";
import RolesListPage from "@/pages/roles/RolesListPage";
import Workers from "@/pages/workers/workers";
import Inventory from "@/pages/inventory/Inventory";
import NosotrosPage from "@/pages/nosotros/nosotrosPage";
import SalesPage from "@/pages/sales/SalesPage";
import PurchaseHistoryPage from "@/pages/shopping/PurchaseHistoryPage";

export default function PrivateLayout() {
  return (
    <div className="flex h-screen bg-gray-100 relative">
      <div className="flex flex-column w-full p-4">
        <Navbar />

        <div className="flex-1 overflow-auto border-round-bottom-xl">
          <Routes>

            <Route path="/" element={<Navigate to="/catalogo" replace />} />

            <Route path="/catalogo" element={<Catalog />} />
            <Route path="/roles" element={<RolesListPage />} />
            <Route path="/trabajadores" element={<Workers />} />
            <Route path="/inventario" element={<Inventory />} />
            <Route path="/acerca" element={<NosotrosPage />} />
            <Route path="/historial" element={<PurchaseHistoryPage />} />
            <Route path="/ventas" element={<SalesPage />} />

          </Routes>
        </div>
      </div>
    </div>
  );
}
