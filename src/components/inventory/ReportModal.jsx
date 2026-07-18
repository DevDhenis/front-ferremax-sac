import { useState, useEffect } from "react";
import { useAuth } from "@/services/auth/authContext";
import { useToast } from "@/context/ToastContext";
import CustomModal from "@/components/common/CustomModal";
import ActionButton from "@/components/common/ActionButton";
import DatePicker from "@/components/common/DatePicker";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { getTraceabilityReport } from "@/services/inventory";
import { openTraceabilityReport } from "./traceabilityReport";

function Field({ label, htmlFor, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-xs font-semibold text-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}

export default function ReportModal({ visible, onHide, products = [] }) {
  const { http } = useAuth();
  const { showToast } = useToast();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [productId, setProductId] = useState("all");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      setFrom("");
      setTo("");
      setProductId("all");
    }
  }, [visible]);

  const generate = async () => {
    setLoading(true);
    try {
      const result = await getTraceabilityReport(http, {
        from,
        to,
        product_id: productId === "all" ? undefined : productId,
      });
      const ok = openTraceabilityReport(result.data);
      if (!ok) {
        showToast("warn", "Ventana bloqueada", "Permite las ventanas emergentes para ver el reporte.");
        return;
      }
      onHide();
    } catch (error) {
      console.error("Error generando el reporte:", error);
    } finally {
      setLoading(false);
    }
  };

  const footerActions = (
    <div className="flex justify-end gap-2 w-full">
      <ActionButton label="Cancelar" icon="pi pi-times" color="secondary" onClick={onHide} disabled={loading} />
      <ActionButton
        label="Generar reporte"
        icon="pi pi-file-excel"
        color="primary"
        onClick={generate}
        loading={loading}
      />
    </div>
  );

  return (
    <CustomModal
      visible={visible}
      onHide={onHide}
      header="Reporte de trazabilidad"
      footerActions={footerActions}
      className="w-[92vw] sm:w-[64vw] md:w-[44vw] lg:w-[36vw]"
    >
      <p className="text-xs text-muted-foreground mb-4">
        Genera un documento imprimible (se abre en otra pestaña; guárdalo como PDF con “Imprimir”). Deja los
        filtros vacíos para incluir todo el historial y todos los productos.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Desde" htmlFor="rep_from">
          <DatePicker id="rep_from" value={from} onChange={setFrom} placeholder="Inicio" />
        </Field>
        <Field label="Hasta" htmlFor="rep_to">
          <DatePicker id="rep_to" value={to} onChange={setTo} placeholder="Hoy" />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Producto" htmlFor="rep_product">
            <Select
              items={[{ label: "Todos los productos", value: "all" }, ...products.map((p) => ({ label: p.name, value: String(p.id) }))]}
              value={productId}
              onValueChange={setProductId}
            >
              <SelectTrigger id="rep_product">
                <SelectValue placeholder="Todos los productos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los productos</SelectItem>
                {products.map((p) => (
                  <SelectItem key={p.id} value={String(p.id)}>
                    {p.internal_code} — {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>
      </div>
    </CustomModal>
  );
}
