import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { AccountListItem } from "../types";

interface AccountsState {
  selectedAccount: AccountListItem | null;
  setSelectedAccount: (account: AccountListItem | null) => void;
  clearSelectedAccount: () => void;
}

export type { AccountsState };

export const useAccountsStore = create<AccountsState>()(
  devtools(
    persist(
      (set) => ({
        selectedAccount: null,

        setSelectedAccount: (account: AccountListItem | null) => {
          set({ selectedAccount: account }, false, "setSelectedAccount");
        },

        clearSelectedAccount: () => {
          set({ selectedAccount: null }, false, "clearSelectedAccount");
        },
      }),
      {
        name: "accounts-storage",
        partialize: (state) => ({
          selectedAccount: state.selectedAccount,
        }),
      }
    ),
    {
      name: "accounts-store",
    }
  )
);
