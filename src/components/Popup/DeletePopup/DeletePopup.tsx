import React, { FunctionComponent, useRef } from "react";
import "./DeletePopup.scss";

interface PopupType {
  openPopupSetter: (open: boolean) => void;
  children: React.ReactNode;
  action: () => void;
  textCta:string;
}
const DeletePopup: FunctionComponent<PopupType> = ({
  openPopupSetter,
  children,
  action,
  textCta
}) => {
  const popupRef = useRef<HTMLDivElement>(null);

  const handleClickOutsidePopup = (event: React.MouseEvent<HTMLDivElement>) => {
    if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
      openPopupSetter(false);
    }
  };

  return (
    <div className="overlay-wrap" onClick={handleClickOutsidePopup}>
      <main className="popup-delete-wrap" ref={popupRef}>
        <section className="popup-delete-wrap-content">{children}</section>
        <footer className="popup-delete-wrap-actions">
          <div className="popup-delete-wrap-actions-cancel" onClick={()=>openPopupSetter(false)}>
            <p>Annuler</p>
          </div>
          <div className="popup-delete-wrap-actions-cta" onClick={action}>
            <p>Supprimer</p>
          </div>
        </footer>
        
      </main>
    </div>
  );
};

export default DeletePopup;
