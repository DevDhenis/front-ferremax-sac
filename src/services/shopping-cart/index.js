export const getShoppingCart = async (http) => {
  const response = await http.get("shopping-cart");
  return response.data;
};

export const addItemToCart = async (http, productId) => {
  const response = await http.post(
    "shopping-cart/items",
    { product_id: productId },
    { skipToast: true } // el componente muestra su propio toast "Carrito"
  );
  return response.data;
};

export const updateCartItemQuantity = async (http, itemId, quantity) => {
  const response = await http.put(`shopping-cart/items/${itemId}`, {
    quantity,
  });
  return response.data;
};

export const deleteCartItem = async (http, itemId) => {
  const response = await http.delete(`shopping-cart/items/${itemId}`);
  return response.data;
};

export const checkoutShoppingCart = async (http, payload) => {
  const response = await http.post("shopping-cart/checkout", payload);
  return response.data;
};
