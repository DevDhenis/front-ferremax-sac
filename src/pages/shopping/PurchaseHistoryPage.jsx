import { useEffect, useState } from "react";
import { useMySales } from "@/hooks/useMySales";
import { ProgressSpinner } from "primereact/progressspinner";
import { Tag } from "primereact/tag";
import { Avatar } from "primereact/avatar";
import Header from "@/components/layout/Header";
import Container from "@/components/layout/Container";
import PurchaseHistory from "../../assets/images/purchase-history.png";
import DetailPurchaseModal from "@/components/shopping/DetailPurchaseModal";

export default function PurchaseHistoryPage() {
  const { loading, handleGetMySales } = useMySales();
  const [compras, setCompras] = useState([]);

  useEffect(() => {
    const cargar = async () => {
      const data = await handleGetMySales();
      setCompras(data || []);
    };
    cargar();
  }, []);

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

  const formatMoney = (v) => `S/ ${Number(v || 0).toFixed(2)}`;

  // const itemsCount = (c) =>
  //   c.items?.reduce((acc, it) => acc + Number(it.quantity || 0), 0) || 0;

  const itemsCount = (c) => c.items?.length || 0;

  if (loading) {
    return (
      <Container>
        <div className="flex flex-column align-items-center justify-content-center py-6">
          <ProgressSpinner />
          <p className="mt-2 text-700">Cargando historial de compras...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Header
        title="Historial de compras"
        subtitle="Consulta el detalle de tus compras realizadas en la tienda."
      />

      <div className="grid mt-3">
        {/* Columna principal: lista de compras */}
        <div className="col-12 lg:col-9 flex flex-column gap-4">
          {compras.map((c) => {
            const st = formatStatus(c.status);
            const totalItems = itemsCount(c);
            const primerItem = c.items?.[0];
            const pago = c.payments?.[0];

            return (
              <div
                key={c.id}
                className="p-4 border-1 border-round border-gray-300"
              >
                {/* Encabezado compra */}
                <div className="flex justify-content-between align-items-center mb-3">
                  <div>
                    <div className="text-xl font-bold">Compra #{c.id}</div>
                    <div className="text-600 text-sm">
                      {formatDate(c.sale_date)}
                    </div>
                  </div>

                  <Tag value={st.label} severity={st.severity} />
                </div>

                {/* Resumen principal */}
                <div className="flex align-items-center gap-4 mb-3">
                  <Avatar
                    image={primerItem?.product?.imagen}
                    shape="square"
                    size="xlarge"
                  />

                  <div className="flex flex-column gap-1">
                    <span className="text-900 font-semibold">
                      {totalItems} producto(s)
                    </span>
                    <span className="text-sm text-600">
                      {primerItem?.product?.nombre}
                      {totalItems > 1 ? " y más..." : ""}
                    </span>

                    <span className="text-green-700 font-bold text-lg mt-2">
                      Total pagado: {formatMoney(c.total)}
                    </span>
                  </div>
                </div>

                {/* Info secundaria */}
                <div className="grid text-sm text-600 mt-2">
                  <div className="col-12 md:col-4">
                    <span className="font-semibold text-700">Resumen:</span>
                    <div>Subtotal: {formatMoney(c.subtotal)}</div>
                    <div>IGV: {formatMoney(c.tax)}</div>
                  </div>

                  <div className="col-12 md:col-4">
                    <span className="font-semibold text-700">Pago:</span>
                    <div>Método: {pago?.method || "No registrado"}</div>
                    <div>Estado: {pago?.status || "—"}</div>
                  </div>

                  <div className="col-12 md:col-4">
                    <span className="font-semibold text-700">Envío:</span>
                    <div className="truncate-2-lines">
                      {c.direccion_envio || "Sin dirección de envío"}
                    </div>
                  </div>

                  <div className="flex justify-content-end w-full">
                    <DetailPurchaseModal sale={c} />
                  </div>
                </div>
              </div>
            );
          })}

          {/* Estado vacío con diseño agradable */}
          {compras.length === 0 && (
            <div className="flex flex-column align-items-center justify-content-center py-6 fadein animation-duration-400">
              <img
                src={PurchaseHistory}
                alt="Sin compras"
                style={{ width: "120px", opacity: 0.85 }}
                className="mb-3"
              />

              <h3 className="text-900 font-bold mb-2">
                Aún no tienes compras registradas
              </h3>

              <p
                className="text-600 text-center mb-3"
                style={{ maxWidth: "320px" }}
              >
                Cuando realices una compra, podrás ver aquí el detalle de cada
                pedido, sus productos, pagos y estados.
              </p>
            </div>
          )}
        </div>

        {/* Columna lateral: resumen global */}
        <div className="col-12 lg:col-3">
          <div className="surface-card shadow-2 border-round p-3 flex flex-column gap-3">
            <h3 className="text-lg font-bold text-900 mb-2">
              Resumen general
            </h3>

            <div className="flex justify-content-between align-items-center">
              <span className="text-600 text-sm">Compras realizadas</span>
              <span className="font-bold text-900">{compras.length}</span>
            </div>

            <div className="flex justify-content-between align-items-center">
              <span className="text-600 text-sm">Total gastado (aprox.)</span>
              <span className="font-bold text-green-700">
                {formatMoney(
                  compras.reduce(
                    (acc, c) => acc + Number(c.total || 0),
                    0
                  )
                )}
              </span>
            </div>

            {compras.length > 0 && (
              <div className="flex flex-column mt-2">
                <span className="text-600 text-sm mb-1">
                  Última compra
                </span>
                <span className="font-medium text-900">
                  #{compras[0].id} – {formatDate(compras[0].sale_date)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
}
