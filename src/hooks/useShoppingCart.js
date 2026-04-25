import { useState } from "react";
import { useAuth } from "@/services/auth/authContext";
import { getShoppingCart } from "@/services/shopping-cart/index";
import {
  addItemToCart,
  deleteCartItem,
  updateCartItemQuantity,
} from "@/services/shopping-cart/index";

export const useShoppingCart = () => {
  const { http } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleGetShoppingCart = async () => {
    setLoading(true);
    try {
      const result = await getShoppingCart(http);
      return result.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId) => {
    setLoading(true);
    try {
      return await addItemToCart(http, productId);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (itemId, cantidad) => {
    setLoading(true);
    try {
      return await updateCartItemQuantity(http, itemId, cantidad);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (itemId) => {
    setLoading(true);
    try {
      return await deleteCartItem(http, itemId);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async (payload) => {
    setLoading(true);
    try {
      return await checkoutShoppingCart(http, payload);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleGetShoppingCart,
    handleAddToCart,
    handleUpdateQuantity,
    handleDeleteItem,
    handleCheckout,
  };
};
