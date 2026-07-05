import { createContext, useContext } from "react";
import { toast as sonnerToast } from "sonner";

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast debe usarse dentro de un ToastProvider");
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const showToast = (severity, summary, detail, life = 5000) => {
    const options = detail ? { description: detail, duration: life } : { duration: life };
    
    if (severity === "success") {
      sonnerToast.success(summary, options);
    } else if (severity === "error" || severity === "danger") {
      sonnerToast.error(summary, options);
    } else if (severity === "warn" || severity === "warning") {
      sonnerToast.warning(summary, options);
    } else {
      sonnerToast.info(summary, options);
    }
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
    sonnerToast.dismiss();
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
      {children}
    </ToastContext.Provider>
  );
};