import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import ActionButton from "../common/ActionButton";
import CompactTable from "../common/CompactTable";

export default function InventoryTable({
    productos,
    onEditProduct,
    onDeleteProduct,
    onRefresh,
    loading = false
}) {
    const estadoTemplate = (rowData) => (
        <Tag
            value={rowData.estado_registro === "A" ? "Activo" : "Inactivo"}
            severity={rowData.estado_registro === "A" ? "success" : "danger"}
        />
    );

    const promocionTemplate = (rowData) => (
        <Tag
            value={rowData.en_promocion ? "Sí" : "No"}
            severity={rowData.en_promocion ? "warning" : "info"}
        />
    );

    const precioUnitarioTemplate = (rowData) => (
        <span>S/ {parseFloat(rowData.pre_uni).toFixed(2)}</span>
    );

    const precioMayorTemplate = (rowData) => (
        <span>S/ {parseFloat(rowData.pre_uni_may).toFixed(2)}</span>
    );

    const stockTemplate = (rowData) => (
        <span className={parseFloat(rowData.stock) <= parseFloat(rowData.cantidad_minima) ? "text-red-500 font-semibold" : ""}>
            {parseFloat(rowData.stock)} {rowData.unit?.abreviatura}
        </span>
    );

    const categoriaTemplate = (rowData) => (
        <Tag value={rowData.category?.nombre} severity="info" />
    );

    const descuentoTemplate = (rowData) => (
        <span>{rowData.descuento}%</span>
    );

    const actionsBodyTemplate = (rowData) => {
        return (
            <div className="flex gap-2">
                <ActionButton
                    icon="pi pi-pencil"
                    color="warning"
                    size="sm"
                    tooltip="Editar producto"
                    onClick={() => onEditProduct(rowData)}
                />
                <ActionButton
                    icon="pi pi-trash"
                    color="danger"
                    size="sm"
                    tooltip="Eliminar producto"
                    onClick={() => onDeleteProduct(rowData)}
                />
            </div >
        );
    };

    return (
        <CompactTable
            value={productos}
            paginator
            rows={10}
            emptyMessage="No hay productos registrados"
            size="small"
            loading={loading}
            scrollable
            scrollHeight="flex"
            onRefresh={onRefresh}
        >
            <Column field="codigo_interno" header="Código" sortable style={{ width: "8%" }} />
            <Column field="nombre" header="Producto" sortable style={{ width: "15%" }} />
            <Column
                field="category.nombre"
                header="Categoría"
                body={categoriaTemplate}
                sortable
                style={{ width: "10%" }}
            />
            <Column
                field="pre_uni"
                header="P. Unitario"
                body={precioUnitarioTemplate}
                sortable
                style={{ width: "8%" }}
            />
            <Column
                field="pre_uni_may"
                header="P. Mayor"
                body={precioMayorTemplate}
                sortable
                style={{ width: "8%" }}
            />
            <Column
                field="stock"
                header="Stock"
                body={stockTemplate}
                sortable
                style={{ width: "8%" }}
            />
            <Column
                field="unit.abreviatura"
                header="Unidad"
                sortable
                style={{ width: "6%" }}
            />
            <Column
                field="en_promocion"
                header="Promoción"
                body={promocionTemplate}
                sortable
                style={{ width: "8%" }}
            />
            <Column
                field="descuento"
                header="Desc."
                body={descuentoTemplate}
                sortable
                style={{ width: "6%" }}
            />
            <Column
                field="estado_registro"
                header="Estado"
                body={estadoTemplate}
                style={{ width: "8%" }}
            />
            <Column
                body={actionsBodyTemplate}
                header="Acciones"
                style={{ width: "15%" }}
                exportable={false}
            />
        </CompactTable>
    );
}