import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function useInventoryReport() {
  const generateStockReport = (products) => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("Reporte de Stock", 14, 15);

    const tableData = products.map((p) => [
      p.codigo_interno,
      p.nombre,
      p.category?.name || "",
      p.stock,
      p.cantidad_minima,
    ]);

    autoTable(doc, {
      startY: 25,
      head: [["Código", "Producto", "Categoría", "Stock", "Mínimo"]],
      body: tableData,
    });

    doc.save("reporte-stock.pdf");
  };

  return { generateStockReport };
}
