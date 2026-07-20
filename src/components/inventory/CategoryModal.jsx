import { useState, useEffect } from "react";
import ActionButton from "../common/ActionButton";
import CustomModal from "../common/CustomModal";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DataTable } from "@/components/ui/data-table";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { useAuth } from "@/services/auth/authContext";
import { useToast } from "@/context/ToastContext";

export default function CategoryModal({ visible, onHide }) {
  const { http } = useAuth();
  const { showToast } = useToast();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  useEffect(() => {
    if (visible) getCategories();
  }, [visible]);

  const getCategories = async () => {
    try {
      const { data } = await http.get("product-categories");
      setCategories(data?.data ?? []);
    } catch {
      // El interceptor de axios ya muestra el toast de error.
    }
  };

  const resetForm = () => {
    setFormData({ name: "", description: "" });
    setEditingId(null);
  };

  const handleCreateCategory = async () => {
    if (!formData.name.trim()) {
      showToast("error", "Error", "El nombre es obligatorio");
      return;
    }

    setLoading(true);
    try {
      if (editingId) {
        await http.put(`product-categories/${editingId}`, formData);
      } else {
        await http.post("product-categories", formData);
      }
      resetForm();
      getCategories();
    } catch {
      // El interceptor de axios ya muestra el toast de error.
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category) => {
    setFormData({
      name: category.name,
      description: category.description || "",
    });
    setEditingId(category.id);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;
    try {
      await http.delete(`product-categories/${categoryToDelete.id}`);
      getCategories();
    } catch {
      // El interceptor de axios ya muestra el toast de error.
    } finally {
      setCategoryToDelete(null);
    }
  };

  const handleCancel = () => {
    resetForm();
    onHide();
  };

  const columns = [
    {
      accessorKey: "name",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Nombre" />,
      cell: ({ row }) => (
        <span className="font-medium text-foreground">{row.original.name}</span>
      ),
    },
    {
      accessorKey: "description",
      header: "Descripción",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="text-muted-foreground text-xs line-clamp-2">
          {row.original.description || "Sin descripción"}
        </span>
      ),
    },
    {
      id: "acciones",
      header: () => <span className="sr-only">Acciones</span>,
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex gap-1.5 justify-end">
          <ActionButton
            icon="pi pi-pencil"
            color="warning"
            size="sm"
            tooltip="Editar categoría"
            onClick={() => handleEdit(row.original)}
          />
          <ActionButton
            icon="pi pi-trash"
            color="danger"
            size="sm"
            tooltip="Eliminar categoría"
            onClick={() => setCategoryToDelete(row.original)}
          />
        </div>
      ),
    },
  ];

  const footerActions = (
    <div className="flex justify-end gap-2 w-full">
      <ActionButton
        label="Cancelar"
        icon="pi pi-times"
        color="secondary"
        onClick={handleCancel}
        disabled={loading}
      />
      <ActionButton
        label={editingId ? "Actualizar" : "Crear categoría"}
        icon={editingId ? "pi pi-check" : "pi pi-plus"}
        color="success"
        onClick={handleCreateCategory}
        disabled={!formData.name.trim() || loading}
        loading={loading}
      />
    </div>
  );

  return (
    <>
      <CustomModal
        visible={visible}
        onHide={handleCancel}
        header="Gestión de categorías"
        footerActions={footerActions}
        className="w-[92vw] sm:w-[72vw] md:w-[54vw] lg:w-[46vw]"
      >
        <div className="flex flex-col gap-6">
          {/* Formulario crear / editar */}
          <div className="rounded-xl border border-border/80 bg-secondary/30 p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                {editingId ? "Editar categoría" : "Nueva categoría"}
              </span>
              <span className="h-px flex-1 bg-border/60" />
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label htmlFor="nombre" className="text-xs font-medium text-foreground">
                  Nombre de la categoría *
                </label>
                <Input
                  id="nombre"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej: Herramientas eléctricas"
                  className="bg-card"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="descripcion" className="text-xs font-medium text-foreground">
                  Descripción
                </label>
                <Textarea
                  id="descripcion"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Descripción de la categoría (opcional)"
                  rows={3}
                  className="bg-card"
                />
              </div>
            </div>
          </div>

          {/* Lista de categorías */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Categorías existentes
              </span>
              <span className="h-px flex-1 bg-border/60" />
            </div>
            <DataTable
              columns={columns}
              data={categories}
              onRefresh={getCategories}
              emptyMessage="No hay categorías registradas"
              searchPlaceholder="Buscar categoría..."
              pageSize={5}
            />
          </div>
        </div>
      </CustomModal>

      <ConfirmDialog
        open={!!categoryToDelete}
        onOpenChange={(o) => !o && setCategoryToDelete(null)}
        title="Eliminar categoría"
        description={
          <>
            ¿Seguro que deseas eliminar la categoría{" "}
            <span className="font-semibold text-foreground">“{categoryToDelete?.name}”</span>?
            Esta acción no se puede deshacer.
          </>
        }
        confirmLabel="Sí, eliminar"
        onConfirm={confirmDelete}
      />
    </>
  );
}
