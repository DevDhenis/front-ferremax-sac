import { useState } from "react";
import { useAuth } from "@/services/auth/authContext";
import { getMySales } from "@/services/purchase-history";

export const useMySales = () => {
  const { http } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleGetMySales = async () => {
    setLoading(true);
    try {
      const result = await getMySales(http);
      return result.data;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleGetMySales,
  };
};
