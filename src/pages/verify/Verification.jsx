import { useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import { InputOtp } from "primereact/inputotp";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/services/auth/authContext";
import { useToast } from "@/context/ToastContext";
import ActionButton from "@/components/common/ActionButton";

export default function Verification() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');
  const type = searchParams.get('type');

  const { http, logout } = useAuth();
  const { showToast } = useToast();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleVerify = async () => {
    if (!otp || otp.length < 8) {
      setError("El código debe tener 8 dígitos");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const payload = {
        code: otp,
        email: email
      };

      let endpoint;
      if (type === "recoveryPass") {
        endpoint = "auth/verify-recovery-code";
      } else {
        endpoint = "auth/verify-email";
      }

      const { data } = await http.post(endpoint, payload);
      // showToast("success", "Éxito", data.message || "Verificación exitosa");

      if (type === "recoveryPass") {
        navigate("/reset-password", { state: { email, code: otp } });
      } else {
        logout();
        navigate("/login");
      }
    } catch (err) {
      console.log('Error:', err.response?.data);
      const response = err.response?.data;
      if (response?.message) {
        setError(response.message);
      } else if (response?.errors) {
        const errorMessages = Object.values(response.errors).flat();
        setError(errorMessages.join(", "));
      } else {
        setError("Error en la verificación");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/login");
  };

  return (
    <div className="w-screen h-screen flex justify-content-center align-items-center">
      <Card className="w-4 shadow-4 border-round-lg p-4">
        <div className="text-center mb-4">
          <i className="pi pi-shield text-5xl text-green-500 mb-3"></i>
          <h2 className="text-2xl font-bold text-gray-700">Verificación</h2>
          <p className="text-gray-500">
            Ingresa el código de verificación enviado a
            {email ? <strong> {email}</strong> : " tu correo"}
          </p>
          {type === "recoveryPass" && (
            <p className="text-blue-500 text-sm">Recuperación de contraseña</p>
          )}
        </div>

        <div className="flex justify-content-center mb-3">
          <InputOtp
            value={otp}
            onChange={(e) => setOtp(e.value)}
            length={8}
            className="text-center"
          />
        </div>

        {error && <Message severity="error" text={error} className="mb-3" />}

        <div className=" flex flex-column gap-3">
          <Button
            label={loading ? "Verificando..." : "Verificar"}
            icon="pi pi-check"
            className="w-full p-button-rounded p-button-lg p-button-success"
            disabled={loading}
            onClick={handleVerify}
          />

          <ActionButton
            label="Atrás"
            icon="pi pi-arrow-left"
            color="secondary"
            className="w-full"
            onClick={handleBack}
            size="lg"
          />
        </div>
      </Card>
    </div>
  );
}