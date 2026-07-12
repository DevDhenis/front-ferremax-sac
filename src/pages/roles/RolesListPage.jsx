import { useEffect, useState } from "react";
import ActionButton from "@/components/common/ActionButton";
import { DataTable } from "@/components/ui/data-table";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import Container from "@/components/layout/Container";
import Header from "@/components/layout/Header";
import Section from "@/components/layout/Section";
import CreateRol from "@/components/roles/CreateRol";
import EditRol from "@/components/roles/EditRol";
import RoleUsersModal from "@/components/roles/RoleUsersModal";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { useAuth } from "@/services/auth/authContext";

export default function RolesListPage() {
  const { http } = useAuth();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editVisible, setEditVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  const [usersVisible, setUsersVisible] = useState(false);
  const [roleForUsers, setRoleForUsers] = useState(null);
  const [roleToDelete, setRoleToDelete] = useState(null);

  const getRoles = async () => {
    try {
      const { data } = await http.get("/roles");
      if (data.success) {
        setRoles(data.data);
      }
    } catch (error) {
      console.error("Error cargando roles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRoles();
  }, []);

  const confirmDelete = async () => {
    if (!roleToDelete) return;
    try {
      const { data } = await http.delete(`/roles/${roleToDelete.id}`);
      if (data.success) getRoles();
    } catch (error) {
      console.error("Error eliminando rol:", error);
    } finally {
      setRoleToDelete(null);
    }
  };

  const columns = [
    {
      accessorKey: "name",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Nombre" />,
      cell: ({ row }) => (
        <span className="font-medium text-foreground">{row.original.name}</span>
      ),
    },
    {
      accessorKey: "description",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Descripción" />,
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.original.description}</span>
      ),
    },
    {
      id: "acciones",
      header: () => <span className="sr-only">Acciones</span>,
      enableSorting: false,
      cell: ({ row }) => {
        const rowData = row.original;
        return (
          <div className="flex justify-start gap-2">
            <ActionButton
              icon="pi-users"
              color="success"
              onClick={() => {
                setRoleForUsers(rowData);
                setUsersVisible(true);
              }}
            />
            <ActionButton
              icon="pi-pencil"
              color="warning"
              onClick={() => {
                setSelectedRole(rowData);
                setEditVisible(true);
              }}
            />
            <ActionButton
              icon="pi-trash"
              color="danger"
              onClick={() => setRoleToDelete(rowData)}
            />
          </div>
        );
      },
    },
  ];

  return (
    <Container>
      <Header
        title="Roles"
        subtitle="A continuación, se visualizarán los roles registrados en el sistema."
      />
      <Section className="flex justify-end items-center my-3">
        <CreateRol onCreated={getRoles} />
      </Section>

      <DataTable
        columns={columns}
        data={roles}
        loading={loading}
        onRefresh={getRoles}
        searchPlaceholder="Buscar rol..."
        emptyMessage="No hay roles registrados"
      />

      {selectedRole && (
        <EditRol
          role={selectedRole}
          visible={editVisible}
          onHide={() => setEditVisible(false)}
          onUpdated={getRoles}
        />
      )}

      {roleForUsers && (
        <RoleUsersModal
          role={roleForUsers}
          visible={usersVisible}
          onHide={() => setUsersVisible(false)}
        />
      )}

      <ConfirmDialog
        open={!!roleToDelete}
        onOpenChange={(o) => !o && setRoleToDelete(null)}
        title="Eliminar rol"
        description={
          <>
            ¿Seguro que deseas eliminar el rol{" "}
            <span className="font-semibold text-foreground">“{roleToDelete?.name}”</span>?
            Esta acción no se puede deshacer.
          </>
        }
        confirmLabel="Sí, eliminar"
        onConfirm={confirmDelete}
      />
    </Container>
  );
}
