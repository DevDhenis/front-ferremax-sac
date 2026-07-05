import Container from "@/components/layout/Container";
import { Inbox } from "lucide-react";
import Header from "@/components/layout/Header";
import Pagination from "@/components/common/Pagination";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useAuth } from "@/services/auth/authContext";
import CategorySidebar from "@/components/product/CategorySidebar";
import ProductSkeleton from "@/components/product/ProductSkeleton";
import ProductsGrid from "@/components/product/ProductsGrid";
import ShoppingCart from "@/components/shopping/ShoppingCart";
import ActionButton from "@/components/common/ActionButton";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import CustomSearch from "@/components/common/CustomSearch";
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

  const { addToCart: addProductToCart } = useCart();
  const { showToast } = useToast();

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
      await addProductToCart(producto.id);
      showToast("success", "Carrito", `${producto.nombre} se agregó a tu carrito.`);
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        "No se pudo agregar el producto al carrito.";
      showToast("error", "Carrito", msg);
    }
  };

  return (
    <Container>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <Header
          title="Catálogo de Productos"
          subtitle="Explora nuestra amplia selección de productos organizados por categorías"
        />
        <div className="shrink-0 self-end sm:self-center">
          <ShoppingCart onCheckout={getProductos} />
        </div>
      </div>

      <PromoCarousel productos={productos.filter(p => p.en_promocion)} />

      <div className="flex flex-col md:flex-row gap-6 lg:gap-8 items-start">
        {/* Sidebar Sticky en Desktop, Horizontal en Móvil */}
        <aside className="w-full md:w-60 lg:w-68 shrink-0 md:sticky md:top-24">
          <CategorySidebar
            categorias={categorias}
            categoriaSeleccionada={categoriaSeleccionada}
            onCategoriaChange={handleCategoriaChange}
            conteoProductosPorCategoria={conteoProductosPorCategoria}
          />
        </aside>

        {/* Sección Principal de Productos */}
        <div className="flex-1 w-full min-w-0">
          {loading ? (
            <div className="grid grid-cols-12 gap-5">
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="col-span-12 sm:col-span-6 lg:col-span-4"
                >
                  <ProductSkeleton />
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Barra de Título de Categoría & Info */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 pb-4 border-b border-border/40">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    {categoriaSeleccionada === "todas" ? "Catálogo" : "Categoría"}
                  </span>
                  <h2 className="text-2xl font-bold text-foreground tracking-tight m-0 mt-0.5">
                    {categoriaSeleccionada === "todas"
                      ? "Todos los productos"
                      : categorias.find(
                        (c) => c.id.toString() === categoriaSeleccionada
                      )?.nombre}
                  </h2>
                  <p className="text-xs text-muted-foreground m-0 mt-1">
                    <span className="font-spec font-semibold text-foreground">{productosFiltrados.length}</span>{" "}
                    {productosFiltrados.length === 1 ? "producto encontrado" : "productos encontrados"}
                  </p>
                </div>

                <div className="flex items-center gap-3 self-end">
                  <span className="font-spec text-xs bg-secondary text-muted-foreground px-2.5 py-1 rounded-md border border-border/60">
                    Pág {Math.floor(first / rows) + 1} / {Math.ceil(productosFiltrados.length / rows) || 1}
                  </span>

                  <ActionButton
                    icon="pi pi-refresh"
                    color="primary"
                    tooltip="Actualizar productos"
                    onClick={handleRefresh}
                    loading={loading}
                  />
                </div>
              </div>

              {/* Buscador */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
                <CustomSearch
                  value={searchTerm}
                  onChange={(val) => {
                    setSearchTerm(val);
                    setFirst(0);
                  }}
                  placeholder="Buscar productos por nombre o descripción..."
                  className="max-w-md"
                />
              </div>

              <ProductsGrid
                productos={productosPaginados}
                onAddToCart={addToCart}
              />

              {productosFiltrados.length > rows && (
                <div className="mt-8 flex justify-center">
                  <Pagination
                    first={first}
                    rows={rows}
                    totalRecords={productosFiltrados.length}
                    rowsPerPageOptions={[12, 24, 36]}
                    onPageChange={onPageChange}
                  />
                </div>
              )}

              {productosFiltrados.length === 0 && (
                <div className="text-center py-14 bg-card rounded-xl border border-border/80 border-dashed p-6">
                  <span className="inline-flex size-14 items-center justify-center rounded-full bg-secondary text-muted-foreground mb-4">
                    <Inbox className="size-6" />
                  </span>
                  <h3 className="text-foreground text-base font-bold mb-1">
                    {searchTerm ? "Sin coincidencias" : "Aún no hay productos aquí"}
                  </h3>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                    {searchTerm
                      ? `No hay productos que coincidan con "${searchTerm}". Prueba con otro término o revisa otra categoría.`
                      : categoriaSeleccionada === "todas"
                        ? "No hay productos disponibles en el catálogo por ahora."
                        : `No hay productos en la categoría "${categorias.find(
                          (c) => c.id.toString() === categoriaSeleccionada
                        )?.nombre}". Elige otra desde el panel lateral.`}
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
