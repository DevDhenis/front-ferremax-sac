import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import ActionButton from "../common/ActionButton";
import CustomModal from "../common/CustomModal";
import { useAuth } from "@/services/auth/authContext";
import { checkoutShoppingCart } from "@/services/shopping-cart";
import { useToast } from "@/context/ToastContext";

export default function PaymentModal({ cartEmpty, reloadCart, onPaid }) {
  const { http } = useAuth();
  const { showToast } = useToast();
  const [visible, setVisible] = useState(false);

  const [shippingAddress, setShippingAddress] = useState("");
  const [cellphone, setCellphone] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [exp, setExp] = useState("");
  const [cvv, setCvv] = useState("");

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const validateForm = () => {
    if (!shippingAddress.trim()) {
      showToast("error", "Error", "La dirección de envío es obligatoria");
      return false;
    }
    if (!cellphone.trim() || cellphone.length < 9) {
      showToast("error", "Error", "Debe ingresar un número de celular válido");
      return false;
    }
    if (!cardNumber.trim() || cardNumber.length < 16) {
      showToast("error", "Error", "Número de tarjeta inválido (16 dígitos)");
      return false;
    }
    if (!cardName.trim()) {
      showToast("error", "Error", "El nombre del titular es obligatorio");
      return false;
    }
    if (!exp.trim() || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(exp)) {
      showToast("error", "Error", "La fecha de expiración debe tener formato MM/AA");
      return false;
    }
    if (!cvv.trim() || cvv.length < 3) {
      showToast("error", "Error", "El CVV debe tener 3 dígitos");
      return false;
    }
    return true;
  };

  const handlePay = async () => {
    if (!validateForm()) return;

    try {
      let payload = {
        card_number: cardNumber,
        card_holder: cardName,
        card_expiration: exp,
        card_cvv: cvv,
        phone: cellphone,
        shipping_address: shippingAddress,
      }

      await checkoutShoppingCart(http, payload);

      setShippingAddress("");
      setCellphone("");
      setCardNumber("");
      setCardName("");
      setExp("");
      setCvv("");

      hideModal();

      if (reloadCart) {
        await reloadCart();
      }
      // Recarga los productos del catálogo para reflejar el stock actualizado.
      onPaid?.();

    } catch (error) {
      console.error("Error en pago:", error);
    }
  };

  const footerActions = (
    <div className="flex justify-end gap-2 w-full">
      <ActionButton
        icon="pi pi-check"
        label="Pagar"
        color="primary"
        onClick={handlePay}
      />
    </div>
  );

  return (
    <>
      <ActionButton
        icon="pi pi-credit-card"
        label="Proceder al pago"
        color="primary"
        disabled={cartEmpty}
        onClick={showModal}
      />

      <CustomModal
        visible={visible}
        onHide={hideModal}
        header="Pago con tarjeta"
        className="w-[33vw]"
        footerActions={footerActions}
      >
        <div className="flex flex-col gap-3">

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-foreground">Ubicación / Dirección de envío *</label>
            <Input
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              placeholder="Ej: Av. Los Laureles 123"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-foreground">Número de celular *</label>
            <Input
              value={cellphone}
              maxLength={9}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                setCellphone(value);
              }}
              onPaste={(e) => {
                const pasted = e.clipboardData.getData("Text");
                if (!/^\d*$/.test(pasted)) {
                  e.preventDefault();
                  showToast("error", "Error", "Solo se permiten números en el celular");
                }
              }}
              placeholder="999 999 999"
            />

          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-foreground">Número de tarjeta *</label>
            <Input
              value={cardNumber}
              maxLength={16}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                setCardNumber(value);
              }}
              onPaste={(e) => {
                const pasted = e.clipboardData.getData("Text");
                if (!/^\d*$/.test(pasted)) {
                  e.preventDefault();
                  showToast("error", "Error", "Solo se permiten números en la tarjeta");
                }
              }}
              placeholder="0000 0000 0000 0000"
            />

          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-foreground">Nombre del titular *</label>
            <Input
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              placeholder="Ej: Raul Sanchez"
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1 flex flex-col gap-1">
              <label className="text-xs font-medium text-foreground">Expiración *</label>
              <Input
                value={exp}
                onChange={(e) => setExp(e.target.value)}
                placeholder="MM/AA"
                maxLength={5}
              />
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <label className="text-xs font-medium text-foreground">CVV *</label>
              <Input
                value={cvv}
                maxLength={3}
                onChange={(e) => setCvv(e.target.value)}
                placeholder="123"
              />
            </div>
          </div>

        </div>
      </CustomModal >
    </>
  );
}
