import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "../../test/utils/test-utils";
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

  it("renders page title and Nuevo button", async () => {
    render(<ClientsPage />);
    expect(screen.getByText("Clientes")).toBeInTheDocument();
    expect(screen.getByText("Nuevo")).toBeInTheDocument();
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
});
