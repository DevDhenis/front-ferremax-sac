import React, { useState, useEffect } from "react";
import InventoryHeader from "@/components/inventory/InventoryHeader";
import InventoryTable from "@/components/inventory/InventoryTable";
import ProductFormModal from "@/components/inventory/ProductFormModal";
import CategoryModal from "@/components/inventory/CategoryModal";
import { confirmDialog } from "primereact/confirmdialog";
import { useAuth } from "@/services/auth/authContext";
import useInventoryReport from "@/hooks/useInventoryReport";
import Container from "@/components/layout/Container";

export default function Inventory() {
    const { http } = useAuth();
    const [visible, setVisible] = useState(false);
    const [categoryVisible, setCategoryVisible] = useState(false);
    const [productos, setProductos] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [searchValue, setSearchValue] = useState("");
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const { generateStockReport } = useInventoryReport();

    const handleGenerateReport = () => {
        generateStockReport(productos);
    };

    const getProducts = async () => {
        setLoading(true);
        try {
            const { data } = await http.get("products");
            setProductos(data.data);
            setFilteredProducts(data.data);
        } catch (error) {
            console.error("Error cargando productos:", error);
        } finally {
            setLoading(false);
        }
    }

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

    const handleSearchChange = (e) => {
        setSearchValue(e.target.value);
    };

    const handleEditProduct = (product) => {
        setSelectedProduct(product);
        setVisible(true);
    };

    const handleAddProduct = () => {
        setSelectedProduct(null);
        setVisible(true);
    };

    const deleteProduct = async (id) => {
        try {
            await http.delete(`products/${id}`);
            getProducts();
        } catch (error) {
            console.error("Error eliminando producto:", error);
        }
    };

    const confirmDelete = (product) => {
        confirmDialog({
            message: `¿Estás seguro de que deseas eliminar el producto "${product.nombre}"?`,
            header: "Confirmar eliminación",
            icon: "pi pi-exclamation-triangle",
            acceptClassName: "p-button-danger",
            acceptLabel: "Sí, eliminar",
            rejectLabel: "Cancelar",
            accept: () => deleteProduct(product.id),
        });
    };

    const handleHideModal = () => {
        setVisible(false);
        setSelectedProduct(null);
    };

    useEffect(() => {
        const tableHeader = document.querySelectorAll(".p-datatable-thead > tr > th");
        tableHeader.forEach((th) => {
            th.style.backgroundColor = "#1E88E5";
            th.style.color = "#fff";
        });
        getProducts();
    }, []);

    return (
        <Container>
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
                onDeleteProduct={confirmDelete}
                onRefresh={getProducts}
                loading={loading}
            />
            <ProductFormModal
                visible={visible}
                onHide={handleHideModal}
                product={selectedProduct}
                onSuccess={getProducts}
            />
            <CategoryModal
                visible={categoryVisible}
                onHide={() => setCategoryVisible(false)}
            />
        </Container>
    );
}