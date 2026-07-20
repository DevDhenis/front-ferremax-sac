import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useSales } from "@/hooks/useSales";
import SaleDetailModal from "@/components/sales/SaleDetailModal";
import SalesImg from "../../assets/images/sales-img.jpg";
import Container from "@/components/layout/Container";
import Header from "@/components/layout/Header";
import { Avatar } from "@/components/ui/avatar";
import StatusBadge from "@/components/common/StatusBadge";

const STATUS = {
  pendiente_envio: { label: "Pendiente de envío", tone: "warning" },
  en_preparacion: { label: "En preparación", tone: "muted" },
  en_camino: { label: "En camino", tone: "primary" },
  entregado: { label: "Entregado", tone: "success" },
  cancelado: { label: "Cancelado", tone: "danger" },
};
const getStatus = (s) => STATUS[s] || { label: s, tone: "muted" };
const money = (v) => `S/ ${Number(v).toFixed(2)}`;

function Metric({ label, value, accent }) {
  return (
    <div className="flex flex-col">
      <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </span>
      <span className={`font-spec text-sm font-bold ${accent ? "text-success" : "text-foreground"}`}>
        {value}
      </span>
    </div>
  );
}

export default function SalesPage() {
  const { loading, handleGetSales } = useSales();
  const [sales, setSales] = useState([]);

  const loadSales = async () => {
    const data = await handleGetSales();
    setSales(data || []);
  };

  useEffect(() => {
    loadSales();
  }, []);

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

  return (
    <Container>
      <Header
        title="Ventas"
        subtitle="Gestiona y visualiza todas las ventas realizadas en tu tienda."
      />

      <div className="flex items-center gap-2 mt-6 mb-4">
        <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Registro de ventas
        </span>
        <span className="h-px flex-1 bg-border/60" />
        <span className="font-spec text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">{sales.length}</span> ventas
        </span>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="size-8 animate-spin text-primary mb-3" />
          <span className="text-sm text-muted-foreground">Cargando ventas…</span>
        </div>
      ) : sales.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-14 rounded-xl border border-dashed border-border/80 bg-card">
          <img src={SalesImg} alt="" className="w-28 opacity-80 mb-3" />
          <p className="text-sm text-muted-foreground">No hay ventas registradas aún.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {sales.map((sale) => {
            const customer = sale.customer?.person;
            const st = getStatus(sale.status);
            const nombre = customer
              ? `${customer.nombres} ${customer.apellido_paterno}`
              : "Sin cliente";

            return (
              <div
                key={sale.id}
                className="rounded-xl border border-border/80 bg-card shadow-sm hover:shadow-md transition-shadow p-4 md:p-5"
              >
                {/* Cabecera */}
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      Venta
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="font-spec text-lg font-bold text-foreground">
                        #{sale.id}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(sale.sale_date)}
                      </span>
                    </div>
                  </div>
                  <StatusBadge tone={st.tone}>{st.label}</StatusBadge>
                </div>

                {/* Cliente */}
                <div className="flex items-center gap-3 my-4 py-3 border-y border-border/50">
                  <Avatar
                    src={customer?.imagen}
                    fallback={customer?.nombres?.charAt(0) || "?"}
                    className="size-10"
                  />
                  <div className="min-w-0">
                    <div className="font-semibold text-foreground truncate">{nombre}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {sale.direccion_envio}
                    </div>
                  </div>
                </div>

                {/* Métricas + acción */}
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div className="flex gap-6">
                    <Metric label="Total" value={money(sale.total)} accent />
                    <Metric label="Subtotal" value={money(sale.subtotal)} />
                    <Metric label="Impuesto" value={money(sale.tax)} />
                    <Metric label="Productos" value={sale.items?.length || 0} />
                  </div>
                  <SaleDetailModal saleId={sale.id} onStatusUpdated={loadSales} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Container>
  );
}
