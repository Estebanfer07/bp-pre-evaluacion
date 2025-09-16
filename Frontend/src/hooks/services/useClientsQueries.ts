import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import apiClient from "./apiClient";
import type {
  ClientResponse,
  ClientListItem,
  CreateClientWithPerson,
  UpdateClientWithPerson,
} from "../../types/clients";

export const useClientsQueries = () => {
  const queryClient = useQueryClient();

  const handleError = (error: AxiosError, operation: string) => {
    console.error(`Error ${operation}:`, error);
    const message =
      (error.response?.data as any)?.message ||
      error.message ||
      `Failed to ${operation}`;
    alert(`Error: ${message}`);
  };

  const useGetClients = (search?: string) => {
    return useQuery({
      queryKey: ["clients"],
      queryFn: async (): Promise<ClientListItem[]> => {
        try {
          const response = await apiClient.get<ClientListItem[]>("/clients");
          return response.data;
        } catch (error) {
          handleError(error as AxiosError, "fetch clients");
          throw error;
        }
      },
      select: (data) => {
        if (!search || search.trim() === "") {
          return data;
        }

        const searchLower = search.toLowerCase();
        return data.filter(
          (client) =>
            client.person.name.toLowerCase().includes(searchLower) ||
            client.person.identification.includes(search) ||
            client.person.phone.includes(search)
        );
      },
      staleTime: 1000 * 60 * 5,
    });
  };

  const useGetClient = (id: string) => {
    return useQuery({
      queryKey: ["clients", id],
      queryFn: async (): Promise<ClientResponse> => {
        try {
          const response = await apiClient.get<ClientResponse>(
            `/clients/${id}`
          );
          return response.data;
        } catch (error) {
          handleError(error as AxiosError, "fetch client");
          throw error;
        }
      },
      enabled: !!id,
      staleTime: 1000 * 60 * 5,
    });
  };

  const useCreateClient = () => {
    return useMutation({
      mutationFn: async (
        clientData: CreateClientWithPerson
      ): Promise<ClientResponse> => {
        try {
          const response = await apiClient.post<ClientResponse>(
            "/clients",
            clientData
          );
          return response.data;
        } catch (error) {
          handleError(error as AxiosError, "create client");
          throw error;
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["clients"] });
        alert("Client created successfully!");
      },
    });
  };

  const useUpdateClient = () => {
    return useMutation({
      mutationFn: async ({
        id,
        data,
      }: {
        id: string;
        data: UpdateClientWithPerson;
      }): Promise<ClientResponse> => {
        try {
          const response = await apiClient.put<ClientResponse>(
            `/clients/${id}`,
            data
          );
          return response.data;
        } catch (error) {
          handleError(error as AxiosError, "update client");
          throw error;
        }
      },
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ["clients"] });
        queryClient.invalidateQueries({ queryKey: ["clients", variables.id] });
        alert("Client updated successfully!");
      },
    });
  };

  const useDeleteClient = () => {
    return useMutation({
      mutationFn: async (id: string): Promise<void> => {
        try {
          await apiClient.delete(`/clients/${id}`);
        } catch (error) {
          handleError(error as AxiosError, "delete client");
          throw error;
        }
      },
      onSuccess: (_, id) => {
        queryClient.invalidateQueries({ queryKey: ["clients"] });
        queryClient.removeQueries({ queryKey: ["clients", id] });
        alert("Client deleted successfully!");
      },
    });
  };

  return {
    useGetClients,
    useGetClient,
    useCreateClient,
    useUpdateClient,
    useDeleteClient,
  };
};
