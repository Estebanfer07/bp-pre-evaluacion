import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import apiClient from "./apiClient";
import type {
  Movement,
  MovementListItem,
  CreateMovement,
  JsonReportResponse,
  PdfReportResponse,
  MovementReportItem,
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
          const accountParam = accountId || "all";
          const params: any = {
            format: "JSON",
          };

          if (startDate) params.from = startDate;
          if (endDate) params.to = endDate;

          const response = await apiClient.get<JsonReportResponse>(
            `/movements/account/${encodeURIComponent(accountParam)}/report`,
            { params }
          );

          return response.data.jsonReport.map(
            (item: MovementReportItem): MovementListItem => ({
              id: item.id,
              accountId: item.accountNumber,
              accountNumber: item.accountNumber,
              clientName: item.clientName,
              date: item.date,
              movementType: item.type,
              amount: item.amount,
              balance: item.balance,
              isReversed: false,
              createdAt: item.date,
            })
          );
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

  const useReverseMovement = () => {
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
        alert("Movement reversed successfully!");
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
          const accountParam = reportData.accountId || "all";
          const params: any = {
            format: reportData.format,
          };

          if (reportData.startDate) params.from = reportData.startDate;
          if (reportData.endDate) params.to = reportData.endDate;

          if (reportData.format === "PDF") {
            const response = await apiClient.get<PdfReportResponse>(
              `/movements/account/${encodeURIComponent(accountParam)}/report`,
              { params }
            );
            return response.data.pdfReport;
          } else {
            const response = await apiClient.get<{ excelReport: string }>(
              `/movements/account/${encodeURIComponent(accountParam)}/report`,
              { params }
            );
            return response.data.excelReport;
          }
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
    useCreateMovement,
    useReverseMovement,
    useGenerateMovementReport,
  };
};
