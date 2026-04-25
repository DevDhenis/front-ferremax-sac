import React, { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { Checkbox } from "primereact/checkbox";
import { FileUpload } from "primereact/fileupload";
import CustomModal from "../common/CustomModal";
import ActionButton from "../common/ActionButton";
import { useAuth } from "@/services/auth/authContext";
import { useToast } from "@/context/ToastContext";

export default function ProductFormModal({ visible, onHide, product, onSuccess }) {
    const { http } = useAuth();
    const { showToast } = useToast();

    const [formData, setFormData] = useState({
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
        product_category_id: ""
    });

    const [categories, setCategories] = useState([]);
    const [units, setUnits] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (visible) {
            loadInitialData();
            if (product) {
                setFormData({
                    codigo_interno: product.codigo_interno || "",
                    nombre: product.nombre || "",
                    descripcion: product.descripcion || "",
                    stock: product.stock || 0,
                    cantidad_minima: product.cantidad_minima || 0,
                    en_promocion: product.en_promocion || false,
                    pre_uni: product.pre_uni || 0,
                    pre_uni_may: product.pre_uni_may || 0,
                    can_min_may: product.can_min_may || 0,
                    descuento: product.descuento || 0,
                    unit_id: product.unit_id || "",
                    product_category_id: product.product_category_id || ""
                });
            } else {
                resetForm();
            }
        }
    }, [visible, product]);

    const loadInitialData = async () => {
        try {
            const categoriesResponse = await http.get("product-categories");
            setCategories(
                (categoriesResponse.data.data || []).map(cat => ({
                    label: cat.nombre,
                    value: cat.id
                }))
            );

            const unitsResponse = await http.get("units");
            setUnits(
                (unitsResponse.data || []).map(unit => ({
                    label: unit.nombre,
                    value: unit.id
                }))
            );
        } catch (error) {
            console.error("Error cargando datos iniciales:", error);
        }
    };
    const resetForm = () => {
        setFormData({
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
            product_category_id: ""
        });
        setSelectedFile(null);
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleFileSelect = (event) => {
        setSelectedFile(event.files[0]);
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

            Object.keys(formData).forEach(key => {
                let value = formData[key];

                if (key === 'en_promocion') {
                    value = value ? '1' : '0';
                }

                if (value !== null && value !== undefined) {
                    submitData.append(key, value.toString());
                }
            });

            if (selectedFile) {
                submitData.append("imagen", selectedFile);
            }

            let response;
            if (product) {
                submitData.append('_method', 'PUT');
                response = await http.post(`products/${product.id}`, submitData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                showToast("success", "Éxito", "Producto actualizado correctamente");
            } else {
                response = await http.post("products", submitData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                showToast("success", "Éxito", "Producto creado correctamente");
            }

            resetForm();
            onSuccess?.();
            onHide();
        } catch (error) {
            console.error("Error guardando producto:", error);
        } finally {
            setLoading(false);
        }
    };
    const footerActions = (
        <div className="flex justify-content-end gap-2">
            <ActionButton
                label="Cancelar"
                icon="pi pi-times"
                color="secondary"
                onClick={onHide}
                disabled={loading}
            />
            <ActionButton
                label={product ? "Actualizar" : "Guardar"}
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
            header={product ? "Editar Producto" : "Agregar Producto"}
            footerActions={footerActions}
            className="w-11 md:w-8 lg:w-6"
        >
            <div className="grid p-fluid">
                <div className="col-12 md:col-6">
                    <div className="field">
                        <label htmlFor="codigo_interno" className="font-medium">Código Interno *</label>
                        <InputText
                            id="codigo_interno"
                            value={formData.codigo_interno}
                            onChange={(e) => handleInputChange('codigo_interno', e.target.value)}
                            placeholder="Ej: P001"
                            className="w-full"
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="nombre" className="font-medium">Nombre *</label>
                        <InputText
                            id="nombre"
                            value={formData.nombre}
                            onChange={(e) => handleInputChange('nombre', e.target.value)}
                            placeholder="Nombre del producto"
                            className="w-full"
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="descripcion" className="font-medium">Descripción *</label>
                        <InputText
                            id="descripcion"
                            value={formData.descripcion}
                            onChange={(e) => handleInputChange('descripcion', e.target.value)}
                            placeholder="Descripción del producto"
                            className="w-full"
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="product_category_id" className="font-medium">Seleccionar Categoría *</label>
                        <Dropdown
                            id="product_category_id"
                            value={formData.product_category_id}
                            options={categories}
                            onChange={(e) => handleInputChange('product_category_id', e.value)}
                            placeholder="Seleccione categoría"
                            className="w-full"
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="unit_id" className="font-medium">Unidad de medida *</label>
                        <Dropdown
                            id="unit_id"
                            value={formData.unit_id}
                            options={units}
                            onChange={(e) => handleInputChange('unit_id', e.value)}
                            placeholder="Seleccione unidad"
                            className="w-full"
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="imagen" className="font-medium">Imagen</label>
                        <FileUpload
                            mode="basic"
                            name="imagen"
                            accept="image/*"
                            maxFileSize={5000000}
                            chooseLabel="Seleccionar imagen"
                            onSelect={handleFileSelect}
                            className="w-full"
                        />
                    </div>
                </div>

                <div className="col-12 md:col-6">
                    <div className="field">
                        <label htmlFor="stock" className="font-medium">Stock *</label>
                        <InputNumber
                            id="stock"
                            value={formData.stock}
                            onValueChange={(e) => handleInputChange('stock', e.value)}
                            mode="decimal"
                            min={0}
                            className="w-full"
                            minFractionDigits={0}
                            maxFractionDigits={2}
                            useGrouping={false}

                        />
                    </div>

                    <div className="field">
                        <label htmlFor="cantidad_minima" className="font-medium">Cantidad Mínima *</label>
                        <InputNumber
                            id="cantidad_minima"
                            value={formData.cantidad_minima}
                            onValueChange={(e) => handleInputChange('cantidad_minima', e.value)}
                            mode="decimal"
                            min={0}
                            className="w-full"
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="pre_uni" className="font-medium">Precio Unitario *</label>
                        <InputNumber
                            id="pre_uni"
                            value={formData.pre_uni}
                            onValueChange={(e) => handleInputChange('pre_uni', e.value)}
                            mode="currency"
                            currency="PEN"
                            locale="es-PE"
                            min={0}
                            className="w-full"
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="pre_uni_may" className="font-medium">Precio por Mayor *</label>
                        <InputNumber
                            id="pre_uni_may"
                            value={formData.pre_uni_may}
                            onValueChange={(e) => handleInputChange('pre_uni_may', e.value)}
                            mode="currency"
                            currency="PEN"
                            locale="es-PE"
                            min={0}
                            className="w-full"
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="can_min_may" className="font-medium">Cant. Mínima Mayor *</label>
                        <InputNumber
                            id="can_min_may"
                            value={formData.can_min_may}
                            onValueChange={(e) => handleInputChange('can_min_may', e.value)}
                            mode="decimal"
                            min={0}
                            className="w-full"
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="descuento" className="font-medium">Descuento (%)</label>
                        <InputNumber
                            id="descuento"
                            value={formData.descuento}
                            onValueChange={(e) => handleInputChange('descuento', e.value)}
                            mode="decimal"
                            min={0}
                            max={100}
                            suffix="%"
                            className="w-full"
                        />
                    </div>

                    <div className="field flex align-items-center">
                        <Checkbox
                            inputId="en_promocion"
                            checked={formData.en_promocion}
                            onChange={(e) => handleInputChange('en_promocion', e.checked)}
                        />
                        <label htmlFor="en_promocion" className="ml-2 mt-2 font-medium">
                            En promoción
                        </label>
                    </div>
                </div>
            </div>
        </CustomModal>
    );
}