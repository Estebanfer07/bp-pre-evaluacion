import React from "react";
import { Button, SearchInput, Table } from "../../components";
import "../pages.scss";
import "./ClientsPage.scss";
import { useClientsPage } from "./useClientsPage";

export const ClientsPage: React.FC = () => {
  const {
    tableColumns,
    clients,
    isLoading,
    error,
    handleSearch,
    handleRowClick,
  } = useClientsPage();

  if (error) {
    return (
      <div className="page">
        <div className="page__header">
          <h1>Clientes</h1>
        </div>
        <div className="page__content">
          <div className="error-message">
            Error al cargar los clientes. Por favor, intenta nuevamente.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page__header">
        <h1>Clientes</h1>
        <Button variant="primary">Nuevo</Button>
      </div>
      <div className="page__content">
        <div className="search-section">
          <SearchInput
            placeholder="Buscar clientes por nombre, identificación o teléfono..."
            onSearch={handleSearch}
            debounceDelay={300}
          />
        </div>
        <div className="clients-list">
          <Table
            columns={tableColumns}
            data={clients || []}
            onRowClick={handleRowClick}
            loading={isLoading}
            emptyMessage="No se encontraron clientes"
            className="clients-table"
          />
        </div>
      </div>
    </div>
  );
};
