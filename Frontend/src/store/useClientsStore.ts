import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { ClientListItem } from "../types";

interface ClientsState {
  selectedClient: ClientListItem | null;
  selectedClientForEdit: ClientListItem | null;
  isModalOpen: boolean;
  setSelectedClient: (client: ClientListItem | null) => void;
  setSelectedClientForEdit: (client: ClientListItem | null) => void;
  openModal: () => void;
  openEditModal: (client: ClientListItem) => void;
  closeModal: () => void;
  clearSelectedClient: () => void;
}

export type { ClientsState };

export const useClientsStore = create<ClientsState>()(
  devtools(
    persist(
      (set) => ({
        selectedClient: null,
        selectedClientForEdit: null,
        isModalOpen: false,

        setSelectedClient: (client: ClientListItem | null) => {
          set({ selectedClient: client }, false, "setSelectedClient");
        },

        setSelectedClientForEdit: (client: ClientListItem | null) => {
          set(
            { selectedClientForEdit: client },
            false,
            "setSelectedClientForEdit"
          );
        },

        openModal: () => {
          set(
            { isModalOpen: true, selectedClientForEdit: null },
            false,
            "openModal"
          );
        },

        openEditModal: (client: ClientListItem) => {
          set(
            { isModalOpen: true, selectedClientForEdit: client },
            false,
            "openEditModal"
          );
        },

        closeModal: () => {
          set(
            { isModalOpen: false, selectedClientForEdit: null },
            false,
            "closeModal"
          );
        },

        clearSelectedClient: () => {
          set({ selectedClient: null }, false, "clearSelectedClient");
        },
      }),
      {
        name: "clients-storage",
        partialize: (state) => ({
          selectedClient: state.selectedClient,
        }),
      }
    ),
    {
      name: "clients-store",
    }
  )
);
