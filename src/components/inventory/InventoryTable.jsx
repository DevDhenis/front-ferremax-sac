import ActionButton from "../common/ActionButton";
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
      accessorKey: "codigo_interno",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Código" />,
      cell: ({ row }) => (
        <span className="font-spec text-xs text-muted-foreground">
          {row.original.codigo_interno}
        </span>
      ),
    },
    {
      accessorKey: "nombre",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Producto" />,
      cell: ({ row }) => (
        <span className="font-medium text-foreground">{row.original.nombre}</span>
      ),
    },
    {
      id: "categoria",
      accessorFn: (r) => r.category?.nombre ?? "",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Categoría" />,
      cell: ({ row }) => <StatusBadge tone="muted">{row.original.category?.nombre}</StatusBadge>,
    },
    {
      accessorKey: "pre_uni",
      header: ({ column }) => <DataTableColumnHeader column={column} title="P. Unitario" />,
      cell: ({ row }) => <span className="font-spec">{money(row.original.pre_uni)}</span>,
    },
    {
      accessorKey: "pre_uni_may",
      header: ({ column }) => <DataTableColumnHeader column={column} title="P. Mayor" />,
      cell: ({ row }) => <span className="font-spec">{money(row.original.pre_uni_may)}</span>,
    },
    {
      accessorKey: "stock",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Stock" />,
      cell: ({ row }) => {
        const p = row.original;
        const low = parseFloat(p.stock) <= parseFloat(p.cantidad_minima);
        return (
          <span className={cn("font-spec", low && "text-destructive font-semibold")}>
            {parseFloat(p.stock)} {p.unit?.abreviatura}
          </span>
        );
      },
    },
    {
      id: "unidad",
      accessorFn: (r) => r.unit?.abreviatura ?? "",
      header: "Unidad",
      cell: ({ row }) => (
        <span className="text-muted-foreground text-xs">
          {row.original.unit?.nombre} ({row.original.unit?.abreviatura})
        </span>
      ),
      enableSorting: false,
    },
    {
      accessorKey: "en_promocion",
      header: "Promoción",
      cell: ({ row }) =>
        row.original.en_promocion ? (
          <StatusBadge tone="warning">Sí</StatusBadge>
        ) : (
          <StatusBadge tone="muted">No</StatusBadge>
        ),
    },
    {
      accessorKey: "descuento",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Desc." />,
      cell: ({ row }) => <span className="font-spec">{row.original.descuento}%</span>,
    },
    {
      accessorKey: "estado_registro",
      header: "Estado",
      cell: ({ row }) =>
        row.original.estado_registro === "A" ? (
          <StatusBadge tone="success">Activo</StatusBadge>
        ) : (
          <StatusBadge tone="danger">Inactivo</StatusBadge>
        ),
    },
    {
      id: "acciones",
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
