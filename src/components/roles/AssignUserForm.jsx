import { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { useAuth } from "@/services/auth/authContext";

export default function AssignUserForm({ role, onAssigned, employees }) {
  const { http } = useAuth();
  const [employeeId, setEmployeeId] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const { data } = await http.post(`/roles/${role.id}/assign-user`, {
        employee_id: employeeId,
        username,
        email,
        password,
      });

      if (data.success) {
        onAssigned();
        setEmployeeId(null);
        setUsername("");
        setEmail("");
        setPassword("");
      }
    } catch (err) {
      console.error("Error asignando usuario:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-column gap-3 p-3 border-round border-1 surface-border">
      <Dropdown
        value={employeeId}
        options={employees}
        onChange={(e) => setEmployeeId(e.value)}
        optionLabel="label"
        optionValue="id"
        placeholder="Seleccionar trabajador"
        className="w-full"
      />

      <InputText
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Nombre de usuario"
        className="w-full"
      />

      <InputText
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Correo electrónico"
        className="w-full"
      />

      <InputText
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Contraseña"
        className="w-full"
      />

      <Button
        label="Asignar"
        icon="pi pi-check"
        loading={loading}
        onClick={handleSubmit}
        className="w-full"
      />
    </div>
  );
}
