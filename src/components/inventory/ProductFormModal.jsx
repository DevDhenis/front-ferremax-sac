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
  codigo_interno: "",
  nombre: "",
  descripcion: "",
  stock: 0,
  cantidad_minima: 0,
  en_promocion: false,
  pre_uni: 0,
  pre_uni_may: 0,
  can_min_may: 0,
  descuento: 0,
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
        codigo_interno: product.codigo_interno || "",
        nombre: product.nombre || "",
        descripcion: product.descripcion || "",
        stock: product.stock ?? 0,
        cantidad_minima: product.cantidad_minima ?? 0,
        en_promocion: product.en_promocion || false,
        pre_uni: product.pre_uni ?? 0,
        pre_uni_may: product.pre_uni_may ?? 0,
        can_min_may: product.can_min_may ?? 0,
        descuento: product.descuento ?? 0,
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
    if (!formData.codigo_interno || !formData.nombre) {
      showToast("error", "Error", "Código interno y nombre son obligatorios");
      return;
    }
    if (!formData.pre_uni || formData.pre_uni <= 0) {
      showToast("error", "Error", "El precio unitario debe ser mayor a 0");
      return;
    }
    if (!formData.pre_uni_may || formData.pre_uni_may <= 0) {
      showToast("error", "Error", "El precio por mayor debe ser mayor a 0");
      return;
    }
    if (!formData.can_min_may || formData.can_min_may <= 0) {
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
        if (key === "en_promocion") value = value ? "1" : "0";
        if (value !== null && value !== undefined) {
          submitData.append(key, value.toString());
        }
      });
      if (selectedFile) submitData.append("imagen", selectedFile);

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
        disabled={loading || !formData.codigo_interno || !formData.nombre}
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
        <Field label="Código interno *" htmlFor="codigo_interno">
          <Input
            id="codigo_interno"
            value={formData.codigo_interno}
            onChange={(e) => handleInputChange("codigo_interno", e.target.value)}
            placeholder="Ej: FER-001-A1"
            className="h-9 bg-card font-spec"
          />
        </Field>

        <Field label="Nombre *" htmlFor="nombre">
          <Input
            id="nombre"
            value={formData.nombre}
            onChange={(e) => handleInputChange("nombre", e.target.value)}
            placeholder="Nombre del producto"
            className="h-9 bg-card"
          />
        </Field>

        <Field label="Descripción" htmlFor="descripcion" className="sm:col-span-2">
          <Textarea
            id="descripcion"
            value={formData.descripcion}
            onChange={(e) => handleInputChange("descripcion", e.target.value)}
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
            items={units.map((u) => ({ label: `${u.nombre} (${u.abreviatura})`, value: u.id }))}
            value={formData.unit_id === "" ? null : formData.unit_id}
            onValueChange={(v) => handleInputChange("unit_id", v)}
          >
            <SelectTrigger id="unit_id">
              <SelectValue placeholder="Seleccione unidad" />
            </SelectTrigger>
            <SelectContent>
              {units.map((unit) => (
                <SelectItem key={unit.id} value={unit.id}>
                  {unit.nombre} ({unit.abreviatura})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field label="Stock *" htmlFor="stock">
          <Input
            id="stock"
            type="number"
            min={0}
            step="0.01"
            value={formData.stock}
            onChange={(e) => handleNumberChange("stock", e.target.value)}
            className="h-9 bg-card font-spec"
          />
        </Field>

        <Field label="Cantidad mínima *" htmlFor="cantidad_minima">
          <Input
            id="cantidad_minima"
            type="number"
            min={0}
            step="0.01"
            value={formData.cantidad_minima}
            onChange={(e) => handleNumberChange("cantidad_minima", e.target.value)}
            className="h-9 bg-card font-spec"
          />
        </Field>

        <Field label="Precio unitario (S/) *" htmlFor="pre_uni">
          <Input
            id="pre_uni"
            type="number"
            min={0}
            step="0.01"
            value={formData.pre_uni}
            onChange={(e) => handleNumberChange("pre_uni", e.target.value)}
            className="h-9 bg-card font-spec"
          />
        </Field>

        <Field label="Precio por mayor (S/) *" htmlFor="pre_uni_may">
          <Input
            id="pre_uni_may"
            type="number"
            min={0}
            step="0.01"
            value={formData.pre_uni_may}
            onChange={(e) => handleNumberChange("pre_uni_may", e.target.value)}
            className="h-9 bg-card font-spec"
          />
        </Field>

        <Field label="Cant. mínima mayor *" htmlFor="can_min_may">
          <Input
            id="can_min_may"
            type="number"
            min={0}
            step="0.01"
            value={formData.can_min_may}
            onChange={(e) => handleNumberChange("can_min_may", e.target.value)}
            className="h-9 bg-card font-spec"
          />
        </Field>

        <Field label="Descuento (%)" htmlFor="descuento">
          <Input
            id="descuento"
            type="number"
            min={0}
            max={100}
            step="1"
            value={formData.descuento}
            onChange={(e) => handleNumberChange("descuento", e.target.value)}
            className="h-9 bg-card font-spec"
          />
        </Field>

        {/* Imagen */}
        <Field label="Imagen" htmlFor="imagen" className="sm:col-span-2">
          <label
            htmlFor="imagen"
            className="flex items-center gap-3 rounded-lg border border-dashed border-input bg-card px-3 py-2.5 cursor-pointer transition-colors hover:border-ring hover:bg-secondary/40"
          >
            <span className="inline-flex size-9 items-center justify-center rounded-lg bg-secondary text-muted-foreground shrink-0">
              {selectedFile ? <ImageIcon className="size-4" /> : <Upload className="size-4" />}
            </span>
            <span className="text-sm text-muted-foreground truncate">
              {selectedFile ? selectedFile.name : "Seleccionar imagen (JPG, PNG…)"}
            </span>
            <input
              id="imagen"
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
            checked={formData.en_promocion}
            onChange={(e) => handleInputChange("en_promocion", e.target.checked)}
            className="size-4 rounded border border-input accent-primary cursor-pointer"
          />
          <span className="text-sm font-medium text-foreground">En promoción</span>
        </label>
      </div>
    </CustomModal>
  );
}
