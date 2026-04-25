import { useState } from "react";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import { Link, useNavigate } from "react-router-dom";
import ThemeSwitch from "@/components/common/ThemeSwitch";
import axios from "axios";
import { useToast } from "@/context/ToastContext";
import { useAuth } from "@/services/auth/authContext";

export default function Register() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombres: "",
    apellido_paterno: "",
    apellido_materno: "",
    direccion: "",
    username: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const url = import.meta.env.VITE_BASE_URL;

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombres) newErrors.nombres = "Los nombres son obligatorios";
    if (!formData.apellido_paterno) newErrors.apellido_paterno = "El apellido paterno es obligatorio";
    if (!formData.apellido_materno) newErrors.apellido_materno = "El apellido materno es obligatorio";
    if (!formData.username) newErrors.username = "El nombre de usuario es obligatorio";
    if (!formData.email) newErrors.username = "El email de usuario es obligatorio";

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
      const { data } = await axios.post(`${url}auth/register`, formData);
      login(data.token)
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
          showToast("error", "Error", backendErrors);
        }
      } else {
        showToast("error", "Error", "No se pudo registrar, intente nuevamente.");
      }
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen">
      {/* <div className="absolute mt-3 mr-3 top-0 right-0">
        <ThemeSwitch />
      </div> */}

      <div className="flex justify-content-center align-items-center h-full">
        <Card className="w-6 shadow-4 border-round-lg">
          <div className="text-center mb-4">
            <i className="pi pi-user-plus text-5xl text-blue-500 mb-3"></i>
            <h2 className="text-2xl font-bold text-gray-700">Crear cuenta</h2>
            <p className="text-gray-500">Regístrate para continuar</p>
          </div>

          <div className="grid">
            <div className="col-12 md:col-6">
              <div className="flex flex-column">
                <label>Nombres</label>
                <InputText
                  value={formData.nombres}
                  onChange={(e) => handleChange("nombres", e.target.value)}
                  className={`w-full ${errors.nombres ? "p-invalid" : ""}`}
                />
                {errors.nombres && <small className="p-error">{errors.nombres}</small>}

                <label>Apellido paterno</label>
                <InputText
                  value={formData.apellido_paterno}
                  onChange={(e) => handleChange("apellido_paterno", e.target.value)}
                  className={`w-full ${errors.apellido_paterno ? "p-invalid" : ""}`}
                />
                {errors.apellido_paterno && <small className="p-error">{errors.apellido_paterno}</small>}

                <label>Apellido materno</label>
                <InputText
                  value={formData.apellido_materno}
                  onChange={(e) => handleChange("apellido_materno", e.target.value)}
                  className={`w-full ${errors.apellido_materno ? "p-invalid" : ""}`}

                />
                {errors.apellido_paterno && <small className="p-error">{errors.apellido_materno}</small>}

                <label>Nombre de usuario</label>
                <InputText
                  value={formData.username}
                  onChange={(e) => handleChange("username", e.target.value)}
                  className={`w-full ${errors.username ? "p-invalid" : ""}`}
                />
                {errors.username && <small className="p-error">{errors.username}</small>}
              </div>
            </div>

            <div className="col-12 md:col-6 flex flex-column">
              <label>Email</label>
              <InputText
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className={`w-full ${errors.email ? "p-invalid" : ""}`}
              />
              {errors.username && <small className="p-error">{errors.username}</small>}

              <label>Contraseña</label>
              <div className="p-inputgroup">
                <InputText
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  className={`w-full ${errors.password ? "p-invalid" : ""}`}
                />
                <Button
                  type="button"
                  icon={showPassword ? "pi pi-eye-slash" : "pi pi-eye"}
                  className="p-button-secondary"
                  onClick={() => setShowPassword(!showPassword)}
                />
              </div>
              {errors.password && <small className="p-error">{errors.password}</small>}

              <label>Confirmar contraseña</label>
              <div className="p-inputgroup">
                <InputText
                  type={showPassword ? "text" : "password"}
                  value={formData.password_confirmation}
                  onChange={(e) => handleChange("password_confirmation", e.target.value)}
                  className={`w-full ${errors.password_confirmation ? "p-invalid" : ""}`}
                />
                <Button
                  type="button"
                  icon={showPassword ? "pi pi-eye-slash" : "pi pi-eye"}
                  className="p-button-secondary"
                  onClick={() => setShowPassword(!showPassword)}
                />
              </div>
              {errors.password_confirmation && (
                <small className="p-error">{errors.password_confirmation}</small>
              )}
            </div>
          </div>

          <Button
            label={loading ? "Registrando..." : "Registrarse"}
            icon="pi pi-user-plus"
            className="w-full p-button-rounded p-button-lg p-button-success mt-3"
            disabled={loading}
            onClick={handleRegister}
          />

          {errors.general && (
            <Message severity="error" text={errors.general} className="mb-3" />
          )}

          <div className="text-center mt-3">
            <span className="text-sm text-gray-500">¿Ya tienes cuenta?</span>{" "}
            <Link to="/login" className="text-blue-500 text-sm hover:underline">
              Inicia sesión aquí
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
