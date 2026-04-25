import { useState, useEffect } from "react";
import CustomModal from "../common/CustomModal";
import { useSales } from "@/hooks/useSales";
import { Tag } from "primereact/tag";
import { Avatar } from "primereact/avatar";
import ActionButton from "../common/ActionButton";
import { Dropdown } from "primereact/dropdown";
import { ProgressSpinner } from "primereact/progressspinner";

export default function SaleDetailModal({ saleId, onStatusUpdated }) {
  const { loading, handleGetSaleDetail, handleChangeStatus } = useSales();

  const [sale, setSale] = useState(null);
  const [visible, setVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);

  const statusOptions = [
    { label: "Pendiente de envío", value: "pendiente_envio" },
    { label: "En preparación", value: "en_preparacion" },
    { label: "En camino", value: "en_camino" },
    { label: "Entregado", value: "entregado" },
    { label: "Cancelado", value: "cancelado" },
  ];

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

    if (typeof onStatusUpdated === "function") {
      onStatusUpdated();
    }
  };

  const formatStatus = (status) => {
    const map = {
      pendiente_envio: { value: "Pendiente de envío", severity: "warning" },
      en_preparacion: { value: "En preparación", severity: "info" },
      en_camino: { value: "En camino", severity: "info" },
      entregado: { value: "Entregado", severity: "success" },
      cancelado: { value: "Cancelado", severity: "danger" },
    };

    return map[status] || { value: status, severity: null };
  };

  const formatMoney = (v) => `S/ ${Number(v).toFixed(2)}`;

  const footerActions = (
    <div className="flex justify-content-between w-full">
      <ActionButton
        label="Guardar cambios"
        icon="pi pi-save"
        color="primary"
        onClick={handleSaveStatus}
      />
      <ActionButton
        label="Cerrar"
        icon="pi pi-times"
        color="secondary"
        onClick={hideModal}
      />
    </div>
  );

  return (
    <>
      <ActionButton
        icon="pi pi-angle-right"
        label="Ver detalle"
        color="primary"
        onClick={showModal}
      />

      <CustomModal
        visible={visible}
        onHide={hideModal}
        header={`Detalle de Venta #${saleId}`}
        className="w-12"
        footerActions={footerActions}
      >
        {loading || !sale ? (
          <div className="flex flex-column align-items-center py-4">
            <ProgressSpinner />
            <span className="text-700 font-medium">Cargando detalle...</span>
          </div>
        ) : (
          <div className="flex flex-column gap-4">

            <div className="flex justify-content-between align-items-center">
              <div className="flex align-items-center gap-3">
                <Avatar
                  image={sale.customer?.person?.imagen}
                  label={sale.customer?.person?.nombres?.charAt(0)}
                  shape="circle"
                  size="large"
                />
                <div className="flex flex-column">
                  <span className="font-semibold text-lg">
                    {sale.customer?.person?.nombres} {sale.customer?.person?.apellido_paterno}
                  </span>
                  <span className="text-sm text-600">{sale.direccion_envio}</span>
                </div>
              </div>

              <Tag {...formatStatus(sale.status)} />
            </div>

            <div className="flex flex-column gap-1">
              <span className="text-sm font-medium">Cambiar estado del pedido</span>
              <Dropdown
                value={selectedStatus}
                options={statusOptions}
                onChange={(e) => setSelectedStatus(e.value)}
                className="w-full md:w-14rem"
              />
            </div>

            <div className="grid">
              <div className="col-4 flex flex-column">
                <span className="text-600 text-xs">Subtotal</span>
                <span className="font-bold">{formatMoney(sale.subtotal)}</span>
              </div>

              <div className="col-4 flex flex-column">
                <span className="text-600 text-xs">Impuesto</span>
                <span className="font-bold">{formatMoney(sale.tax)}</span>
              </div>

              <div className="col-4 flex flex-column">
                <span className="text-600 text-xs">Total</span>
                <span className="font-bold text-green-600">{formatMoney(sale.total)}</span>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Productos</h3>

              <div className="flex flex-column gap-3">
                {sale.items.map((item) => {
                  const prod = item.product;
                  const price = Number(item.price);
                  const discount = Number(prod.descuento || 0);
                  const qty = Number(item.quantity);

                  const finalPrice =
                    discount > 0 ? price - (price * discount) / 100 : price;

                  const unitName = prod.unit?.nombre?.toLowerCase() || "";

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
                                  S/ {finalPrice.toFixed(2)}
                                </span>
                                <span className="text-500 text-sm line-through">
                                  S/ {price.toFixed(2)}
                                </span>
                                <span className="text-red-500 text-xs font-bold">
                                  -{discount}%
                                </span>
                              </>
                            ) : (
                              <span className="text-900 font-bold text-lg">
                                S/ {price.toFixed(2)}
                              </span>
                            )}
                          </div>

                          <span className="text-sm text-700">
                            Cantidad: {qty} {unitName}
                          </span>
                        </div>
                      </div>

                      <div className="text-right min-w-max">
                        <span className="text-sm text-600">Subtotal</span>
                        <div className="font-bold text-xl">
                          S/ {Number(item.subtotal).toFixed(2)}
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
