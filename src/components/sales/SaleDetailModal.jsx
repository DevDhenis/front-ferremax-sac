import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import CustomModal from "../common/CustomModal";
import { useSales } from "@/hooks/useSales";
import ActionButton from "../common/ActionButton";
import { Avatar } from "@/components/ui/avatar";
import StatusBadge from "@/components/common/StatusBadge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const STATUS = {
  pendiente_envio: { label: "Pendiente de envío", tone: "warning" },
  en_preparacion: { label: "En preparación", tone: "muted" },
  en_camino: { label: "En camino", tone: "primary" },
  entregado: { label: "Entregado", tone: "success" },
  cancelado: { label: "Cancelado", tone: "danger" },
};
const getStatus = (s) => STATUS[s] || { label: s, tone: "muted" };
const money = (v) => `S/ ${Number(v).toFixed(2)}`;

const statusOptions = [
  { label: "Pendiente de envío", value: "pendiente_envio" },
  { label: "En preparación", value: "en_preparacion" },
  { label: "En camino", value: "en_camino" },
  { label: "Entregado", value: "entregado" },
  { label: "Cancelado", value: "cancelado" },
];

function MoneyStat({ label, value, accent }) {
  return (
    <div className="flex flex-col">
      <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </span>
      <span className={`font-spec text-base font-bold ${accent ? "text-success" : "text-foreground"}`}>
        {value}
      </span>
    </div>
  );
}

export default function SaleDetailModal({ saleId, onStatusUpdated }) {
  const { loading, handleGetSaleDetail, handleChangeStatus } = useSales();
  const [sale, setSale] = useState(null);
  const [visible, setVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);

  const loadDetail = async () => {
    if (!saleId) return;
    const data = await handleGetSaleDetail(saleId);
    setSale(data);
    setSelectedStatus(data.status);
  };

  useEffect(() => {
    if (visible) loadDetail();
  }, [visible]);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const handleSaveStatus = async () => {
    if (!selectedStatus) return;
    await handleChangeStatus(saleId, selectedStatus, null);
    await loadDetail();
    if (typeof onStatusUpdated === "function") onStatusUpdated();
  };

  const footerActions = (
    <div className="flex justify-between w-full gap-2">
      <ActionButton
        label="Cerrar"
        icon="pi pi-times"
        color="secondary"
        onClick={hideModal}
      />
      <ActionButton
        label="Guardar cambios"
        icon="pi pi-save"
        color="primary"
        onClick={handleSaveStatus}
      />
    </div>
  );

  const st = sale ? getStatus(sale.status) : null;
  const customer = sale?.customer?.person;

  return (
    <>
      <ActionButton
        icon="pi pi-angle-right"
        iconPos="right"
        label="Ver detalle"
        color="primary"
        onClick={showModal}
      />

      <CustomModal
        visible={visible}
        onHide={hideModal}
        header={`Detalle de venta #${saleId}`}
        className="w-[92vw] sm:w-[76vw] md:w-[58vw] lg:w-[48vw]"
        footerActions={footerActions}
      >
        {loading || !sale ? (
          <div className="flex flex-col items-center py-10">
            <Loader2 className="size-8 animate-spin text-primary mb-3" />
            <span className="text-sm text-muted-foreground">Cargando detalle…</span>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {/* Cliente + estado */}
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-3">
                <Avatar
                  src={customer?.imagen}
                  fallback={customer?.nombres?.charAt(0) || "?"}
                  className="size-11"
                />
                <div className="flex flex-col">
                  <span className="font-semibold text-foreground">
                    {customer?.nombres} {customer?.apellido_paterno}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {sale.direccion_envio}
                  </span>
                </div>
              </div>
              <StatusBadge tone={st.tone}>{st.label}</StatusBadge>
            </div>

            {/* Cambiar estado */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-foreground">
                Cambiar estado del pedido
              </label>
              <Select items={statusOptions} value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full sm:w-64">
                  <SelectValue placeholder="Selecciona un estado" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Resumen */}
            <div className="grid grid-cols-3 gap-3 rounded-xl border border-border/80 bg-secondary/30 p-4">
              <MoneyStat label="Subtotal" value={money(sale.subtotal)} />
              <MoneyStat label="Impuesto" value={money(sale.tax)} />
              <MoneyStat label="Total" value={money(sale.total)} accent />
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
        )}
      </CustomModal>
    </>
  );
}
