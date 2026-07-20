import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/services/auth/authContext";
import { getReturns, approveReturn, rejectReturn, refundReturn } from "@/services/returns";

export const useReturns = () => {
  const { http } = useAuth();
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getReturns(http, statusFilter || undefined);
      setReturns(result.data ?? []);
    } catch (error) {
      console.error("Error cargando devoluciones:", error);
    } finally {
      setLoading(false);
    }
  }, [http, statusFilter]);

  useEffect(() => {
    load();
  }, [load]);

  // The Axios interceptor toasts these mutations.
  const approve = async (id) => {
    await approveReturn(http, id);
    await load();
  };
  const reject = async (id, note) => {
    await rejectReturn(http, id, note);
    await load();
  };
  const refund = async (id) => {
    await refundReturn(http, id);
    await load();
  };

  return { returns, loading, statusFilter, setStatusFilter, approve, reject, refund, reload: load };
};
