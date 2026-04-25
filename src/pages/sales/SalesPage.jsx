import { useEffect, useState } from "react";
import { useSales } from "@/hooks/useSales";
import { Avatar } from "primereact/avatar";
import { Tag } from "primereact/tag";
import { ProgressSpinner } from "primereact/progressspinner";
import SaleDetailModal from "@/components/sales/SaleDetailModal";
import SalesImg from "../../assets/images/sales-img.jpg";
import Container from "@/components/layout/Container";
import Header from "@/components/layout/Header";

export default function SalesPage() {
  const { loading, handleGetSales } = useSales();
  const [sales, setSales] = useState([]);

  const loadSales = async () => {
    const data = await handleGetSales();
    setSales(data);
  };

  useEffect(() => {
    loadSales();
  }, []);

  const itemsCount = (items) => items?.length || 0;

  const formatStatus = (status) => {
    const map = {
      pendiente_envio: { label: "Pendiente de envío", severity: "warning" },
      en_preparacion: { label: "En preparación", severity: "info" },
      en_camino: { label: "En camino", severity: "info" },
      entregado: { label: "Entregado", severity: "success" },
      cancelado: { label: "Cancelado", severity: "danger" },
    };

    return map[status] || { label: status, severity: null };
  };

  const formatDate = (dateString) => {
    const utcDate = new Date(dateString + " UTC");

    return utcDate.toLocaleString("es-PE", {
      timeZone: "America/Lima",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };


  if (loading) return (
    <div className="flex flex-column align-items-center justify-content-center py-6">
      <ProgressSpinner />
      <span className="mt-3 text-900 font-medium text-lg">
        Cargando carrito...
      </span>
    </div>
  );

  return (
    <Container>
      <Header
        title="Ventas"
        subtitle="Gestiona y visualiza todas las ventas realizadas en tu tienda."
      />

      <div className="text-600 flex justify-content-end mb-3">{sales.length} ventas registradas</div>

      {sales.length === 0 && (
        <div className="flex flex-column align-items-center justify-content-center py-6 fadein animation-duration-400">
          <img
            src={SalesImg}
            alt="Sin compras"
            style={{ width: "120px", opacity: 0.85 }}
            className="mb-3"
          />

          <p className="text-600">No hay ventas registradas aún.</p>
        </div>
      )}

      <div className="flex flex-column gap-4">
        {sales.map((sale) => {
          const customer = sale.customer?.person;
          const st = formatStatus(sale.status);

          return (
            <div
              key={sale.id}
              className="p-4 border-1 border-round border-gray-300"
            >
              <div className="flex justify-content-between align-items-center mb-3">
                <div>
                  <div className="text-xl font-bold">Venta #{sale.id}</div>
                  <div className="text-600 text-sm">{formatDate(sale.sale_date)}</div>
                </div>

                <Tag value={st.label} severity={st.severity} />
              </div>

              <div className="flex align-items-center gap-3 mb-3">
                <Avatar
                  image={customer?.imagen}
                  label={!customer?.imagen ? customer?.nombres?.charAt(0) : ""}
                  shape="circle"
                  size="large"
                />
                <div>
                  <div className="font-semibold text-lg">
                    {customer
                      ? `${customer.nombres} ${customer.apellido_paterno}`
                      : "Sin cliente"}
                  </div>
                  <div className="text-600 text-sm">{sale.direccion_envio}</div>
                </div>
              </div>

              <div className="grid text-sm">
                <div className="col-12 md:col-3 flex flex-column">
                  <span className="text-600 text-xs mb-1">Total</span>
                  <span className="text-xl font-bold text-green-600">
                    S/ {Number(sale.total).toFixed(2)}
                  </span>
                </div>

                <div className="col-6 md:col-2 flex flex-column">
                  <span className="text-600 text-xs mb-1">Subtotal</span>
                  <span>S/ {Number(sale.subtotal).toFixed(2)}</span>
                </div>

                <div className="col-6 md:col-2 flex flex-column">
                  <span className="text-600 text-xs mb-1">Impuesto</span>
                  <span>S/ {Number(sale.tax).toFixed(2)}</span>
                </div>

                <div className="col-6 md:col-2 flex flex-column">
                  <span className="text-600 text-xs mb-1">Productos</span>
                  <span className="font-semibold">{itemsCount(sale.items)}</span>
                </div>

                <div className="col-6 md:col-3 flex align-items-end justify-content-end">
                  <SaleDetailModal saleId={sale.id} onStatusUpdated={loadSales} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Container>
  );
}
