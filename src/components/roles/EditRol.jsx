import { useState, useEffect } from "react";
import ActionButton from "../common/ActionButton";
import CustomModal from "@/components/common/CustomModal";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/services/auth/authContext";

export default function EditRol({ role, visible, onHide, onUpdated }) {
  const { http } = useAuth();

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [accesses, setAccesses] = useState([]);
  const [selectedAccesses, setSelectedAccesses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!visible || !role) return;
    setNombre(role.nombre || "");
    setDescripcion(role.descripcion || "");
    loadAccessData();
  }, [visible, role]);

  const loadAccessData = async () => {
    try {
      const resAcc = await http.get("/accesses");
      if (resAcc.data.success) setAccesses(resAcc.data.data);

      const resAssigned = await http.get(`/roles/${role.id}/accesses`);
      if (resAssigned.data.success) {
        setSelectedAccesses(resAssigned.data.data.assigned || []);
      }
    } catch (err) {
      console.error("Error cargando datos de accesos:", err);
    }
  };

  const toggleAccess = (id) => {
    setSelectedAccesses((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    if (!nombre.trim()) return;
    try {
      setLoading(true);
      await http.put(`/roles/${role.id}`, { nombre, descripcion });
      await http.post(`/roles/${role.id}/accesses`, { access_ids: selectedAccesses });
      if (onUpdated) onUpdated();
      onHide();
    } catch (err) {
      console.error("Error actualizando rol:", err);
    } finally {
      setLoading(false);
    }
  };

  const footer = (
    <div className="flex justify-end gap-2 w-full">
      <ActionButton label="Cancelar" icon="pi pi-times" color="secondary" onClick={onHide} disabled={loading} />
      <ActionButton
        label="Guardar cambios"
        icon="pi pi-check"
        color="success"
        loading={loading}
        disabled={!nombre.trim() || loading}
        onClick={handleSubmit}
      />
    </div>
  );

  return (
    <CustomModal
      visible={visible}
      onHide={onHide}
      header="Editar rol"
      footerActions={footer}
      className="w-[92vw] sm:w-[70vw] md:w-[52vw] lg:w-[44vw]"
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-foreground">Nombre *</label>
          <Input value={nombre} onChange={(e) => setNombre(e.target.value)} className="bg-card" />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-foreground">Descripción</label>
          <Input value={descripcion} onChange={(e) => setDescripcion(e.target.value)} className="bg-card" />
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Accesos asignados
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
  );
}
