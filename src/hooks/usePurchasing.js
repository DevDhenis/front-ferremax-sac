import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/services/auth/authContext";
import {
  getPurchases,
  createPurchase,
  getSupplierReturns,
  createSupplierReturn,
  creditSupplierReturn,
} from "@/services/purchasing";
import { getSuppliers } from "@/services/suppliers";

export const usePurchasing = () => {
  const { http } = useAuth();
  const [purchases, setPurchases] = useState([]);
  const [supplierReturns, setSupplierReturns] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [p, sr, sup, prod] = await Promise.all([
        getPurchases(http),
        getSupplierReturns(http),
        getSuppliers(http),
        http.get("products"),
      ]);
      setPurchases(p.data ?? []);
      setSupplierReturns(sr.data ?? []);
      setSuppliers(sup.data ?? []);
      setProducts(prod.data?.data ?? []);
    } catch (error) {
      console.error("Error cargando compras:", error);
    } finally {
      setLoading(false);
    }
  }, [http]);

  useEffect(() => {
    load();
  }, [load]);

  // The Axios interceptor toasts these mutations.
  const registerPurchase = async (payload) => {
    await createPurchase(http, payload);
    await load();
  };
  const registerReturn = async (payload) => {
    await createSupplierReturn(http, payload);
    await load();
  };
  const credit = async (id) => {
    await creditSupplierReturn(http, id);
    await load();
  };

  return { purchases, supplierReturns, suppliers, products, loading, load, registerPurchase, registerReturn, credit };
};
