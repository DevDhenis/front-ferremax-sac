import { useState } from "react";
import { Plus } from "lucide-react";
import Container from "@/components/layout/Container";
import Header from "@/components/layout/Header";
import ActionButton from "@/components/common/ActionButton";
import StatusBadge from "@/components/common/StatusBadge";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import SupplierFormModal from "@/components/suppliers/SupplierFormModal";
import { DataTable } from "@/components/ui/data-table";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { useSuppliers } from "@/hooks/useSuppliers";

export default function SuppliersPage() {
  const { suppliers, loading, load, create, update, remove } = useSuppliers();
  const [formOpen, setFormOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [toDelete, setToDelete] = useState(null);

  const openCreate = () => {
    setSelected(null);
    setFormOpen(true);
  };
  const openEdit = (supplier) => {
    setSelected(supplier);
    setFormOpen(true);
  };

  const columns = [
    {
      accessorKey: "name",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Proveedor" />,
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium text-foreground">{row.original.name}</span>
          {row.original.contact_name && (
            <span className="text-xs text-muted-foreground">{row.original.contact_name}</span>
          )}
        </div>
      ),
    },
    {
      accessorKey: "ruc",
      header: ({ column }) => <DataTableColumnHeader column={column} title="RUC" />,
      cell: ({ row }) => <span className="font-spec text-xs text-muted-foreground">{row.original.ruc || "—"}</span>,
    },
    {
      accessorKey: "phone",
      header: "Teléfono",
      enableSorting: false,
      cell: ({ row }) => <span className="font-spec text-xs">{row.original.phone || "—"}</span>,
    },
    {
      accessorKey: "email",
      header: "Correo",
      enableSorting: false,
      cell: ({ row }) => <span className="text-xs text-muted-foreground">{row.original.email || "—"}</span>,
    },
    {
      id: "address",
      accessorFn: (r) => r.address ?? "",
      header: "Dirección",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground max-w-[14rem] block truncate" title={row.original.address}>
          {row.original.address || "—"}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Estado",
      cell: ({ row }) =>
        row.original.status === "A" ? (
          <StatusBadge tone="success">Activo</StatusBadge>
        ) : (
          <StatusBadge tone="danger">Inactivo</StatusBadge>
        ),
    },
    {
      id: "actions",
      header: () => <span className="sr-only">Acciones</span>,
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex gap-1.5 justify-end">
          <ActionButton icon="pi pi-pencil" color="warning" size="sm" tooltip="Editar proveedor" onClick={() => openEdit(row.original)} />
          <ActionButton icon="pi pi-trash" color="danger" size="sm" tooltip="Eliminar proveedor" onClick={() => setToDelete(row.original)} />
        </div>
      ),
    },
  ];

  return (
    <Container>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <Header title="Proveedores" subtitle="Catálogo de proveedores de la ferretería" />
        <ActionButton label="Agregar proveedor" icon={Plus} color="primary" onClick={openCreate} />
      </div>

      <DataTable
        columns={columns}
        data={suppliers}
        loading={loading}
        onRefresh={load}
        searchable
        searchPlaceholder="Buscar por nombre, RUC, correo…"
        emptyMessage="No hay proveedores registrados"
      />

      <SupplierFormModal
        visible={formOpen}
        onHide={() => setFormOpen(false)}
        supplier={selected}
        onSave={{ create, update }}
      />

      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(o) => !o && setToDelete(null)}
        title="Eliminar proveedor"
        description={
          <>
            ¿Seguro que deseas eliminar a{" "}
            <span className="font-semibold text-foreground">{toDelete?.name}</span>? Esta acción no se puede deshacer.
          </>
        }
        confirmLabel="Sí, eliminar"
        tone="danger"
        onConfirm={async () => {
          if (toDelete) await remove(toDelete.id);
          setToDelete(null);
        }}
      />
    </Container>
  );
}
