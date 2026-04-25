import CustomModal from "../common/CustomModal";
import { Tag } from "primereact/tag";
import { Divider } from "primereact/divider";
import { useState } from "react";
import ActionButton from "../common/ActionButton";

export default function DetailPurchaseModal({ sale }) {
  const [visible, setVisible] = useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  if (!sale) return null;

  const formatMoney = (v) => `S/ ${Number(v || 0).toFixed(2)}`;

  const formatDateTime = (dateString) => {
    const utcDate = new Date(dateString + " UTC");
    return utcDate.toLocaleString("es-PE", {
      timeZone: "America/Lima",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const formatStatus = (status) => {
    const map = {
      pendiente_envio: { label: "Pendiente de envío", severity: "warning" },
      en_preparacion: { label: "En preparación", severity: "info" },
      en_camino: { label: "En camino", severity: "info" },
      entregado: { label: "Entregado", severity: "success" },
      cancelado: { label: "Cancelado", severity: "danger" }
    };
    return map[status] || { label: status, severity: null };
  };

  const formatQty = (q, unit) => {
    const qty = Number(q);
    const u = unit?.nombre?.toLowerCase() || "";
    return `${qty} ${u}`;
  };

  const st = formatStatus(sale.status);
  const pago = sale.payments?.[0];

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
        className="w-12"
        footerActions={null}
      >
        <div className="flex flex-column gap-4">

          <div className="flex justify-content-between align-items-center">
            <div className="flex flex-column">
              <span className="text-sm text-600">Fecha de compra</span>
              <span className="font-semibold">{formatDateTime(sale.sale_date)}</span>
            </div>
            <Tag value={st.label} severity={st.severity} />
          </div>

          <Divider />

          <div className="grid px-3">
            <div className="col-12 lg:col-4 flex flex-column gap-1">
              <span className="text-sm text-600">Resumen</span>
              <span>Subtotal: {formatMoney(sale.subtotal)}</span>
              <span>IGV: {formatMoney(sale.tax)}</span>
              <span className="text-lg font-bold text-green-700">
                Total: {formatMoney(sale.total)}
              </span>
            </div>

            <div className="col-12 lg:col-4 flex flex-column gap-1">
              <span className="text-sm text-600">Pago</span>
              <span>Método: {pago?.method || "No registrado"}</span>
              <span>Monto: {formatMoney(pago?.amount)}</span>
              <span>Estado: {pago?.status || "—"}</span>
              {pago?.card_last4 && (
                <span>Tarjeta: **** **** **** {pago.card_last4}</span>
              )}
            </div>

            <div className="col-12 lg:col-4 flex flex-column gap-1">
              <span className="text-sm text-600">Envío</span>
              <span className="text-900">{sale.direccion_envio || "Sin dirección de envío"}</span>
            </div>
          </div>

          <Divider />

          <div>
            <h3 className="text-lg font-semibold mb-3">Productos</h3>

            <div className="flex flex-column gap-3">
              {sale.items.map((item) => {
                const prod = item.product;
                const price = Number(item.price);
                const discount = Number(prod.descuento || 0);

                const finalPrice =
                  discount > 0 ? price - (price * discount) / 100 : price;

                return (
                  <div
                    key={item.id}
                    className="p-3 border-1 surface-border border-round flex gap-3 align-items-start"
                  >
                    <img
                      src={prod.imagen}
                      alt={prod.nombre}
                      className="border-round"
                      style={{ width: "120px", height: "120px", objectFit: "cover" }}
                    />

                    <div className="flex flex-column justify-content-between flex-1 gap-2">
                      <div className="flex flex-column gap-1">
                        <span className="font-semibold text-lg">{prod.nombre}</span>
                        <span className="text-sm text-600">{prod.descripcion}</span>

                        <div className="flex gap-2 align-items-center mt-2 flex-wrap">
                          {discount > 0 ? (
                            <>
                              <span className="text-green-600 font-bold text-lg">
                                {formatMoney(finalPrice)}
                              </span>
                              <span className="text-500 text-sm line-through">
                                {formatMoney(price)}
                              </span>
                              <span className="text-red-500 text-xs font-bold">
                                -{discount}%
                              </span>
                            </>
                          ) : (
                            <span className="text-900 font-bold text-lg">
                              {formatMoney(price)}
                            </span>
                          )}
                        </div>

                        <span className="text-sm text-700">
                          {formatQty(item.quantity, prod.unit)}
                        </span>
                      </div>
                    </div>

                    <div className="text-right min-w-max">
                      <span className="text-sm text-600">Subtotal</span>
                      <div className="font-bold text-xl">
                        {formatMoney(item.subtotal)}
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
