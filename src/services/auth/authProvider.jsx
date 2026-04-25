import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "./authContext";
import axios from "axios";
import { useToast } from "@/context/ToastContext";

const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });
  const [accesses, setAccesses] = useState(() => {
    const stored = localStorage.getItem("accesses");
    return stored ? JSON.parse(stored) : [];
  });

  const navigate = useNavigate();
  const { showError, showSuccess } = useToast();

  const url = import.meta.env.VITE_BASE_URL;

  const http = axios.create({
    baseURL: url,
    headers: {
      "Content-type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  http.interceptors.response.use(
    (response) => {
      if (response.data?.success && response.data?.message) {
        const method = response.config.method?.toUpperCase();
        if (["POST", "PUT", "DELETE"].includes(method)) {
          showSuccess("Éxito", response.data.message);
        }
      }
      return response;
    },
    (error) => {
      if (error.response?.data) {
        const { message, errors } = error.response.data;

        let detail = "";
        if (errors && Array.isArray(errors)) {
          detail = errors.map((e) => e.error).join("\n");
        }

        showError(message || "Error en la operación", detail);
      } else {
        showError("Error de conexión", "No se pudo conectar con el servidor");
      }

      return Promise.reject(error);
    }
  );

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("accesses", JSON.stringify(accesses));
      }
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("accesses");
    }
  }, [token, user, accesses]);

  const login = (newToken, newUser = null) => {
    setToken(newToken);
    if (newUser) {
      setUser(newUser);
      setAccesses(newUser.accesses || []);

      if (newUser.accesses && newUser.accesses.length > 0) {
        const firstPath = newUser.accesses[0].path || "/";
        navigate(firstPath);
      } else {
        navigate("/sin-permisos");
      }
    } else {
      navigate("/sin-permisos");
    }
  };

  useEffect(() => {
    if (token) {
      http.get("/auth/me")
        .then(res => {
          setUser(res.data.user);
          setAccesses(res.data.user.accesses || []);
        })
        .catch(() => {
          logout();
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const logout = () => {
    setToken(null);
    setUser(null);
    setAccesses([]);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, http, user, accesses, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
