import { useNavigate } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import type { TableColumn } from "../../components";
import { useClientsQueries } from "../../hooks";
import { useClientsStore } from "../../store";
import type { ClientListItem } from "../../types";

export const useClientsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { setSelectedClient, openModal, openEditModal } = useClientsStore();
  const { useGetClients, useDeleteClient } = useClientsQueries();

  const { data: clients, isLoading, error } = useGetClients(searchTerm);
  const deleteClientMutation = useDeleteClient();

  const handleSearch = useCallback((query: string) => {
    console.log("Searching for:", query);
    setSearchTerm(query);
  }, []);

  const handleRowClick = useCallback(
    (client: ClientListItem) => {
      console.log("Selected client:", client);
      setSelectedClient(client);
      navigate({ to: "/accounts" });
    },
    [setSelectedClient, navigate]
  );

  const handleDeleteClient = useCallback(
    (client: ClientListItem) => {
      if (
        window.confirm(
          `¿Está seguro de que desea eliminar al cliente ${client.person.name}?`
        )
      ) {
        deleteClientMutation.mutate(client.id);
      }
    },
    [deleteClientMutation]
  );

  const handleEditClient = useCallback(
    (client: ClientListItem) => {
      console.log("Editing client:", client);
      openEditModal(client);
    },
    [openEditModal]
  );

  const handleOpenModal = useCallback(() => {
    openModal();
  }, [openModal]);

  const handleClientCreated = useCallback(() => {
    console.log("Client created successfully");
  }, []);

  const tableColumns: TableColumn<ClientListItem>[] = [
    {
      key: "person.identification",
      title: "Identificación",
      align: "left",
      width: "20%",
      render: (_, record) => record.person.identification,
    },
    {
      key: "person.name",
      title: "Nombre",
      align: "left",
      width: "30%",
      render: (_, record) => record.person.name,
    },
    {
      key: "person.phone",
      title: "Teléfono",
      align: "center",
      width: "20%",
      render: (_, record) => record.person.phone,
    },
    {
      key: "state",
      title: "Estado",
      align: "center",
      width: "15%",
      render: (_, record) => (
        <span
          className={`status-badge status-badge--${record.state.toLowerCase()}`}
        >
          {record.state === "ACTIVE" ? "Activo" : "Inactivo"}
        </span>
      ),
    },
    {
      key: "createdAt",
      title: "Fecha de Registro",
      align: "center",
      width: "15%",
      render: (_, record) => {
        const date = new Date(record.createdAt);
        return date.toLocaleDateString("es-CO");
      },
    },
    {
      key: "actions",
      title: "Acciones",
      align: "center",
      width: "10%",
      render: (_, record) => (
        <div className="actions-container">
          <button
            className="edit-btn"
            type="button"
            aria-label={`Editar cliente ${record.person.name}`}
            onClick={(e) => {
              e.stopPropagation();
              handleEditClient(record);
            }}
            disabled={deleteClientMutation.isPending}
          >
            ✏️
          </button>
          <button
            className="delete-btn"
            type="button"
            aria-label={`Eliminar cliente ${record.person.name}`}
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteClient(record);
            }}
            disabled={deleteClientMutation.isPending}
          >
            {deleteClientMutation.isPending ? "..." : "🗑️"}
          </button>
        </div>
      ),
    },
  ];

  return {
    tableColumns,
    clients,
    isLoading,
    error,
    handleSearch,
    handleRowClick,
    handleDeleteClient,
    handleEditClient,
    isDeleting: deleteClientMutation.isPending,
    handleOpenModal,
    handleClientCreated,
  };
};
