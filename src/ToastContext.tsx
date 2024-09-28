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

interface Toast {
  message: string;
  type: "success" | "error" | "warning";
  title:string;
}

const ToastComponent: FunctionComponent<{
  message: string;
  type: "success" | "error" | "warning";
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
    <div className={`toast-wrap ${type}`} ref={toastRef}>
      <div className="toast-wrap-icon">
        {type === "success" && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M8.6 14.6L15.65 7.55L14.25 6.15L8.6 11.8L5.75 8.95L4.35 10.35L8.6 14.6ZM10 20C8.61667 20 7.31667 19.7373 6.1 19.212C4.88333 18.6873 3.825 17.975 2.925 17.075C2.025 16.175 1.31267 15.1167 0.788 13.9C0.262667 12.6833 0 11.3833 0 10C0 8.61667 0.262667 7.31667 0.788 6.1C1.31267 4.88333 2.025 3.825 2.925 2.925C3.825 2.025 4.88333 1.31233 6.1 0.787C7.31667 0.262333 8.61667 0 10 0C11.3833 0 12.6833 0.262333 13.9 0.787C15.1167 1.31233 16.175 2.025 17.075 2.925C17.975 3.825 18.6873 4.88333 19.212 6.1C19.7373 7.31667 20 8.61667 20 10C20 11.3833 19.7373 12.6833 19.212 13.9C18.6873 15.1167 17.975 16.175 17.075 17.075C16.175 17.975 15.1167 18.6873 13.9 19.212C12.6833 19.7373 11.3833 20 10 20Z"
              fill="#00DF80"
            />
          </svg>
        )}

        {type === "warning" && (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none">
                <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM11 15H9V13H11V15ZM11 11H9V5H11V11Z" fill="#FFD21E"/>
            </svg>
        )}

        {type === "error" && (
            <svg xmlns="http://www.w3.org/2000/svg"viewBox="0 0 20 20" fill="none">
                <path d="M6.4 15L10 11.4L13.6 15L15 13.6L11.4 10L15 6.4L13.6 5L10 8.6L6.4 5L5 6.4L8.6 10L5 13.6L6.4 15ZM10 20C8.61667 20 7.31667 19.7373 6.1 19.212C4.88333 18.6873 3.825 17.975 2.925 17.075C2.025 16.175 1.31267 15.1167 0.788 13.9C0.262667 12.6833 0 11.3833 0 10C0 8.61667 0.262667 7.31667 0.788 6.1C1.31267 4.88333 2.025 3.825 2.925 2.925C3.825 2.025 4.88333 1.31233 6.1 0.787C7.31667 0.262333 8.61667 0 10 0C11.3833 0 12.6833 0.262333 13.9 0.787C15.1167 1.31233 16.175 2.025 17.075 2.925C17.975 3.825 18.6873 4.88333 19.212 6.1C19.7373 7.31667 20 8.61667 20 10C20 11.3833 19.7373 12.6833 19.212 13.9C18.6873 15.1167 17.975 16.175 17.075 17.075C16.175 17.975 15.1167 18.6873 13.9 19.212C12.6833 19.7373 11.3833 20 10 20Z" fill="#F04248"/>
            </svg>
        )}
      </div>

      <div className="toast-wrap-texts">
        <h2 className="toast-wrap-texts-title">{title}</h2>
        <p className="toast-wrap-texts-message">{message}</p>
      </div>
    </div>
  );
};


interface ToastContextType {
  toast: Toast | null;
  showToast: (message: string, type: "success" | "error" | "warning",title:string) => void;
  closeToast: () => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const ToastProvider: FunctionComponent<{ children: ReactNode }> = ({
  children,
}) => {
  const [toast, setToast] = useState<Toast | null>(null);
  const location = useLocation();
  
  const showToast = useCallback((message: string, type: "success" | "error" | "warning",title:string) => {
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
