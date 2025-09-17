import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ClientForm } from "./ClientForm";
import type { ClientForm as ClientFormType } from "../../../types/clients";

describe("ClientForm", () => {
  const mockOnSubmit = vi.fn();

  const defaultProps = {
    onSubmit: mockOnSubmit,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders form with all required fields", () => {
    render(<ClientForm {...defaultProps} />);

    expect(screen.getByLabelText(/nombre completo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/identificación/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/teléfono/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/edad/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/dirección/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/género/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
  });

  it("displays section titles", () => {
    render(<ClientForm {...defaultProps} />);

    expect(screen.getByText("Información Personal")).toBeInTheDocument();
    expect(screen.getByText("Información de Cuenta")).toBeInTheDocument();
  });

  it("renders with initial data", () => {
    const initialData: Partial<ClientFormType> = {
      name: "John Doe",
      identification: "12345678",
      phone: "555-1234",
      address: "123 Main St",
      age: 30,
      gender: "MALE",
      password: "password123",
    };

    render(<ClientForm {...defaultProps} initialData={initialData} />);

    expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();
    expect(screen.getByDisplayValue("12345678")).toBeInTheDocument();
    expect(screen.getByDisplayValue("555-1234")).toBeInTheDocument();
    expect(screen.getByDisplayValue("123 Main St")).toBeInTheDocument();
    expect(screen.getByDisplayValue("30")).toBeInTheDocument();
    expect(screen.getByDisplayValue("password123")).toBeInTheDocument();
  });

  it("calls onSubmit with form data when form is submitted", async () => {
    render(<ClientForm {...defaultProps} />);

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/nombre completo/i), {
      target: { value: "Jane Doe" },
    });
    fireEvent.change(screen.getByLabelText(/identificación/i), {
      target: { value: "87654321" },
    });
    fireEvent.change(screen.getByLabelText(/teléfono/i), {
      target: { value: "555-9876" },
    });
    fireEvent.change(screen.getByLabelText(/dirección/i), {
      target: { value: "456 Oak St" },
    });
    fireEvent.change(screen.getByLabelText(/edad/i), {
      target: { value: "25" },
    });
    fireEvent.change(screen.getByLabelText(/género/i), {
      target: { value: "FEMALE" },
    });
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: "newpassword123" },
    });

    // Submit the form
    fireEvent.submit(screen.getByRole("form"));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: "Jane Doe",
        identification: "87654321",
        phone: "555-9876",
        address: "456 Oak St",
        age: 25,
        gender: "FEMALE",
        password: "newpassword123",
      });
    });
  });

  it("shows validation errors for empty required fields", async () => {
    const { debug } = render(<ClientForm {...defaultProps} />);

    fireEvent.submit(screen.getByRole("form"));

    await waitFor(() => {
      debug();
      expect(screen.getByText("Nombre es obligatorio")).toBeInTheDocument();
      expect(
        screen.getByText("La identificación es obligatoria")
      ).toBeInTheDocument();
      expect(
        screen.getByText("El teléfono es obligatorio")
      ).toBeInTheDocument();
      expect(
        screen.getByText("La dirección es obligatoria")
      ).toBeInTheDocument();
      expect(
        screen.getByText("La edad debe ser mayor que 0")
      ).toBeInTheDocument();
      expect(
        screen.getByText("La contraseña debe tener al menos 8 caracteres")
      ).toBeInTheDocument();
    });
  });

  it("validates password length", async () => {
    render(<ClientForm {...defaultProps} />);

    const passwordInput = screen.getByLabelText(/contraseña/i);

    // Test password too short
    fireEvent.change(passwordInput, { target: { value: "short" } });
    fireEvent.blur(passwordInput);

    await waitFor(() => {
      expect(
        screen.getByText("La contraseña debe tener al menos 8 caracteres")
      ).toBeInTheDocument();
    });

    // Test password too long
    fireEvent.change(passwordInput, {
      target: { value: "verylongpasswordthatexceedslimit" },
    });
    fireEvent.blur(passwordInput);

    await waitFor(() => {
      expect(
        screen.getByText("La contraseña no debe exceder los 15 caracteres")
      ).toBeInTheDocument();
    });
  });

  it("disables form fields when loading", () => {
    render(<ClientForm {...defaultProps} isLoading={true} />);

    expect(screen.getByLabelText(/nombre completo/i)).toBeDisabled();
    expect(screen.getByLabelText(/identificación/i)).toBeDisabled();
    expect(screen.getByLabelText(/teléfono/i)).toBeDisabled();
    expect(screen.getByLabelText(/edad/i)).toBeDisabled();
    expect(screen.getByLabelText(/dirección/i)).toBeDisabled();
    expect(screen.getByLabelText(/género/i)).toBeDisabled();
    expect(screen.getByLabelText(/contraseña/i)).toBeDisabled();
  });

  it("renders gender options correctly", () => {
    render(<ClientForm {...defaultProps} />);

    const genderSelect = screen.getByLabelText(/género/i);
    expect(genderSelect).toBeInTheDocument();

    const options = screen.getAllByRole("option");
    const genderOptions = options.filter(
      (option) =>
        option.textContent === "Masculino" ||
        option.textContent === "Femenino" ||
        option.textContent === "Otro"
    );

    expect(genderOptions).toHaveLength(3);
  });

  it("does not submit form when validation fails", async () => {
    render(<ClientForm {...defaultProps} />);

    // Only fill some fields, leaving others empty
    fireEvent.change(screen.getByLabelText(/nombre completo/i), {
      target: { value: "John" },
    });

    fireEvent.submit(screen.getByRole("form"));

    // Wait a bit to ensure onSubmit is not called
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });
});
