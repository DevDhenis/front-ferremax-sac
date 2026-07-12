import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useToast } from "@/context/ToastContext";
import { useAuth } from "@/services/auth/authContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import IconLogo from "@/assets/icons/icon.svg";
import IconLogoLight from "@/assets/icons/icon-light.svg";

export default function Register() {
  const { token, accesses } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    second_last_name: "",
    address: "",
    username: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const url = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    if (token) {
      if (accesses && accesses.length > 0) {
        const firstPath = accesses[0].path || "/catalogo";
        navigate(firstPath);
      } else {
        navigate("/catalogo");
      }
    }
  }, [token, accesses, navigate]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.first_name) newErrors.first_name = "Los nombres son obligatorios";
    if (!formData.last_name) newErrors.last_name = "El apellido paterno es obligatorio";
    if (!formData.second_last_name) newErrors.second_last_name = "El apellido materno es obligatorio";
    if (!formData.username) newErrors.username = "El nombre de usuario es obligatorio";

    if (!formData.email) {
      newErrors.email = "El correo es obligatorio";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Formato de correo inválido";
    }

    if (!formData.password) {
      newErrors.password = "La contraseña es obligatoria";
    } else if (formData.password.length < 6) {
      newErrors.password = "Debe tener al menos 6 caracteres";
    }

    if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = "Las contraseñas no coinciden";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;
    setLoading(true);
    setErrors({});

    try {
      // No autenticamos al registrar: el usuario debe confirmar su correo primero.
      await axios.post(`${url}auth/register`, formData);
      showToast("success", "Registro exitoso", "Revisa tu correo para confirmar tu cuenta.");
      navigate(`/verification?email=${encodeURIComponent(formData.email)}&type=signUp`);
    } catch (err) {
      const response = err.response?.data;

      if (response?.errors) {
        if (Array.isArray(response.errors)) {
          const backendErrors = response.errors.map(e => e.error).join(", ");
          showToast("error", "Error de validación", backendErrors);
        } else {
          const backendErrors = {};
          Object.keys(response.errors).forEach((key) => {
            backendErrors[key] = response.errors[key][0];
          });
          showToast("error", "Error", JSON.stringify(backendErrors));
        }
      } else {
        showToast("error", "Error", "No se pudo registrar, intente nuevamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen flex bg-background overflow-hidden relative">
      <div className="hidden md:flex md:w-1/2 lg:w-[50%] bg-primary relative justify-center items-center p-12 text-primary-foreground">
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" />

        <div className="absolute top-1/4 left-1/4 size-96 bg-accent-foreground/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 size-96 bg-secondary/5 rounded-full blur-3xl" />

        <div className="max-w-md w-full relative z-10 flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="bg-primary-foreground/10 p-2.5 rounded-xl backdrop-blur-sm border border-primary-foreground/10 shrink-0">
              <img alt="Ferremax Logo" src={IconLogoLight} className="size-9" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-xl font-bold tracking-wider text-primary-foreground">FERREMAX S.A.C.</span>
              <span className="text-xs text-primary-foreground/60 tracking-wider">SISTEMA DE GESTIÓN</span>
            </div>
          </div>

          <div className="h-px bg-primary-foreground/10 my-2" />

          <div className="flex flex-col gap-2">
            <h1 className="text-3xl lg:text-4xl font-semibold leading-tight tracking-tight text-primary-foreground">
              Comienza hoy mismo
            </h1>
            <p className="text-sm lg:text-base text-primary-foreground/75 font-light leading-relaxed">
              Regístrate para obtener tu cuenta y accede a todas las herramientas de control, inventario y venta en tiempo real.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="p-4 rounded-xl bg-primary-foreground/[0.03] border border-primary-foreground/[0.06] backdrop-blur-sm">
              <span className="text-2xl font-bold block text-primary-foreground">Rápido</span>
              <span className="text-xs text-primary-foreground/50">Registro en segundos</span>
            </div>
            <div className="p-4 rounded-xl bg-primary-foreground/[0.03] border border-primary-foreground/[0.06] backdrop-blur-sm">
              <span className="text-2xl font-bold block text-primary-foreground">Seguro</span>
              <span className="text-xs text-primary-foreground/50">Datos encriptados</span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full md:w-1/2 lg:w-[50%] flex justify-center items-center p-6 sm:p-12 bg-card overflow-y-auto h-full">
        <div className="w-full max-w-lg flex flex-col gap-6 my-auto">
          <div className="flex flex-col gap-2 text-left">
            <div className="flex items-center gap-2 md:hidden mb-2">
              <img alt="Ferremax Logo" src={IconLogo} className="size-8" />
              <span className="text-lg font-bold text-foreground tracking-wider">FERREMAX S.A.C.</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Crear Cuenta
            </h2>
            <p className="text-sm text-muted-foreground">
              Por favor, completa tus datos para registrarte en el sistema
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground/80">Nombres</label>
                <Input
                  value={formData.first_name}
                  onChange={(e) => handleChange("first_name", e.target.value)}
                  placeholder="Ej. Juan"
                  className={`h-10 ${errors.first_name ? "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20" : ""}`}
                  disabled={loading}
                />
                {errors.first_name && <span className="text-xs text-destructive font-medium">{errors.first_name}</span>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground/80">Nombre de usuario</label>
                <Input
                  value={formData.username}
                  onChange={(e) => handleChange("username", e.target.value)}
                  placeholder="Ej. jgonzalez"
                  className={`h-10 ${errors.username ? "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20" : ""}`}
                  disabled={loading}
                />
                {errors.username && <span className="text-xs text-destructive font-medium">{errors.username}</span>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground/80">Apellido paterno</label>
                <Input
                  value={formData.last_name}
                  onChange={(e) => handleChange("last_name", e.target.value)}
                  placeholder="Ej. Gómez"
                  className={`h-10 ${errors.last_name ? "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20" : ""}`}
                  disabled={loading}
                />
                {errors.last_name && <span className="text-xs text-destructive font-medium">{errors.last_name}</span>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground/80">Apellido materno</label>
                <Input
                  value={formData.second_last_name}
                  onChange={(e) => handleChange("second_last_name", e.target.value)}
                  placeholder="Ej. Pérez"
                  className={`h-10 ${errors.second_last_name ? "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20" : ""}`}
                  disabled={loading}
                />
                {errors.second_last_name && <span className="text-xs text-destructive font-medium">{errors.second_last_name}</span>}
              </div>

              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-foreground/80">Dirección (Opcional)</label>
                <Input
                  value={formData.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  placeholder="Ej. Av. Larco 123, Lima"
                  className="h-10"
                  disabled={loading}
                />
              </div>

              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-foreground/80">Correo electrónico</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="correo@ejemplo.com"
                  className={`h-10 ${errors.email ? "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20" : ""}`}
                  disabled={loading}
                />
                {errors.email && <span className="text-xs text-destructive font-medium">{errors.email}</span>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground/80">Contraseña</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    placeholder="••••••••"
                    className={`h-10 pr-10 ${errors.password ? "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20" : ""}`}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground outline-none cursor-pointer flex items-center justify-center p-1 rounded-md"
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
                {errors.password && <span className="text-xs text-destructive font-medium">{errors.password}</span>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground/80">Confirmar contraseña</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={formData.password_confirmation}
                    onChange={(e) => handleChange("password_confirmation", e.target.value)}
                    placeholder="••••••••"
                    className={`h-10 pr-10 ${errors.password_confirmation ? "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20" : ""}`}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground outline-none cursor-pointer flex items-center justify-center p-1 rounded-md"
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
                {errors.password_confirmation && <span className="text-xs text-destructive font-medium">{errors.password_confirmation}</span>}
              </div>
            </div>

            <Button
              onClick={handleRegister}
              disabled={loading}
              className="w-full h-10 mt-3 font-medium cursor-pointer"
            >
              {loading ? "Registrando..." : "Registrarse"}
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground mt-2 border-t border-border/40 pt-4">
            ¿Ya tienes una cuenta?{" "}
            <Link to="/login" className="text-primary font-semibold hover:underline">
              Inicia sesión aquí
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
