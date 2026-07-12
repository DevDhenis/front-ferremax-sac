import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "./authContext";
import IconLogo from "@/assets/icons/icon.svg";

export default function PrivateRoute({ children }) {
  const { token, loading } = useAuth();

  // Pantalla inicial mientras se verifica la sesión (aún no hay usuario, por eso
  // no se puede mostrar el layout todavía). El contenido de cada página carga
  // luego dentro del layout.
  if (loading) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center gap-5 bg-background">
        <img src={IconLogo} alt="Ferremax" className="size-12 animate-pulse" />
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="size-4 animate-spin text-primary" />
          <span className="text-sm">Cargando…</span>
        </div>
      </div>
    );
  }

  if (!token) return <Navigate to="/login" replace />;

  return children;
}
