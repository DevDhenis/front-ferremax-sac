import { useState } from "react";
import { Plus, ShoppingCart, Undo2, Banknote } from "lucide-react";
import Container from "@/components/layout/Container";
import Header from "@/components/layout/Header";
import ActionButton from "@/components/common/ActionButton";
import StatusBadge from "@/components/common/StatusBadge";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { DataTable } from "@/components/ui/data-table";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import RegisterPurchaseModal from "@/components/purchasing/RegisterPurchaseModal";
import RegisterSupplierReturnModal from "@/components/purchasing/RegisterSupplierReturnModal";
import { usePurchasing } from "@/hooks/usePurchasing";

const TABS = [
  { id: "compras", label: "Compras", icon: ShoppingCart },
  { id: "devoluciones", label: "Devoluciones a proveedor", icon: Undo2 },
];

const currency = new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" });
const money = (v) => currency.format(Number(v) || 0);
const fmt = (iso) =>
  iso
    ? new Date(iso).toLocaleString("es-PE", { timeZone: "America/Lima", day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit" })
    : "—";

function ItemsList({ items, showQty = true }) {
  return (
    <ul className="m-0 p-0 list-none space-y-0.5 max-w-[16rem]">
      {(items ?? []).map((it) => (
        <li key={it.id} className="text-xs text-foreground truncate">
          {showQty && <span className="font-spec text-muted-foreground">{it.quantity}× </span>}
          {it.product?.name}
        </li>
      ))}
    </ul>
  );
}

export default function PurchasesPage() {
  const { purchases, supplierReturns, suppliers, products, loading, registerPurchase, registerReturn, credit } = usePurchasing();
  const [tab, setTab] = useState("compras");
  const [purchaseOpen, setPurchaseOpen] = useState(false);
  const [returnOpen, setReturnOpen] = useState(false);
  const [toCredit, setToCredit] = useState(null);

  const purchaseColumns = [
    { accessorKey: "purchase_date", header: ({ column }) => <DataTableColumnHeader column={column} title="Fecha" />, cell: ({ row }) => <span className="font-spec text-xs text-muted-foreground whitespace-nowrap">{fmt(row.original.purchase_date)}</span> },
    { id: "supplier", accessorFn: (r) => r.supplier?.name ?? "", header: "Proveedor", cell: ({ row }) => <span className="text-foreground">{row.original.supplier?.name ?? "—"}</span> },
    { accessorKey: "document_number", header: "N° doc.", enableSorting: false, cell: ({ row }) => <span className="font-spec text-xs text-muted-foreground">{row.original.document_number || "—"}</span> },
    { id: "items", header: "Productos", enableSorting: false, cell: ({ row }) => <ItemsList items={row.original.items} /> },
    { accessorKey: "total", header: () => <span className="block text-right">Total</span>, cell: ({ row }) => <span className="font-spec font-bold text-foreground block text-right">{money(row.original.total)}</span> },
  ];

  const returnColumns = [
    { accessorKey: "return_date", header: ({ column }) => <DataTableColumnHeader column={column} title="Fecha" />, cell: ({ row }) => <span className="font-spec text-xs text-muted-foreground whitespace-nowrap">{fmt(row.original.return_date)}</span> },
    { id: "supplier", accessorFn: (r) => r.supplier?.name ?? "", header: "Proveedor", cell: ({ row }) => <span className="text-foreground">{row.original.supplier?.name ?? "—"}</span> },
    { id: "items", header: "Productos", enableSorting: false, cell: ({ row }) => <ItemsList items={row.original.items} /> },
    { accessorKey: "reason", header: "Motivo", enableSorting: false, cell: ({ row }) => <span className="text-xs text-muted-foreground max-w-[14rem] block truncate" title={row.original.reason}>{row.original.reason}</span> },
    {
      accessorKey: "credit_status",
      header: "Nota de crédito",
      cell: ({ row }) =>
        row.original.credit_status === "credited" ? (
          <StatusBadge tone="success">Acreditada</StatusBadge>
        ) : (
          <StatusBadge tone="muted">Pendiente</StatusBadge>
        ),
    },
    {
      id: "actions",
      header: () => <span className="sr-only">Acciones</span>,
      enableSorting: false,
      cell: ({ row }) =>
        row.original.credit_status === "pending" ? (
          <div className="flex justify-end">
            <ActionButton icon={Banknote} color="primary" size="sm" tooltip="Registrar nota de crédito" onClick={() => setToCredit(row.original)} />
          </div>
        ) : null,
    },
  ];

  return (
    <Container>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <Header title="Compras" subtitle="Compras a proveedores y devoluciones a proveedor" />
        {tab === "compras" ? (
          <ActionButton label="Registrar compra" icon={Plus} color="primary" onClick={() => setPurchaseOpen(true)} />
        ) : (
          <ActionButton label="Registrar devolución" icon={Plus} color="primary" onClick={() => setReturnOpen(true)} />
        )}
      </div>

      <div className="inline-flex items-center gap-1 rounded-full border border-border bg-card p-1 mb-4">
        {TABS.map((t) => {
          const active = tab === t.id;
          const Icon = t.icon;
          return (
            <button key={t.id} type="button" onClick={() => setTab(t.id)} className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-primary/30 ${active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              <Icon className="size-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      {tab === "compras" ? (
        <DataTable columns={purchaseColumns} data={purchases} loading={loading} searchable searchPlaceholder="Buscar por proveedor…" emptyMessage="No hay compras registradas" />
      ) : (
        <DataTable columns={returnColumns} data={supplierReturns} loading={loading} searchable searchPlaceholder="Buscar por proveedor, motivo…" emptyMessage="No hay devoluciones a proveedor" />
      )}

      <RegisterPurchaseModal visible={purchaseOpen} onHide={() => setPurchaseOpen(false)} suppliers={suppliers} products={products} onSubmit={registerPurchase} />
      <RegisterSupplierReturnModal visible={returnOpen} onHide={() => setReturnOpen(false)} suppliers={suppliers} products={products} onSubmit={registerReturn} />

      <ConfirmDialog
        open={!!toCredit}
        onOpenChange={(o) => !o && setToCredit(null)}
        title="Registrar nota de crédito"
        description="Se marcará esta devolución como acreditada por el proveedor. ¿Confirmas que recibiste la nota de crédito?"
        confirmLabel="Sí, acreditada"
        tone="primary"
        onConfirm={async () => {
          if (toCredit) await credit(toCredit.id);
          setToCredit(null);
        }}
      />
    </Container>
  );
}
