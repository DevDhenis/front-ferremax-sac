import Container from "@/components/layout/Container";
import Header from "@/components/layout/Header";
import { Tag } from "primereact/tag";
import { Paginator } from "primereact/paginator";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useAuth } from "@/services/auth/authContext";
import CategorySidebar from "@/components/product/CategorySidebar";
import ProductSkeleton from "@/components/product/ProductSkeleton";
import ProductsGrid from "@/components/product/ProductsGrid";
import ShoppingCart from "@/components/shopping/ShoppingCart";
import ActionButton from "@/components/common/ActionButton";
import { useShoppingCart } from "@/hooks/useShoppingCart";
import { InputText } from "primereact/inputtext";
import PromoCarousel from "@/components/catalog/PromoCarousel";

export default function Catalog() {
  const { http } = useAuth();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("todas");
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(12);
  const [searchTerm, setSearchTerm] = useState("");

  const { handleAddToCart } = useShoppingCart();

  const getProductos = async () => {
    try {
      const { data } = await http.get("products");
      if (data.success) {
        setProductos(data.data);
      }
    } catch (error) {
      console.error("Error cargando productos:", error);
    } finally {
      setLoading(false);
    }
  };

  const getCategorias = async () => {
    try {
      const { data } = await http.get("/product-categories");
      if (data.success) {
        setCategorias(data.data);
      }
    } catch (error) {
      console.error("Error cargando categorías:", error);
    }
  };

  useEffect(() => {
    getProductos();
    getCategorias();
  }, []);

  const conteoProductosPorCategoria = useMemo(() => {
    const conteo = { todas: productos.length };
    categorias.forEach(c => {
      conteo[c.id] = productos.filter(p => p.category?.id === c.id).length;
    });
    return conteo;
  }, [productos]);

  const normalize = useCallback((text) => {
    if (!text) return "";
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }, []);

  const productosFiltrados = useMemo(() => {
    let list = categoriaSeleccionada === "todas"
      ? productos
      : productos.filter(
        (producto) =>
          producto.category?.id.toString() === categoriaSeleccionada
      );

    if (searchTerm.trim() !== "") {
      const term = normalize(searchTerm);

      list = list.filter((p) => {
        const nombre = normalize(p.nombre);
        const descripcion = normalize(p.descripcion || "");
        return nombre.includes(term) || descripcion.includes(term);
      });
    }

    return list;
  }, [productos, categoriaSeleccionada, searchTerm]);


  const productosPaginados = productosFiltrados.slice(first, first + rows);

  const onPageChange = (event) => {
    setFirst(event.first);
    setRows(event.rows);
  };

  const handleCategoriaChange = (categoriaId) => {
    setCategoriaSeleccionada(categoriaId);
    setSearchTerm("");
    setFirst(0);
  };

  const handleRefresh = async () => {
    setLoading(true);
    await getProductos();
    setLoading(false);
  };

  const addToCart = async (producto) => {
    try {
      await handleAddToCart(producto.id);
    } catch (error) {
      console.error("Error al agregar producto al carrito:", error);
    }
  };

  return (
    <Container>
      <div className="flex flex-row justify-content-between">
        <Header
          title="Catálogo de Productos"
          subtitle="Explora nuestra amplia selección de productos organizados por categorías"
        />

        <ShoppingCart />
      </div>

      <PromoCarousel productos={productos.filter(p => p.en_promocion)} />

      <div className="grid">
        <div className="col-12 md:col-3 lg:col-3">
          <CategorySidebar
            categorias={categorias}
            categoriaSeleccionada={categoriaSeleccionada}
            onCategoriaChange={handleCategoriaChange}
            conteoProductosPorCategoria={conteoProductosPorCategoria}
          />
        </div>

        <div className="col-12 md:col-9 lg:col-9">
          {loading ? (
            <div className="grid grid-nogutter gap-4">
              {[...Array(8)].map((_, index) => (
                <div
                  key={index}
                  className="col-12 sm:col-6 md:col-4 lg:col-3"
                >
                  <ProductSkeleton />
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="mb-4 flex align-items-center justify-content-between">
                <div>
                  <h3 className="text-xl font-bold m-0">
                    {categoriaSeleccionada === "todas"
                      ? "Todos los productos"
                      : categorias.find(
                        (c) => c.id.toString() === categoriaSeleccionada
                      )?.nombre}
                  </h3>
                  <p className="text-600 m-0 mt-1">
                    {productosFiltrados.length} producto
                    {productosFiltrados.length !== 1 ? "s" : ""} encontrado
                    {productosFiltrados.length !== 1 ? "s" : ""}
                  </p>
                </div>

                <div className="flex flex-row align-items-center gap-5">
                  <Tag
                    value={`Página ${Math.floor(first / rows) + 1} de ${Math.ceil(
                      productosFiltrados.length / rows
                    )}`}
                    severity="info"
                    className="text-sm font-semibold"
                  />

                  <ActionButton
                    icon="pi pi-refresh"
                    color="primary"
                    tooltip="Actualizar productos"
                    onClick={handleRefresh}
                    loading={loading}
                  />
                </div>
              </div>

              <div className="flex justify-content-start mb-4">
                <span className="p-input-icon-left w-20rem">
                  <i className="pi pi-search" />
                  <InputText
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setFirst(0);
                    }}
                    placeholder="Buscar productos..."
                    className="w-full"
                  />
                </span>
              </div>

              <ProductsGrid
                productos={productosPaginados}
                onAddToCart={addToCart}
              />

              {productosFiltrados.length > rows && (
                <div className="mt-5 flex justify-content-center">
                  <Paginator
                    first={first}
                    rows={rows}
                    totalRecords={productosFiltrados.length}
                    rowsPerPageOptions={[12, 24, 36]}
                    onPageChange={onPageChange}
                    template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                  />
                </div>
              )}

              {productosFiltrados.length === 0 && (
                <div className="text-center py-6">
                  <i className="pi pi-inbox text-6xl text-400 mb-3"></i>
                  <h3 className="text-900 font-semibold mb-2">
                    No hay productos
                  </h3>
                  <p className="text-600">
                    {categoriaSeleccionada === "todas"
                      ? "No se encontraron productos en el catálogo."
                      : `No se encontraron productos en la categoría "${categorias.find(
                        (c) =>
                          c.id.toString() === categoriaSeleccionada
                      )?.nombre
                      }".`}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Container>
  );
}
