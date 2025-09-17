import React from "react";
import { Modal } from "../Modal/Modal";
import { MovementForm } from "../MovementForm/MovementForm";
import { useMovementsQueries } from "../../../hooks/services/useMovementsQueries";
import type { MovementForm as MovementFormType } from "../../../types/movements";
import "./MovementModal.scss";

interface MovementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export type { MovementModalProps };

export const MovementModal: React.FC<MovementModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { useCreateMovement } = useMovementsQueries();
  const createMovementMutation = useCreateMovement();

  const isLoading = createMovementMutation.isPending;

  const handleFormSubmit = (formData: MovementFormType) => {
    const movementData = {
      accountId: formData.accountId,
      movementType: formData.movementType,
      amount: formData.amount,
    };

    createMovementMutation.mutate(movementData, {
      onSuccess: () => {
        onClose();
        if (onSuccess) {
          onSuccess();
        }
      },
      onError: (error) => {
        console.error("Error creating movement:", error);
      },
    });
  };

  const handleSave = () => {
    const form = document.querySelector(".movement-form") as HTMLFormElement;
    if (form) {
      const submitEvent = new Event("submit", {
        bubbles: true,
        cancelable: true,
      });
      form.dispatchEvent(submitEvent);
    }
  };

  const handleCancel = () => {
    if (!isLoading) {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nuevo Movimiento"
      onSave={handleSave}
      onCancel={handleCancel}
      saveLabel="Crear Movimiento"
      cancelLabel="Cancelar"
      isSaving={isLoading}
      saveDisabled={isLoading}
      size="lg"
    >
      <div className="movement-modal__content">
        <MovementForm onSubmit={handleFormSubmit} isLoading={isLoading} />
      </div>
    </Modal>
  );
};
