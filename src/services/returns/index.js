export const getReturns = async (http, status) => {
  const response = await http.get("returns", { params: status ? { status } : {} });
  return response.data;
};

export const getMyReturns = async (http) => {
  const response = await http.get("my-returns", { skipToast: true });
  return response.data;
};

export const requestReturn = async (http, payload) => {
  const response = await http.post("returns", payload);
  return response.data;
};

export const approveReturn = async (http, id) => {
  const response = await http.post(`returns/${id}/approve`);
  return response.data;
};

export const rejectReturn = async (http, id, reviewNote) => {
  const response = await http.post(`returns/${id}/reject`, { review_note: reviewNote });
  return response.data;
};

export const refundReturn = async (http, id) => {
  const response = await http.post(`returns/${id}/refund`);
  return response.data;
};
