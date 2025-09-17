import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MovementForm } from "./MovementForm";
import { render, screen } from "../../../test/utils/test-utils";

// Mock the useAccountsQueries hook
const mockUseAccountsQueries = vi.fn();

vi.mock("../../../hooks/services/useAccountsQueries", () => ({
  useAccountsQueries: () => mockUseAccountsQueries(),
}));

describe("MovementForm", () => {
  const mockOnSubmit = vi.fn();
  let queryClient: QueryClient;

  const defaultProps = {
    onSubmit: mockOnSubmit,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    // Mock the accounts query hook
    mockUseAccountsQueries.mockReturnValue({
      useGetAccounts: () => ({
        data: [
          {
            id: "1",
            accountNumber: "12345",
            balance: 1000,
            clientName: "John Doe",
          },
        ],
        isLoading: false,
        error: null,
      }),
    });
  });

  it("renders form with all required fields", () => {
    render(<MovementForm {...defaultProps} />);

    expect(screen.getByLabelText(/cuenta/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tipo de movimiento/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/monto/i)).toBeInTheDocument();
  });

  it("displays section title", () => {
    render(<MovementForm {...defaultProps} />);

    expect(screen.getByText("Información del Movimiento")).toBeInTheDocument();
  });

  it("renders movement type options", () => {
    render(<MovementForm {...defaultProps} />);

    // Check that the select has the expected options
    const depositOption = screen.getByRole("option", { name: "Depósito" });
    const withdrawalOption = screen.getByRole("option", { name: "Retiro" });

    expect(depositOption).toBeInTheDocument();
    expect(withdrawalOption).toBeInTheDocument();
  });
});
