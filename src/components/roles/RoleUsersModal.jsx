import { useEffect, useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { DataTable } from "@/components/ui/data-table";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
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
          label:
            `${emp.person?.first_name ?? ""} ${emp.person?.last_name ?? ""}`.trim() ||
            `Empleado ${emp.id}`,
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

  const columns = [
    {
      id: "avatar",
      header: () => <span className="sr-only">Avatar</span>,
      enableSorting: false,
      cell: ({ row }) => {
        const rowData = row.original;
        return (
          <Avatar
            src={rowData.person?.image}
            fallback={rowData.username?.[0]?.toUpperCase() || "?"}
            className="size-9"
          />
        );
      },
    },
    {
      accessorKey: "username",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Usuario" />,
      cell: ({ row }) => (
        <span className="font-medium text-foreground">{row.original.username}</span>
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.original.email}</span>
      ),
    },
    {
      id: "nombre",
      accessorFn: (r) => `${r.person?.first_name ?? ""} ${r.person?.last_name ?? ""}`.trim(),
      header: ({ column }) => <DataTableColumnHeader column={column} title="Nombre" />,
      cell: ({ row }) => (
        <span className="text-foreground">
          {`${row.original.person?.first_name ?? ""} ${row.original.person?.last_name ?? ""}`.trim() || "-"}
        </span>
      ),
    },
  ];

  return (
    <CustomModal
      visible={visible}
      onHide={onHide}
      header={`Usuarios del rol: ${role?.name}`}
      className="w-[92vw] sm:w-[80vw] md:w-[64vw] lg:w-[56vw]"
    >
      <AssignUserForm role={role} employees={employees} onAssigned={getUsers} />

      <div className="mt-3">
        <DataTable
          columns={columns}
          data={users}
          loading={loading}
          onRefresh={getUsers}
          searchPlaceholder="Buscar usuario..."
          emptyMessage="No hay usuarios asignados a este rol"
        />
      </div>
    </CustomModal>
  );
}
