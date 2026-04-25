import { useEffect, useState } from "react";
import ActionButton from "@/components/common/ActionButton";
import CompactTable from "@/components/common/CompactTable";
import Container from "@/components/layout/Container";
import Header from "@/components/layout/Header";
import Section from "@/components/layout/Section";
import CreateRol from "@/components/roles/CreateRol";
import EditRol from "@/components/roles/EditRol";
import RoleUsersModal from "@/components/roles/RoleUsersModal";
import { Column } from "primereact/column";
import { confirmDialog } from "primereact/confirmdialog";
import { useAuth } from "@/services/auth/authContext";

export default function RolesListPage() {
  const { http } = useAuth();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editVisible, setEditVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  const [usersVisible, setUsersVisible] = useState(false);
  const [roleForUsers, setRoleForUsers] = useState(null);

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

  const deleteRole = async (id) => {
    try {
      const { data } = await http.delete(`/roles/${id}`);
      if (data.success) {
        getRoles();
      }
    } catch (error) {
      console.error("Error eliminando rol:", error);
    }
  };

  const confirmDelete = (role) => {
    confirmDialog({
      message: `¿Seguro que deseas eliminar el rol "${role.nombre}"?`,
      header: "Confirmar eliminación",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      acceptLabel: "Sí, eliminar",
      rejectLabel: "Cancelar",
      accept: () => deleteRole(role.id),
    });
  };

  const Actions = (rowData) => (
    <div className="flex justify-content-start gap-2">
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
        onClick={() => confirmDelete(rowData)}
      />
    </div>
  );

  return (
    <Container>
      <Header
        title="Roles"
        subtitle="A continuación, se visualizarán los roles registrados en el sistema."
      />
      <Section className="flex justify-content-end align-items-center my-3">
        <CreateRol onCreated={getRoles} />
      </Section>

      <CompactTable value={roles} loading={loading}>
        <Column header="Nombre" field="nombre" />
        <Column header="Descripción" field="descripcion" />
        <Column header="Acciones" body={(rowData) => <Actions {...rowData} rowData={rowData} />} />
      </CompactTable>

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
    </Container>
  );
}
