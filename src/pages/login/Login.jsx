import { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Card } from "primereact/card";
import { useAuth } from "@/services/auth/authContext";
import ThemeSwitch from "@/components/common/ThemeSwitch";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useToast } from "@/context/ToastContext";
import ActionButton from "@/components/common/ActionButton";
import ConfirmRecoveryPass from "@/components/login/confirmRecoveryPass";

export default function Login() {
  const { http, login } = useAuth();
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const url = import.meta.env.VITE_BASE_URL;

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
      showToast('success', 'Bienvenido', 'Inicio de sesión exitoso')
    } catch (err) {
      let errorMessage = 'Error de conexión o desconocido';

      if (err.response && err.response.data) {
        if (err.response.data.errors && err.response.data.errors.length > 0) {
          errorMessage = err.response.data.errors[0].error;
        }
        else if (err.response.data.message) {
          errorMessage = err.response.data.message;
        }
      }

      showToast('error', 'Error', errorMessage)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen">
      <div className="absolute mt-3 mr-3 top-0 right-0">
        <ThemeSwitch />
      </div>

      <div className="flex justify-content-center align-items-center h-full">
        <Card className="w-25rem shadow-4 border-round-lg">
          <div className="text-center mb-4">
            <i className="pi pi-lock text-5xl text-blue-500 mb-3"></i>
            <h2 className="text-2xl font-bold text-gray-700">Bienvenido</h2>
            <p className="text-gray-500">Inicia sesión para continuar</p>
          </div>

          <div className="flex flex-column gap-3">
            <div className="flex flex-column">
              <label>Correo electrónico</label>
              <InputText
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                className={`w-full ${errors.email ? "p-invalid" : ""}`}
              />
              {errors.email && <small className="p-error">{errors.email}</small>}
            </div>

            <div className="flex flex-column">
              <label>Contraseña</label>
              <Password
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                toggleMask
                feedback={false}
                className={`w-full ${errors.password ? "p-invalid" : ""}`}
                inputClassName="w-full"
                style={{ display: "block", width: "100%" }}
              />
              {errors.password && (
                <small className="p-error">{errors.password}</small>
              )}
            </div>

            <ActionButton
              icon="pi-sign-in"
              label={loading ? "Ingresando..." : "Ingresar"}
              color="primary"
              onClick={handleSubmit}
              disabled={loading}
              rounded={false}
            />
          </div>

          <div className="text-center mt-4">
            <ConfirmRecoveryPass />
          </div>

          <div className="text-center mt-3">
            <span className="text-sm text-gray-500">¿No tienes cuenta?</span>{" "}
            <Link to="/register" className="text-blue-500 text-sm hover:underline">
              Regístrate aquí
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}