import { useState } from "react";
import { Check, X, Banknote } from "lucide-react";
import Container from "@/components/layout/Container";
import Header from "@/components/layout/Header";
import ActionButton from "@/components/common/ActionButton";
import StatusBadge from "@/components/common/StatusBadge";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { DataTable } from "@/components/ui/data-table";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useReturns } from "@/hooks/useReturns";
import {
  RETURN_STATUS,
  REFUND_STATUS,
  RETURN_STATUS_FILTER,
  formatDateTime,
  formatCurrency,
} from "@/components/returns/returnConfig";

const CONFIRM = {
  approve: {
    title: "Aprobar devolución",
    description: "Se aprobará la devolución y el stock de los productos volverá al inventario (movimiento trazable). ¿Continuar?",
    confirmLabel: "Sí, aprobar",
    tone: "primary",
  },
  reject: {
    title: "Rechazar devolución",
    description: "Se rechazará la solicitud. No se modifica el stock. ¿Continuar?",
    confirmLabel: "Sí, rechazar",
    tone: "danger",
  },
  refund: {
    title: "Registrar reembolso",
    description: "Se marcará esta devolución como reembolsada. ¿Confirmas que el dinero fue devuelto al cliente?",
    confirmLabel: "Sí, reembolsé",
    tone: "primary",
  },
};

export default function ReturnsPage() {
  const { returns, loading, statusFilter, setStatusFilter, approve, reject, refund, reload } = useReturns();
  const [action, setAction] = useState(null); // { type, ret }

  const runAction = async () => {
    if (!action) return;
    const { type, ret } = action;
    if (type === "approve") await approve(ret.id);
    else if (type === "reject") await reject(ret.id, null);
    else if (type === "refund") await refund(ret.id);
    setAction(null);
  };

  const columns = [
    {
      accessorKey: "created_at",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Fecha" />,
      cell: ({ row }) => (
        <span className="font-spec text-xs text-muted-foreground whitespace-nowrap">
          {formatDateTime(row.original.created_at)}
        </span>
      ),
    },
    {
      id: "client",
      accessorFn: (r) => r.client ?? "",
      header: "Cliente",
      cell: ({ row }) => <span className="text-foreground">{row.original.client ?? "—"}</span>,
    },
    {
      id: "sale",
      header: "Venta",
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-spec text-xs text-muted-foreground">#{row.original.sale?.id}</span>
          <span className="font-spec text-xs">{formatCurrency(row.original.sale?.total)}</span>
        </div>
      ),
    },
    {
      id: "items",
      header: "Productos",
      enableSorting: false,
      cell: ({ row }) => (
        <ul className="m-0 p-0 list-none space-y-0.5 max-w-[16rem]">
          {(row.original.items ?? []).map((it) => (
            <li key={it.id} className="text-xs text-foreground truncate">
              <span className="font-spec text-muted-foreground">{it.quantity}×</span> {it.product?.name}
            </li>
          ))}
        </ul>
      ),
    },
    {
      accessorKey: "reason",
      header: "Motivo",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground max-w-[14rem] block truncate" title={row.original.reason}>
          {row.original.reason}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Estado",
      cell: ({ row }) => {
        const cfg = RETURN_STATUS[row.original.status];
        return <StatusBadge tone={cfg?.tone ?? "muted"}>{cfg?.label ?? row.original.status}</StatusBadge>;
      },
    },
    {
      accessorKey: "refund_status",
      header: "Reembolso",
      cell: ({ row }) => {
        if (row.original.status !== "approved") return <span className="text-xs text-muted-foreground">—</span>;
        const cfg = REFUND_STATUS[row.original.refund_status];
        return <StatusBadge tone={cfg?.tone ?? "muted"}>{cfg?.label ?? row.original.refund_status}</StatusBadge>;
      },
    },
    {
      id: "actions",
      header: () => <span className="sr-only">Acciones</span>,
      enableSorting: false,
      cell: ({ row }) => {
        const r = row.original;
        return (
          <div className="flex gap-1.5 justify-end">
            {r.status === "requested" && (
              <>
                <ActionButton
                  icon={Check}
                  color="success"
                  size="sm"
                  tooltip="Aprobar devolución"
                  onClick={() => setAction({ type: "approve", ret: r })}
                />
                <ActionButton
                  icon={X}
                  color="danger"
                  size="sm"
                  tooltip="Rechazar devolución"
                  onClick={() => setAction({ type: "reject", ret: r })}
                />
              </>
            )}
            {r.status === "approved" && r.refund_status === "pending" && (
              <ActionButton
                icon={Banknote}
                color="primary"
                size="sm"
                tooltip="Registrar reembolso"
                onClick={() => setAction({ type: "refund", ret: r })}
              />
            )}
          </div>
        );
      },
    },
  ];

  const confirmCfg = action ? CONFIRM[action.type] : null;

  return (
    <Container>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <Header title="Devoluciones" subtitle="Solicitudes de devolución de clientes" />
        <div className="w-full sm:w-52">
          <Select
            items={RETURN_STATUS_FILTER}
            value={statusFilter || "all"}
            onValueChange={(v) => setStatusFilter(v === "all" ? "" : v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              {RETURN_STATUS_FILTER.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={returns}
        loading={loading}
        onRefresh={reload}
        searchable
        searchPlaceholder="Buscar por cliente, motivo…"
        emptyMessage="No hay solicitudes de devolución"
      />

      <ConfirmDialog
        open={!!action}
        onOpenChange={(o) => !o && setAction(null)}
        title={confirmCfg?.title}
        description={confirmCfg?.description}
        confirmLabel={confirmCfg?.confirmLabel}
        tone={confirmCfg?.tone}
        onConfirm={runAction}
      />
    </Container>
  );
}
