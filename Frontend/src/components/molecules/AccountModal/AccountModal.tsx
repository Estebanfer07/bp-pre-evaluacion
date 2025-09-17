import React from "react";
import { Modal } from "../Modal/Modal";
import { AccountForm } from "../AccountForm/AccountForm";
import { useAccountsQueries } from "../../../hooks/services/useAccountsQueries";
import type { AccountForm as AccountFormType } from "../../../types/accounts";
import type {
  CreateAccount,
  UpdateAccount,
  AccountListItem,
} from "../../../types/accounts";
import "./AccountModal.scss";

export interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  editMode?: boolean;
  initialData?: AccountListItem;
}

export const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  editMode = false,
  initialData,
}) => {
  const { useCreateAccount, useUpdateAccount } = useAccountsQueries();
  const createAccountMutation = useCreateAccount();
  const updateAccountMutation = useUpdateAccount();

  const isLoading =
    createAccountMutation.isPending || updateAccountMutation.isPending;

  const handleFormSubmit = (formData: AccountFormType) => {
    if (editMode && initialData) {
      // Update existing account
      const updateData: UpdateAccount = {
        type: formData.type,
        balance: formData.balance,
      };

      updateAccountMutation.mutate(
        { id: initialData.id, data: updateData },
        {
          onSuccess: () => {
            onClose();
            if (onSuccess) {
              onSuccess();
            }
          },
          onError: (error) => {
            console.error("Error updating account:", error);
          },
        }
      );
    } else {
      // Create new account
      const accountData: CreateAccount = {
        type: formData.type,
        balance: formData.balance,
        clientId: formData.clientId,
      };

      createAccountMutation.mutate(accountData, {
        onSuccess: () => {
          onClose();
          if (onSuccess) {
            onSuccess();
          }
        },
        onError: (error) => {
          console.error("Error creating account:", error);
        },
      });
    }
  };

  const handleSave = () => {
    const form = document.querySelector(".account-form") as HTMLFormElement;
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

  const getInitialFormData = (): Partial<AccountFormType> | undefined => {
    if (!editMode || !initialData) {
      return undefined;
    }

    return {
      type: initialData.type,
      balance: initialData.balance,
      clientId: initialData.clientId,
    };
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editMode ? "Editar Cuenta" : "Nueva Cuenta"}
      onSave={handleSave}
      onCancel={handleCancel}
      saveLabel={editMode ? "Actualizar Cuenta" : "Crear Cuenta"}
      cancelLabel="Cancelar"
      isSaving={isLoading}
      saveDisabled={isLoading}
      size="lg"
    >
      <div className="account-modal__content">
        <AccountForm
          onSubmit={handleFormSubmit}
          initialData={getInitialFormData()}
          isLoading={isLoading}
        />
      </div>
    </Modal>
  );
};
