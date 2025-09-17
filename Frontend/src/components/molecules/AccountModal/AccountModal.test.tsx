import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AccountModal } from "./AccountModal";
import type { AccountListItem } from "../../../types/accounts";

// Mock the accounts queries
vi.mock("../../../hooks/services/useAccountsQueries", () => ({
  useAccountsQueries: () => ({
    useCreateAccount: () => ({
      mutate: vi.fn(),
      isPending: false,
    }),
    useUpdateAccount: () => ({
      mutate: vi.fn(),
      isPending: false,
    }),
  }),
}));

// Mock the clients queries hook used by AccountForm
vi.mock("../../../hooks/services/useClientsQueries", () => ({
  useClientsQueries: () => ({
    useGetClients: () => ({
      data: [
        {
          id: "client-1",
          person: {
            name: "Juan Pérez",
            identification: "12345678",
          },
        },
      ],
    }),
  }),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("AccountModal", () => {
  const mockOnClose = vi.fn();
  const mockOnSuccess = vi.fn();

  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    onSuccess: mockOnSuccess,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders modal with 'Nueva Cuenta' title in create mode", () => {
    render(<AccountModal {...defaultProps} />, { wrapper: createWrapper() });

    expect(screen.getByText("Nueva Cuenta")).toBeInTheDocument();
    expect(screen.getByText("Crear Cuenta")).toBeInTheDocument();
  });

  it("renders modal with 'Editar Cuenta' title in edit mode", () => {
    const mockAccount: AccountListItem = {
      id: "account-1",
      accountNumber: "123456789",
      type: "AHO",
      balance: 1000,
      state: "ACTIVE",
      clientName: "Juan Pérez",
      createdAt: "2023-01-01T00:00:00Z",
    };

    render(
      <AccountModal
        {...defaultProps}
        editMode={true}
        initialData={mockAccount}
      />,
      { wrapper: createWrapper() }
    );

    expect(screen.getByText("Editar Cuenta")).toBeInTheDocument();
    expect(screen.getByText("Actualizar Cuenta")).toBeInTheDocument();
  });

  it("renders AccountForm component", () => {
    render(<AccountModal {...defaultProps} />, { wrapper: createWrapper() });

    expect(screen.getByLabelText(/tipo de cuenta/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/saldo inicial/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/cliente/i)).toBeInTheDocument();
  });

  it("does not render when isOpen is false", () => {
    render(<AccountModal {...defaultProps} isOpen={false} />, {
      wrapper: createWrapper(),
    });

    expect(screen.queryByText("Nueva Cuenta")).not.toBeInTheDocument();
  });

  it("calls onClose when cancel button is clicked", () => {
    render(<AccountModal {...defaultProps} />, { wrapper: createWrapper() });

    const cancelButton = screen.getByText("Cancelar");
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it("pre-fills form with initial data in edit mode", () => {
    const mockAccount: AccountListItem = {
      id: "account-1",
      accountNumber: "123456789",
      type: "CTE",
      balance: 500,
      state: "ACTIVE",
      clientName: "Juan Pérez",
      createdAt: "2023-01-01T00:00:00Z",
    };

    render(
      <AccountModal
        {...defaultProps}
        editMode={true}
        initialData={mockAccount}
      />,
      { wrapper: createWrapper() }
    );

    expect(screen.getByDisplayValue("Corriente")).toBeInTheDocument();
    expect(screen.getByDisplayValue("500")).toBeInTheDocument();
  });
});
