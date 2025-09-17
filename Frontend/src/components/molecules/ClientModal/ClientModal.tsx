import React from "react";
import { Modal } from "../Modal/Modal";
import { ClientForm } from "../ClientForm/ClientForm";
import { useClientsQueries } from "../../../hooks/services/useClientsQueries";
import type { ClientForm as ClientFormType } from "../../../types/clients";
import type {
  CreateClientWithPerson,
  UpdateClientWithPerson,
  ClientListItem,
} from "../../../types/clients";
import "./ClientModal.scss";

export interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  editMode?: boolean;
  initialData?: ClientListItem;
}

export const ClientModal: React.FC<ClientModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  editMode = false,
  initialData,
}) => {
  const { useCreateClient, useUpdateClient } = useClientsQueries();
  const createClientMutation = useCreateClient();
  const updateClientMutation = useUpdateClient();

  const isLoading =
    createClientMutation.isPending || updateClientMutation.isPending;

  const handleFormSubmit = (formData: ClientFormType) => {
    if (editMode && initialData) {
      const updateData: UpdateClientWithPerson = {
        name: formData.name,
        identification: formData.identification,
        phone: formData.phone,
        address: formData.address,
        age: formData.age,
        gender: formData.gender,
        password: formData.password,
      };

      updateClientMutation.mutate(
        { id: initialData.id, data: updateData },
        {
          onSuccess: () => {
            onClose();
            if (onSuccess) {
              onSuccess();
            }
          },
          onError: (error) => {
            console.error("Error updating client:", error);
          },
        }
      );
    } else {
      const clientData: CreateClientWithPerson = {
        name: formData.name,
        identification: formData.identification,
        phone: formData.phone,
        address: formData.address,
        age: formData.age,
        gender: formData.gender,
        password: formData.password,
        state: "ACTIVE",
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
        },
      });
    }
  };

  const handleSave = () => {
    const form = document.querySelector(".client-form") as HTMLFormElement;
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

  const getInitialFormData = (): Partial<ClientFormType> | undefined => {
    if (!editMode || !initialData) {
      return undefined;
    }

    return {
      name: initialData.person.name,
      identification: initialData.person.identification,
      phone: initialData.person.phone,
      address: initialData.person.address,
      age: initialData.person.age,
      gender: initialData.person.gender,
      password: "",
    };
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editMode ? "Editar Cliente" : "Nuevo Cliente"}
      onSave={handleSave}
      onCancel={handleCancel}
      saveLabel={editMode ? "Actualizar Cliente" : "Crear Cliente"}
      cancelLabel="Cancelar"
      isSaving={isLoading}
      saveDisabled={isLoading}
      size="lg"
    >
      <div className="client-modal__content">
        <ClientForm
          onSubmit={handleFormSubmit}
          initialData={getInitialFormData()}
          isLoading={isLoading}
        />
      </div>
    </Modal>
  );
};
