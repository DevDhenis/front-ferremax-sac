import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "@/services/auth/authContext";
import { getShoppingCart, addItemToCart } from "@/services/shopping-cart/index";

const CartContext = createContext(null);

/**
 * Estado compartido del carrito: mantiene el conteo (para el badge del botón
 * de carrito) sincronizado en toda la app. Se refresca al agregar productos
 * desde cualquier lugar (catálogo, modal, etc.).
 */
export function CartProvider({ children }) {
  const { http, token } = useAuth();
  const [count, setCount] = useState(0);
  const [items, setItems] = useState([]);

  const refresh = useCallback(async () => {
    if (!token) return;
    try {
      const res = await getShoppingCart(http);
      const list = res?.data?.items || [];
      setItems(list);
      setCount(list.length);
    } catch (error) {
      console.error("Error cargando el carrito:", error);
    }
  }, [http, token]);

  // Carga inicial (y cuando cambia la sesión).
  useEffect(() => {
    if (token) refresh();
    else {
      setItems([]);
      setCount(0);
    }
  }, [token, refresh]);

  const addToCart = useCallback(
    async (productId) => {
      await addItemToCart(http, productId);
      await refresh();
    },
    [http, refresh]
  );

  return (
    <CartContext.Provider value={{ count, items, refresh, addToCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de un CartProvider");
  return ctx;
}
