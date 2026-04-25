import { useState } from "react";
import { useAuth } from "@/services/auth/authContext";
import { getSales, getSaleDetail, changeSaleStatus } from "@/services/sales";

export const useSales = () => {
  const { http } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleGetSales = async () => {
    setLoading(true);
    try {
      const result = await getSales(http);
      return result.data;
    } finally {
      setLoading(false);
    }
  };

  const handleGetSaleDetail = async (saleId) => {
    setLoading(true);
    try {
      const result = await getSaleDetail(http, saleId);
      return result.data;
    } finally {
      setLoading(false);
    }
  };

  const handleChangeStatus = async (saleId, newStatus, reason = null) => {
    setLoading(true);
    try {
      const result = await changeSaleStatus(http, saleId, {
        new_status: newStatus,
        reason: reason,
      });
      return result.data;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleGetSales,
    handleGetSaleDetail,
    handleChangeStatus,
  };
};
