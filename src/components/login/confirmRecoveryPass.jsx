import { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { useAuth } from '@/services/auth/authContext';
import ActionButton from '../common/ActionButton';
import { useToast } from "@/context/ToastContext";
import CustomModal from '../common/CustomModal';
import { Link, useNavigate } from "react-router-dom";

export default function ConfirmRecoveryPass() {
  const { http } = useAuth();
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const emailError =
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && submitted
      ? 'Correo inválido'
      : '';

  const close = () => {
    setEmail('');
    setSubmitted(false);
    setVisible(false);
  };

  const sendEmail = async () => {
    setSubmitted(true);
    if (emailError) return;

    setLoading(true);
    try {
      await http.post('auth/forgot-password', { email });
      close();
      navigate(`/verification?email=${encodeURIComponent(email)}&type=recoveryPass`);
    } catch (error) {
      close();
    } finally {
      setLoading(false);
    }
  };

  const footer = (
    <div className="flex justify-center gap-2 w-full">
      <ActionButton
        label="Cancelar"
        color="danger"
        onClick={close}
        disabled={loading}
      />
      <ActionButton
        label="Enviar"
        color="primary"
        onClick={sendEmail}
        loading={loading}
      />
    </div>
  );

  return (
    <>
      <div className="text-center">
        <Link
          onClick={() => setVisible(true)}
          className="text-sm cursor-pointer text-blue-500"
        >
          ¿Has olvidado tu contraseña?
        </Link>
      </div>

      <CustomModal
        visible={visible}
        onHide={close}
        header="Recuperar contraseña"
        footerActions={footer}
      >
        <p className="text-base mb-3">
          Introduce tu correo electrónico para buscar tu cuenta.
        </p>

        <div className="flex flex-column">
          <label htmlFor="email" className="font-semibold">
            Correo
          </label>
          <InputText
            id="email"
            type="email"
            value={email}
            placeholder="Ingresa tu correo electrónico"
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full ${emailError ? 'p-invalid' : ''}`}
          />
          {emailError && (
            <small className="p-error text-sm">{emailError}</small>
          )}
        </div>
      </CustomModal>
    </>
  );
}
