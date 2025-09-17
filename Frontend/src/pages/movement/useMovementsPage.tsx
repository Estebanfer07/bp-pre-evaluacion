import { useMemo, useCallback, useState } from "react";
import { useMovementsQueries } from "../../hooks/services";
import { useAccountsStore } from "../../store";
import type { MovementListItem } from "../../types";

// Define ColumnDefinition locally since it's not exported from Table
interface ColumnDefinition<T> {
  key: string;
  title: string;
  align?: "left" | "center" | "right";
  width?: string;
  render?: (value: any, record: T) => React.ReactNode;
}

export const useMovementsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { selectedAccount, clearSelectedAccount } = useAccountsStore();
  const { useGetMovements, useGenerateMovementReport } = useMovementsQueries();

  // Fetch all movements, optionally filtered by selected account
  const {
    data: allMovements,
    isLoading,
    error,
  } = useGetMovements(
    undefined, // search
    selectedAccount?.id // accountId
  );

  const movements = allMovements || [];

  // PDF report generation
  const generateReportMutation = useGenerateMovementReport();

  const handleGeneratePdfReport = useCallback(async () => {
    try {
      const reportData = await generateReportMutation.mutateAsync({
        format: "PDF",
        accountId: selectedAccount?.id,
        // You can add date range here if needed
        // startDate: "2025-09-01",
        // endDate: "2025-09-15",
      });

      // Create blob from base64 PDF data
      const byteCharacters = atob(reportData as string);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/pdf" });

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `movimientos-${selectedAccount?.accountNumber || "todos"}-${new Date().toISOString().split("T")[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating PDF report:", error);
    }
  }, [generateReportMutation, selectedAccount]);

  const handleSearch = useCallback((query: string) => {
    setSearchTerm(query);
  }, []);

  const handleRowClick = useCallback((movement: MovementListItem) => {
    console.log("Movement clicked:", movement);
  }, []);

  const handleClearAccountFilter = useCallback(() => {
    clearSelectedAccount();
  }, [clearSelectedAccount]);

  // Filter movements based on search term
  const filteredMovements = useMemo(() => {
    if (!searchTerm) return movements;

    const searchLower = searchTerm.toLowerCase();
    return movements.filter((movement) => {
      const typeLabel =
        movement.movementType === "DEPOSIT"
          ? "depósito"
          : movement.movementType === "WITHDRAWAL"
            ? "retiro"
            : "transferencia";

      return (
        movement.accountNumber?.toLowerCase().includes(searchLower) ||
        movement.clientName?.toLowerCase().includes(searchLower) ||
        typeLabel.includes(searchLower) ||
        movement.amount.toString().includes(searchTerm)
      );
    });
  }, [movements, searchTerm]);

  // Table columns definition
  const tableColumns: ColumnDefinition<MovementListItem>[] = useMemo(
    () => [
      {
        key: "date",
        title: "Fecha",
        align: "left",
        width: "15%",
        render: (_, record) => {
          const date = new Date(record.date);
          return date.toLocaleDateString("es-CO", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          });
        },
      },
      {
        key: "movementType",
        title: "Tipo",
        align: "center",
        width: "15%",
        render: (_, record) => {
          const typeMap = {
            DEPOSIT: { label: "Depósito", class: "movement-type deposit" },
            WITHDRAWAL: { label: "Retiro", class: "movement-type withdrawal" },
            TRANSFER: {
              label: "Transferencia",
              class: "movement-type transfer",
            },
          };
          const type = typeMap[record.movementType] || {
            label: record.movementType,
            class: "movement-type",
          };
          return <span className={type.class}>{type.label}</span>;
        },
      },
      {
        key: "description",
        title: "Descripción",
        align: "left",
        width: "25%",
        render: (_, record) => {
          // Generate description based on movement type since there's no description field
          const typeLabel =
            record.movementType === "DEPOSIT"
              ? "Depósito"
              : record.movementType === "WITHDRAWAL"
                ? "Retiro"
                : "Transferencia";
          return `${typeLabel} - ${record.accountNumber || record.accountId}`;
        },
      },
      {
        key: "amount",
        title: "Monto",
        align: "right",
        width: "15%",
        render: (_, record) => (
          <span className={`amount ${record.movementType.toLowerCase()}`}>
            $
            {record.amount.toLocaleString("es-CO", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        ),
      },
      {
        key: "balance",
        title: "Saldo Resultante",
        align: "right",
        width: "15%",
        render: (_, record) => (
          <span className={`balance ${record.balance < 0 ? "negative" : ""}`}>
            $
            {record.balance.toLocaleString("es-CO", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        ),
      },
      {
        key: "accountNumber",
        title: "Cuenta",
        align: "center",
        width: "15%",
        render: (_, record) => record.accountNumber || record.accountId,
      },
    ],
    []
  );

  return {
    tableColumns,
    filteredMovements,
    isLoading,
    error,
    handleSearch,
    handleRowClick,
    handleClearAccountFilter,
    handleGeneratePdfReport,
    isGeneratingReport: generateReportMutation.isPending,
    searchQuery: searchTerm,
  };
};
