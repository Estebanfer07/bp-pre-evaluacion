import React from "react";
import { Button, SearchInput, Table } from "../../components";
import { useAccountsPage } from "./useAccountsPage";
import "../pages.scss";

export const AccountsPage: React.FC = () => {
  const {
    tableColumns,
    accounts,
    isLoading,
    error,
    handleSearch,
    handleRowClick,
    selectedClient,
    handleClearClientFilter,
  } = useAccountsPage();

  return (
    <div className="page">
      <div className="page__header">
        <h1>Cuentas</h1>
        <Button variant="primary">Nueva</Button>
      </div>

      {selectedClient && (
        <div className="page__filter-info">
          <div className="filter-info">
            <span className="filter-info__text">
              Mostrando cuentas de:{" "}
              <strong>{selectedClient.person.name}</strong>
            </span>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleClearClientFilter}
            >
              Ver todas las cuentas
            </Button>
          </div>
        </div>
      )}

      <div className="page__content">
        <div className="page__search">
          <SearchInput
            placeholder="Buscar cuentas por número, cliente o tipo..."
            onSearch={handleSearch}
          />
        </div>

        <div className="page__table">
          {error ? (
            <div className="error-message">
              Error al cargar las cuentas. Por favor, intenta nuevamente.
            </div>
          ) : (
            <Table
              columns={tableColumns}
              data={accounts}
              loading={isLoading}
              onRowClick={handleRowClick}
              emptyMessage={
                selectedClient
                  ? `No se encontraron cuentas para ${selectedClient.person.name}`
                  : "No se encontraron cuentas"
              }
            />
          )}
        </div>
      </div>
    </div>
  );
};
