import { useEffect, useState } from "react";
import { Column } from "primereact/column";
import { Avatar } from "primereact/avatar";
import CompactTable from "@/components/common/CompactTable";
import CustomModal from "@/components/common/CustomModal";
import AssignUserForm from "@/components/roles/AssignUserForm";
import { useAuth } from "@/services/auth/authContext";

export default function RoleUsersModal({ role, visible, onHide }) {
  const { http } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState([]);

  const getUsers = async () => {
    try {
      const { data } = await http.get(`/roles/${role.id}/users`);
      if (data.success) setUsers(data.data);
    } catch (err) {
      console.error("Error obteniendo usuarios:", err);
    } finally {
      setLoading(false);
    }
  };

  const getEmployees = async () => {
    try {
      const { data } = await http.get("/employees");
      if (data.success) {
        const mapped = data.data.map((emp) => ({
          id: emp.id,
          label: emp.person?.nombres || `Empleado ${emp.id}`,
          person: emp.person
        }));
        setEmployees(mapped);
      }
    } catch (err) {
      console.error("Error cargando empleados:", err);
    }
  };

  useEffect(() => {
    if (visible && role) {
      getUsers();
      getEmployees();
    }
  }, [visible, role]);

  const avatarBody = (rowData) => (
    <Avatar
      image={rowData.person?.imagen || "/default-avatar.png"}
      label={!rowData.person?.imagen ? rowData.username[0].toUpperCase() : undefined}
      shape="circle"
      size="large"
    />
  );

  return (
    <CustomModal
      visible={visible}
      onHide={onHide}
      header={`Usuarios del rol: ${role?.nombre}`}
      className="w-auto"
    >
      <AssignUserForm role={role} employees={employees} onAssigned={getUsers} />

      <CompactTable value={users} loading={loading} className="mt-3">
        <Column header="Avatar" body={avatarBody} style={{ width: "80px" }} />
        <Column header="Usuario" field="username" />
        <Column header="Email" field="email" />
        <Column header="Nombre" body={(u) => u.person?.nombres || "-"} />
      </CompactTable>
    </CustomModal>
  );
}
