import { useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAccountsStore, useClientsStore } from "../store";
import type { AccountListItem } from "../types/accounts";

export const useAccountSelection = () => {
  const navigate = useNavigate();
  const { setSelectedAccount } = useAccountsStore();
  const { clearSelectedClient } = useClientsStore();

  const handleAccountSelection = useCallback(
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

  return {
    handleAccountSelection,
    handleClearClientFilter,
  };
};
