export const getMySales = async (http) => {
  const response = await http.get("my-sales");
  return response.data;
};
