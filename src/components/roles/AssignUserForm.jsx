import { useState } from "react";
import ActionButton from "../common/ActionButton";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
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
    <div className="flex flex-col gap-3 p-4 rounded-xl border border-border/80 bg-secondary/30">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Asignar usuario
        </span>
        <span className="h-px flex-1 bg-border/60" />
      </div>

      <Select
        items={employees.map((e) => ({ label: e.label, value: e.id }))}
        value={employeeId}
        onValueChange={setEmployeeId}
      >
        <SelectTrigger className="bg-card">
          <SelectValue placeholder="Seleccionar trabajador" />
        </SelectTrigger>
        <SelectContent>
          {employees.map((e) => (
            <SelectItem key={e.id} value={e.id}>
              {e.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Nombre de usuario"
        className="bg-card"
      />
      <Input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Correo electrónico"
        className="bg-card"
      />
      <Input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Contraseña"
        className="bg-card"
      />

      <ActionButton
        label="Asignar usuario"
        icon="pi pi-check"
        color="success"
        loading={loading}
        onClick={handleSubmit}
        className="w-full justify-center"
      />
    </div>
  );
}
