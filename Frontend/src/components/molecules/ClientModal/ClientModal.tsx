import React from "react";
import { Modal } from "../Modal/Modal";
import { ClientForm } from "../ClientForm/ClientForm";
import { useClientsQueries } from "../../../hooks/services/useClientsQueries";
import type { ClientForm as ClientFormType } from "../../../types/clients";
import type { CreateClientWithPerson } from "../../../types/clients";
import "./ClientModal.scss";

export interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ClientModal: React.FC<ClientModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { useCreateClient } = useClientsQueries();
  const createClientMutation = useCreateClient();

  const handleFormSubmit = (formData: ClientFormType) => {
    // Transform form data to match API requirements
    const clientData: CreateClientWithPerson = {
      name: formData.name,
      identification: formData.identification,
      phone: formData.phone,
      address: formData.address,
      age: formData.age,
      gender: formData.gender,
      password: formData.password,
    };

    createClientMutation.mutate(clientData, {
      onSuccess: () => {
        onClose();
        if (onSuccess) {
          onSuccess();
        }
      },
      onError: (error) => {
        console.error("Error creating client:", error);
        // Error handling is already done in the mutation
      },
    });
  };

  const handleSave = () => {
    // Form submission is handled by the form's submit event
    const form = document.querySelector(".client-form") as HTMLFormElement;
    if (form) {
      // Trigger form validation and submission
      const submitEvent = new Event("submit", {
        bubbles: true,
        cancelable: true,
      });
      form.dispatchEvent(submitEvent);
    }
  };

  const handleCancel = () => {
    if (!createClientMutation.isPending) {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nuevo Cliente"
      onSave={handleSave}
      onCancel={handleCancel}
      saveLabel="Crear Cliente"
      cancelLabel="Cancelar"
      isSaving={createClientMutation.isPending}
      saveDisabled={createClientMutation.isPending}
      size="lg"
    >
      <div className="client-modal__content">
        <ClientForm
          onSubmit={handleFormSubmit}
          isLoading={createClientMutation.isPending}
        />
      </div>
    </Modal>
  );
};
