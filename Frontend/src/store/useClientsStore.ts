import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { ClientListItem } from "../types";

interface ClientsState {
  selectedClient: ClientListItem | null;
  setSelectedClient: (client: ClientListItem | null) => void;
  clearSelectedClient: () => void;
}

export type { ClientsState };

export const useClientsStore = create<ClientsState>()(
  devtools(
    persist(
      (set) => ({
        selectedClient: null,

        setSelectedClient: (client: ClientListItem | null) => {
          set({ selectedClient: client }, false, "setSelectedClient");
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
