import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ClientModal } from "./ClientModal";
import axios from "axios";

// Mock axios
vi.mock("axios");
const mockedAxios = axios as any;

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

    // Mock successful API response
    mockedAxios.post.mockResolvedValue({
      data: {
        id: "1",
        person: {
          id: "1",
          name: "John Doe",
          identification: "12345678",
          phone: "555-1234",
          address: "123 Main St",
          age: 30,
          gender: "MALE",
          createdAt: "2023-01-01T00:00:00Z",
          updatedAt: "2023-01-01T00:00:00Z",
        },
        state: "ACTIVE",
        createdAt: "2023-01-01T00:00:00Z",
        updatedAt: "2023-01-01T00:00:00Z",
      },
    });

    // Mock console methods to avoid noise in tests
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(window, "alert").mockImplementation(() => {});
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

  it("calls onClose when modal backdrop is clicked", () => {
    renderWithQueryClient(<ClientModal {...defaultProps} />);

    const backdrop = document.querySelector(".modal-backdrop");
    fireEvent.click(backdrop!);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("submits form with correct data when form is filled and submitted", async () => {
    renderWithQueryClient(<ClientModal {...defaultProps} />);

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/nombre completo/i), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText(/identificación/i), {
      target: { value: "12345678" },
    });
    fireEvent.change(screen.getByLabelText(/teléfono/i), {
      target: { value: "555-1234" },
    });
    fireEvent.change(screen.getByLabelText(/dirección/i), {
      target: { value: "123 Main St" },
    });
    fireEvent.change(screen.getByLabelText(/edad/i), {
      target: { value: "30" },
    });
    fireEvent.change(screen.getByLabelText(/género/i), {
      target: { value: "MALE" },
    });
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByLabelText(/estado/i), {
      target: { value: "ACTIVE" },
    });

    // Submit form directly
    fireEvent.submit(screen.getByRole("form"));

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith("/clients", {
        name: "John Doe",
        identification: "12345678",
        phone: "555-1234",
        address: "123 Main St",
        age: 30,
        gender: "MALE",
        password: "password123",
        state: "ACTIVE",
      });
    });
  });

  it("calls onClose and onSuccess when submission succeeds", async () => {
    renderWithQueryClient(<ClientModal {...defaultProps} />);

    // Fill out required fields
    fireEvent.change(screen.getByLabelText(/nombre completo/i), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText(/identificación/i), {
      target: { value: "12345678" },
    });
    fireEvent.change(screen.getByLabelText(/teléfono/i), {
      target: { value: "555-1234" },
    });
    fireEvent.change(screen.getByLabelText(/dirección/i), {
      target: { value: "123 Main St" },
    });
    fireEvent.change(screen.getByLabelText(/edad/i), {
      target: { value: "30" },
    });
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: "password123" },
    });

    // Submit form
    fireEvent.submit(screen.getByRole("form"));

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalledTimes(1);
      expect(mockOnSuccess).toHaveBeenCalledTimes(1);
    });
  });

  it("handles API error correctly", async () => {
    const errorMessage = "Client creation failed";
    mockedAxios.post.mockRejectedValueOnce({
      response: { data: { message: errorMessage } },
      message: errorMessage,
    });

    renderWithQueryClient(<ClientModal {...defaultProps} />);

    // Fill out required fields
    fireEvent.change(screen.getByLabelText(/nombre completo/i), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText(/identificación/i), {
      target: { value: "12345678" },
    });
    fireEvent.change(screen.getByLabelText(/teléfono/i), {
      target: { value: "555-1234" },
    });
    fireEvent.change(screen.getByLabelText(/dirección/i), {
      target: { value: "123 Main St" },
    });
    fireEvent.change(screen.getByLabelText(/edad/i), {
      target: { value: "30" },
    });
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: "password123" },
    });

    // Submit form
    fireEvent.submit(screen.getByRole("form"));

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        "Error creating client:",
        expect.any(Object)
      );
    });

    // Modal should not close on error
    expect(mockOnClose).not.toHaveBeenCalled();
    expect(mockOnSuccess).not.toHaveBeenCalled();
  });

  it("disables form and buttons during submission", async () => {
    // Make the API call hang to test loading state
    mockedAxios.post.mockImplementation(() => new Promise(() => {}));

    renderWithQueryClient(<ClientModal {...defaultProps} />);

    // Fill out required fields
    fireEvent.change(screen.getByLabelText(/nombre completo/i), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText(/identificación/i), {
      target: { value: "12345678" },
    });
    fireEvent.change(screen.getByLabelText(/teléfono/i), {
      target: { value: "555-1234" },
    });
    fireEvent.change(screen.getByLabelText(/dirección/i), {
      target: { value: "123 Main St" },
    });
    fireEvent.change(screen.getByLabelText(/edad/i), {
      target: { value: "30" },
    });
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: "password123" },
    });

    // Submit form
    fireEvent.submit(screen.getByRole("form"));

    // Wait for loading state
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /crear cliente/i })
      ).toBeDisabled();
      expect(screen.getByRole("button", { name: /cancelar/i })).toBeDisabled();
    });

    // Check that form fields are disabled
    expect(screen.getByLabelText(/nombre completo/i)).toBeDisabled();
    expect(screen.getByLabelText(/identificación/i)).toBeDisabled();
    expect(screen.getByLabelText(/teléfono/i)).toBeDisabled();
    expect(screen.getByLabelText(/edad/i)).toBeDisabled();
    expect(screen.getByLabelText(/dirección/i)).toBeDisabled();
    expect(screen.getByLabelText(/género/i)).toBeDisabled();
    expect(screen.getByLabelText(/contraseña/i)).toBeDisabled();
    expect(screen.getByLabelText(/estado/i)).toBeDisabled();
  });

  it("works without onSuccess callback", async () => {
    const propsWithoutSuccess = {
      isOpen: true,
      onClose: mockOnClose,
    };

    renderWithQueryClient(<ClientModal {...propsWithoutSuccess} />);

    // Fill out required fields
    fireEvent.change(screen.getByLabelText(/nombre completo/i), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText(/identificación/i), {
      target: { value: "12345678" },
    });
    fireEvent.change(screen.getByLabelText(/teléfono/i), {
      target: { value: "555-1234" },
    });
    fireEvent.change(screen.getByLabelText(/dirección/i), {
      target: { value: "123 Main St" },
    });
    fireEvent.change(screen.getByLabelText(/edad/i), {
      target: { value: "30" },
    });
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: "password123" },
    });

    // Submit form
    fireEvent.submit(screen.getByRole("form"));

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  it("validates form before submission", async () => {
    renderWithQueryClient(<ClientModal {...defaultProps} />);

    // Try to submit empty form
    fireEvent.submit(screen.getByRole("form"));

    // Should show validation errors and not call API
    await waitFor(() => {
      expect(screen.getByText("Name is required")).toBeInTheDocument();
    });

    expect(mockedAxios.post).not.toHaveBeenCalled();
    expect(mockOnClose).not.toHaveBeenCalled();
  });
});
