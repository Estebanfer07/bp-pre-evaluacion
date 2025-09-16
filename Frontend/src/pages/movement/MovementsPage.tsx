import React from "react";
import { Table } from "../../components";
import { useMovementsPage } from "./useMovementsPage";
import { useAccountsStore } from "../../store";
import "../pages.scss";

export const MovementsPage: React.FC = () => {
  const {
    tableColumns,
    filteredMovements,
    isLoading,
    error,
    handleSearch,
    handleRowClick,
    handleClearAccountFilter,
    searchQuery,
  } = useMovementsPage();

  const { selectedAccount } = useAccountsStore();

  if (error) {
    return (
      <div className="page">
        <div className="page__header">
          <h1>Movimientos</h1>
        </div>
        <div className="page__content">
          <div className="error-message">
            <p>Error al cargar los movimientos: {error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page__header">
        <h1>Movimientos</h1>
        {selectedAccount && (
          <div className="account-filter">
            <p>
              Mostrando movimientos para la cuenta:{" "}
              <strong>{selectedAccount.accountNumber}</strong>
              {selectedAccount.clientName && ` - ${selectedAccount.clientName}`}
              <button
                onClick={handleClearAccountFilter}
                className="clear-filter-btn"
                type="button"
              >
                Mostrar todos
              </button>
            </p>
          </div>
        )}
      </div>
      <div className="page__content">
        <div className="search-section">
          <input
            type="text"
            placeholder="Buscar movimientos..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="search-input"
          />
        </div>
        <Table
          columns={tableColumns}
          data={filteredMovements}
          loading={isLoading}
          onRowClick={handleRowClick}
        />
      </div>
    </div>
  );
};
