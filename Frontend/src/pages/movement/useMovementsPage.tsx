import { useMemo, useCallback, useState } from "react";
import { useMovementsQueries } from "../../hooks/services";
import { useAccountsStore } from "../../store";
import {
  downloadPdfFromBase64,
  generateMovementReportFilename,
} from "../../utils";
import type { MovementListItem } from "../../types";

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

  const {
    data: allMovements,
    isLoading,
    error,
  } = useGetMovements(undefined, selectedAccount?.id);

  const movements = allMovements || [];

  const generateReportMutation = useGenerateMovementReport();

  const handleGeneratePdfReport = useCallback(async () => {
    try {
      const reportData = await generateReportMutation.mutateAsync({
        format: "PDF",
        accountId: selectedAccount?.id,
      });

      const filename = generateMovementReportFilename(
        selectedAccount?.accountNumber,
        "PDF"
      );
      downloadPdfFromBase64(reportData as string, filename);
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
