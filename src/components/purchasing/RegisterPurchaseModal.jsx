import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import CustomModal from "@/components/common/CustomModal";
import ActionButton from "@/components/common/ActionButton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const currency = new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" });
const money = (v) => currency.format(Number(v) || 0);

const emptyLine = () => ({ product_id: null, quantity: "", unit_cost: "" });

export default function RegisterPurchaseModal({ visible, onHide, suppliers = [], products = [], onSubmit }) {
  const [supplierId, setSupplierId] = useState(null);
  const [documentNumber, setDocumentNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [lines, setLines] = useState([emptyLine()]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      setSupplierId(null);
      setDocumentNumber("");
      setNotes("");
      setLines([emptyLine()]);
    }
  }, [visible]);

  const setLine = (i, field, value) => setLines((ls) => ls.map((l, idx) => (idx === i ? { ...l, [field]: value } : l)));
  const addLine = () => setLines((ls) => [...ls, emptyLine()]);
  const removeLine = (i) => setLines((ls) => (ls.length > 1 ? ls.filter((_, idx) => idx !== i) : ls));

  const validLines = lines
    .filter((l) => l.product_id && Number(l.quantity) > 0 && Number(l.unit_cost) >= 0)
    .map((l) => ({ product_id: l.product_id, quantity: Number(l.quantity), unit_cost: Number(l.unit_cost) }));

  const subtotal = validLines.reduce((s, l) => s + l.quantity * l.unit_cost, 0);
  const total = subtotal * 1.18;
  const canSubmit = supplierId && validLines.length > 0;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setLoading(true);
    try {
      await onSubmit({ supplier_id: supplierId, document_number: documentNumber || null, notes: notes || null, items: validLines });
      onHide();
    } catch {
      // interceptor toasted
    } finally {
      setLoading(false);
    }
  };

  const footerActions = (
    <div className="flex items-center justify-between gap-2 w-full">
      <span className="text-sm text-muted-foreground">
        Total (IGV inc.): <span className="font-spec font-bold text-foreground">{money(total)}</span>
      </span>
      <div className="flex gap-2">
        <ActionButton label="Cancelar" icon="pi pi-times" color="secondary" onClick={onHide} disabled={loading} />
        <ActionButton label="Registrar compra" icon="pi pi-check" color="success" onClick={handleSubmit} loading={loading} disabled={loading || !canSubmit} />
      </div>
    </div>
  );

  return (
    <CustomModal visible={visible} onHide={onHide} header="Registrar compra a proveedor" footerActions={footerActions} className="w-[95vw] md:w-[74vw] lg:w-[60vw]">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div className="sm:col-span-2 flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-foreground">Proveedor *</label>
          <Select items={suppliers.map((s) => ({ label: s.name, value: String(s.id) }))} value={supplierId ? String(supplierId) : null} onValueChange={(v) => setSupplierId(Number(v))}>
            <SelectTrigger><SelectValue placeholder="Selecciona el proveedor" /></SelectTrigger>
            <SelectContent>
              {suppliers.map((s) => (
                <SelectItem key={s.id} value={String(s.id)}>{s.name}{s.ruc ? ` — ${s.ruc}` : ""}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-foreground">N° documento</label>
          <Input value={documentNumber} onChange={(e) => setDocumentNumber(e.target.value)} placeholder="Factura / guía" className="h-9 bg-card font-spec" />
        </div>
      </div>

      {/* Líneas de productos */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground px-1">
          <span className="flex-1">Producto</span>
          <span className="w-24 text-right">Cantidad</span>
          <span className="w-28 text-right">Costo unit.</span>
          <span className="w-24 text-right">Subtotal</span>
          <span className="w-8" />
        </div>
        {lines.map((l, i) => {
          const lineSub = (Number(l.quantity) || 0) * (Number(l.unit_cost) || 0);
          return (
            <div key={i} className="flex items-center gap-2">
              <div className="flex-1 min-w-0">
                <Select items={products.map((p) => ({ label: p.name, value: String(p.id) }))} value={l.product_id ? String(l.product_id) : null} onValueChange={(v) => setLine(i, "product_id", Number(v))}>
                  <SelectTrigger><SelectValue placeholder="Producto" /></SelectTrigger>
                  <SelectContent>
                    {products.map((p) => (
                      <SelectItem key={p.id} value={String(p.id)}>{p.internal_code} — {p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Input type="number" min="0" step="1" value={l.quantity} onChange={(e) => setLine(i, "quantity", e.target.value)} placeholder="0" className="w-24 h-9 bg-card font-spec text-right" />
              <Input type="number" min="0" step="0.01" value={l.unit_cost} onChange={(e) => setLine(i, "unit_cost", e.target.value)} placeholder="0.00" className="w-28 h-9 bg-card font-spec text-right" />
              <span className="w-24 text-right font-spec text-sm text-muted-foreground">{money(lineSub)}</span>
              <button type="button" onClick={() => removeLine(i)} className="w-8 h-9 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive-bg" title="Quitar">
                <Trash2 className="size-4" />
              </button>
            </div>
          );
        })}
        <button type="button" onClick={addLine} className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline mt-1">
          <Plus className="size-3.5" /> Agregar producto
        </button>
      </div>

      <div className="mt-4">
        <label className="text-xs font-semibold text-foreground">Observaciones</label>
        <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} placeholder="Opcional" className="bg-card mt-1.5" />
      </div>
    </CustomModal>
  );
}
