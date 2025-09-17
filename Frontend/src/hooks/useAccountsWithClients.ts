import { useMemo } from "react";
import { useAccountsQueries, useClientsQueries } from "./services";
import { useClientsStore } from "../store";

export const useAccountsWithClients = (searchTerm?: string) => {
  const { selectedClient } = useClientsStore();
  const { useGetAccounts } = useAccountsQueries();
  const { useGetClients } = useClientsQueries();

  const {
    data: allAccounts,
    isLoading: isLoadingAccounts,
    error: accountsError,
  } = useGetAccounts(searchTerm);
  const { data: clients, isLoading: isLoadingClients } = useGetClients();

  const accountsWithClients = useMemo(() => {
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

  return {
    accounts: accountsWithClients,
    isLoading: isLoadingAccounts || isLoadingClients,
    error: accountsError,
  };
};
