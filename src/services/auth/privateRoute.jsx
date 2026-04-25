import { Navigate } from "react-router-dom";
import { useAuth } from "./authContext";
import { ProgressSpinner } from "primereact/progressspinner";

export default function PrivateRoute({ children }) {
  const { token, loading } = useAuth();

  if (loading) return <ProgressSpinner />;

  if (!token) return <Navigate to="/login" replace />;

  return children;
}
