import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "../../test/utils/test-utils";
import { MovementsPage } from "./MovementsPage";
import { mockMovementListItems } from "../../test/utils/mocks/movements/mockMovements";

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

// Mock the accounts store
vi.mock("../../store/useAccountsStore", () => ({
  useAccountsStore: vi.fn(() => ({
    selectedAccount: null,
    clearSelectedAccount: vi.fn(),
  })),
}));

import apiClient from "../../hooks/services/apiClient";
import { useAccountsStore } from "../../store";

const mockedApiClient = apiClient as any;
const mockUseAccountsStore = useAccountsStore as any;

describe("MovementsPage (with axios mocking)", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockUseAccountsStore.mockReturnValue({
      selectedAccount: null,
      clearSelectedAccount: vi.fn(),
    });

    mockedApiClient.get = vi.fn().mockImplementation((url: string) => {
      if (url.startsWith("/movements/account/") && url.includes("/report")) {
        return Promise.resolve({
          data: {
            jsonReport: mockMovementListItems.map((item) => ({
              id: item.id,
              date: item.date,
              type: item.movementType,
              amount: item.amount,
              balance: item.balance,
              accountNumber: item.accountNumber,
              clientName: item.clientName,
            })),
          },
        });
      }
      if (url === "/accounts") {
        return Promise.resolve({ data: [] });
      }
      if (url === "/clients") {
        return Promise.resolve({ data: [] });
      }
      return Promise.reject(new Error(`Unmocked endpoint: ${url}`));
    });

    mockedApiClient.post = vi.fn().mockImplementation((url: string) => {
      if (url === "/movements/report") {
        return Promise.resolve({ data: "base64PDFString" });
      }
      return Promise.reject(new Error(`Unmocked endpoint: ${url}`));
    });

    mockedApiClient.delete = vi.fn().mockImplementation((url: string) => {
      if (url.includes("/movements/")) {
        return Promise.resolve({ data: { success: true } });
      }
      return Promise.reject(new Error(`Unmocked endpoint: ${url}`));
    });
  });

  it("renders page title correctly", async () => {
    render(<MovementsPage />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Movimientos"
    );
  });

  it("renders search input with correct placeholder", () => {
    render(<MovementsPage />);

    const searchInput = screen.getByPlaceholderText("Buscar movimientos...");
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveValue("");
  });

  it("renders PDF download button", () => {
    render(<MovementsPage />);

    const pdfButton = screen.getByRole("button", { name: /descargar pdf/i });
    expect(pdfButton).toBeInTheDocument();
    expect(pdfButton).not.toBeDisabled();
  });

  it("loads and displays movement data from API", async () => {
    render(<MovementsPage />);

    await waitFor(() => {
      expect(mockedApiClient.get).toHaveBeenCalledWith(
        "/movements/account/all/report",
        {
          params: { format: "JSON" },
        }
      );
    });

    await waitFor(() => {
      const table = screen.getByRole("table");
      expect(table).toBeInTheDocument();
    });

    expect(screen.getAllByText("0012345678").length).toBeGreaterThan(0);
  });

  it("handles loading state correctly", async () => {
    mockedApiClient.get = vi.fn().mockImplementation((url: string) => {
      if (url.startsWith("/movements/account/") && url.includes("/report")) {
        return new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                data: {
                  jsonReport: mockMovementListItems.map((item) => ({
                    id: item.id,
                    date: item.date,
                    type: item.movementType,
                    amount: item.amount,
                    balance: item.balance,
                    accountNumber: item.accountNumber,
                    clientName: item.clientName,
                  })),
                },
              }),
            100
          )
        );
      }
      if (url === "/accounts") return Promise.resolve({ data: [] });
      if (url === "/clients") return Promise.resolve({ data: [] });
      return Promise.reject(new Error(`Unmocked endpoint: ${url}`));
    });

    render(<MovementsPage />);

    await waitFor(() => {
      expect(mockedApiClient.get).toHaveBeenCalledWith(
        "/movements/account/all/report",
        {
          params: { format: "JSON" },
        }
      );
    });

    await waitFor(
      () => {
        const table = screen.getByRole("table");
        expect(table).toBeInTheDocument();
      },
      { timeout: 2000 }
    );
  });

  it("renders reverse buttons for each movement", async () => {
    render(<MovementsPage />);

    await waitFor(() => {
      expect(mockedApiClient.get).toHaveBeenCalledWith(
        "/movements/account/all/report",
        {
          params: { format: "JSON" },
        }
      );
    });

    await waitFor(() => {
      const reverseButtons = screen.getAllByLabelText(/reversar movimiento/i);
      expect(reverseButtons.length).toBeGreaterThan(0);
    });
  });

  it("calls reverse API when reverse button is clicked", async () => {
    const originalConfirm = window.confirm;
    window.confirm = vi.fn(() => true);

    render(<MovementsPage />);

    await waitFor(() => {
      expect(mockedApiClient.get).toHaveBeenCalledWith(
        "/movements/account/all/report",
        {
          params: { format: "JSON" },
        }
      );
    });

    await waitFor(() => {
      const reverseButtons = screen.getAllByLabelText(/reversar movimiento/i);
      expect(reverseButtons.length).toBeGreaterThan(0);
    });

    const firstReverseButton =
      screen.getAllByLabelText(/reversar movimiento/i)[0];
    firstReverseButton.click();

    await waitFor(() => {
      expect(mockedApiClient.delete).toHaveBeenCalledWith(
        `/movements/${mockMovementListItems[0].id}`
      );
    });

    window.confirm = originalConfirm;
  });

  it("displays account filter when selectedAccount exists", async () => {
    const mockSelectedAccount = {
      id: "acc-1",
      accountNumber: "0012345678",
      clientName: "Juan Carlos Pérez",
      accountType: "SAVINGS",
      balance: 2250.75,
      isActive: true,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
    };

    mockUseAccountsStore.mockReturnValue({
      selectedAccount: mockSelectedAccount,
      clearSelectedAccount: vi.fn(),
    });

    render(<MovementsPage />);

    expect(
      screen.getByText(/mostrando movimientos para la cuenta:/i)
    ).toBeInTheDocument();
    expect(screen.getAllByText("0012345678").length).toBeGreaterThan(0);
    expect(
      screen.getByRole("button", { name: /mostrar todos/i })
    ).toBeInTheDocument();
  });

  it("does not display account filter when selectedAccount is null", () => {
    render(<MovementsPage />);

    expect(
      screen.queryByText(/mostrando movimientos para la cuenta:/i)
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /mostrar todos/i })
    ).not.toBeInTheDocument();
  });
});
