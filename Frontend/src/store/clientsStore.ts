import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { Client } from "./types";

interface ClientsState {
  clients: Client[];
  selectedClient: Client | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setClients: (clients: Client[]) => void;
  addClient: (client: Client) => void;
  updateClient: (id: string, updates: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  setSelectedClient: (client: Client | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useClientsStore = create<ClientsState>()(
  devtools(
    (set) => ({
      // State
      clients: [],
      selectedClient: null,
      isLoading: false,
      error: null,

      // Actions
      setClients: (clients) => set({ clients }, false, "setClients"),

      addClient: (client) =>
        set(
          (state) => ({
            clients: [...state.clients, client],
          }),
          false,
          "addClient"
        ),

      updateClient: (id, updates) =>
        set(
          (state) => ({
            clients: state.clients.map((client) =>
              client.id === id ? { ...client, ...updates } : client
            ),
          }),
          false,
          "updateClient"
        ),

      deleteClient: (id) =>
        set(
          (state) => ({
            clients: state.clients.filter((client) => client.id !== id),
            selectedClient:
              state.selectedClient?.id === id ? null : state.selectedClient,
          }),
          false,
          "deleteClient"
        ),

      setSelectedClient: (client) =>
        set({ selectedClient: client }, false, "setSelectedClient"),

      setLoading: (loading) => set({ isLoading: loading }, false, "setLoading"),

      setError: (error) => set({ error }, false, "setError"),

      clearError: () => set({ error: null }, false, "clearError"),
    }),
    {
      name: "clients-store",
    }
  )
);
