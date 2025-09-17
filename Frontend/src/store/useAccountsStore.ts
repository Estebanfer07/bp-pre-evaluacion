import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { AccountListItem } from "../types";

interface AccountsState {
  selectedAccount: AccountListItem | null;
  selectedAccountForEdit: AccountListItem | null;
  isModalOpen: boolean;
  setSelectedAccount: (account: AccountListItem | null) => void;
  setSelectedAccountForEdit: (account: AccountListItem | null) => void;
  openModal: () => void;
  openEditModal: (account: AccountListItem) => void;
  closeModal: () => void;
  clearSelectedAccount: () => void;
}

export type { AccountsState };

export const useAccountsStore = create<AccountsState>()(
  devtools(
    persist(
      (set) => ({
        selectedAccount: null,
        selectedAccountForEdit: null,
        isModalOpen: false,

        setSelectedAccount: (account: AccountListItem | null) => {
          set({ selectedAccount: account }, false, "setSelectedAccount");
        },

        setSelectedAccountForEdit: (account: AccountListItem | null) => {
          set(
            { selectedAccountForEdit: account },
            false,
            "setSelectedAccountForEdit"
          );
        },

        openModal: () => {
          set(
            { isModalOpen: true, selectedAccountForEdit: null },
            false,
            "openModal"
          );
        },

        openEditModal: (account: AccountListItem) => {
          set(
            { isModalOpen: true, selectedAccountForEdit: account },
            false,
            "openEditModal"
          );
        },

        closeModal: () => {
          set(
            { isModalOpen: false, selectedAccountForEdit: null },
            false,
            "closeModal"
          );
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
