import { useState, useEffect } from "react";
import CustomModal from "@/components/common/CustomModal";
import ActionButton from "@/components/common/ActionButton";
import { Input } from "@/components/ui/input";

function Field({ label, htmlFor, children, className = "" }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label htmlFor={htmlFor} className="text-xs font-semibold text-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}

const EMPTY = { name: "", ruc: "", contact_name: "", phone: "", email: "", address: "", status: "A" };

export default function SupplierFormModal({ visible, onHide, supplier, onSave }) {
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!visible) return;
    if (supplier) {
      setForm({
        name: supplier.name ?? "",
        ruc: supplier.ruc ?? "",
        contact_name: supplier.contact_name ?? "",
        phone: supplier.phone ?? "",
        email: supplier.email ?? "",
        address: supplier.address ?? "",
        status: supplier.status ?? "A",
      });
    } else {
      setForm(EMPTY);
    }
  }, [visible, supplier]);

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async () => {
    if (!form.name.trim()) return;
    setLoading(true);
    try {
      const payload = { ...form, ruc: form.ruc || null };
      if (supplier) await onSave.update(supplier.id, payload);
      else await onSave.create(payload);
      onHide();
    } catch {
      // Interceptor already toasted the error.
    } finally {
      setLoading(false);
    }
  };

  const footerActions = (
    <div className="flex justify-end gap-2 w-full">
      <ActionButton label="Cancelar" icon="pi pi-times" color="secondary" onClick={onHide} disabled={loading} />
      <ActionButton
        label={supplier ? "Actualizar" : "Guardar proveedor"}
        icon="pi pi-check"
        color="success"
        onClick={handleSubmit}
        loading={loading}
        disabled={loading || !form.name.trim()}
      />
    </div>
  );

  return (
    <CustomModal
      visible={visible}
      onHide={onHide}
      header={supplier ? "Editar proveedor" : "Agregar proveedor"}
      footerActions={footerActions}
      className="w-[92vw] md:w-[64vw] lg:w-[48vw]"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Nombre / Razón social *" htmlFor="sup_name" className="sm:col-span-2">
          <Input id="sup_name" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Ej: Distribuidora Andina S.A.C." className="h-9 bg-card" />
        </Field>
        <Field label="RUC" htmlFor="sup_ruc">
          <Input id="sup_ruc" value={form.ruc} onChange={(e) => set("ruc", e.target.value)} placeholder="11 dígitos" className="h-9 bg-card font-spec" />
        </Field>
        <Field label="Persona de contacto" htmlFor="sup_contact">
          <Input id="sup_contact" value={form.contact_name} onChange={(e) => set("contact_name", e.target.value)} placeholder="Nombre del contacto" className="h-9 bg-card" />
        </Field>
        <Field label="Teléfono" htmlFor="sup_phone">
          <Input id="sup_phone" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="Ej: 999888777" className="h-9 bg-card font-spec" />
        </Field>
        <Field label="Correo" htmlFor="sup_email">
          <Input id="sup_email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="ventas@proveedor.pe" className="h-9 bg-card" />
        </Field>
        <Field label="Dirección" htmlFor="sup_address" className="sm:col-span-2">
          <Input id="sup_address" value={form.address} onChange={(e) => set("address", e.target.value)} placeholder="Dirección del proveedor" className="h-9 bg-card" />
        </Field>
        <label className="sm:col-span-2 flex items-center gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={form.status === "A"}
            onChange={(e) => set("status", e.target.checked ? "A" : "I")}
            className="size-4 rounded border border-input accent-primary cursor-pointer"
          />
          <span className="text-sm font-medium text-foreground">Proveedor activo</span>
        </label>
      </div>
    </CustomModal>
  );
}
