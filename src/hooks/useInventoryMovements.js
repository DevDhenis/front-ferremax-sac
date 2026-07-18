import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/services/auth/authContext";
import { getMovements, createMovement, voidMovement } from "@/services/inventory";

export const useInventoryMovements = () => {
  const { http } = useAuth();
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ movement_type: "", product_id: "" });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.movement_type) params.movement_type = filters.movement_type;
      if (filters.product_id) params.product_id = filters.product_id;
      const result = await getMovements(http, params);
      setMovements(result.data ?? []);
    } catch (error) {
      console.error("Error cargando movimientos:", error);
    } finally {
      setLoading(false);
    }
  }, [http, filters]);

  useEffect(() => {
    load();
  }, [load]);

  // The Axios interceptor already toasts success/error for these mutations.
  const register = async (payload) => {
    await createMovement(http, payload);
    await load();
  };

  const annul = async (id) => {
    await voidMovement(http, id);
    await load();
  };

  return { movements, loading, filters, setFilters, load, register, annul };
};
