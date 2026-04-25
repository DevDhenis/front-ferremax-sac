import { useState } from "react";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/services/auth/authContext";
import { useToast } from "@/context/ToastContext";

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

      const { data } = await http.post("auth/reset-password", payload);
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
    <div className="w-screen h-screen flex justify-content-center align-items-center">
      <Card className="w-4 shadow-4 border-round-lg p-4">
        <div className="text-center mb-4">
          <i className="pi pi-key text-5xl text-blue-500 mb-3"></i>
          <h2 className="text-2xl font-bold text-gray-700">Nueva Contraseña</h2>
          <p className="text-gray-500">
            Crea una nueva contraseña para {email ? <strong>{email}</strong> : "tu cuenta"}
          </p>
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Nueva Contraseña
          </label>
          <div className="p-inputgroup">
            <InputText
              id="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full"
              placeholder="Mínimo 6 caracteres"
            />
            <Button
              type="button"
              icon={showPassword ? "pi pi-eye-slash" : "pi pi-eye"}
              className="p-button-secondary"
              onClick={() => setShowPassword(!showPassword)}
            />
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-2">
            Confirmar Contraseña
          </label>
          <div className="p-inputgroup">
            <InputText
              id="password_confirmation"
              type={showPassword ? "text" : "password"}
              value={formData.password_confirmation}
              onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
              className="w-full"
              placeholder="Repite tu contraseña"
            />
            <Button
              type="button"
              icon={showPassword ? "pi pi-eye-slash" : "pi pi-eye"}
              className="p-button-secondary"
              onClick={() => setShowPassword(!showPassword)}
            />
          </div>
        </div>

        {error && <Message severity="error" text={error} className="mb-3" />}

        <Button
          label={loading ? "Restableciendo..." : "Restablecer Contraseña"}
          icon="pi pi-check"
          className="w-full p-button-rounded p-button-lg p-button-success"
          disabled={loading}
          onClick={handleSubmit}
        />

        <div className="text-center mt-3">
          <Button
            label="Volver al Login"
            icon="pi pi-arrow-left"
            className="p-button-text p-button-sm"
            onClick={() => navigate("/login")}
          />
        </div>
      </Card>
    </div>
  );
}