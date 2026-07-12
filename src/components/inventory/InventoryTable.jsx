import ActionButton from "../common/ActionButton";
import { Avatar } from "@/components/ui/avatar";
import { DataTable } from "@/components/ui/data-table";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { cn } from "@/lib/utils";

const money = (v) => `S/ ${parseFloat(v).toFixed(2)}`;

const TONES = {
  success: "bg-success-bg text-success border-success/20",
  danger: "bg-destructive-bg text-destructive border-destructive/20",
  warning: "bg-warning-bg text-warning border-warning/20",
  muted: "bg-secondary text-muted-foreground border-border",
};

function StatusBadge({ tone = "muted", children }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap",
        TONES[tone]
      )}
    >
      {children}
    </span>
  );
}

export default function InventoryTable({
  productos,
  onEditProduct,
  onDeleteProduct,
  onRefresh,
  loading = false,
}) {
  const columns = [
    {
      accessorKey: "internal_code",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Código" />,
      cell: ({ row }) => (
        <span className="font-spec text-xs text-muted-foreground">
          {row.original.internal_code}
        </span>
      ),
    },
    {
      accessorKey: "name",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Producto" />,
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar
            src={row.original.image}
            alt={row.original.name}
            fallback={row.original.name?.charAt(0) || "?"}
            className="size-10 rounded-lg"
          />
          <span className="font-medium text-foreground">{row.original.name}</span>
        </div>
      ),
    },
    {
      id: "category",
      accessorFn: (r) => r.category?.name ?? "",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Categoría" />,
      cell: ({ row }) => <StatusBadge tone="muted">{row.original.category?.name}</StatusBadge>,
    },
    {
      accessorKey: "unit_price",
      header: ({ column }) => <DataTableColumnHeader column={column} title="P. Unitario" />,
      cell: ({ row }) => <span className="font-spec">{money(row.original.unit_price)}</span>,
    },
    {
      accessorKey: "wholesale_unit_price",
      header: ({ column }) => <DataTableColumnHeader column={column} title="P. Mayor" />,
      cell: ({ row }) => <span className="font-spec">{money(row.original.wholesale_unit_price)}</span>,
    },
    {
      accessorKey: "stock",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Stock" />,
      cell: ({ row }) => {
        const p = row.original;
        const low = parseFloat(p.stock) <= parseFloat(p.minimum_quantity);
        return (
          <span className={cn("font-spec", low && "text-destructive font-semibold")}>
            {parseFloat(p.stock)} {p.unit?.abbreviation}
          </span>
        );
      },
    },
    {
      id: "unit",
      accessorFn: (r) => r.unit?.abbreviation ?? "",
      header: "Unidad",
      cell: ({ row }) => (
        <span className="text-muted-foreground text-xs">
          {row.original.unit?.name} ({row.original.unit?.abbreviation})
        </span>
      ),
      enableSorting: false,
    },
    {
      accessorKey: "on_promotion",
      header: "Promoción",
      cell: ({ row }) =>
        row.original.on_promotion ? (
          <StatusBadge tone="warning">Sí</StatusBadge>
        ) : (
          <StatusBadge tone="muted">No</StatusBadge>
        ),
    },
    {
      accessorKey: "discount",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Desc." />,
      cell: ({ row }) => <span className="font-spec">{row.original.discount}%</span>,
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
          <ActionButton
            icon="pi pi-pencil"
            color="warning"
            size="sm"
            tooltip="Editar producto"
            onClick={() => onEditProduct(row.original)}
          />
          <ActionButton
            icon="pi pi-trash"
            color="danger"
            size="sm"
            tooltip="Eliminar producto"
            onClick={() => onDeleteProduct(row.original)}
          />
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={productos}
      loading={loading}
      onRefresh={onRefresh}
      searchable={false}
      emptyMessage="No hay productos registrados"
    />
  );
}
