import { createContext, useContext, useRef } from "react";
import { Toast } from "primereact/toast";

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast debe usarse dentro de un ToastProvider");
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const toast = useRef(null);

  const showToast = (severity, summary, detail, life = 5000) => {
    toast.current?.show({
      severity,
      summary,
      detail,
      life
    });
  };

  const showSuccess = (summary, detail) => {
    showToast('success', summary, detail);
  };

  const showError = (summary, detail) => {
    showToast('error', summary, detail);
  };

  const showWarning = (summary, detail) => {
    showToast('warn', summary, detail);
  };

  const showInfo = (summary, detail) => {
    showToast('info', summary, detail);
  };

  const clearToasts = () => {
    toast.current?.clear();
  };

  const value = {
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    clearToasts
  };

  return (
    <ToastContext.Provider value={value}>
      <Toast ref={toast} position="top-right" />
      {children}
    </ToastContext.Provider>
  );
};