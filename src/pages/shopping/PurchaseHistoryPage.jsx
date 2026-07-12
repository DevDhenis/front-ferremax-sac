import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useMySales } from "@/hooks/useMySales";
import Header from "@/components/layout/Header";
import Container from "@/components/layout/Container";
import PurchaseHistory from "../../assets/images/purchase-history.png";
import DetailPurchaseModal from "@/components/shopping/DetailPurchaseModal";
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
const money = (v) => `S/ ${Number(v || 0).toFixed(2)}`;

function MetaBlock({ label, children }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </span>
      {children}
    </div>
  );
}

export default function PurchaseHistoryPage() {
  const { loading, handleGetMySales } = useMySales();
  const [compras, setCompras] = useState([]);

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await handleGetMySales();
        setCompras(data || []);
      } catch {
        // Sin compras o usuario no-cliente: se muestra el estado vacío.
        setCompras([]);
      }
    };
    cargar();
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

  if (loading) {
    return (
      <Container>
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="size-8 animate-spin text-primary mb-3" />
          <p className="text-sm text-muted-foreground">Cargando historial de compras…</p>
        </div>
      </Container>
    );
  }

  const totalGastado = compras.reduce((acc, c) => acc + Number(c.total || 0), 0);

  return (
    <Container>
      <Header
        title="Historial de compras"
        subtitle="Consulta el detalle de tus compras realizadas en la tienda."
      />

      <div className="grid grid-cols-12 gap-6 mt-6">
        {/* Lista de compras */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-4">
          {compras.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 rounded-xl border border-dashed border-border/80 bg-card text-center">
              <img src={PurchaseHistory} alt="" className="w-28 opacity-80 mb-3" />
              <h3 className="text-foreground font-bold mb-1">
                Aún no tienes compras registradas
              </h3>
              <p className="text-xs text-muted-foreground max-w-xs">
                Cuando realices una compra, verás aquí el detalle de cada pedido:
                productos, pagos y estados.
              </p>
            </div>
          ) : (
            compras.map((c) => {
              const st = getStatus(c.status);
              const totalItems = c.items?.length || 0;
              const primerItem = c.items?.[0];
              const pago = c.payments?.[0];

              return (
                <div
                  key={c.id}
                  className="rounded-xl border border-border/80 bg-card shadow-sm hover:shadow-md transition-shadow p-4 md:p-5"
                >
                  {/* Cabecera */}
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                        Compra
                      </span>
                      <div className="flex items-baseline gap-2">
                        <span className="font-spec text-lg font-bold text-foreground">
                          #{c.id}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(c.sale_date)}
                        </span>
                      </div>
                    </div>
                    <StatusBadge tone={st.tone}>{st.label}</StatusBadge>
                  </div>

                  {/* Resumen del pedido */}
                  <div className="flex items-center gap-3 my-4 py-3 border-y border-border/50">
                    <Avatar
                      src={primerItem?.product?.image}
                      fallback={primerItem?.product?.name?.charAt(0) || "?"}
                      className="size-14 rounded-lg bg-secondary/40"
                    />
                    <div className="min-w-0">
                      <div className="font-semibold text-foreground">
                        <span className="font-spec">{totalItems}</span> producto(s)
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {primerItem?.product?.name}
                        {totalItems > 1 ? " y más…" : ""}
                      </div>
                      <div className="font-spec text-success font-bold mt-1">
                        Total {money(c.total)}
                      </div>
                    </div>
                  </div>

                  {/* Detalles */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <MetaBlock label="Resumen">
                      <span className="text-muted-foreground">
                        Subtotal <span className="font-spec text-foreground">{money(c.subtotal)}</span>
                      </span>
                      <span className="text-muted-foreground">
                        IGV <span className="font-spec text-foreground">{money(c.tax)}</span>
                      </span>
                    </MetaBlock>

                    <MetaBlock label="Pago">
                      <span className="text-foreground">{pago?.method || "No registrado"}</span>
                      <span className="text-muted-foreground">{pago?.status || "—"}</span>
                    </MetaBlock>

                    <MetaBlock label="Envío">
                      <span className="text-foreground line-clamp-2">
                        {c.direccion_envio || "Sin dirección de envío"}
                      </span>
                    </MetaBlock>
                  </div>

                  <div className="flex justify-end mt-4">
                    <DetailPurchaseModal sale={c} />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Panel de resumen */}
        <div className="col-span-12 lg:col-span-4">
          <div className="lg:sticky lg:top-24 rounded-xl border border-border/80 bg-card shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Resumen general
              </span>
              <span className="h-px flex-1 bg-border/60" />
            </div>

            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-muted-foreground">Compras realizadas</span>
              <span className="font-spec font-bold text-foreground">{compras.length}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total gastado</span>
              <span className="font-spec font-bold text-success">{money(totalGastado)}</span>
            </div>

            {compras.length > 0 && (
              <div className="mt-4 pt-4 border-t border-border/60">
                <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  Última compra
                </span>
                <div className="text-sm font-medium text-foreground mt-1">
                  <span className="font-spec">#{compras[0].id}</span> ·{" "}
                  {formatDate(compras[0].sale_date)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
}
