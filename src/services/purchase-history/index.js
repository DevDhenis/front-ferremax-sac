export const getMySales = async (http) => {
  // El historial maneja su propio estado vacío; que un no-cliente (p. ej. admin)
  // no tenga compras no debe disparar un toast de error.
  const response = await http.get("my-sales", { skipToast: true });
  return response.data;
};
