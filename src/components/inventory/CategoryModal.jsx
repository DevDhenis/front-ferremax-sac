import React, { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Column } from "primereact/column";
import ActionButton from "../common/ActionButton";
import { InputTextarea } from "primereact/inputtextarea";
import CustomModal from "../common/CustomModal";
import CompactTable from "../common/CompactTable";
import { useAuth } from "@/services/auth/authContext";
import { useToast } from "@/context/ToastContext";

export default function CategoryModal({ visible, onHide }) {
  const { http } = useAuth();
  const { showToast } = useToast();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: ""
  });
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (visible) {
      getCategories();
    }
  }, [visible]);

  const getCategories = async () => {
    try {
      const { data } = await http.get("product-categories");
      setCategories(data.data);
    } catch (error) {
      showToast("error", "Error", "No se pudieron cargar las categorías");
    }
  };

  const handleCreateCategory = async () => {
    if (!formData.nombre.trim()) {
      showToast("error", "Error", "El nombre es obligatorio");
      return;
    }

    setLoading(true);
    try {
      if (editingId) {
        await http.put(`product-categories/${editingId}`, formData);
        showToast("success", "Éxito", "Categoría actualizada correctamente");
      } else {
        await http.post("product-categories", formData);
        showToast("success", "Éxito", "Categoría creada correctamente");
      }

      setFormData({ nombre: "", descripcion: "" });
      setEditingId(null);
      getCategories();
    } catch (error) {
      const message = error.response?.data?.message || "Error al guardar la categoría";
      showToast("error", "Error", message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category) => {
    setFormData({
      nombre: category.nombre,
      descripcion: category.descripcion || ""
    });
    setEditingId(category.id);
  };

  const handleDelete = async (category) => {
    if (!confirm(`¿Estás seguro de eliminar la categoría "${category.nombre}"?`)) {
      return;
    }

    try {
      await http.delete(`product-categories/${category.id}`);
      showToast("success", "Éxito", "Categoría eliminada correctamente");
      getCategories();
    } catch (error) {
      const message = error.response?.data?.message || "Error al eliminar la categoría";
      showToast("error", "Error", message);
    }
  };

  const handleCancel = () => {
    setFormData({ nombre: "", descripcion: "" });
    setEditingId(null);
    onHide();
  };

  const actionsBodyTemplate = (rowData) => {
    return (
      <div className="flex gap-2">
        <ActionButton
          icon="pi pi-pencil"
          color="warning"
          size="sm"
          tooltip="Editar categoría"
          onClick={() => handleEdit(rowData)}
        />
        <ActionButton
          icon="pi pi-trash"
          color="danger"
          size="sm"
          tooltip="Eliminar categoría"
          onClick={() => handleDelete(rowData)}
        />
      </div>
    );
  };

  const footerActions = (
    <div className="flex justify-content-end gap-2">
      <ActionButton
        label="Cancelar"
        icon="pi pi-times"
        color="secondary"
        onClick={handleCancel}
        disabled={loading}
      />
      <ActionButton
        label={editingId ? "Actualizar Categoría" : "Crear Categoría"}
        icon={editingId ? "pi pi-check" : "pi pi-plus"}
        color="success"
        onClick={handleCreateCategory}
        disabled={!formData.nombre.trim() || loading}
        loading={loading}
      />
    </div>
  );

  return (
    <CustomModal
      visible={visible}
      onHide={handleCancel}
      header={editingId ? "Editar Categoría" : "Gestión de Categorías"}
      footerActions={footerActions}
      className="w-auto"
    >
      <div className="flex flex-column gap-4">
        {/* Formulario para crear/editar categoría */}
        <div className="p-fluid grid">
          <div className="col-12">
            <label htmlFor="nombre" className="block text-sm font-medium mb-2">
              Nombre de la categoría *
            </label>
            <InputText
              id="nombre"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              placeholder="Ingrese el nombre de la categoría"
              className="w-full"
            />
          </div>

          <div className="col-12">
            <label htmlFor="descripcion" className="block text-sm font-medium mb-2">
              Descripción
            </label>
            <InputTextarea
              id="descripcion"
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              placeholder="Ingrese una descripción para la categoría (opcional)"
              rows={3}
              className="w-full"
            />
          </div>
        </div>

        {/* Tabla de categorías existentes */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-3">Categorías Existentes</h3>
          <CompactTable
            value={categories}
            emptyMessage="No hay categorías registradas"
            size="small"
          >
            <Column field="nombre" header="Nombre" sortable style={{ width: '25%' }} />
            <Column
              field="descripcion"
              header="Descripción"
              style={{ width: '45%' }}
              body={(rowData) => rowData.descripcion || "Sin descripción"}
            />
            <Column
              field="created_at"
              header="Fecha Creación"
              sortable
              style={{ width: '20%' }}
              body={(rowData) => new Date(rowData.created_at).toLocaleDateString()}
            />
            <Column
              body={actionsBodyTemplate}
              header="Acciones"
              style={{ width: '10%' }}
              exportable={false}
            />
          </CompactTable>
        </div>
      </div>
    </CustomModal>
  );
}