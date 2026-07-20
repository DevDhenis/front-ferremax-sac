export const getSuppliers = async (http) => {
  const response = await http.get("suppliers");
  return response.data;
};

export const createSupplier = async (http, payload) => {
  const response = await http.post("suppliers", payload);
  return response.data;
};

export const updateSupplier = async (http, id, payload) => {
  const response = await http.put(`suppliers/${id}`, payload);
  return response.data;
};

export const deleteSupplier = async (http, id) => {
  const response = await http.delete(`suppliers/${id}`);
  return response.data;
};
