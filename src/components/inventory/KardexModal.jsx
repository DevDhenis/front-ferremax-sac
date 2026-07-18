import { useState, useEffect } from "react";
import { useAuth } from "@/services/auth/authContext";
import CustomModal from "../common/CustomModal";
import StatusBadge from "../common/StatusBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { getKardex } from "@/services/inventory";
import { movementBadge, movementDirection, formatQty, formatDateTime } from "./inventoryMovementConfig";

function SignedQty({ movement }) {
  const dir = movementDirection(movement);
  const qty = formatQty(movement.quantity);
  if (dir === "in") return <span className="text-success font-semibold">+{qty}</span>;
  if (dir === "out") return <span className="text-destructive font-semibold">−{qty}</span>;
  return <span className="text-warning font-semibold">±{qty}</span>;
}

export default function KardexModal({ visible, onHide, product }) {
  const { http } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!visible || !product) return;
    setData(null);
    setLoading(true);
    getKardex(http, product.id)
      .then((r) => setData(r.data))
      .catch((e) => console.error("Error cargando kardex:", e))
      .finally(() => setLoading(false));
  }, [visible, product, http]);

  const summary = data?.product;
  const movements = data?.movements ?? [];

  return (
    <CustomModal
      visible={visible}
      onHide={onHide}
      header={
        <span className="flex items-center gap-2">
          Trazabilidad
          {summary && (
            <span className="font-spec text-xs text-muted-foreground">· {summary.internal_code}</span>
          )}
        </span>
      }
      className="w-[94vw] md:w-[74vw] lg:w-[60vw]"
    >
      {/* Resumen del producto */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-4 border-b border-border/40">
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Producto
          </span>
          <p className="text-sm font-bold text-foreground m-0">{product?.name}</p>
        </div>
        {summary && (
          <div className="flex items-center gap-5">
            <div className="text-right">
              <span className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">Stock actual</span>
              <p className="font-spec text-lg font-extrabold text-foreground m-0">
                {formatQty(summary.stock)} {summary.unit}
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">Mínimo</span>
              <p className="font-spec text-sm text-muted-foreground m-0">{formatQty(summary.minimum_quantity)}</p>
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-9 w-full" />
          ))}
        </div>
      ) : movements.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-10 m-0">
          Este producto todavía no tiene movimientos registrados.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="text-left border-b border-border/60">
                {["Fecha", "Tipo", "Cant.", "Saldo", "Responsable", "Motivo"].map((h, i) => (
                  <th
                    key={h}
                    className={`font-semibold text-[10px] uppercase tracking-[0.12em] text-muted-foreground pb-2 pr-3 ${
                      i >= 2 && i <= 3 ? "text-right" : ""
                    }`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {movements.map((m) => {
                const badge = movementBadge(m);
                return (
                  <tr key={m.id} className="border-b border-border/40 last:border-0 align-top">
                    <td className="font-spec text-xs text-muted-foreground py-2.5 pr-3 whitespace-nowrap">
                      {formatDateTime(m.movement_date)}
                    </td>
                    <td className="py-2.5 pr-3">
                      <StatusBadge tone={badge.tone}>{badge.label}</StatusBadge>
                    </td>
                    <td className="font-spec py-2.5 pr-3 text-right whitespace-nowrap">
                      <SignedQty movement={m} />
                    </td>
                    <td className="font-spec font-bold text-foreground py-2.5 pr-3 text-right whitespace-nowrap">
                      {formatQty(m.stock_after)}
                    </td>
                    <td className="text-xs text-muted-foreground py-2.5 pr-3 whitespace-nowrap">{m.employee}</td>
                    <td className="text-xs text-muted-foreground py-2.5 max-w-[14rem]">{m.reason || "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </CustomModal>
  );
}
