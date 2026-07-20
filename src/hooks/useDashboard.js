import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/services/auth/authContext";
import { getDashboard } from "@/services/dashboard";

export const useDashboard = () => {
  const { http } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("30d");

  const load = useCallback(
    async (nextRange) => {
      setLoading(true);
      try {
        const result = await getDashboard(http, nextRange);
        setData(result.data);
      } catch (error) {
        console.error("Error cargando el panel:", error);
      } finally {
        setLoading(false);
      }
    },
    [http]
  );

  useEffect(() => {
    load(range);
  }, [range, load]);

  const refresh = useCallback(() => load(range), [load, range]);

  return { data, loading, range, setRange, refresh };
};
