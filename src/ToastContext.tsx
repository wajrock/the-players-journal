import React, {
  createContext,
  useState,
  useContext,
  FunctionComponent,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { useLocation } from "react-router-dom"; // Utiliser useLocation pour accéder à location.state
import './ToastContext.scss'
import Toast from "./components/Toast/Toast";

interface Toast {
  message: string;
  type: "success" | "error" | "warning" | "information";
  title:string;
}

const ToastComponent: FunctionComponent<{
  message: string;
  type: "success" | "error" | "warning" | "information";
  title:string;
  onClose: () => void;
}> = ({ message, type, title,onClose }) => {
  const toastRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (toastRef.current) {
      toastRef.current.classList.add('active'); // Ajouter la classe pour l'animation
      const timer = setTimeout(() => {
        if (toastRef.current) {
          toastRef.current.classList.remove('active'); // Retirer la classe après l'animation
        }
        
        setTimeout(() => {
          onClose();
        }, 1000);
      }, 4000); // Durée avant la fermeture automatique

      return () => clearTimeout(timer); // Nettoyage du timer
    }
  }, [onClose]);

  return (
    <Toast message={message} type={type} title={title} ref={toastRef} />
  );
};


interface ToastContextType {
  toast: Toast | null;
  showToast: (message: string, type: "success" | "error" | "warning" | "information",title:string) => void;
  closeToast: () => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const ToastProvider: FunctionComponent<{ children: ReactNode }> = ({
  children,
}) => {
  const [toast, setToast] = useState<Toast | null>(null);
  const location = useLocation();
  
  const showToast = useCallback((message: string, type: "success" | "error" | "warning" | "information",title:string) => {
    setToast({ message, type,title });
    setTimeout(() => {
      setToast(null);
    }, 5000);
  }, []);

  const closeToast = useCallback(() => {
    setToast(null);
  }, []);

  useEffect(() => {
    if (location.state && location.state.toast) {
      const { message, type,title } = location.state.toast;
      showToast(message, type,title);
      
      const newState = { ...location.state };
      delete newState.toast; 

      window.history.replaceState(newState, document.title);
    }
  }, [location.state, showToast]);

  return (
    <ToastContext.Provider value={{ toast, showToast, closeToast }}>
      {children}
      {toast && (
        <ToastComponent message={toast.message} type={toast.type} title={toast.title} onClose={closeToast} />
      )}
    </ToastContext.Provider>
  );
};




export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
