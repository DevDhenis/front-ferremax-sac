import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/services/auth/authContext";
import { useToast } from "@/context/ToastContext";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "@/components/ui/input-otp";
import { CheckCircle2, ArrowLeft } from "lucide-react";
import IconLogo from "@/assets/icons/icon.svg";

export default function Verification() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');
  const type = searchParams.get('type');

  const { http } = useAuth();
  const { showError } = useToast();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleVerify = async () => {
    if (!otp || otp.length < 8) {
      showError("Código incompleto", "El código debe tener 8 dígitos.");
      return;
    }

    setLoading(true);
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

      await http.post(endpoint, payload);

      if (type === "recoveryPass") {
        navigate("/reset-password", { state: { email, code: otp } });
      } else {
        // El interceptor de axios ya muestra el toast de éxito.
        navigate("/login");
      }
    } catch {
      // El interceptor de axios ya muestra el toast de error.
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    try {
      await http.post("auth/resend-code", { email });
      // El interceptor de axios ya muestra el toast de éxito.
    } catch (err) {
      // 409: el correo ya está verificado → el usuario solo debe iniciar sesión.
      // Otros errores los muestra el interceptor de axios.
      if (err.response?.status === 409) {
        navigate("/login");
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

          <div className="bg-success-bg p-3 rounded-full border border-success/20 text-success shrink-0 mt-2">
            <CheckCircle2 className="size-8" />
          </div>

          <div className="flex flex-col gap-1.5 mt-2">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Verificación de Cuenta</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Ingresa el código de 8 dígitos enviado a 
              {email ? <strong className="text-foreground font-semibold"> {email}</strong> : " tu correo"}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col items-center gap-3">
            <label htmlFor="otp" className="text-xs font-semibold text-foreground/80 self-start">
              Código de verificación
            </label>
            <InputOTP
              id="otp"
              maxLength={8}
              value={otp}
              onChange={(value) => setOtp(value)}
              disabled={loading}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
                <InputOTPSlot index={6} />
                <InputOTPSlot index={7} />
              </InputOTPGroup>
            </InputOTP>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            onClick={handleVerify}
            disabled={loading}
            className="w-full h-10 font-medium cursor-pointer"
          >
            {loading ? "Verificando..." : "Verificar Código"}
          </Button>

          <div className="flex justify-between items-center text-xs mt-1">
            <button
              onClick={() => navigate("/login")}
              disabled={loading}
              className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 font-medium hover:underline cursor-pointer outline-none bg-transparent border-0"
            >
              <ArrowLeft className="size-3.5" />
              Volver al Login
            </button>

            <button
              onClick={handleResend}
              disabled={loading}
              className="text-primary hover:underline font-semibold cursor-pointer outline-none bg-transparent border-0"
            >
              ¿No recibiste el código? Reenviar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}