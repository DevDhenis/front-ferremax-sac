import { useState } from "react";
import CustomModal from "../common/CustomModal";
import ActionButton from "../common/ActionButton";
import StatusBadge from "../common/StatusBadge";

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
      <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground mb-0.5">
        {label}
      </span>
      {children}
    </div>
  );
}

export default function DetailPurchaseModal({ sale }) {
  const [visible, setVisible] = useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  if (!sale) return null;

  const formatDateTime = (dateString) => {
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

  const st = getStatus(sale.status);
  const pago = sale.payments?.[0];

  const footerActions = (
    <div className="flex justify-end w-full">
      <ActionButton label="Cerrar" icon="pi pi-times" color="secondary" onClick={hideModal} />
    </div>
  );

  return (
    <>
      <ActionButton
        icon="pi pi-shopping-cart"
        color="primary"
        onClick={showModal}
        label="Ver detalle"
        rounded
      />

      <CustomModal
        visible={visible}
        onHide={hideModal}
        header={`Detalle de compra #${sale.id}`}
        className="w-[92vw] sm:w-[76vw] md:w-[58vw] lg:w-[48vw]"
        footerActions={footerActions}
      >
        <div className="flex flex-col gap-5">
          {/* Fecha + estado */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex flex-col">
              <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Fecha de compra
              </span>
              <span className="font-medium text-foreground">
                {formatDateTime(sale.sale_date)}
              </span>
            </div>
            <StatusBadge tone={st.tone}>{st.label}</StatusBadge>
          </div>

          {/* Resumen / Pago / Envío */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 rounded-xl border border-border/80 bg-secondary/30 p-4 text-sm">
            <MetaBlock label="Resumen">
              <span className="text-muted-foreground">
                Subtotal <span className="font-spec text-foreground">{money(sale.subtotal)}</span>
              </span>
              <span className="text-muted-foreground">
                IGV <span className="font-spec text-foreground">{money(sale.tax)}</span>
              </span>
              <span className="text-foreground font-semibold mt-0.5">
                Total <span className="font-spec text-success">{money(sale.total)}</span>
              </span>
            </MetaBlock>

            <MetaBlock label="Pago">
              <span className="text-foreground">{pago?.method || "No registrado"}</span>
              <span className="text-muted-foreground">
                Monto <span className="font-spec text-foreground">{money(pago?.amount)}</span>
              </span>
              <span className="text-muted-foreground">{pago?.status || "—"}</span>
              {pago?.card_last4 && (
                <span className="font-spec text-muted-foreground">•••• {pago.card_last4}</span>
              )}
            </MetaBlock>

            <MetaBlock label="Envío">
              <span className="text-foreground line-clamp-3">
                {sale.direccion_envio || "Sin dirección de envío"}
              </span>
            </MetaBlock>
          </div>

          {/* Productos */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Productos ({sale.items.length})
              </span>
              <span className="h-px flex-1 bg-border/60" />
            </div>

            <div className="flex flex-col gap-3">
              {sale.items.map((item) => {
                const prod = item.product;
                const price = Number(item.price);
                const discount = Number(prod.descuento || 0);
                const qty = Number(item.quantity);
                const finalPrice = discount > 0 ? price - (price * discount) / 100 : price;
                const unitName = prod.unit?.abreviatura || "";

                return (
                  <div
                    key={item.id}
                    className="flex gap-3 p-3 rounded-xl border border-border/80 bg-card"
                  >
                    <img
                      src={prod.imagen}
                      alt={prod.nombre}
                      className="size-16 shrink-0 rounded-lg border border-border/60 bg-secondary/30 object-contain p-1"
                    />

                    <div className="flex-1 min-w-0">
                      <h5 className="m-0 text-sm font-semibold text-foreground truncate">
                        {prod.nombre}
                      </h5>
                      {prod.descripcion && (
                        <p className="m-0 mt-0.5 text-xs text-muted-foreground line-clamp-1">
                          {prod.descripcion}
                        </p>
                      )}

                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="font-spec text-sm font-bold text-foreground">
                          {money(finalPrice)}
                        </span>
                        {discount > 0 && (
                          <>
                            <span className="font-spec text-xs text-muted-foreground line-through">
                              {money(price)}
                            </span>
                            <span className="font-spec text-[11px] font-bold text-destructive">
                              -{discount}%
                            </span>
                          </>
                        )}
                      </div>

                      <p className="m-0 mt-1 text-[11px] text-muted-foreground">
                        Cantidad:{" "}
                        <span className="font-spec">
                          {qty} {unitName}
                        </span>
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                        Subtotal
                      </div>
                      <div className="font-spec text-base font-bold text-foreground">
                        {money(item.subtotal)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </CustomModal>
    </>
  );
}
