import { useState } from "react";
import { Plus, FileText } from "lucide-react";
import ActionButton from "../common/ActionButton";
import StatusBadge from "../common/StatusBadge";
import ConfirmDialog from "../common/ConfirmDialog";
import RegisterMovementModal from "./RegisterMovementModal";
import ReportModal from "./ReportModal";
import { DataTable } from "@/components/ui/data-table";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useInventoryMovements } from "@/hooks/useInventoryMovements";
import {
  MOVEMENT_OPTIONS,
  movementBadge,
  movementDirection,
  formatQty,
  formatDateTime,
} from "./inventoryMovementConfig";

const TYPE_FILTER = [{ value: "all", label: "Todos los tipos" }, ...MOVEMENT_OPTIONS];

function SignedQty({ movement }) {
  const dir = movementDirection(movement);
  const qty = formatQty(movement.quantity);
  if (dir === "in") return <span className="text-success font-semibold">+{qty}</span>;
  if (dir === "out") return <span className="text-destructive font-semibold">−{qty}</span>;
  return <span className="text-warning font-semibold">±{qty}</span>;
}

export default function MovementsTab({ products = [], onStockChange }) {
  const { movements, loading, filters, setFilters, register, annul } = useInventoryMovements();
  const [registerOpen, setRegisterOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [toVoid, setToVoid] = useState(null);

  // Movements change product stock, so refresh the products list too.
  const handleRegister = async (payload) => {
    await register(payload);
    onStockChange?.();
  };

  const handleAnnul = async (id) => {
    await annul(id);
    onStockChange?.();
  };

  const columns = [
    {
      accessorKey: "movement_date",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Fecha" />,
      cell: ({ row }) => (
        <span className="font-spec text-xs text-muted-foreground whitespace-nowrap">
          {formatDateTime(row.original.movement_date)}
        </span>
      ),
    },
    {
      id: "product",
      accessorFn: (r) => r.product?.name ?? "",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Producto" />,
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="text-foreground">{row.original.product?.name ?? "—"}</span>
          <span className="font-spec text-[11px] text-muted-foreground">
            {row.original.product?.internal_code}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "movement_type",
      header: "Tipo",
      cell: ({ row }) => {
        const badge = movementBadge(row.original);
        return <StatusBadge tone={badge.tone}>{badge.label}</StatusBadge>;
      },
    },
    {
      accessorKey: "quantity",
      header: () => <span className="block text-right">Cant.</span>,
      cell: ({ row }) => (
        <div className="font-spec text-right">
          <SignedQty movement={row.original} />
        </div>
      ),
    },
    {
      accessorKey: "stock_after",
      header: () => <span className="block text-right">Saldo</span>,
      cell: ({ row }) => (
        <span className="font-spec font-bold text-foreground block text-right">
          {formatQty(row.original.stock_after)}
        </span>
      ),
    },
    {
      id: "employee",
      accessorFn: (r) => r.employee ?? "",
      header: "Responsable",
      cell: ({ row }) => <span className="text-xs text-muted-foreground">{row.original.employee}</span>,
      enableSorting: false,
    },
    {
      accessorKey: "status",
      header: "Estado",
      cell: ({ row }) =>
        row.original.status === "voided" ? (
          <StatusBadge tone="muted">Anulado</StatusBadge>
        ) : (
          <StatusBadge tone="success">Activo</StatusBadge>
        ),
    },
    {
      id: "actions",
      header: () => <span className="sr-only">Acciones</span>,
      enableSorting: false,
      cell: ({ row }) =>
        row.original.status === "active" ? (
          <div className="flex justify-end">
            <ActionButton
              icon="pi pi-times"
              color="danger"
              size="sm"
              tooltip="Anular movimiento"
              onClick={() => setToVoid(row.original)}
            />
          </div>
        ) : null,
    },
  ];

  const typeValue = filters.movement_type || "all";

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="w-full sm:w-52">
          <Select
            items={TYPE_FILTER}
            value={typeValue}
            onValueChange={(v) => setFilters((f) => ({ ...f, movement_type: v === "all" ? "" : v }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por tipo" />
            </SelectTrigger>
            <SelectContent>
              {TYPE_FILTER.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <ActionButton
            label="Reporte"
            icon={FileText}
            color="secondary"
            tooltip="Reporte de trazabilidad"
            onClick={() => setReportOpen(true)}
          />
          <ActionButton
            label="Registrar movimiento"
            icon={Plus}
            color="primary"
            onClick={() => setRegisterOpen(true)}
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={movements}
        loading={loading}
        searchable
        searchPlaceholder="Buscar por producto, motivo…"
        emptyMessage="No hay movimientos registrados"
      />

      <RegisterMovementModal
        visible={registerOpen}
        onHide={() => setRegisterOpen(false)}
        products={products}
        onSubmit={handleRegister}
      />

      <ReportModal visible={reportOpen} onHide={() => setReportOpen(false)} products={products} />

      <ConfirmDialog
        open={!!toVoid}
        onOpenChange={(o) => !o && setToVoid(null)}
        title="Anular movimiento"
        description={
          <>
            ¿Anular este movimiento de{" "}
            <span className="font-semibold text-foreground">{toVoid?.product?.name}</span>? El stock del
            producto volverá a su valor previo. Solo se puede anular el último movimiento del producto.
          </>
        }
        confirmLabel="Sí, anular"
        tone="danger"
        onConfirm={async () => {
          if (toVoid) await handleAnnul(toVoid.id);
          setToVoid(null);
        }}
      />
    </div>
  );
}
