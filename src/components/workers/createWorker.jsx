import { useState, useEffect } from "react";
import CustomModal from "../common/CustomModal";
import ActionButton from "../common/ActionButton";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/services/auth/authContext";

export default function CreateOrEditWorker({ isOpen, onClose, reload, setReload, editData = null }) {
  const { http } = useAuth();

  const [formData, setFormData] = useState({
    nombres: "",
    horario_laboral: "",
    sueldo: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editData) {
      setFormData({
        nombres: editData?.person?.nombres || "",
        horario_laboral: editData?.horario_laboral || "",
        sueldo: editData?.sueldo || "",
      });
    } else {
      setFormData({ nombres: "", horario_laboral: "", sueldo: "" });
    }
  }, [editData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!formData.nombres.trim()) return;
    try {
      setLoading(true);
      if (editData) {
        await http.put(`employees/${editData.id}`, formData);
      } else {
        await http.post("employees", formData);
      }
      // El interceptor de axios ya muestra el toast de éxito/error.
      setReload(!reload);
      onClose();
    } catch (err) {
      console.error("Error al guardar colaborador:", err);
    } finally {
      setLoading(false);
    }
  };

  const footer = (
    <div className="flex justify-end gap-2 w-full">
      <ActionButton label="Cancelar" icon="pi pi-times" color="secondary" onClick={onClose} disabled={loading} />
      <ActionButton
        label={editData ? "Actualizar" : "Registrar"}
        icon="pi pi-check"
        color="success"
        loading={loading}
        disabled={loading || !formData.nombres.trim()}
        onClick={handleSubmit}
      />
    </div>
  );

  return (
    <CustomModal
      visible={isOpen}
      onHide={onClose}
      header={editData ? "Editar colaborador" : "Registrar colaborador"}
      footerActions={footer}
      className="w-[92vw] sm:w-[64vw] md:w-[46vw] lg:w-[38vw]"
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-foreground">Nombres *</label>
          <Input
            name="nombres"
            value={formData.nombres}
            onChange={handleChange}
            placeholder="Ej: Juan Pérez"
            className="bg-card"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-foreground">Horario laboral *</label>
          <Input
            name="horario_laboral"
            value={formData.horario_laboral}
            onChange={handleChange}
            placeholder="Ej: 9am - 6pm"
            className="bg-card"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-foreground">Sueldo (S/) *</label>
          <Input
            type="number"
            name="sueldo"
            value={formData.sueldo}
            onChange={handleChange}
            placeholder="0.00"
            className="bg-card font-spec"
          />
        </div>
      </div>
    </CustomModal>
  );
}
