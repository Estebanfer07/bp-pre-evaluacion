import { useCallback, useState } from "react";
import type { TableColumn } from "../../components";
import {
  useAccountsQueries,
  useAccountsWithClients,
  useAccountSelection,
} from "../../hooks";
import { useClientsStore, useAccountsStore } from "../../store";
import type { AccountListItem } from "../../types";
import {
  ACCOUNT_TYPE_LABELS,
  ACCOUNT_STATE_LABELS,
} from "../../types/accounts";

export const useAccountsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { selectedClient } = useClientsStore();
  const { openModal, openEditModal } = useAccountsStore();
  const { useDeleteAccount } = useAccountsQueries();
  const { accounts, isLoading, error } = useAccountsWithClients(searchTerm);
  const { handleAccountSelection, handleClearClientFilter } =
    useAccountSelection();

  const deleteAccountMutation = useDeleteAccount();

  const handleSearch = useCallback((query: string) => {
    console.log("Searching accounts for:", query);
    setSearchTerm(query);
  }, []);

  const handleRowClick = useCallback(
    (account: AccountListItem) => {
      handleAccountSelection(account);
    },
    [handleAccountSelection]
  );

  const handleDeleteAccount = useCallback(
    (account: AccountListItem) => {
      if (
        window.confirm(
          `¿Está seguro de que desea eliminar la cuenta ${account.accountNumber}?`
        )
      ) {
        deleteAccountMutation.mutate(account.id);
      }
    },
    [deleteAccountMutation]
  );

  const handleEditAccount = useCallback(
    (account: AccountListItem) => {
      console.log("Editing account:", account);
      openEditModal(account);
    },
    [openEditModal]
  );

  const handleOpenModal = useCallback(() => {
    openModal();
  }, [openModal]);

  const handleAccountCreated = useCallback(() => {
    console.log("Account created successfully");
  }, []);

  const tableColumns: TableColumn<AccountListItem>[] = [
    {
      key: "accountNumber",
      title: "Número de Cuenta",
      align: "left",
      width: "20%",
      render: (_, record) => record.accountNumber,
    },
    {
      key: "type",
      title: "Tipo",
      align: "center",
      width: "15%",
      render: (_, record) => (
        <span
          className={`account-type account-type--${record.type.toLowerCase()}`}
        >
          {ACCOUNT_TYPE_LABELS[record.type]}
        </span>
      ),
    },
    {
      key: "balance",
      title: "Saldo",
      align: "right",
      width: "20%",
      render: (_, record) => (
        <span
          className={`balance ${record.balance < 0 ? "balance--negative" : ""}`}
        >
          $
          {record.balance.toLocaleString("es-EC", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      ),
    },
    {
      key: "clientName",
      title: "Cliente",
      align: "left",
      width: "25%",
      render: (_, record) => record.clientName || "Sin cliente",
    },
    {
      key: "state",
      title: "Estado",
      align: "center",
      width: "10%",
      render: (_, record) => (
        <span
          className={`status-badge status-badge--${record.state.toLowerCase()}`}
        >
          {ACCOUNT_STATE_LABELS[record.state]}
        </span>
      ),
    },
    {
      key: "createdAt",
      title: "Fecha de Creación",
      align: "center",
      width: "10%",
      render: (_, record) => {
        const date = new Date(record.createdAt);
        return date.toLocaleDateString("es-CO");
      },
    },
    {
      key: "actions",
      title: "Acciones",
      align: "center",
      width: "10%",
      render: (_, record) => (
        <div className="actions-container">
          <button
            className="edit-btn"
            type="button"
            aria-label={`Editar cuenta ${record.accountNumber}`}
            onClick={(e) => {
              e.stopPropagation();
              handleEditAccount(record);
            }}
            disabled={deleteAccountMutation.isPending}
          >
            ✏️
          </button>
          <button
            className="delete-btn"
            type="button"
            aria-label={`Eliminar cuenta ${record.accountNumber}`}
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteAccount(record);
            }}
            disabled={deleteAccountMutation.isPending}
          >
            {deleteAccountMutation.isPending ? "..." : "🗑️"}
          </button>
        </div>
      ),
    },
  ];

  return {
    tableColumns,
    accounts,
    isLoading,
    error,
    handleSearch,
    handleRowClick,
    selectedClient,
    handleClearClientFilter,
    handleDeleteAccount,
    handleEditAccount,
    handleOpenModal,
    handleAccountCreated,
    isDeleting: deleteAccountMutation.isPending,
  };
};
