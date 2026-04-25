import React, { useState } from "react";
import { Badge } from "primereact/badge";
import ActionButton from "../common/ActionButton";
import CustomModal from "../common/CustomModal";
import { useShoppingCart } from "@/hooks/useShoppingCart";
import { ProgressSpinner } from "primereact/progressspinner";
import { InputNumber } from "primereact/inputnumber";
import PaymentModal from "../payment/PaymentModal";

export default function ShoppingCart() {
  const [visible, setVisible] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [editingItemId, setEditingItemId] = useState(null);
  const [editValue, setEditValue] = useState(null);

  const {
    handleGetShoppingCart,
    handleUpdateQuantity,
    handleDeleteItem,
    loading
  } = useShoppingCart();

  const round2 = (num) => Number(Number(num).toFixed(2));

  const normalizeCartItems = (items) =>
    items.map((item) => ({
      item_id: item.id,
      id: item.product.id,
      nombre: item.product.nombre,
      descripcion: item.product.descripcion,
      imagen: item.product.imagen,
      pre_uni: item.product.pre_uni,
      descuento: item.product.descuento,
      en_promocion: item.product.en_promocion,
      stock: item.product.stock,
      unit: item.product.unit,
      cantidad: round2(item.cantidad),
    }));

  const calculateSummary = () => {
    let subtotal = 0;
    let discountTotal = 0;

    cartItems.forEach(item => {
      const qty = Number(item.cantidad);
      const price = Number(item.pre_uni);
      const discountedPrice = item.en_promocion
        ? price - (price * (item.descuento / 100))
        : price;

      subtotal += discountedPrice * qty;

      if (item.en_promocion) {
        discountTotal += (price - discountedPrice) * qty;
      }
    });

    const igv = subtotal * 0.18;
    const total = subtotal + igv;

    return {
      subtotal,
      discountTotal,
      igv,
      total
    };
  };

  const loadCart = async () => {
    try {
      const res = await handleGetShoppingCart();
      setCartItems(normalizeCartItems(res.items || []));
    } catch (error) {
      console.error("Error cargando carrito:", error);
    }
  };

  const showModal = async () => {
    setVisible(true);
    await loadCart();
  };

  const hideModal = () => setVisible(false);

  const increase = async (productId) => {
    const item = cartItems.find((i) => i.id === productId);
    if (!item) return;

    const step = item.unit?.abreviatura === "u" ? 1 : 1;
    const newQty = item.unit?.abreviatura === "u"
      ? item.cantidad + step
      : round2(item.cantidad + step);

    await handleUpdateQuantity(item.item_id, newQty);
    await loadCart();
  };

  const decrease = async (productId) => {
    const item = cartItems.find((i) => i.id === productId);
    if (!item) return;

    const step = item.unit?.abreviatura === "u" ? 1 : 1;
    const newQty = item.unit?.abreviatura === "u"
      ? item.cantidad - step
      : round2(item.cantidad - step);

    if (newQty <= 0) return;

    await handleUpdateQuantity(item.item_id, newQty);
    await loadCart();
  };

  const removeItem = async (productId) => {
    const item = cartItems.find((i) => i.id === productId);
    if (!item) return;

    await handleDeleteItem(item.item_id);
    await loadCart();
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

    const qty = item.unit?.abreviatura === "u"
      ? Math.floor(editValue)
      : round2(editValue);

    await handleUpdateQuantity(item.item_id, qty);
    setEditingItemId(null);
    setEditValue(null);
    await loadCart();
  };

  const footerActions = (
    <div className="flex justify-content-end">
      <PaymentModal cartEmpty={cartItems.length === 0} reloadCart={loadCart} />
    </div>
  );

  const summary = calculateSummary();

  return (
    <>
      <div className="relative">
        <ActionButton
          icon="pi pi-shopping-cart"
          color="primary"
          onClick={showModal}
          label="Carrito de compras"
          rounded
        />

        {cartItems.length > 0 && (
          <Badge value={cartItems.length} className="absolute -top-1 -right-1" />
        )}
      </div>

      <CustomModal
        visible={visible}
        onHide={hideModal}
        header="Carrito de Compras"
        className="w-5"
        footerActions={footerActions}
      >
        {loading ? (
          <div className="text-center py-4">
            <ProgressSpinner />
            <h4 className="text-900 font-medium">Cargando carrito...</h4>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-4">
            <i className="pi pi-shopping-cart text-6xl text-400 mb-3"></i>
            <h4 className="text-900 font-medium mb-2">Carrito vacío</h4>
            <p className="text-600">Agrega productos al carrito para verlos aquí.</p>
          </div>
        ) : (
          <div className="flex flex-column gap-3">
            {cartItems.map((p) => (
              <div key={p.item_id} className="flex flex-column gap-3 p-3 border-1 surface-border border-round">
                <div className="flex gap-3">
                  <div className="w-4 flex justify-content-center align-items-center">
                    <img
                      src={p.imagen || "/placeholder-product.png"}
                      alt={p.nombre}
                      className="w-10rem h-10rem border-round"
                      style={{ objectFit: "cover" }}
                    />
                  </div>

                  <div className="flex-1 flex flex-column justify-content-between">

                    <div>
                      <h5 className="m-0">{p.nombre}</h5>
                      <p className="m-0 text-sm text-600">{p.descripcion}</p>

                      <div className="flex align-items-center gap-2 mt-2 flex-wrap">

                        {p.en_promocion ? (
                          <>
                            <span className="text-green-600 font-bold">
                              S/ {(p.pre_uni - (p.pre_uni * p.descuento) / 100).toFixed(2)}
                            </span>
                            <span className="text-500 text-sm line-through">
                              S/ {parseFloat(p.pre_uni).toFixed(2)}
                            </span>
                            <span className="text-red-500 text-xs font-bold">-{p.descuento}%</span>
                          </>
                        ) : (
                          <span className="text-900 font-bold">
                            S/ {parseFloat(p.pre_uni).toFixed(2)}
                          </span>
                        )}

                        <span className="text-500 text-xs">•</span>
                        <span className="text-500 text-xs">Stock: {p.stock}</span>
                        <span className="text-500 text-xs">•</span>
                        <span className="text-500 text-xs">
                          {p.unit?.nombre} ({p.unit?.abreviatura})
                        </span>
                      </div>
                    </div>

                    {editingItemId === p.item_id ? (
                      <div className="flex justify-content-start align-items-center gap-2 mt-3">
                        <div className="p-inputgroup">
                          <InputNumber
                            value={editValue}
                            min={1}
                            maxFractionDigits={p.unit?.abreviatura === "u" ? 0 : 2}
                            minFractionDigits={p.unit?.abreviatura === "u" ? 0 : 0}
                            onValueChange={(e) => setEditValue(e.value)}
                            mode="decimal"
                            inputClassName="w-full"
                          />
                          <span className="p-inputgroup-addon font-bold">
                            {p.unit?.abreviatura}
                          </span>
                        </div>

                        <div className="shrink-0 flex flex-row gap-2">
                          <ActionButton
                            icon="pi pi-check"
                            color="success"
                            size="sm"
                            onClick={() => saveEdit(p)}
                          />

                          <ActionButton
                            icon="pi pi-times"
                            color="secondary"
                            size="sm"
                            onClick={cancelEdit}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-content-start align-items-center gap-2 mt-3">
                        <ActionButton icon="pi pi-minus" size="sm" onClick={() => decrease(p.id)} />

                        <span className="font-semibold">{p.cantidad.toFixed(2)}</span>

                        <ActionButton icon="pi pi-plus" size="sm" onClick={() => increase(p.id)} />

                        <ActionButton icon="pi pi-pencil" color="info" size="sm" onClick={() => startEdit(p)} />

                        <ActionButton icon="pi pi-trash" color="danger" size="sm" onClick={() => removeItem(p.id)} />
                      </div>
                    )}

                  </div>
                </div>
              </div>
            ))}

            <div className="mt-3 p-3 border-1 surface-border border-round">
              <div className="flex justify-content-between mb-2">
                <span className="text-sm text-700">Subtotal</span>
                <span className="font-medium">S/ {summary.subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-content-between mb-2">
                <span className="text-sm text-700">Descuentos</span>
                <span className="font-medium text-green-600">
                  - S/ {summary.discountTotal.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-content-between mb-2">
                <span className="text-sm text-700">IGV (18%)</span>
                <span className="font-medium">S/ {summary.igv.toFixed(2)}</span>
              </div>

              <div className="flex justify-content-between mt-3 pt-3 border-top-1 surface-border">
                <span className="text-xl font-bold">Total a pagar</span>
                <span className="text-2xl font-bold text-primary">
                  S/ {summary.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        )}
      </CustomModal>
    </>
  );
}
