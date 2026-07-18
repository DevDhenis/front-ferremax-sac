import { useState, useEffect } from "react";
import { Package, ArrowLeftRight } from "lucide-react";
import { useAuth } from "@/services/auth/authContext";
import Container from "@/components/layout/Container";
import InventoryHeader from "@/components/inventory/InventoryHeader";
import InventoryTable from "@/components/inventory/InventoryTable";
import ProductFormModal from "@/components/inventory/ProductFormModal";
import CategoryModal from "@/components/inventory/CategoryModal";
import MovementsTab from "@/components/inventory/MovementsTab";
import KardexModal from "@/components/inventory/KardexModal";
import ConfirmDialog from "@/components/common/ConfirmDialog";

const TABS = [
  { id: "productos", label: "Productos", icon: Package },
  { id: "movimientos", label: "Movimientos", icon: ArrowLeftRight },
];

export default function Inventory() {
    const { http } = useAuth();
    const [productos, setProductos] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [visible, setVisible] = useState(false);
    const [categoryVisible, setCategoryVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [productToDelete, setProductToDelete] = useState(null);
    const [searchValue, setSearchValue] = useState("");
    const [activeTab, setActiveTab] = useState("productos");
    const [kardexProduct, setKardexProduct] = useState(null);

    const getProducts = async () => {
        setLoading(true);
        try {
            const { data } = await http.get("products");
            const lista = data?.data ?? [];
            setProductos(lista);
            setFilteredProducts(lista);
        } catch (error) {
            console.error("Error cargando productos:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (searchValue.trim() === "") {
            setFilteredProducts(productos);
        } else {
            const filtered = productos.filter(product =>
                product.internal_code.toLowerCase().includes(searchValue.toLowerCase()) ||
                product.name.toLowerCase().includes(searchValue.toLowerCase()) ||
                product.category?.name.toLowerCase().includes(searchValue.toLowerCase()) ||
                product.description?.toLowerCase().includes(searchValue.toLowerCase())
            );
            setFilteredProducts(filtered);
        }
    }, [searchValue, productos]);

    const handleSearchChange = (val) => {
        const value = typeof val === 'object' && val.target ? val.target.value : val;
        setSearchValue(value);
    };

    const handleEditProduct = (product) => {
        setSelectedProduct(product);
        setVisible(true);
    };

    const handleAddProduct = () => {
        setSelectedProduct(null);
        setVisible(true);
    };

    const confirmDelete = async () => {
        if (!productToDelete) return;
        try {
            await http.delete(`products/${productToDelete.id}`);
            getProducts();
        } catch (error) {
            console.error("Error eliminando producto:", error);
        } finally {
            setProductToDelete(null);
        }
    };

    const handleHideModal = () => {
        setVisible(false);
        setSelectedProduct(null);
    };

    useEffect(() => {
        getProducts();
    }, []);

    const handleGenerateReport = () => {
        const rows = filteredProducts.length ? filteredProducts : productos;
        if (!rows.length) return;

        const headers = [
            "Código", "Nombre", "Categoría", "P. Unitario", "P. Mayor",
            "Stock", "Unidad", "En promoción", "Descuento", "Estado",
        ];
        const data = rows.map((p) => [
            p.internal_code,
            p.name,
            p.category?.name ?? "",
            Number(p.unit_price).toFixed(2),
            Number(p.wholesale_unit_price).toFixed(2),
            parseFloat(p.stock),
            p.unit?.abbreviation ?? "",
            p.on_promotion ? "Sí" : "No",
            `${p.discount}%`,
            p.status === "A" ? "Activo" : "Inactivo",
        ]);

        const esc = (v) => {
            const s = String(v ?? "");
            return /[";\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
        };
        const csv = [headers, ...data].map((r) => r.map(esc).join(";")).join("\r\n");
        // BOM para que Excel respete UTF-8 (tildes/ñ).
        const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `reporte_stock_${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <Container className="space-y-3">
            {/* Pestañas: Productos | Movimientos */}
            <div className="inline-flex items-center gap-1 rounded-full border border-border bg-card p-1">
                {TABS.map((tab) => {
                    const active = activeTab === tab.id;
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveTab(tab.id)}
                            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-primary/30 ${
                                active
                                    ? "bg-primary text-primary-foreground"
                                    : "text-muted-foreground hover:text-foreground"
                            }`}
                        >
                            <Icon className="size-4" />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {activeTab === "productos" ? (
                <>
                    <InventoryHeader
                        onAddClick={handleAddProduct}
                        onAddCategory={() => setCategoryVisible(true)}
                        searchValue={searchValue}
                        onSearchChange={handleSearchChange}
                        onGenerateReport={handleGenerateReport}
                    />
                    <InventoryTable
                        productos={filteredProducts}
                        onEditProduct={handleEditProduct}
                        onDeleteProduct={setProductToDelete}
                        onViewKardex={setKardexProduct}
                        onRefresh={getProducts}
                        loading={loading}
                    />
                </>
            ) : (
                <MovementsTab products={productos} onStockChange={getProducts} />
            )}
            <ProductFormModal
                visible={visible}
                onHide={handleHideModal}
                product={selectedProduct}
                onSave={getProducts}
            />
            <CategoryModal
                visible={categoryVisible}
                onHide={() => setCategoryVisible(false)}
            />

            <ConfirmDialog
                open={!!productToDelete}
                onOpenChange={(o) => !o && setProductToDelete(null)}
                title="Eliminar producto"
                description={
                    <>
                        ¿Seguro que deseas eliminar el producto{" "}
                        <span className="font-semibold text-foreground">“{productToDelete?.name}”</span>?
                        Esta acción no se puede deshacer.
                    </>
                }
                confirmLabel="Sí, eliminar"
                onConfirm={confirmDelete}
            />

            <KardexModal
                visible={!!kardexProduct}
                onHide={() => setKardexProduct(null)}
                product={kardexProduct}
            />
        </Container>
    );
}