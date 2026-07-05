import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthProvider from "@/services/auth/authProvider";
import { ToastProvider } from "./context/ToastContext";
import { Toaster } from "@/components/ui/sonner";
import Register from "./pages/register/Register";
import Verification from "./pages/verify/Verification";
import Login from "./pages/login/Login";
import ResetPassword from "./components/login/ResetPassword";
import PrivateLayout from "./components/routes/PrivateLayout";
import PrivateRoute from "./services/auth/privateRoute";

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <Toaster />

          <Routes>

            <Route path="/" element={<Navigate to="/catalogo" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verification" element={<Verification />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            <Route
              path="/*"
              element={
                <PrivateRoute>
                  <PrivateLayout />
                </PrivateRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}


export default App;
