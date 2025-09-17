import { useCallback, useState, useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import type { TableColumn } from "../../components";
import { useAccountsQueries, useClientsQueries } from "../../hooks";
import { useClientsStore, useAccountsStore } from "../../store";
import type { AccountListItem } from "../../types";
import {
  ACCOUNT_TYPE_LABELS,
  ACCOUNT_STATE_LABELS,
} from "../../types/accounts";

export const useAccountsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { selectedClient, clearSelectedClient } = useClientsStore();
  const { setSelectedAccount } = useAccountsStore();
  const { useGetAccounts, useDeleteAccount } = useAccountsQueries();
  const { useGetClients } = useClientsQueries();

  const { data: allAccounts, isLoading, error } = useGetAccounts(searchTerm);
  const deleteAccountMutation = useDeleteAccount();

  const { data: clients } = useGetClients();

  const accounts = useMemo(() => {
    if (!allAccounts) return [];

    const clientsMap = new Map();
    clients?.forEach((client) => {
      clientsMap.set(client.id, client);
    });

    let completeAccountsInfo = allAccounts.map((account) => {
      let clientName = account.clientName;

      const accountWithClientId = account as any;
      if (!clientName && accountWithClientId.clientId) {
        const clientData = clientsMap.get(accountWithClientId.clientId);
        clientName = clientData?.person?.name;
      }

      return {
        ...account,
        clientName: clientName || "Cliente desconocido",
      };
    });

    if (selectedClient) {
      completeAccountsInfo = completeAccountsInfo.filter(
        (account) => account.clientName === selectedClient.person.name
      );
    }

    return completeAccountsInfo;
  }, [allAccounts, clients, selectedClient]);

  const handleSearch = useCallback((query: string) => {
    console.log("Searching accounts for:", query);
    setSearchTerm(query);
  }, []);

  const handleRowClick = useCallback(
    (account: AccountListItem) => {
      console.log("Selected account:", account);

      setSelectedAccount(account);

      navigate({ to: "/movements" });
    },
    [setSelectedAccount, navigate]
  );

  const handleClearClientFilter = useCallback(() => {
    clearSelectedClient();
  }, [clearSelectedClient]);

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
    isDeleting: deleteAccountMutation.isPending,
  };
};
