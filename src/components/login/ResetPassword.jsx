import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/services/auth/authContext";
import { useToast } from "@/context/ToastContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Key, ArrowLeft } from "lucide-react";
import IconLogo from "@/assets/icons/icon.svg";

export default function ResetPassword() {
  const location = useLocation();
  const { email, code } = location.state || {};
  const { http } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    password: "",
    password_confirmation: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async () => {
    if (!formData.password || formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (formData.password !== formData.password_confirmation) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (!email || !code) {
      setError("Error: No se encontró la información de verificación");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const payload = {
        email: email,
        code: code,
        password: formData.password,
        password_confirmation: formData.password_confirmation
      };

      await http.post("auth/reset-password", payload);
      showToast("success", "Contraseña restablecida", "Tu contraseña ha sido actualizada.");
      navigate("/login");
    } catch (err) {
      console.log('Error:', err.response?.data);
      const response = err.response?.data;
      if (response?.message) {
        setError(response.message);
      } else if (response?.errors) {
        const errorMessages = Object.values(response.errors).flat();
        setError(errorMessages.join(", "));
      } else {
        setError("Error al restablecer la contraseña");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-background px-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] size-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] size-96 bg-secondary/5 rounded-full blur-3xl" />

      <div className="w-full max-w-md bg-card border border-border shadow-md rounded-xl p-6 sm:p-8 flex flex-col gap-6 relative z-10">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="flex items-center gap-2">
            <img alt="Ferremax Logo" src={IconLogo} className="size-8" />
            <span className="text-lg font-bold text-foreground tracking-wider">FERREMAX S.A.C.</span>
          </div>

          <div className="bg-primary/5 p-3 rounded-full border border-primary/10 text-primary shrink-0 mt-2">
            <Key className="size-8" />
          </div>

          <div className="flex flex-col gap-1.5 mt-2">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Nueva Contraseña</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Crea una nueva contraseña segura para tu cuenta de 
              {email ? <strong className="text-foreground font-semibold"> {email}</strong> : " correo"}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-xs font-semibold text-foreground/80">
              Nueva Contraseña
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Mínimo 6 caracteres"
                className="h-10 pr-10"
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
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password_confirmation" className="text-xs font-semibold text-foreground/80">
              Confirmar Contraseña
            </label>
            <div className="relative">
              <Input
                id="password_confirmation"
                type={showPassword ? "text" : "password"}
                value={formData.password_confirmation}
                onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                placeholder="Repite tu contraseña"
                className="h-10 pr-10"
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
          </div>

          {error && (
            <div className="p-3 text-xs font-medium text-destructive bg-destructive-bg border border-destructive/20 rounded-lg text-center">
              {error}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full h-10 font-medium cursor-pointer"
          >
            {loading ? "Restableciendo..." : "Restablecer Contraseña"}
          </Button>

          <Button
            variant="outline"
            onClick={() => navigate("/login")}
            disabled={loading}
            className="w-full h-10 font-medium cursor-pointer text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4 mr-2" />
            Volver al Login
          </Button>
        </div>
      </div>
    </div>
  );
}