import { useState } from 'react';
import { useAuth } from '@/services/auth/authContext';
import { useToast } from "@/context/ToastContext";
import CustomModal from '../common/CustomModal';
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ConfirmRecoveryPass() {
  const { http } = useAuth();
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const getEmailError = () => {
    if (!submitted) return "";
    if (!email) return "El correo es obligatorio";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Formato de correo inválido";
    return "";
  };

  const emailError = getEmailError();

  const close = () => {
    setEmail('');
    setSubmitted(false);
    setVisible(false);
  };

  const sendEmail = async () => {
    setSubmitted(true);
    const currentError = getEmailError();
    if (currentError || !email) return;

    setLoading(true);
    try {
      await http.post('auth/forgot-password', { email });
      close();
      showToast("success", "Correo enviado", "Se envió un código a tu correo.");
      navigate(`/verification?email=${encodeURIComponent(email)}&type=recoveryPass`);
    } catch (error) {
      close();
    } finally {
      setLoading(false);
    }
  };

  const footer = (
    <div className="flex justify-end gap-2 w-full">
      <Button
        variant="ghost"
        onClick={close}
        disabled={loading}
        className="cursor-pointer"
      >
        Cancelar
      </Button>
      <Button
        onClick={sendEmail}
        disabled={loading}
        className="cursor-pointer"
      >
        {loading ? "Enviando..." : "Enviar"}
      </Button>
    </div>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setVisible(true)}
        className="text-xs font-semibold text-primary hover:underline cursor-pointer outline-none bg-transparent border-0 p-0"
      >
        ¿Olvidaste tu contraseña?
      </button>

      <CustomModal
        visible={visible}
        onHide={close}
        header="Recuperar contraseña"
        footerActions={footer}
        dismissableMask={false}
      >
        <p className="text-sm text-muted-foreground mb-4">
          Introduce tu correo electrónico para buscar tu cuenta y recibir un código de verificación.
        </p>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="recovery-email" className="text-xs font-semibold text-foreground/80">
            Correo electrónico
          </label>
          <Input
            id="recovery-email"
            type="email"
            value={email}
            placeholder="correo@empresa.com"
            onChange={(e) => setEmail(e.target.value)}
            className={`h-10 ${emailError ? 'border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20' : ''}`}
            disabled={loading}
          />
          {emailError && (
            <span className="text-xs text-destructive font-medium mt-0.5">{emailError}</span>
          )}
        </div>
      </CustomModal>
    </>
  );
}
