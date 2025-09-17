import React, { useEffect } from "react";
import { Button } from "../../atoms/Button/Button";
import "./Modal.scss";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onSave: () => void;
  onCancel: () => void;
  saveLabel?: string;
  cancelLabel?: string;
  isSaving?: boolean;
  saveDisabled?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  onSave,
  onCancel,
  saveLabel = "Guardar",
  cancelLabel = "Cancelar",
  isSaving = false,
  saveDisabled = false,
  size = "md",
}) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSave = () => {
    if (!saveDisabled && !isSaving) {
      onSave();
    }
  };

  const handleCancel = () => {
    if (!isSaving) {
      onCancel();
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className={`modal modal--${size}`}>
        <div className="modal__header">
          <h2 className="modal__title">{title}</h2>
          <button
            className="modal__close-btn"
            onClick={onClose}
            aria-label="Cerrar modal"
            disabled={isSaving}
          >
            ✕
          </button>
        </div>

        <div className="modal__body">{children}</div>

        <div className="modal__footer">
          <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
            {cancelLabel}
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={saveDisabled}
            loading={isSaving}
          >
            {saveLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};
