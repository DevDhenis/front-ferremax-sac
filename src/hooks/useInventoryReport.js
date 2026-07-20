import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function useInventoryReport() {
  const generateStockReport = (products) => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("Reporte de Stock", 14, 15);

    const tableData = products.map((p) => [
      p.internal_code,
      p.name,
      p.category?.name || "",
      p.stock,
      p.minimum_quantity,
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
