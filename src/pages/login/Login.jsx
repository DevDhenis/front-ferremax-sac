import { useState, useEffect } from "react";
import { useAuth } from "@/services/auth/authContext";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useToast } from "@/context/ToastContext";
import ConfirmRecoveryPass from "@/components/login/confirmRecoveryPass";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import IconLogo from "@/assets/icons/icon.svg";
import IconLogoLight from "@/assets/icons/icon-light.svg";

export default function Login() {
  const { login, token, accesses } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

  const isValidEmail = (value) => /\S+@\S+\.\S+/.test(value);

  const handleEmailChange = (value) => {
    setEmail(value);

    if (!value) {
      setErrors((prev) => ({ ...prev, email: "El correo es obligatorio" }));
    } else if (!isValidEmail(value)) {
      setErrors((prev) => ({ ...prev, email: "Formato de correo inválido" }));
    } else {
      setErrors((prev) => {
        const { email, ...rest } = prev;
        return rest;
      });
    }
  };

  const handlePasswordChange = (value) => {
    setPassword(value);

    if (!value) {
      setErrors((prev) => ({ ...prev, password: "La contraseña es obligatoria" }));
    } else {
      setErrors((prev) => {
        const { password, ...rest } = prev;
        return rest;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = "El correo es obligatorio";
      setErrors(newErrors);
      return false;
    }
    if (!isValidEmail(email)) {
      newErrors.email = "Formato de correo inválido";
      setErrors(newErrors);
      return false;
    }

    if (!password) {
      newErrors.password = "La contraseña es obligatoria";
      setErrors(newErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      const { data } = await axios.post(`${url}auth/login`, { email, password });
      login(data.token, data.user);
      showToast('success', 'Bienvenido', 'Inicio de sesión exitoso');
    } catch (err) {
      const response = err.response?.data;

      // 403 con requires_verification: la cuenta existe pero falta confirmar el correo.
      if (err.response?.status === 403 && response?.requires_verification) {
        showToast('warn', 'Verifica tu correo', 'Tu cuenta aún no está verificada. Ingresa el código que te enviamos.');
        navigate(`/verification?email=${encodeURIComponent(email)}&type=signUp`);
        return;
      }

      let errorMessage = 'Error de conexión o desconocido';

      if (response) {
        if (response.errors && response.errors.length > 0) {
          errorMessage = response.errors[0].error;
        }
        else if (response.message) {
          errorMessage = response.message;
        }
      }

      showToast('error', 'Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen flex bg-background overflow-hidden relative">
      <div className="hidden md:flex md:w-1/2 lg:w-[55%] bg-primary relative justify-center items-center p-12 text-primary-foreground">
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
              Gestión inteligente para tu inventario
            </h1>
            <p className="text-sm lg:text-base text-primary-foreground/75 font-light leading-relaxed">
              Controla productos, gestiona trabajadores, roles y visualiza el historial de ventas de manera consolidada en un solo lugar.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="p-4 rounded-xl bg-primary-foreground/[0.03] border border-primary-foreground/[0.06] backdrop-blur-sm">
              <span className="text-2xl font-bold block text-primary-foreground">100%</span>
              <span className="text-xs text-primary-foreground/50">Control de stock</span>
            </div>
            <div className="p-4 rounded-xl bg-primary-foreground/[0.03] border border-primary-foreground/[0.06] backdrop-blur-sm">
              <span className="text-2xl font-bold block text-primary-foreground">Rápido</span>
              <span className="text-xs text-primary-foreground/50">Reportes en vivo</span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full md:w-1/2 lg:w-[45%] flex justify-center items-center p-6 sm:p-12 bg-card">
        <div className="w-full max-w-sm flex flex-col gap-6">
          <div className="flex flex-col gap-2 text-left">
            <div className="flex items-center gap-2 md:hidden mb-4">
              <img alt="Ferremax Logo" src={IconLogo} className="size-8" />
              <span className="text-lg font-bold text-foreground tracking-wider">FERREMAX S.A.C.</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Iniciar Sesión
            </h2>
            <p className="text-sm text-muted-foreground">
              Ingresa tus credenciales para acceder a la plataforma
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-xs font-semibold text-foreground/80">
                Correo electrónico
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                placeholder="nombre@empresa.com"
                className={`h-10 ${errors.email ? "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20" : ""}`}
                disabled={loading}
              />
              {errors.email && (
                <span className="text-xs text-destructive flex items-center gap-1 font-medium mt-0.5">
                  {errors.email}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="text-xs font-semibold text-foreground/80">
                  Contraseña
                </label>
                <ConfirmRecoveryPass />
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  placeholder="••••••••"
                  className={`h-10 pr-10 ${errors.password ? "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20" : ""}`}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground outline-none cursor-pointer flex items-center justify-center p-1 rounded-md transition-colors"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {errors.password && (
                <span className="text-xs text-destructive flex items-center gap-1 font-medium mt-0.5">
                  {errors.password}
                </span>
              )}
            </div>

            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full h-10 mt-2 font-medium cursor-pointer"
            >
              {loading ? "Ingresando..." : "Ingresar"}
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground mt-2 border-t border-border/40 pt-4">
            ¿No tienes una cuenta?{" "}
            <Link to="/register" className="text-primary font-semibold hover:underline">
              Regístrate aquí
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}