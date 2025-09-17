import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AccountForm } from "./AccountForm";
import type { AccountForm as AccountFormType } from "../../../types/accounts";

vi.mock("../../../hooks/services/useClientsQueries", () => ({
  useClientsQueries: () => ({
    useGetClients: () => ({
      data: [
        {
          id: "550e8400-e29b-41d4-a716-446655440000",
          person: {
            name: "Juan Pérez",
            identification: "12345678",
          },
        },
        {
          id: "550e8400-e29b-41d4-a716-446655440001",
          person: {
            name: "María García",
            identification: "87654321",
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

describe("AccountForm", () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all form fields", () => {
    render(<AccountForm onSubmit={mockOnSubmit} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByLabelText(/tipo de cuenta/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/saldo inicial/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/cliente/i)).toBeInTheDocument();
  });

  it("renders account type options", () => {
    render(<AccountForm onSubmit={mockOnSubmit} />, {
      wrapper: createWrapper(),
    });

    const typeSelect = screen.getByLabelText(/tipo de cuenta/i);
    expect(typeSelect).toBeInTheDocument();

    // Check if options exist
    expect(screen.getByDisplayValue("Ahorros")).toBeInTheDocument();
    expect(screen.getByText("Corriente")).toBeInTheDocument();
  });

  it("renders client options from the clients list", async () => {
    render(<AccountForm onSubmit={mockOnSubmit} />, {
      wrapper: createWrapper(),
    });

    const clientSelect = screen.getByLabelText(/cliente/i);
    expect(clientSelect).toBeInTheDocument();

    // Check if client options exist
    await waitFor(() => {
      expect(screen.getByText("Juan Pérez - 12345678")).toBeInTheDocument();
      expect(screen.getByText("María García - 87654321")).toBeInTheDocument();
    });
  });

  it("shows validation errors for required fields", async () => {
    render(<AccountForm onSubmit={mockOnSubmit} />, {
      wrapper: createWrapper(),
    });

    const form = screen.getByRole("form");
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText(/invalid client id format/i)).toBeInTheDocument();
    });
  });

  it("calls onSubmit with correct data when form is valid", async () => {
    render(<AccountForm onSubmit={mockOnSubmit} />, {
      wrapper: createWrapper(),
    });

    // Fill the form
    const typeSelect = screen.getByLabelText(/tipo de cuenta/i);
    const balanceInput = screen.getByLabelText(/saldo inicial/i);
    const clientSelect = screen.getByLabelText(/cliente/i);

    fireEvent.change(typeSelect, { target: { value: "CTE" } });
    fireEvent.change(balanceInput, { target: { value: "1000" } });
    fireEvent.change(clientSelect, {
      target: { value: "550e8400-e29b-41d4-a716-446655440000" },
    });

    const form = screen.getByRole("form");
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        type: "CTE",
        balance: 1000,
        clientId: "550e8400-e29b-41d4-a716-446655440000",
      });
    });
  });

  it("pre-fills form with initial data", () => {
    const initialData: Partial<AccountFormType> = {
      type: "CTE",
      balance: 500,
      clientId: "550e8400-e29b-41d4-a716-446655440001",
    };

    render(<AccountForm onSubmit={mockOnSubmit} initialData={initialData} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByDisplayValue("Corriente")).toBeInTheDocument();
    expect(screen.getByDisplayValue("500")).toBeInTheDocument();
    expect((screen.getByLabelText(/cliente/i) as HTMLSelectElement).value).toBe(
      "550e8400-e29b-41d4-a716-446655440001"
    );
  });

  it("disables form fields when loading", () => {
    render(<AccountForm onSubmit={mockOnSubmit} isLoading={true} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByLabelText(/tipo de cuenta/i)).toBeDisabled();
    expect(screen.getByLabelText(/saldo inicial/i)).toBeDisabled();
    expect(screen.getByLabelText(/cliente/i)).toBeDisabled();
  });
});
