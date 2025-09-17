import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "../../test/utils/test-utils";
import { AccountsPage } from "./AccountsPage";
import { mockAccountListItems } from "../../test/utils/mocks/accounts/mockAccounts";

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

// Mock the clients store
vi.mock("../store/useClientsStore", () => ({
  useClientsStore: vi.fn(() => ({
    selectedClient: null,
    setSelectedClient: vi.fn(),
    clearSelectedClient: vi.fn(),
  })),
}));

import apiClient from "../../hooks/services/apiClient";
import { ACCOUNT_TYPE_LABELS } from "../../types";

const mockedApiClient = apiClient as any;

describe("AccountsPage (with axios mocking)", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockedApiClient.get = vi
      .fn()
      .mockImplementation((url: string, _config?: any) => {
        if (url === "/accounts") {
          return Promise.resolve({ data: mockAccountListItems });
        }
        if (url === "/clients") {
          return Promise.resolve({ data: [] });
        }
        return Promise.reject(new Error(`Unmocked endpoint: ${url}`));
      });
  });

  it("renders page title and Nueva button", async () => {
    render(<AccountsPage />);
    expect(screen.getAllByText("Cuentas").length).toBeGreaterThan(0);
    expect(screen.getByText("Nueva Cuenta")).toBeInTheDocument();
  });

  it("renders search input", () => {
    render(<AccountsPage />);
    expect(
      screen.getByPlaceholderText(
        "Buscar cuentas por número, cliente o tipo..."
      )
    ).toBeInTheDocument();
  });

  it("loads and displays account data from API", async () => {
    render(<AccountsPage />);

    const mockItem = mockAccountListItems[0];

    await waitFor(() => {
      expect(mockedApiClient.get).toHaveBeenCalledWith("/accounts", {
        params: {},
      });
    });

    await waitFor(() => {
      expect(
        screen.getAllByText(mockItem.accountNumber).length
      ).toBeGreaterThan(0);
      expect(
        screen.getAllByText(mockItem.clientName ?? "").length
      ).toBeGreaterThan(0);
    });

    expect(
      screen.getAllByText(ACCOUNT_TYPE_LABELS[mockItem.type]).length
    ).toBeGreaterThan(0);

    await waitFor(() => {
      expect(
        screen.getAllByText(
          `$${mockItem.balance.toLocaleString("es-EC", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`
        ).length
      ).toBeGreaterThan(0);
    });
  });

  it("shows all accounts when no client is selected", async () => {
    render(<AccountsPage />);

    await waitFor(() => {
      expect(mockedApiClient.get).toHaveBeenCalledWith("/accounts", {
        params: {},
      });
    });

    await waitFor(() => {
      expect(screen.getAllByText("Juan Carlos Pérez").length).toBeGreaterThan(
        0
      );
      expect(screen.getAllByText("María Elena García").length).toBeGreaterThan(
        0
      );
      expect(
        screen.getAllByText("Carlos Eduardo Mendoza").length
      ).toBeGreaterThan(0);
    });

    expect(screen.queryByText("Mostrando cuentas de:")).not.toBeInTheDocument();
  });

  it("handles loading state correctly", async () => {
    mockedApiClient.get = vi
      .fn()
      .mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(() => resolve({ data: mockAccountListItems }), 100)
          )
      );

    render(<AccountsPage />);

    await waitFor(() => {
      expect(mockedApiClient.get).toHaveBeenCalledWith("/accounts", {
        params: {},
      });
    });

    await waitFor(
      () => {
        expect(screen.getAllByText("0012345678").length).toBeGreaterThan(0);
      },
      { timeout: 2000 }
    );
  });

  it("renders delete buttons for each account", async () => {
    render(<AccountsPage />);

    await waitFor(() => {
      expect(mockedApiClient.get).toHaveBeenCalledWith("/accounts", {
        params: {},
      });
    });

    await waitFor(() => {
      const deleteButtons = screen.getAllByLabelText(/eliminar cuenta/i);
      expect(deleteButtons.length).toBeGreaterThan(0);
    });
  });
});
