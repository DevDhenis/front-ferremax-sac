import { useState, useMemo } from "react";
import { Loader2, ShoppingCart as ShoppingCartIcon, Minus, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import ActionButton from "../common/ActionButton";
import CustomModal from "../common/CustomModal";
import ConfirmDialog from "../common/ConfirmDialog";
import { useShoppingCart } from "@/hooks/useShoppingCart";
import { useCart } from "@/context/CartContext";
import PaymentModal from "../payment/PaymentModal";

const round2 = (num) => Number(Number(num).toFixed(2));
const money = (v) => `S/ ${parseFloat(v).toFixed(2)}`;

export default function ShoppingCart({ onCheckout }) {
  const [visible, setVisible] = useState(false);
  const [opening, setOpening] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);
  const [editValue, setEditValue] = useState(null);
  const [itemToRemove, setItemToRemove] = useState(null);

  // Datos compartidos (el badge se mantiene sincronizado en toda la app).
  const { count, items: rawItems, refresh } = useCart();
  const { handleUpdateQuantity, handleDeleteItem } = useShoppingCart();

  const cartItems = useMemo(
    () =>
      (rawItems || []).map((item) => ({
        item_id: item.id,
        id: item.product.id,
        nombre: item.product.name,
        descripcion: item.product.description,
        imagen: item.product.image,
        pre_uni: item.product.unit_price,
        descuento: item.product.discount,
        en_promocion: item.product.on_promotion,
        stock: item.product.stock,
        unit: item.product.unit,
        cantidad: round2(item.quantity),
      })),
    [rawItems]
  );

  const summary = useMemo(() => {
    let subtotal = 0;
    let discountTotal = 0;
    cartItems.forEach((item) => {
      const qty = Number(item.cantidad);
      const price = Number(item.pre_uni);
      const discounted = item.en_promocion
        ? price - price * (item.descuento / 100)
        : price;
      subtotal += discounted * qty;
      if (item.en_promocion) discountTotal += (price - discounted) * qty;
    });
    const igv = subtotal * 0.18;
    return { subtotal, discountTotal, igv, total: subtotal + igv };
  }, [cartItems]);

  const showModal = async () => {
    setVisible(true);
    setOpening(true);
    await refresh();
    setOpening(false);
  };

  const hideModal = () => setVisible(false);

  const increase = async (productId) => {
    const item = cartItems.find((i) => i.id === productId);
    if (!item) return;
    await handleUpdateQuantity(item.item_id, round2(item.cantidad + 1));
    await refresh();
  };

  const decrease = async (productId) => {
    const item = cartItems.find((i) => i.id === productId);
    if (!item) return;
    const newQty = round2(item.cantidad - 1);
    if (newQty <= 0) return;
    await handleUpdateQuantity(item.item_id, newQty);
    await refresh();
  };

  const removeItem = async (productId) => {
    const item = cartItems.find((i) => i.id === productId);
    if (!item) return;
    await handleDeleteItem(item.item_id);
    await refresh();
  };

  const confirmRemove = async () => {
    if (!itemToRemove) return;
    await removeItem(itemToRemove.id);
    setItemToRemove(null);
  };

  const startEdit = (item) => {
    setEditingItemId(item.item_id);
    setEditValue(item.cantidad);
  };

  const cancelEdit = () => {
    setEditingItemId(null);
    setEditValue(null);
  };

  const saveEdit = async (item) => {
    if (editValue <= 0) return;
    const qty =
      item.unit?.abbreviation === "u" ? Math.floor(editValue) : round2(editValue);
    await handleUpdateQuantity(item.item_id, qty);
    setEditingItemId(null);
    setEditValue(null);
    await refresh();
  };

  const footerActions = (
    <div className="flex items-center justify-between gap-3 w-full">
      <div className="flex flex-col leading-tight">
        <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
          Total a pagar
        </span>
        <span className="font-spec text-xl font-bold text-primary">
          {money(summary.total)}
        </span>
      </div>
      <PaymentModal cartEmpty={cartItems.length === 0} reloadCart={refresh} onPaid={onCheckout} />
    </div>
  );

  return (
    <>
      <div className="relative w-fit">
        <ActionButton
          icon="pi pi-shopping-cart"
          color="primary"
          onClick={showModal}
          label="Carrito de compras"
          rounded
        />

        {count > 0 && (
          <Badge className="font-spec absolute -top-1.5 -right-1.5 h-5 min-w-5 justify-center rounded-full px-1 text-[10px] shadow-sm">
            {count}
          </Badge>
        )}
      </div>

      <CustomModal
        visible={visible}
        onHide={hideModal}
        header="Carrito de compras"
        className="w-[92vw] sm:w-[70vw] md:w-[46vw] lg:w-[40vw]"
        footerActions={cartItems.length > 0 ? footerActions : null}
      >
        {opening && cartItems.length === 0 ? (
          <div className="text-center py-10">
            <Loader2 className="mx-auto size-8 animate-spin text-primary mb-3" />
            <p className="text-sm text-muted-foreground">Cargando carrito…</p>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-12">
            <span className="inline-flex size-14 items-center justify-center rounded-full bg-secondary text-muted-foreground mb-4">
              <ShoppingCartIcon className="size-6" />
            </span>
            <h4 className="text-foreground font-bold mb-1">Tu carrito está vacío</h4>
            <p className="text-xs text-muted-foreground max-w-xs mx-auto">
              Agrega productos desde el catálogo y aparecerán aquí para tu compra.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {/* Conteo */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                {cartItems.length} {cartItems.length === 1 ? "producto" : "productos"}
              </span>
              <span className="h-px flex-1 bg-border/60" />
            </div>

            {/* Ítems */}
            <div className="flex flex-col gap-3">
              {cartItems.map((p) => {
                const precioFinal = p.en_promocion
                  ? p.pre_uni - (p.pre_uni * p.descuento) / 100
                  : parseFloat(p.pre_uni);
                const isEditing = editingItemId === p.item_id;

                return (
                  <div
                    key={p.item_id}
                    className="flex gap-3 p-3 rounded-xl border border-border/80 bg-card"
                  >
                    <img
                      src={p.imagen || "/placeholder-product.png"}
                      alt={p.nombre}
                      className="size-16 shrink-0 rounded-lg border border-border/60 bg-secondary/30 object-contain p-1"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h5 className="m-0 text-sm font-semibold text-foreground truncate">
                            {p.nombre}
                          </h5>
                          {p.descripcion && (
                            <p className="m-0 mt-0.5 text-xs text-muted-foreground line-clamp-2 leading-snug">
                              {p.descripcion}
                            </p>
                          )}
                          <p className="m-0 mt-1 text-[11px] text-muted-foreground">
                            {p.unit?.name} · Stock{" "}
                            <span className="font-spec">{parseFloat(p.stock)}</span>
                          </p>
                        </div>
                        <ActionButton
                          icon="pi pi-trash"
                          color="danger"
                          size="sm"
                          tooltip="Quitar del carrito"
                          onClick={() => setItemToRemove(p)}
                        />
                      </div>

                      {/* Precio */}
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="font-spec text-base font-bold text-foreground">
                          {money(precioFinal)}
                        </span>
                        {p.en_promocion && (
                          <>
                            <span className="font-spec text-xs text-muted-foreground line-through">
                              {money(p.pre_uni)}
                            </span>
                            <span className="font-spec text-[11px] font-bold text-destructive">
                              -{p.descuento}%
                            </span>
                          </>
                        )}
                      </div>

                      {/* Cantidad */}
                      <div className="mt-2.5">
                        {isEditing ? (
                          <div className="flex items-center gap-2">
                            <div className="flex items-stretch w-32">
                              <Input
                                type="number"
                                value={editValue ?? ""}
                                min={1}
                                step={p.unit?.abbreviation === "u" ? 1 : 0.01}
                                onChange={(e) => {
                                  const v = e.target.value;
                                  setEditValue(v === "" ? null : Number(v));
                                }}
                                className="font-spec h-8 rounded-r-none"
                              />
                              <span className="inline-flex items-center rounded-r-lg border border-l-0 border-input bg-muted px-2.5 text-xs font-bold text-muted-foreground">
                                {p.unit?.abbreviation}
                              </span>
                            </div>
                            <ActionButton
                              icon="pi pi-check"
                              color="success"
                              size="sm"
                              tooltip="Guardar"
                              onClick={() => saveEdit(p)}
                            />
                            <ActionButton
                              icon="pi pi-times"
                              color="secondary"
                              size="sm"
                              tooltip="Cancelar"
                              onClick={cancelEdit}
                            />
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <div className="inline-flex items-center rounded-lg border border-border bg-secondary/40 overflow-hidden">
                              <button
                                type="button"
                                onClick={() => decrease(p.id)}
                                disabled={p.cantidad <= 1}
                                aria-label="Disminuir"
                                className="grid place-items-center size-7 text-foreground transition-colors hover:bg-secondary disabled:opacity-40 disabled:pointer-events-none outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                              >
                                <Minus className="size-3.5" />
                              </button>
                              <span className="font-spec min-w-11 text-center text-sm font-semibold tabular-nums">
                                {p.cantidad.toFixed(2)}
                              </span>
                              <button
                                type="button"
                                onClick={() => increase(p.id)}
                                aria-label="Aumentar"
                                className="grid place-items-center size-7 text-foreground transition-colors hover:bg-secondary outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                              >
                                <Plus className="size-3.5" />
                              </button>
                            </div>
                            <span className="text-[11px] text-muted-foreground">
                              {p.unit?.abbreviation}
                            </span>
                            <ActionButton
                              icon="pi pi-pencil"
                              color="info"
                              size="sm"
                              tooltip="Editar cantidad"
                              onClick={() => startEdit(p)}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Resumen */}
            <div className="rounded-xl border border-border/80 bg-secondary/30 p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Subtotal</span>
                <span className="font-spec text-sm font-medium text-foreground">
                  {money(summary.subtotal)}
                </span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Descuentos</span>
                <span className="font-spec text-sm font-medium text-success">
                  − {money(summary.discountTotal)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">IGV (18%)</span>
                <span className="font-spec text-sm font-medium text-foreground">
                  {money(summary.igv)}
                </span>
              </div>
              <div className="flex justify-between items-center mt-3 pt-3 border-t border-border/60">
                <span className="text-sm font-bold text-foreground">Total</span>
                <span className="font-spec text-2xl font-bold text-primary">
                  {money(summary.total)}
                </span>
              </div>
            </div>
          </div>
        )}
      </CustomModal>

      <ConfirmDialog
        open={!!itemToRemove}
        onOpenChange={(o) => !o && setItemToRemove(null)}
        title="Quitar del carrito"
        description={
          <>
            ¿Seguro que deseas quitar{" "}
            <span className="font-semibold text-foreground">“{itemToRemove?.nombre}”</span>{" "}
            de tu carrito?
          </>
        }
        confirmLabel="Sí, quitar"
        onConfirm={confirmRemove}
      />
    </>
  );
}
