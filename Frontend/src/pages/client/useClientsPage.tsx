import { useNavigate } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import type { TableColumn } from "../../components";
import { useClientsQueries } from "../../hooks";
import { useClientsStore } from "../../store";
import type { ClientListItem } from "../../types";

export const useClientsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { setSelectedClient } = useClientsStore();
  const { useGetClients } = useClientsQueries();

  const { data: clients, isLoading, error } = useGetClients(searchTerm);

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
  ];

  return {
    tableColumns,
    clients,
    isLoading,
    error,
    handleSearch,
    handleRowClick,
  };
};
