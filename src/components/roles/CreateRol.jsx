import { useState, useEffect } from "react";
import ActionButton from "../common/ActionButton";
import CustomModal from "../common/CustomModal";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/services/auth/authContext";

export default function CreateRol({ onCreated }) {
  const { http } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [accesses, setAccesses] = useState([]);
  const [selectedAccesses, setSelectedAccesses] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAccesses = async () => {
    try {
      const { data } = await http.get("/accesses");
      if (data.success) setAccesses(data.data);
    } catch (err) {
      console.error("Error cargando accesos:", err);
    }
  };

  useEffect(() => {
    if (isOpen) getAccesses();
  }, [isOpen]);

  const toggleAccess = (id) => {
    setSelectedAccesses((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    if (!nombre.trim()) return;
    try {
      setLoading(true);
      const { data } = await http.post("/roles", { nombre, descripcion });
      if (data.success) {
        const roleId = data.data?.id || data.id || data.role?.id;
        if (!roleId) return;
        if (selectedAccesses.length > 0) {
          await http.post(`/roles/${roleId}/accesses`, { access_ids: selectedAccesses });
        }
        if (onCreated) onCreated();
        handleClose();
      }
    } catch (err) {
      console.error("Error creando rol:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setNombre("");
    setDescripcion("");
    setSelectedAccesses([]);
  };

  const footer = (
    <div className="flex justify-end gap-2 w-full">
      <ActionButton label="Cancelar" icon="pi pi-times" color="secondary" onClick={handleClose} disabled={loading} />
      <ActionButton
        label="Crear rol"
        icon="pi pi-check"
        color="success"
        loading={loading}
        disabled={!nombre.trim() || loading}
        onClick={handleSave}
      />
    </div>
  );

  return (
    <>
      <ActionButton icon="pi pi-plus" label="Crear rol" tooltip="Crear rol" onClick={() => setIsOpen(true)} />

      <CustomModal
        visible={isOpen}
        onHide={handleClose}
        header="Crear rol"
        footerActions={footer}
        className="w-[92vw] sm:w-[70vw] md:w-[52vw] lg:w-[44vw]"
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-foreground">Nombre *</label>
            <Input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej: Vendedor" className="bg-card" />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-foreground">Descripción</label>
            <Input value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Descripción del rol" className="bg-card" />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Accesos
              </span>
              <span className="h-px flex-1 bg-border/60" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {accesses.map((acc) => (
                <label
                  key={acc.id}
                  className="flex items-center gap-2.5 rounded-lg border border-border/70 bg-card px-3 py-2 cursor-pointer transition-colors hover:bg-secondary/50 select-none"
                >
                  <Checkbox
                    checked={selectedAccesses.includes(acc.id)}
                    onCheckedChange={() => toggleAccess(acc.id)}
                  />
                  <span className="text-sm text-foreground">{acc.nombre}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </CustomModal>
    </>
  );
}
