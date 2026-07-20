import { useAuth } from "@/services/auth/authContext";
import { useEffect, useState } from "react";
import ActionButton from "@/components/common/ActionButton";
import { DataTable } from "@/components/ui/data-table";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import Container from "@/components/layout/Container";
import Header from "@/components/layout/Header";
import Section from "@/components/layout/Section";
import CreateOrEditWorker from "@/components/workers/createWorker";
import ConfirmDialog from "@/components/common/ConfirmDialog";

export default function Workers() {
  const { http } = useAuth();

  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [editWorker, setEditWorker] = useState(null);
  const [workerToDelete, setWorkerToDelete] = useState(null);

  const getWorkers = async () => {
    setLoading(true);
    try {
      const response = await http.get("employees");
      setWorkers(response.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const confirmDeleteWorker = async () => {
    if (!workerToDelete) return;
    try {
      await http.delete(`employees/${workerToDelete.id}`);
      setReload((r) => !r);
    } catch (err) {
      // El interceptor de axios ya muestra el toast de error.
      console.error("Error eliminando colaborador:", err);
    } finally {
      setWorkerToDelete(null);
    }
  };

  useEffect(() => {
    getWorkers();
  }, [reload]);

  const columns = [
    {
      id: "nombre",
      accessorFn: (r) => `${r.person?.first_name ?? ""} ${r.person?.last_name ?? ""}`.trim(),
      header: ({ column }) => <DataTableColumnHeader column={column} title="Nombre" />,
      cell: ({ row }) => (
        <span className="font-medium text-foreground">
          {`${row.original.person?.first_name ?? ""} ${row.original.person?.last_name ?? ""}`.trim()}
        </span>
      ),
    },
    {
      accessorKey: "work_schedule",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Horario laboral" />
      ),
      cell: ({ row }) => (
        <span className="text-foreground">{row.original.work_schedule}</span>
      ),
    },
    {
      accessorKey: "salary",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Sueldo" />,
      cell: ({ row }) => <span className="font-spec">S/. {row.original.salary}</span>,
    },
    {
      id: "acciones",
      header: () => <span className="sr-only">Acciones</span>,
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex justify-start gap-2">
          <ActionButton
            icon="pi-pencil"
            color="warning"
            onClick={() => {
              setEditWorker(row.original);
              setIsOpen(true);
            }}
          />
          <ActionButton
            icon="pi-trash"
            color="danger"
            onClick={() => setWorkerToDelete(row.original)}
          />
        </div>
      ),
    },
  ];

  return (
    <Container>
      <Header
        title="Colaboradores"
        subtitle="A continuación, se visualizará los colaboradores registrados en el sistema."
      />
      <Section className="flex justify-end items-center my-3">
        <ActionButton
          icon="pi-plus"
          tooltip="Crear trabajador"
          onClick={() => {
            setEditWorker(null);
            setIsOpen(true);
          }}
        />
      </Section>

      <DataTable
        columns={columns}
        data={workers}
        loading={loading}
        onRefresh={getWorkers}
        searchPlaceholder="Buscar colaborador..."
        emptyMessage="No hay colaboradores registrados"
      />

      <CreateOrEditWorker
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        reload={reload}
        setReload={setReload}
        editData={editWorker}
      />

      <ConfirmDialog
        open={!!workerToDelete}
        onOpenChange={(o) => !o && setWorkerToDelete(null)}
        title="Eliminar colaborador"
        description={
          <>
            ¿Seguro que deseas eliminar a{" "}
            <span className="font-semibold text-foreground">
              “{`${workerToDelete?.person?.first_name ?? ""} ${workerToDelete?.person?.last_name ?? ""}`.trim()}”
            </span>
            ? Esta acción no se puede deshacer.
          </>
        }
        confirmLabel="Sí, eliminar"
        onConfirm={confirmDeleteWorker}
      />
    </Container>
  );
}
