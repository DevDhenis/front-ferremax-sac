export const getMovements = async (http, params = {}) => {
  const response = await http.get("inventory-movements", { params });
  return response.data;
};

export const createMovement = async (http, payload) => {
  const response = await http.post("inventory-movements", payload);
  return response.data;
};

export const voidMovement = async (http, id) => {
  const response = await http.delete(`inventory-movements/${id}`);
  return response.data;
};

export const getKardex = async (http, productId) => {
  const response = await http.get(`products/${productId}/kardex`);
  return response.data;
};

export const getTraceabilityReport = async (http, params = {}) => {
  const clean = {};
  if (params.from) clean.from = params.from;
  if (params.to) clean.to = params.to;
  if (params.product_id) clean.product_id = params.product_id;
  const response = await http.get("inventory-movements/report", { params: clean });
  return response.data;
};
