import { useState, useEffect } from "react";
import { Upload, ImageIcon } from "lucide-react";
import CustomModal from "../common/CustomModal";
import ActionButton from "../common/ActionButton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useAuth } from "@/services/auth/authContext";
import { useToast } from "@/context/ToastContext";

const EMPTY_FORM = {
  internal_code: "",
  name: "",
  description: "",
  stock: 0,
  minimum_quantity: 0,
  on_promotion: false,
  unit_price: 0,
  wholesale_unit_price: 0,
  wholesale_min_quantity: 0,
  discount: 0,
  unit_id: "",
  product_category_id: "",
};

function Field({ label, htmlFor, className = "", children }) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label htmlFor={htmlFor} className="text-xs font-medium text-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}

export default function ProductFormModal({ visible, onHide, product, onSave, onSuccess }) {
  const { http } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState(EMPTY_FORM);
  const [categories, setCategories] = useState([]);
  const [units, setUnits] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!visible) return;
    loadInitialData();
    if (product) {
      setFormData({
        internal_code: product.internal_code || "",
        name: product.name || "",
        description: product.description || "",
        stock: product.stock ?? 0,
        minimum_quantity: product.minimum_quantity ?? 0,
        on_promotion: product.on_promotion || false,
        unit_price: product.unit_price ?? 0,
        wholesale_unit_price: product.wholesale_unit_price ?? 0,
        wholesale_min_quantity: product.wholesale_min_quantity ?? 0,
        discount: product.discount ?? 0,
        unit_id: product.unit_id || "",
        product_category_id: product.product_category_id || "",
      });
    } else {
      resetForm();
    }
  }, [visible, product]);

  const loadInitialData = async () => {
    try {
      const categoriesResponse = await http.get("product-categories");
      setCategories(categoriesResponse.data?.data || []);
      const unitsResponse = await http.get("units");
      setUnits(unitsResponse.data?.data || unitsResponse.data || []);
    } catch (error) {
      console.error("Error cargando datos iniciales:", error);
    }
  };

  const resetForm = () => {
    setFormData(EMPTY_FORM);
    setSelectedFile(null);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNumberChange = (field, value) => {
    handleInputChange(field, value === "" ? "" : Number(value));
  };

  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files?.[0] || null);
  };

  const handleSubmit = async () => {
    if (!formData.internal_code || !formData.name) {
      showToast("error", "Error", "Código interno y nombre son obligatorios");
      return;
    }
    if (!formData.unit_price || formData.unit_price <= 0) {
      showToast("error", "Error", "El precio unitario debe ser mayor a 0");
      return;
    }
    if (!formData.wholesale_unit_price || formData.wholesale_unit_price <= 0) {
      showToast("error", "Error", "El precio por mayor debe ser mayor a 0");
      return;
    }
    if (!formData.wholesale_min_quantity || formData.wholesale_min_quantity <= 0) {
      showToast("error", "Error", "La cantidad mínima por mayor debe ser mayor a 0");
      return;
    }
    if (!formData.unit_id) {
      showToast("error", "Error", "Debe seleccionar una unidad");
      return;
    }
    if (!formData.product_category_id) {
      showToast("error", "Error", "Debe seleccionar una categoría");
      return;
    }

    setLoading(true);
    try {
      const submitData = new FormData();
      Object.keys(formData).forEach((key) => {
        let value = formData[key];
        if (key === "on_promotion") value = value ? "1" : "0";
        if (value !== null && value !== undefined) {
          submitData.append(key, value.toString());
        }
      });
      if (selectedFile) submitData.append("image", selectedFile);

      if (product) {
        submitData.append("_method", "PUT");
        await http.post(`products/${product.id}`, submitData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await http.post("products", submitData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      resetForm();
      (onSave || onSuccess)?.();
      onHide();
    } catch (error) {
      // El interceptor de axios ya muestra el toast de error.
      console.error("Error guardando producto:", error);
    } finally {
      setLoading(false);
    }
  };

  const footerActions = (
    <div className="flex justify-end gap-2 w-full">
      <ActionButton
        label="Cancelar"
        icon="pi pi-times"
        color="secondary"
        onClick={onHide}
        disabled={loading}
      />
      <ActionButton
        label={product ? "Actualizar" : "Guardar producto"}
        icon="pi pi-check"
        color="success"
        onClick={handleSubmit}
        loading={loading}
        disabled={loading || !formData.internal_code || !formData.name}
      />
    </div>
  );

  return (
    <CustomModal
      visible={visible}
      onHide={onHide}
      header={product ? "Editar producto" : "Agregar producto"}
      footerActions={footerActions}
      className="w-[92vw] md:w-[70vw] lg:w-[56vw]"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Código interno *" htmlFor="internal_code">
          <Input
            id="internal_code"
            value={formData.internal_code}
            onChange={(e) => handleInputChange("internal_code", e.target.value)}
            placeholder="Ej: FER-001-A1"
            className="h-9 bg-card font-spec"
          />
        </Field>

        <Field label="Nombre *" htmlFor="name">
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="Nombre del producto"
            className="h-9 bg-card"
          />
        </Field>

        <Field label="Descripción" htmlFor="description" className="sm:col-span-2">
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            placeholder="Descripción del producto (opcional)"
            rows={2}
            className="bg-card"
          />
        </Field>

        <Field label="Categoría *" htmlFor="product_category_id">
          <Select
            items={categories.map((c) => ({ label: c.name, value: c.id }))}
            value={formData.product_category_id === "" ? null : formData.product_category_id}
            onValueChange={(v) => handleInputChange("product_category_id", v)}
          >
            <SelectTrigger id="product_category_id">
              <SelectValue placeholder="Seleccione categoría" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field label="Unidad de medida *" htmlFor="unit_id">
          <Select
            items={units.map((u) => ({ label: `${u.name} (${u.abbreviation})`, value: u.id }))}
            value={formData.unit_id === "" ? null : formData.unit_id}
            onValueChange={(v) => handleInputChange("unit_id", v)}
          >
            <SelectTrigger id="unit_id">
              <SelectValue placeholder="Seleccione unidad" />
            </SelectTrigger>
            <SelectContent>
              {units.map((unit) => (
                <SelectItem key={unit.id} value={unit.id}>
                  {unit.name} ({unit.abbreviation})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field label="Stock (solo lectura)" htmlFor="stock">
          <Input
            id="stock"
            type="number"
            value={product ? formData.stock : 0}
            disabled
            className="h-9 bg-muted/40 font-spec disabled:opacity-70 disabled:cursor-not-allowed"
          />
          <span className="text-[11px] text-muted-foreground">
            {product
              ? "El stock se gestiona desde Inventario → Movimientos (kardex)."
              : "El producto se crea en 0; carga su stock con un movimiento de Entrada."}
          </span>
        </Field>

        <Field label="Cantidad mínima *" htmlFor="minimum_quantity">
          <Input
            id="minimum_quantity"
            type="number"
            min={0}
            step="0.01"
            value={formData.minimum_quantity}
            onChange={(e) => handleNumberChange("minimum_quantity", e.target.value)}
            className="h-9 bg-card font-spec"
          />
        </Field>

        <Field label="Precio unitario (S/) *" htmlFor="unit_price">
          <Input
            id="unit_price"
            type="number"
            min={0}
            step="0.01"
            value={formData.unit_price}
            onChange={(e) => handleNumberChange("unit_price", e.target.value)}
            className="h-9 bg-card font-spec"
          />
        </Field>

        <Field label="Precio por mayor (S/) *" htmlFor="wholesale_unit_price">
          <Input
            id="wholesale_unit_price"
            type="number"
            min={0}
            step="0.01"
            value={formData.wholesale_unit_price}
            onChange={(e) => handleNumberChange("wholesale_unit_price", e.target.value)}
            className="h-9 bg-card font-spec"
          />
        </Field>

        <Field label="Cant. mínima mayor *" htmlFor="wholesale_min_quantity">
          <Input
            id="wholesale_min_quantity"
            type="number"
            min={0}
            step="0.01"
            value={formData.wholesale_min_quantity}
            onChange={(e) => handleNumberChange("wholesale_min_quantity", e.target.value)}
            className="h-9 bg-card font-spec"
          />
        </Field>

        <Field label="Descuento (%)" htmlFor="discount">
          <Input
            id="discount"
            type="number"
            min={0}
            max={100}
            step="1"
            value={formData.discount}
            onChange={(e) => handleNumberChange("discount", e.target.value)}
            className="h-9 bg-card font-spec"
          />
        </Field>

        {/* Imagen */}
        <Field label="Imagen" htmlFor="image" className="sm:col-span-2">
          <label
            htmlFor="image"
            className="flex items-center gap-3 rounded-lg border border-dashed border-input bg-card px-3 py-2.5 cursor-pointer transition-colors hover:border-ring hover:bg-secondary/40"
          >
            <span className="inline-flex size-9 items-center justify-center rounded-lg bg-secondary text-muted-foreground shrink-0">
              {selectedFile ? <ImageIcon className="size-4" /> : <Upload className="size-4" />}
            </span>
            <span className="text-sm text-muted-foreground truncate">
              {selectedFile ? selectedFile.name : "Seleccionar imagen (JPG, PNG…)"}
            </span>
            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </label>
        </Field>

        {/* En promoción */}
        <label className="sm:col-span-2 flex items-center gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={formData.on_promotion}
            onChange={(e) => handleInputChange("on_promotion", e.target.checked)}
            className="size-4 rounded border border-input accent-primary cursor-pointer"
          />
          <span className="text-sm font-medium text-foreground">En promoción</span>
        </label>
      </div>
    </CustomModal>
  );
}
