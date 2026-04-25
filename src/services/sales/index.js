export const getSales = async (http) => {
  const response = await http.get("sales");
  return response.data;
};

export const getSaleDetail = async (http, saleId) => {
  const response = await http.get(`sales/${saleId}`);
  return response.data;
};

export const changeSaleStatus = async (http, saleId, payload) => {
  const response = await http.post(`sales/${saleId}/change-status`, payload);
  return response.data;
};
