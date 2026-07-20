import { useEffect, useRef, useState } from "react";
import { Camera, Loader2 } from "lucide-react";
import CustomModal from "@/components/common/CustomModal";
import ActionButton from "@/components/common/ActionButton";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/services/auth/authContext";
import { useToast } from "@/context/ToastContext";

const EMPTY_FORM = {
  username: "",
  email: "",
  first_name: "",
  last_name: "",
  second_last_name: "",
  address: "",
  document_number: "",
  document_type_id: "",
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_IMAGE_BYTES = 2 * 1024 * 1024; // 2 MB
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

// Maps the profile payload from the API into the flat form shape.
function profileToForm(profile) {
  const person = profile?.person || {};
  return {
    username: profile?.username || "",
    email: profile?.email || "",
    first_name: person.first_name || "",
    last_name: person.last_name || "",
    second_last_name: person.second_last_name || "",
    address: person.address || "",
    document_number: person.document_number || "",
    document_type_id:
      person.document_type_id?.id != null ? person.document_type_id.id : "",
  };
}

function Field({ label, children, className = "" }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label className="text-xs font-medium text-foreground">{label}</label>
      {children}
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
      {children}
    </p>
  );
}

export default function ProfileModal({ visible, onHide }) {
  const { user, updateUser } = useAuth();
  const { showError, showInfo } = useToast();
  const { loading, saving, handleGetProfile, handleGetDocumentTypes, handleUpdateProfile } =
    useProfile();

  const [form, setForm] = useState(EMPTY_FORM);
  const [initialForm, setInitialForm] = useState(EMPTY_FORM);
  const [documentTypes, setDocumentTypes] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  // Load profile + document types whenever the modal opens.
  useEffect(() => {
    if (!visible) return;

    let active = true;
    setImageFile(null);

    Promise.all([handleGetProfile(), handleGetDocumentTypes()])
      .then(([profile, types]) => {
        if (!active) return;
        const nextForm = profileToForm(profile);
        setForm(nextForm);
        setInitialForm(nextForm);
        setDocumentTypes(Array.isArray(types) ? types : []);
        setImagePreview(profile?.person?.image || null);
      })
      .catch(() => {
        // El interceptor de axios ya muestra el toast de error.
      });

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  // Revoke the object URL created for the local image preview.
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const setField = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      showError("Formato no válido", "La imagen debe ser JPG, JPEG o PNG.");
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      showError("Imagen muy pesada", "El tamaño máximo permitido es 2 MB.");
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // Builds a payload with only the fields the user actually changed.
  const buildChangedPayload = () => {
    const payload = {};
    Object.keys(EMPTY_FORM).forEach((key) => {
      const current = (form[key] ?? "").toString().trim();
      const original = (initialForm[key] ?? "").toString().trim();
      if (current !== original) {
        payload[key] =
          key === "document_type_id" && current !== "" ? Number(current) : current;
      }
    });
    if (imageFile) payload.image = imageFile;
    return payload;
  };

  const hasChanges = () => Object.keys(buildChangedPayload()).length > 0;

  const validate = (payload) => {
    if ("email" in payload && payload.email !== "" && !EMAIL_REGEX.test(payload.email)) {
      showError("Correo no válido", "Ingresa un correo electrónico válido.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    const payload = buildChangedPayload();

    if (Object.keys(payload).length === 0) {
      showInfo("Sin cambios", "No hay cambios por guardar.");
      return;
    }
    if (!validate(payload)) return;

    try {
      const updated = await handleUpdateProfile(payload);
      // Keep the sidebar avatar + name in sync with the saved data.
      updateUser({
        username: updated?.username ?? user?.username,
        email: updated?.email ?? user?.email,
        person: updated?.person ?? user?.person,
      });
      onHide();
    } catch {
      // El interceptor de axios ya muestra el toast de error (422/401).
    }
  };

  const initials = (form.username || user?.username || "U").slice(0, 2).toUpperCase();

  const footer = (
    <div className="flex w-full justify-end gap-2">
      <ActionButton
        label="Cancelar"
        icon="pi pi-times"
        color="secondary"
        onClick={onHide}
        disabled={saving}
      />
      <ActionButton
        label="Guardar cambios"
        icon="pi pi-check"
        color="success"
        loading={saving}
        disabled={saving || loading || !hasChanges()}
        onClick={handleSubmit}
      />
    </div>
  );

  return (
    <CustomModal
      visible={visible}
      onHide={onHide}
      header="Mi perfil"
      footerActions={footer}
      className="w-[92vw] sm:w-[70vw] md:w-[54vw] lg:w-[46vw]"
    >
      {loading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
          <Loader2 className="size-4 animate-spin text-primary" />
          <span className="text-sm">Cargando perfil…</span>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Avatar + cambiar foto */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <span className="flex size-24 items-center justify-center overflow-hidden rounded-full border border-border bg-secondary">
                {imagePreview ? (
                  <img src={imagePreview} alt="" className="size-full object-cover" />
                ) : (
                  <span className="text-2xl font-semibold text-muted-foreground">
                    {initials}
                  </span>
                )}
              </span>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                aria-label="Cambiar foto de perfil"
                className="absolute -bottom-1 -right-1 flex size-8 items-center justify-center rounded-full border border-border bg-primary text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <Camera className="size-4" />
              </button>
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-xs font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 rounded"
            >
              Cambiar foto
            </button>
            <p className="text-[11px] text-muted-foreground">JPG, JPEG o PNG · máx. 2 MB</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Datos personales */}
          <div className="flex flex-col gap-3">
            <SectionLabel>Datos personales</SectionLabel>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Nombres">
                <Input
                  value={form.first_name}
                  onChange={(e) => setField("first_name", e.target.value)}
                  maxLength={255}
                  placeholder="Ej: Juan"
                  className="bg-card"
                />
              </Field>
              <Field label="Apellido paterno">
                <Input
                  value={form.last_name}
                  onChange={(e) => setField("last_name", e.target.value)}
                  maxLength={255}
                  placeholder="Ej: Pérez"
                  className="bg-card"
                />
              </Field>
              <Field label="Apellido materno">
                <Input
                  value={form.second_last_name}
                  onChange={(e) => setField("second_last_name", e.target.value)}
                  maxLength={255}
                  placeholder="Ej: Gómez"
                  className="bg-card"
                />
              </Field>
              <Field label="Dirección">
                <Input
                  value={form.address}
                  onChange={(e) => setField("address", e.target.value)}
                  maxLength={255}
                  placeholder="Ej: Av. Siempre Viva 123"
                  className="bg-card"
                />
              </Field>
            </div>
          </div>

          {/* Documento */}
          <div className="flex flex-col gap-3">
            <SectionLabel>Documento</SectionLabel>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Tipo de documento">
                <Select
                  items={documentTypes.map((dt) => ({ label: dt.name, value: dt.id }))}
                  value={form.document_type_id === "" ? null : form.document_type_id}
                  onValueChange={(value) => setField("document_type_id", value ?? "")}
                >
                  <SelectTrigger className="bg-card">
                    <SelectValue placeholder="Selecciona un tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {documentTypes.map((dt) => (
                      <SelectItem key={dt.id} value={dt.id}>
                        {dt.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="N° de documento">
                <Input
                  value={form.document_number}
                  onChange={(e) => setField("document_number", e.target.value)}
                  placeholder="Ej: 12345678"
                  className="bg-card font-spec"
                />
              </Field>
            </div>
          </div>

          {/* Cuenta */}
          <div className="flex flex-col gap-3">
            <SectionLabel>Cuenta</SectionLabel>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Usuario">
                <Input
                  value={form.username}
                  onChange={(e) => setField("username", e.target.value)}
                  maxLength={255}
                  placeholder="Ej: juanp"
                  className="bg-card"
                />
              </Field>
              <Field label="Correo electrónico">
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setField("email", e.target.value)}
                  placeholder="Ej: juan@example.com"
                  className="bg-card"
                />
              </Field>
            </div>
          </div>
        </div>
      )}
    </CustomModal>
  );
}
