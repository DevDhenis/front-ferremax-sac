import { useState, useEffect, useMemo } from "react";
import CustomModal from "../common/CustomModal";
import ActionButton from "../common/ActionButton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { REGISTER_MOVEMENT_OPTIONS, formatQty } from "./inventoryMovementConfig";

function Field({ label, htmlFor, children, hint, className = "" }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label htmlFor={htmlFor} className="text-xs font-semibold text-foreground">
        {label}
      </label>
      {children}
      {hint && <span className="text-[11px] text-muted-foreground">{hint}</span>}
    </div>
  );
}

const EMPTY = { product_id: null, movement_type: "outbound", quantity: "", reason: "", stock_after: "" };

export default function RegisterMovementModal({ visible, onHide, products = [], onSubmit }) {
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) setForm(EMPTY);
  }, [visible]);

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const selectedProduct = useMemo(
    () => products.find((p) => p.id === form.product_id),
    [products, form.product_id]
  );
  const currentStock = selectedProduct ? Number(selectedProduct.stock) : null;
  const isAdjustment = form.movement_type === "adjustment";

  const canSubmit =
    form.product_id &&
    form.movement_type &&
    (isAdjustment ? form.stock_after !== "" : Number(form.quantity) > 0);

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setLoading(true);
    try {
      const payload = {
        product_id: form.product_id,
        movement_type: form.movement_type,
        reason: form.reason || null,
      };
      if (isAdjustment) {
        const target = Number(form.stock_after);
        payload.stock_after = target;
        // Quantity = magnitude of the correction, derived from current stock.
        payload.quantity = Math.abs(target - (currentStock ?? 0)) || 0.001;
      } else {
        payload.quantity = Number(form.quantity);
      }
      await onSubmit(payload);
      onHide();
    } catch {
      // The interceptor already surfaced the error toast; keep the modal open.
    } finally {
      setLoading(false);
    }
  };

  const footerActions = (
    <div className="flex justify-end gap-2 w-full">
      <ActionButton label="Cancelar" icon="pi pi-times" color="secondary" onClick={onHide} disabled={loading} />
      <ActionButton
        label="Registrar movimiento"
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
      header="Registrar movimiento de inventario"
      footerActions={footerActions}
      className="w-[92vw] sm:w-[70vw] md:w-[48vw] lg:w-[38vw]"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field
          label="Producto *"
          htmlFor="mv_product"
          className="sm:col-span-2"
          hint={
            currentStock !== null
              ? `Stock actual: ${formatQty(currentStock)} ${selectedProduct?.unit?.abbreviation ?? ""}`
              : undefined
          }
        >
          <Select
            items={products.map((p) => ({ label: p.name, value: p.id }))}
            value={form.product_id}
            onValueChange={(v) => set("product_id", v)}
          >
            <SelectTrigger id="mv_product">
              <SelectValue placeholder="Seleccione un producto" />
            </SelectTrigger>
            <SelectContent>
              {products.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.internal_code} — {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field label="Tipo de movimiento *" htmlFor="mv_type">
          <Select
            items={REGISTER_MOVEMENT_OPTIONS}
            value={form.movement_type}
            onValueChange={(v) => set("movement_type", v)}
          >
            <SelectTrigger id="mv_type">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              {REGISTER_MOVEMENT_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        {isAdjustment ? (
          <Field
            label="Nuevo stock (objetivo) *"
            htmlFor="mv_target"
            hint="El sistema calcula la diferencia contra el stock actual."
          >
            <Input
              id="mv_target"
              type="number"
              min="0"
              step="0.001"
              value={form.stock_after}
              onChange={(e) => set("stock_after", e.target.value)}
              placeholder="0"
              className="h-9 bg-card font-spec"
            />
          </Field>
        ) : (
          <Field label="Cantidad *" htmlFor="mv_qty">
            <Input
              id="mv_qty"
              type="number"
              min="0.001"
              step="0.001"
              value={form.quantity}
              onChange={(e) => set("quantity", e.target.value)}
              placeholder="0"
              className="h-9 bg-card font-spec"
            />
          </Field>
        )}

        <Field label="Motivo" htmlFor="mv_reason" className="sm:col-span-2">
          <Textarea
            id="mv_reason"
            value={form.reason}
            onChange={(e) => set("reason", e.target.value)}
            placeholder="Ej: Merma, uso interno, baja, ajuste por conteo…"
            rows={2}
            className="bg-card"
          />
        </Field>
      </div>
    </CustomModal>
  );
}
