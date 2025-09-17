import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import apiClient from "./apiClient";
import type {
  Account,
  AccountListItem,
  CreateAccount,
  UpdateAccount,
} from "../../types/accounts";

export const useAccountsQueries = () => {
  const queryClient = useQueryClient();

  const handleError = (error: AxiosError, operation: string) => {
    console.error(`Error ${operation}:`, error);
    const message =
      (error.response?.data as any)?.message ||
      error.message ||
      `Failed to ${operation}`;
    alert(`Error: ${message}`);
  };

  const useGetAccounts = (search?: string, clientId?: string) => {
    return useQuery({
      queryKey: ["accounts", clientId],
      queryFn: async (): Promise<AccountListItem[]> => {
        try {
          const params: any = {};
          if (clientId) params.clientId = clientId;

          const response = await apiClient.get<AccountListItem[]>("/accounts", {
            params,
          });
          return response.data;
        } catch (error) {
          handleError(error as AxiosError, "fetch accounts");
          throw error;
        }
      },
      select: (data) => {
        if (!search || search.trim() === "") {
          return data;
        }

        const searchLower = search.toLowerCase();
        return data.filter(
          (account) =>
            account.accountNumber.includes(search) ||
            account.clientName?.toLowerCase().includes(searchLower) ||
            account.type.toLowerCase().includes(searchLower)
        );
      },
      staleTime: 1000 * 60 * 5,
    });
  };

  const useGetAccount = (id: string) => {
    return useQuery({
      queryKey: ["accounts", id],
      queryFn: async (): Promise<Account> => {
        try {
          const response = await apiClient.get<Account>(`/accounts/${id}`);
          return response.data;
        } catch (error) {
          handleError(error as AxiosError, "fetch account");
          throw error;
        }
      },
      enabled: !!id,
      staleTime: 1000 * 60 * 5,
    });
  };

  const useGetAccountsByClient = (clientId: string) => {
    return useQuery({
      queryKey: ["accounts", "client", clientId],
      queryFn: async (): Promise<AccountListItem[]> => {
        try {
          const response = await apiClient.get<AccountListItem[]>("/accounts", {
            params: { clientId },
          });
          return response.data;
        } catch (error) {
          handleError(error as AxiosError, "fetch client accounts");
          throw error;
        }
      },
      enabled: !!clientId,
      staleTime: 1000 * 60 * 5,
    });
  };

  const useCreateAccount = () => {
    return useMutation({
      mutationFn: async (accountData: CreateAccount): Promise<Account> => {
        try {
          const response = await apiClient.post<Account>(
            "/accounts",
            accountData
          );
          return response.data;
        } catch (error) {
          handleError(error as AxiosError, "create account");
          throw error;
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["accounts"] });
        alert("Account created successfully!");
      },
    });
  };

  const useUpdateAccount = () => {
    return useMutation({
      mutationFn: async ({
        id,
        data,
      }: {
        id: string;
        data: UpdateAccount;
      }): Promise<Account> => {
        try {
          const response = await apiClient.patch<Account>(
            `/accounts/${id}`,
            data
          );
          return response.data;
        } catch (error) {
          handleError(error as AxiosError, "update account");
          throw error;
        }
      },
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ["accounts"] });
        queryClient.invalidateQueries({ queryKey: ["accounts", variables.id] });
        alert("Account updated successfully!");
      },
    });
  };

  const useDeleteAccount = () => {
    return useMutation({
      mutationFn: async (id: string): Promise<void> => {
        try {
          await apiClient.delete(`/accounts/${id}`);
        } catch (error) {
          handleError(error as AxiosError, "delete account");
          throw error;
        }
      },
      onSuccess: (_, id) => {
        queryClient.invalidateQueries({ queryKey: ["accounts"] });
        queryClient.removeQueries({ queryKey: ["accounts", id] });
        alert("Account deleted successfully!");
      },
    });
  };

  return {
    useGetAccounts,
    useGetAccount,
    useGetAccountsByClient,
    useCreateAccount,
    useUpdateAccount,
    useDeleteAccount,
  };
};
