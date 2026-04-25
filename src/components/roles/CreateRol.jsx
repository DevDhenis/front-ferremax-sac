import { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import ActionButton from "../common/ActionButton";
import CustomModal from "../common/CustomModal";
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
    if (isOpen) {
      getAccesses();
    }
  }, [isOpen]);

  const handleSave = async () => {
    try {
      setLoading(true);
      const { data } = await http.post("/roles", { nombre, descripcion });
      console.log("Respuesta creación rol:", data);

      if (data.success) {
        const roleId = data.data?.id || data.id || data.role?.id;
        if (!roleId) {
          console.error("No se encontró el ID del rol en la respuesta.");
          return;
        }

        if (selectedAccesses.length > 0) {
          await http.post(`/roles/${roleId}/accesses`, {
            access_ids: selectedAccesses,
          });
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
    <div className="flex justify-end gap-2">
      <Button label="Cancelar" className="p-button-text" onClick={handleClose} />
      <Button
        label="Guardar"
        icon="pi pi-check"
        loading={loading}
        onClick={handleSave}
      />
    </div>
  );

  return (
    <>
      <ActionButton
        icon="pi-plus"
        tooltip="Crear rol"
        onClick={() => setIsOpen(true)}
      />

      <CustomModal
        visible={isOpen}
        onHide={handleClose}
        header="Crear rol"
        footerActions={footer}
        widthPercentage={60}
      >
        <div className="flex flex-column gap-3">
          <div>
            <label className="block mb-1">Nombre</label>
            <InputText
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full"
            />
          </div>

          <div>
            <label className="block mb-1">Descripción</label>
            <InputText
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full"
            />
          </div>

          <div>
            <label className="block mb-2">Accesos</label>
            <div className="grid">
              {accesses.map((acc) => (
                <div
                  key={acc.id}
                  className="col-6 flex align-items-center gap-2 mb-2"
                >
                  <Checkbox
                    inputId={`acc-${acc.id}`}
                    value={acc.id}
                    onChange={(e) => {
                      const value = e.value;
                      setSelectedAccesses((prev) =>
                        prev.includes(value)
                          ? prev.filter((id) => id !== value)
                          : [...prev, value]
                      );
                    }}
                    checked={selectedAccesses.includes(acc.id)}
                  />
                  <label htmlFor={`acc-${acc.id}`}>{acc.nombre}</label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CustomModal>
    </>
  );
}
