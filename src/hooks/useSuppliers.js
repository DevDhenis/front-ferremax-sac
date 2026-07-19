import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/services/auth/authContext";
import { getSuppliers, createSupplier, updateSupplier, deleteSupplier } from "@/services/suppliers";

export const useSuppliers = () => {
  const { http } = useAuth();
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getSuppliers(http);
      setSuppliers(result.data ?? []);
    } catch (error) {
      console.error("Error cargando proveedores:", error);
    } finally {
      setLoading(false);
    }
  }, [http]);

  useEffect(() => {
    load();
  }, [load]);

  // The Axios interceptor toasts these mutations.
  const create = async (payload) => {
    await createSupplier(http, payload);
    await load();
  };
  const update = async (id, payload) => {
    await updateSupplier(http, id, payload);
    await load();
  };
  const remove = async (id) => {
    await deleteSupplier(http, id);
    await load();
  };

  return { suppliers, loading, load, create, update, remove };
};
