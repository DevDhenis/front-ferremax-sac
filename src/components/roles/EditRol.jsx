import { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import CustomModal from "@/components/common/CustomModal";
import { useAuth } from "@/services/auth/authContext";

export default function EditRol({ role, visible, onHide, onUpdated }) {
  const { http } = useAuth();

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const [accesses, setAccesses] = useState([]); // lista completa accesos
  const [selectedAccesses, setSelectedAccesses] = useState([]); // ids marcados

  const [loading, setLoading] = useState(false);

  // CARGA INICIAL CUANDO SE ABRE EL MODAL
  useEffect(() => {
    if (!visible || !role) return;

    setNombre(role.nombre || "");
    setDescripcion(role.descripcion || "");

    loadAccessData();
  }, [visible, role]);

  // Obtiene accesos + asignados
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

  // Guardar cambios
  const handleSubmit = async () => {
    try {
      setLoading(true);

      // 1. Actualizar rol
      await http.put(`/roles/${role.id}`, {
        nombre,
        descripcion,
      });

      // 2. Actualizar accesos asignados
      await http.post(`/roles/${role.id}/accesses`, {
        access_ids: selectedAccesses,
      });

      if (onUpdated) onUpdated();
      onHide();
    } catch (err) {
      console.error("Error actualizando rol:", err);
    } finally {
      setLoading(false);
    }
  };

  const footer = (
    <div className="flex justify-end gap-2">
      <Button
        label="Cancelar"
        icon="pi pi-times"
        className="p-button-text"
        onClick={onHide}
      />
      <Button
        label="Guardar"
        icon="pi pi-check"
        loading={loading}
        onClick={handleSubmit}
      />
    </div>
  );

  return (
    <CustomModal
      visible={visible}
      onHide={onHide}
      header="Editar Rol"
      footerActions={footer}
      widthPercentage={60}
    >
      <div className="flex flex-column gap-3">

        {/* NOMBRE */}
        <div>
          <label className="block mb-1">Nombre</label>
          <InputText
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full"
          />
        </div>

        {/* DESCRIPCIÓN */}
        <div>
          <label className="block mb-1">Descripción</label>
          <InputText
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full"
          />
        </div>

        {/* ACCESOS */}
        <div>
          <label className="block mb-2">Accesos asignados</label>

          <div className="grid">
            {accesses.map((acc) => (
              <div key={acc.id} className="col-6 flex align-items-center gap-2 mb-2">
                <Checkbox
                  inputId={`acc-${acc.id}`}
                  value={acc.id}
                  checked={selectedAccesses.includes(acc.id)}
                  onChange={(e) => {
                    const value = e.value;
                    setSelectedAccesses((prev) =>
                      prev.includes(value)
                        ? prev.filter((id) => id !== value)
                        : [...prev, value]
                    );
                  }}
                />
                <label htmlFor={`acc-${acc.id}`}>{acc.nombre}</label>
              </div>
            ))}
          </div>
        </div>

      </div>
    </CustomModal>
  );
}
