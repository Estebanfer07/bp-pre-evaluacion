import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { ClientsPage } from "./ClientsPage";

// Use a variable to control the mock return value
let mockReturn: any;

vi.mock("./useClientsPage", () => ({
  useClientsPage: () => mockReturn,
}));

describe("ClientsPage", () => {
  beforeEach(() => {
    mockReturn = {
      tableColumns: [
        { key: "name", title: "Nombre" },
        { key: "id", title: "ID" },
      ],
      clients: [
        { id: 1, name: "Juan" },
        { id: 2, name: "Ana" },
      ],
      isLoading: false,
      error: null,
      handleSearch: vi.fn(),
      handleRowClick: vi.fn(),
    };
  });

  it("renders page title and Nuevo button", () => {
    render(<ClientsPage />);
    expect(screen.getByText("Clientes")).toBeInTheDocument();
    expect(screen.getByText("Nuevo")).toBeInTheDocument();
  });

  it("renders table with client data", () => {
    render(<ClientsPage />);
    expect(screen.getByText("Juan")).toBeInTheDocument();
    expect(screen.getByText("Ana")).toBeInTheDocument();
  });

  it("renders search input", () => {
    render(<ClientsPage />);
    expect(
      screen.getByPlaceholderText(
        "Buscar clientes por nombre, identificación o teléfono..."
      )
    ).toBeInTheDocument();
  });

  it("shows error message when error is present", () => {
    mockReturn = {
      tableColumns: [],
      clients: [],
      isLoading: false,
      error: true,
      handleSearch: vi.fn(),
      handleRowClick: vi.fn(),
    };
    render(<ClientsPage />);
    expect(
      screen.getByText(
        "Error al cargar los clientes. Por favor, intenta nuevamente."
      )
    ).toBeInTheDocument();
  });
});
