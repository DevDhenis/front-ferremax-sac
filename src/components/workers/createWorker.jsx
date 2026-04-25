import { useState, useEffect } from "react";
import CustomModal from "../common/CustomModal";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useAuth } from "@/services/auth/authContext";
import { useToast } from "@/context/ToastContext";

export default function CreateOrEditWorker({ isOpen, onClose, reload, setReload, editData = null }) {
  const { http } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    nombres: "",
    horario_laboral: "",
    sueldo: "",
  });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let data;
      if (editData) {
        const res = await http.put(`employees/${editData.id}`, formData);
        data = res.data;
      } else {
        const res = await http.post("employees", formData);
        data = res.data;
      }

      showToast("success", "Éxito", data.message);
      setReload(!reload);
      onClose();
    } catch (err) {
      showToast("error", "Error", "No se pudo registrar/actualizar.");
    }
  };

  return (
    <CustomModal
      visible={isOpen}
      onHide={onClose}
      header={editData ? "Editar Empleado" : "Registrar Empleado"}
    >
      <form onSubmit={handleSubmit} className="flex flex-column gap-4">
        <InputText
          type="text"
          name="nombres"
          placeholder="Nombres"
          value={formData.nombres}
          onChange={handleChange}
          required
        />
        <InputText
          type="text"
          name="horario_laboral"
          placeholder="Horario laboral (Ej: 9am - 6pm)"
          value={formData.horario_laboral}
          onChange={handleChange}
          required
        />
        <InputText
          type="number"
          name="sueldo"
          placeholder="Sueldo"
          value={formData.sueldo}
          onChange={handleChange}
          required
        />

        <Button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded"
          label={editData ? "Actualizar" : "Registrar"}
        />
      </form>
    </CustomModal>
  );
}
