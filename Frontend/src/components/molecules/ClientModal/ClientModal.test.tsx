import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ClientModal } from "./ClientModal";

vi.mock("../../../hooks/services/apiClient", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("ClientModal", () => {
  let queryClient: QueryClient;
  const mockOnClose = vi.fn();
  const mockOnSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    // Mock console methods to avoid noise in tests
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  const renderWithQueryClient = (component: React.ReactElement) => {
    return render(
      <QueryClientProvider client={queryClient}>
        {component}
      </QueryClientProvider>
    );
  };

  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    onSuccess: mockOnSuccess,
  };

  it("renders modal with client form when open", () => {
    renderWithQueryClient(<ClientModal {...defaultProps} />);

    expect(screen.getByText("Nuevo Cliente")).toBeInTheDocument();
    expect(screen.getByText("Información Personal")).toBeInTheDocument();
    expect(screen.getByText("Información de Cuenta")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /crear cliente/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /cancelar/i })
    ).toBeInTheDocument();
  });

  it("does not render when closed", () => {
    renderWithQueryClient(<ClientModal {...defaultProps} isOpen={false} />);

    expect(screen.queryByText("Nuevo Cliente")).not.toBeInTheDocument();
  });

  it("calls onClose when cancel button is clicked", () => {
    renderWithQueryClient(<ClientModal {...defaultProps} />);

    fireEvent.click(screen.getByRole("button", { name: /cancelar/i }));

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("renders edit mode correctly", () => {
    const mockInitialData = {
      id: "1",
      person: {
        id: "1",
        name: "John Doe",
        identification: "12345678",
        phone: "555-1234",
        address: "123 Main St",
        age: 30,
        gender: "MALE" as const,
        createdAt: "2023-01-01T00:00:00Z",
        updatedAt: "2023-01-01T00:00:00Z",
      },
      password: "hashedpassword",
      state: "ACTIVE" as const,
      createdAt: "2023-01-01T00:00:00Z",
      updatedAt: "2023-01-01T00:00:00Z",
    };

    renderWithQueryClient(
      <ClientModal
        {...defaultProps}
        editMode={true}
        initialData={mockInitialData}
      />
    );

    expect(screen.getByText("Editar Cliente")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /actualizar cliente/i })
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();
    expect(screen.getByDisplayValue("12345678")).toBeInTheDocument();
  });

  it("renders form fields correctly", () => {
    renderWithQueryClient(<ClientModal {...defaultProps} />);

    // Check that all form fields are present
    expect(screen.getByLabelText(/nombre completo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/identificación/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/teléfono/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/dirección/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/edad/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/género/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
  });

  it("shows validation errors for empty required fields", async () => {
    renderWithQueryClient(<ClientModal {...defaultProps} />);

    fireEvent.click(screen.getByRole("button", { name: /crear cliente/i }));

    await waitFor(() => {
      expect(screen.getByText("Nombre es obligatorio")).toBeInTheDocument();
    });
  });

  it("works without onSuccess callback", () => {
    const propsWithoutSuccess = {
      isOpen: true,
      onClose: mockOnClose,
    };

    renderWithQueryClient(<ClientModal {...propsWithoutSuccess} />);

    expect(screen.getByText("Nuevo Cliente")).toBeInTheDocument();
  });
});
