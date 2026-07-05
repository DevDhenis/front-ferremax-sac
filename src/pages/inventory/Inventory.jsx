import { useState, useEffect } from "react";
import { useAuth } from "@/services/auth/authContext";
import Container from "@/components/layout/Container";
import InventoryHeader from "@/components/inventory/InventoryHeader";
import InventoryTable from "@/components/inventory/InventoryTable";
import ProductFormModal from "@/components/inventory/ProductFormModal";
import CategoryModal from "@/components/inventory/CategoryModal";
import ConfirmDialog from "@/components/common/ConfirmDialog";

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
                product.codigo_interno.toLowerCase().includes(searchValue.toLowerCase()) ||
                product.nombre.toLowerCase().includes(searchValue.toLowerCase()) ||
                product.category?.nombre.toLowerCase().includes(searchValue.toLowerCase()) ||
                product.descripcion?.toLowerCase().includes(searchValue.toLowerCase())
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
            p.codigo_interno,
            p.nombre,
            p.category?.nombre ?? "",
            Number(p.pre_uni).toFixed(2),
            Number(p.pre_uni_may).toFixed(2),
            parseFloat(p.stock),
            p.unit?.abreviatura ?? "",
            p.en_promocion ? "Sí" : "No",
            `${p.descuento}%`,
            p.estado_registro === "A" ? "Activo" : "Inactivo",
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
                onRefresh={getProducts}
                loading={loading}
            />
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
                        <span className="font-semibold text-foreground">“{productToDelete?.nombre}”</span>?
                        Esta acción no se puede deshacer.
                    </>
                }
                confirmLabel="Sí, eliminar"
                onConfirm={confirmDelete}
            />
        </Container>
    );
}