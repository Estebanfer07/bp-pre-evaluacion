import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Modal } from "./Modal";

describe("Modal", () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    title: "Test Modal",
    children: <div>Modal content</div>,
    onSave: vi.fn(),
    onCancel: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    document.body.style.overflow = "";
  });

  it("renders modal when isOpen is true", () => {
    render(<Modal {...defaultProps} />);

    expect(screen.getByText("Test Modal")).toBeInTheDocument();
    expect(screen.getByText("Modal content")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /guardar/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /cancelar/i })
    ).toBeInTheDocument();
  });

  it("does not render modal when isOpen is false", () => {
    render(<Modal {...defaultProps} isOpen={false} />);

    expect(screen.queryByText("Test Modal")).not.toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    render(<Modal {...defaultProps} />);

    const closeButton = screen.getByRole("button", { name: /cerrar modal/i });
    fireEvent.click(closeButton);

    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when backdrop is clicked", () => {
    render(<Modal {...defaultProps} />);

    const backdrop = document.querySelector(".modal-backdrop");
    fireEvent.click(backdrop!);

    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it("does not call onClose when modal content is clicked", () => {
    render(<Modal {...defaultProps} />);

    const modal = document.querySelector(".modal");
    fireEvent.click(modal!);

    expect(defaultProps.onClose).not.toHaveBeenCalled();
  });

  it("calls onSave when save button is clicked", () => {
    render(<Modal {...defaultProps} />);

    const saveButton = screen.getByRole("button", { name: /guardar/i });
    fireEvent.click(saveButton);

    expect(defaultProps.onSave).toHaveBeenCalledTimes(1);
  });

  it("calls onCancel when cancel button is clicked", () => {
    render(<Modal {...defaultProps} />);

    const cancelButton = screen.getByRole("button", { name: /cancelar/i });
    fireEvent.click(cancelButton);

    expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
  });

  it("closes modal when ESC key is pressed", async () => {
    render(<Modal {...defaultProps} />);

    fireEvent.keyDown(document, { key: "Escape" });

    await waitFor(() => {
      expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    });
  });

  it("renders custom button labels", () => {
    render(
      <Modal {...defaultProps} saveLabel="Actualizar" cancelLabel="Cerrar" />
    );

    expect(
      screen.getByRole("button", { name: /actualizar/i })
    ).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /cerrar/i })).toHaveLength(2);
  });

  it("disables save button when saveDisabled is true", () => {
    render(<Modal {...defaultProps} saveDisabled={true} />);

    const saveButton = screen.getByRole("button", { name: /guardar/i });
    expect(saveButton).toBeDisabled();
  });

  it("shows loading state on save button when isSaving is true", () => {
    render(<Modal {...defaultProps} isSaving={true} />);

    const saveButton = screen.getByRole("button", { name: /guardar/i });
    expect(saveButton).toBeDisabled();
  });

  it("disables close button when saving", () => {
    render(<Modal {...defaultProps} isSaving={true} />);

    const closeButton = screen.getByRole("button", { name: /cerrar modal/i });
    expect(closeButton).toBeDisabled();
  });

  it("disables cancel button when saving", () => {
    render(<Modal {...defaultProps} isSaving={true} />);

    const cancelButton = screen.getByRole("button", { name: /cancelar/i });
    expect(cancelButton).toBeDisabled();
  });

  it("does not call onSave when save button is disabled", () => {
    render(<Modal {...defaultProps} saveDisabled={true} />);

    const saveButton = screen.getByRole("button", { name: /guardar/i });
    fireEvent.click(saveButton);

    expect(defaultProps.onSave).not.toHaveBeenCalled();
  });

  it("does not call onCancel when saving", () => {
    render(<Modal {...defaultProps} isSaving={true} />);

    const cancelButton = screen.getByRole("button", { name: /cancelar/i });
    fireEvent.click(cancelButton);

    expect(defaultProps.onCancel).not.toHaveBeenCalled();
  });

  it("applies correct size class", () => {
    const { rerender } = render(<Modal {...defaultProps} size="lg" />);

    expect(document.querySelector(".modal--lg")).toBeInTheDocument();

    rerender(<Modal {...defaultProps} size="sm" />);
    expect(document.querySelector(".modal--sm")).toBeInTheDocument();

    rerender(<Modal {...defaultProps} size="xl" />);
    expect(document.querySelector(".modal--xl")).toBeInTheDocument();
  });

  it("sets body overflow to hidden when modal is open", () => {
    render(<Modal {...defaultProps} />);

    expect(document.body.style.overflow).toBe("hidden");
  });

  it("resets body overflow when modal is closed", () => {
    const { unmount } = render(<Modal {...defaultProps} />);

    unmount();

    expect(document.body.style.overflow).toBe("unset");
  });

  it("has proper accessibility attributes", () => {
    render(<Modal {...defaultProps} />);

    const closeButton = screen.getByRole("button", { name: /cerrar modal/i });
    expect(closeButton).toHaveAttribute("aria-label", "Cerrar modal");
  });
});
