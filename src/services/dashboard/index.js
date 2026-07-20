export const getDashboard = async (http, range = "30d") => {
  const response = await http.get("dashboard", { params: { range } });
  return response.data;
};
