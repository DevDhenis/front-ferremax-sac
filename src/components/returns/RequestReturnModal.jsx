import { useState, useEffect } from "react";
import { useAuth } from "@/services/auth/authContext";
import CustomModal from "@/components/common/CustomModal";
import ActionButton from "@/components/common/ActionButton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { requestReturn } from "@/services/returns";

export default function RequestReturnModal({ visible, onHide, sale, onSubmitted }) {
  const { http } = useAuth();
  const [quantities, setQuantities] = useState({});
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      setQuantities({});
      setReason("");
    }
  }, [visible, sale]);

  const items = sale?.items ?? [];

  const setQty = (itemId, max, value) => {
    let n = Number(value);
    if (Number.isNaN(n) || n < 0) n = 0;
    if (n > max) n = max;
    setQuantities((q) => ({ ...q, [itemId]: n }));
  };

  const selectedItems = items
    .map((it) => ({ sales_item_id: it.id, quantity: Number(quantities[it.id]) || 0 }))
    .filter((x) => x.quantity > 0);

  const canSubmit = reason.trim() !== "" && selectedItems.length > 0;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setLoading(true);
    try {
      await requestReturn(http, { sale_id: sale.id, reason, items: selectedItems });
      onSubmitted?.();
      onHide();
    } catch {
      // The interceptor already surfaced the error toast.
    } finally {
      setLoading(false);
    }
  };

  const footerActions = (
    <div className="flex justify-end gap-2 w-full">
      <ActionButton label="Cancelar" icon="pi pi-times" color="secondary" onClick={onHide} disabled={loading} />
      <ActionButton
        label="Enviar solicitud"
        icon="pi pi-check"
        color="success"
        onClick={handleSubmit}
        loading={loading}
        disabled={loading || !canSubmit}
      />
    </div>
  );

  return (
    <CustomModal
      visible={visible}
      onHide={onHide}
      header={`Solicitar devolución · Compra #${sale?.id ?? ""}`}
      footerActions={footerActions}
      className="w-[94vw] sm:w-[70vw] md:w-[52vw] lg:w-[42vw]"
    >
      <p className="text-xs text-muted-foreground mb-4">
        Elige los productos y cantidades que deseas devolver, e indica el motivo. La empresa revisará tu solicitud.
      </p>

      <div className="space-y-2.5 mb-5">
        <div className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground px-1">
          <span className="flex-1">Producto</span>
          <span className="w-16 text-right">Comprado</span>
          <span className="w-24 text-right">Devolver</span>
        </div>
        {items.map((it) => (
          <div key={it.id} className="flex items-center gap-3 rounded-lg border border-border/70 bg-card p-2.5">
            <span className="flex-1 text-sm text-foreground truncate">{it.product?.name}</span>
            <span className="w-16 text-right font-spec text-sm text-muted-foreground">{it.quantity}</span>
            <Input
              type="number"
              min={0}
              max={it.quantity}
              step="1"
              value={quantities[it.id] ?? ""}
              onChange={(e) => setQty(it.id, Number(it.quantity), e.target.value)}
              placeholder="0"
              className="w-24 h-9 bg-card font-spec text-right"
            />
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="return_reason" className="text-xs font-semibold text-foreground">
          Motivo de la devolución *
        </label>
        <Textarea
          id="return_reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Ej: El producto llegó dañado / no corresponde a lo pedido…"
          rows={3}
          className="bg-card"
        />
      </div>
    </CustomModal>
  );
}
