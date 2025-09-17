import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  render,
  screen,
  waitFor,
  fireEvent,
} from "../../test/utils/test-utils";
import { ClientsPage } from "./ClientsPage";
import { mockClientListItems } from "../../test/utils/mocks/clients/mockClients";

vi.mock("axios", () => ({
  default: {
    create: vi.fn(() => ({
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() },
      },
    })),
  },
}));

import apiClient from "../../hooks/services/apiClient";

const mockedApiClient = apiClient as any;

describe("ClientsPage (with axios mocking)", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockedApiClient.get = vi.fn().mockImplementation((url: string) => {
      if (url === "/clients") {
        return Promise.resolve({ data: mockClientListItems });
      }
      return Promise.reject(new Error(`Unmocked endpoint: ${url}`));
    });
  });

  it("renders page title and Nuevo Cliente button", async () => {
    render(<ClientsPage />);
    expect(screen.getByText("Clientes")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Nuevo Cliente" })
    ).toBeInTheDocument();
  });

  it("renders search input", () => {
    render(<ClientsPage />);
    expect(
      screen.getByPlaceholderText(
        "Buscar clientes por nombre, identificación o teléfono..."
      )
    ).toBeInTheDocument();
  });

  it("loads and displays client data from API", async () => {
    render(<ClientsPage />);

    await waitFor(() => {
      expect(mockedApiClient.get).toHaveBeenCalledWith("/clients");
    });

    await waitFor(() => {
      expect(screen.getAllByText("Juan Carlos Pérez").length).toBeGreaterThan(
        0
      );
    });

    const idElements = screen.getAllByText("1234567890");
    expect(idElements.length).toBeGreaterThan(0);

    expect(screen.getAllByText("0987654321").length).toBeGreaterThan(0);
  });

  it("handles loading state correctly", async () => {
    mockedApiClient.get = vi
      .fn()
      .mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(() => resolve({ data: mockClientListItems }), 100)
          )
      );

    render(<ClientsPage />);

    await waitFor(() => {
      expect(mockedApiClient.get).toHaveBeenCalledWith("/clients");
    });

    await waitFor(
      () => {
        expect(screen.getAllByText("Juan Carlos Pérez").length).toBeGreaterThan(
          0
        );
      },
      { timeout: 2000 }
    );
  });

  it("renders delete buttons for each client", async () => {
    render(<ClientsPage />);

    await waitFor(() => {
      expect(mockedApiClient.get).toHaveBeenCalledWith("/clients");
    });

    await waitFor(() => {
      const deleteButtons = screen.getAllByLabelText(/eliminar cliente/i);
      expect(deleteButtons.length).toBeGreaterThan(0);
    });
  });

  it("calls delete API when delete button is clicked", async () => {
    const originalConfirm = window.confirm;
    window.confirm = vi.fn(() => true);

    render(<ClientsPage />);

    await waitFor(() => {
      expect(mockedApiClient.get).toHaveBeenCalledWith("/clients");
    });

    await waitFor(() => {
      const deleteButtons = screen.getAllByLabelText(/eliminar cliente/i);
      expect(deleteButtons.length).toBeGreaterThan(0);
    });

    const firstDeleteButton = screen.getAllByLabelText(/eliminar cliente/i)[0];
    firstDeleteButton.click();

    await waitFor(() => {
      expect(mockedApiClient.delete).toHaveBeenCalledWith(
        `/clients/${mockClientListItems[0].id}`
      );
    });

    window.confirm = originalConfirm;
  });

  it("renders edit buttons for each client", async () => {
    render(<ClientsPage />);

    await waitFor(() => {
      expect(mockedApiClient.get).toHaveBeenCalledWith("/clients");
    });

    await waitFor(() => {
      const editButtons = screen.getAllByLabelText(/editar cliente/i);
      expect(editButtons.length).toBeGreaterThan(0);
    });
  });

  it("opens edit modal when edit button is clicked", async () => {
    render(<ClientsPage />);

    await waitFor(() => {
      expect(mockedApiClient.get).toHaveBeenCalledWith("/clients");
    });

    await waitFor(() => {
      const editButtons = screen.getAllByLabelText(/editar cliente/i);
      expect(editButtons.length).toBeGreaterThan(0);
    });

    const firstEditButton = screen.getAllByLabelText(/editar cliente/i)[0];
    fireEvent.click(firstEditButton);

    await waitFor(() => {
      expect(screen.getByText("Editar Cliente")).toBeInTheDocument();
    });
  });

  it("opens client modal when 'Nuevo Cliente' button is clicked", async () => {
    render(<ClientsPage />);

    await waitFor(() => {
      expect(mockedApiClient.get).toHaveBeenCalledWith("/clients");
    });

    const newClientButton = screen.getByRole("button", {
      name: "Nuevo Cliente",
    });
    fireEvent.click(newClientButton);

    await waitFor(() => {
      expect(screen.getByText("Información Personal")).toBeInTheDocument();
      expect(screen.getByText("Información de Cuenta")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /crear cliente/i })
      ).toBeInTheDocument();
    });
  });

  it("closes modal when cancel button is clicked", async () => {
    render(<ClientsPage />);

    await waitFor(() => {
      expect(mockedApiClient.get).toHaveBeenCalledWith("/clients");
    });

    // Open modal
    const newClientButton = screen.getByRole("button", {
      name: "Nuevo Cliente",
    });
    fireEvent.click(newClientButton);

    await waitFor(() => {
      expect(screen.getByText("Información Personal")).toBeInTheDocument();
    });

    // Close modal
    const cancelButton = screen.getByRole("button", { name: /cancelar/i });
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(
        screen.queryByText("Información Personal")
      ).not.toBeInTheDocument();
    });
  });
});
