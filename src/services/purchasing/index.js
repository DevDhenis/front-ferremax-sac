// Compras a proveedor
export const getPurchases = async (http) => {
  const response = await http.get("purchases");
  return response.data;
};

export const createPurchase = async (http, payload) => {
  const response = await http.post("purchases", payload);
  return response.data;
};

// Devoluciones a proveedor
export const getSupplierReturns = async (http) => {
  const response = await http.get("supplier-returns");
  return response.data;
};

export const createSupplierReturn = async (http, payload) => {
  const response = await http.post("supplier-returns", payload);
  return response.data;
};

export const creditSupplierReturn = async (http, id) => {
  const response = await http.post(`supplier-returns/${id}/credit`);
  return response.data;
};
