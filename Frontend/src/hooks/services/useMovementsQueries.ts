import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import apiClient from "./apiClient";
import type {
  Movement,
  MovementListItem,
  CreateMovement,
  UpdateMovement,
} from "../../types/movements";

export const useMovementsQueries = () => {
  const queryClient = useQueryClient();

  const handleError = (error: AxiosError, operation: string) => {
    console.error(`Error ${operation}:`, error);
    const message =
      (error.response?.data as any)?.message ||
      error.message ||
      `Failed to ${operation}`;
    alert(`Error: ${message}`);
  };

  const useGetMovements = (
    search?: string,
    accountId?: string,
    startDate?: string,
    endDate?: string
  ) => {
    return useQuery({
      queryKey: ["movements", accountId, startDate, endDate],
      queryFn: async (): Promise<MovementListItem[]> => {
        try {
          const params: any = {};
          if (accountId) params.accountId = accountId;
          if (startDate) params.startDate = startDate;
          if (endDate) params.endDate = endDate;

          const response = await apiClient.get<MovementListItem[]>(
            "/movements",
            { params }
          );
          return response.data;
        } catch (error) {
          handleError(error as AxiosError, "fetch movements");
          throw error;
        }
      },
      select: (data) => {
        if (!search || search.trim() === "") {
          return data;
        }

        const searchLower = search.toLowerCase();
        return data.filter(
          (movement) =>
            movement.accountNumber?.includes(search) ||
            movement.clientName?.toLowerCase().includes(searchLower) ||
            movement.movementType.toLowerCase().includes(searchLower) ||
            movement.amount.toString().includes(search)
        );
      },
      staleTime: 1000 * 60 * 2,
    });
  };

  const useGetMovement = (id: string) => {
    return useQuery({
      queryKey: ["movements", id],
      queryFn: async (): Promise<Movement> => {
        try {
          const response = await apiClient.get<Movement>(`/movements/${id}`);
          return response.data;
        } catch (error) {
          handleError(error as AxiosError, "fetch movement");
          throw error;
        }
      },
      enabled: !!id,
      staleTime: 1000 * 60 * 5,
    });
  };

  const useGetMovementsByAccount = (accountId: string) => {
    return useQuery({
      queryKey: ["movements", "account", accountId],
      queryFn: async (): Promise<MovementListItem[]> => {
        try {
          const response = await apiClient.get<MovementListItem[]>(
            "/movements",
            {
              params: { accountId },
            }
          );
          return response.data;
        } catch (error) {
          handleError(error as AxiosError, "fetch account movements");
          throw error;
        }
      },
      enabled: !!accountId,
      staleTime: 1000 * 60 * 2,
    });
  };

  const useGetMovementsByDateRange = (startDate: string, endDate: string) => {
    return useQuery({
      queryKey: ["movements", "dateRange", startDate, endDate],
      queryFn: async (): Promise<MovementListItem[]> => {
        try {
          const response = await apiClient.get<MovementListItem[]>(
            "/movements",
            {
              params: { startDate, endDate },
            }
          );
          return response.data;
        } catch (error) {
          handleError(error as AxiosError, "fetch movements by date range");
          throw error;
        }
      },
      enabled: !!startDate && !!endDate,
      staleTime: 1000 * 60 * 5,
    });
  };

  const useCreateMovement = () => {
    return useMutation({
      mutationFn: async (movementData: CreateMovement): Promise<Movement> => {
        try {
          const response = await apiClient.post<Movement>(
            "/movements",
            movementData
          );
          return response.data;
        } catch (error) {
          handleError(error as AxiosError, "create movement");
          throw error;
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["movements"] });
        queryClient.invalidateQueries({ queryKey: ["accounts"] });
        alert("Movement created successfully!");
      },
    });
  };

  const useUpdateMovement = () => {
    return useMutation({
      mutationFn: async ({
        id,
        data,
      }: {
        id: string;
        data: UpdateMovement;
      }): Promise<Movement> => {
        try {
          const response = await apiClient.put<Movement>(
            `/movements/${id}`,
            data
          );
          return response.data;
        } catch (error) {
          handleError(error as AxiosError, "update movement");
          throw error;
        }
      },
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ["movements"] });
        queryClient.invalidateQueries({
          queryKey: ["movements", variables.id],
        });
        queryClient.invalidateQueries({ queryKey: ["accounts"] });
        alert("Movement updated successfully!");
      },
    });
  };

  const useDeleteMovement = () => {
    return useMutation({
      mutationFn: async (id: string): Promise<void> => {
        try {
          await apiClient.delete(`/movements/${id}`);
        } catch (error) {
          handleError(error as AxiosError, "delete movement");
          throw error;
        }
      },
      onSuccess: (_, id) => {
        queryClient.invalidateQueries({ queryKey: ["movements"] });
        queryClient.removeQueries({ queryKey: ["movements", id] });
        queryClient.invalidateQueries({ queryKey: ["accounts"] });
        alert("Movement deleted successfully!");
      },
    });
  };

  const useGenerateMovementReport = () => {
    return useMutation({
      mutationFn: async (reportData: {
        format: "PDF" | "EXCEL";
        startDate?: string;
        endDate?: string;
        accountId?: string;
      }) => {
        try {
          const response = await apiClient.post(
            "/reports/movements",
            reportData
          );
          return response.data;
        } catch (error) {
          handleError(error as AxiosError, "generate movement report");
          throw error;
        }
      },
      onSuccess: () => {
        alert("Report generated successfully!");
      },
    });
  };

  return {
    useGetMovements,
    useGetMovement,
    useGetMovementsByAccount,
    useGetMovementsByDateRange,
    useCreateMovement,
    useUpdateMovement,
    useDeleteMovement,
    useGenerateMovementReport,
  };
};
