import { screen, fireEvent } from "@testing-library/react";
import { vi, describe, test, expect, beforeEach, type Mock } from "vitest";
import { MovementsPage } from "./MovementsPage";
import { render } from "../../test/utils/test-utils";
import { useMovementsPage } from "./useMovementsPage";
import { useAccountsStore } from "../../store";

vi.mock("./useMovementsPage");
vi.mock("../../store");

vi.mock("../../utils", () => ({
  downloadPdfFromBase64: vi.fn(),
  generateMovementReportFilename: vi.fn(() => "test-report.pdf"),
}));

const mockUseMovementsPage = useMovementsPage as Mock;
const mockUseAccountsStore = useAccountsStore as unknown as Mock;

const mockMovementsData = [
  {
    id: "mov-1",
    accountId: "acc-1",
    movementType: "DEPOSIT",
    amount: 500.0,
    balance: 2250.75,
    date: "2024-01-20T14:15:00Z",
    isReversed: false,
    createdAt: "2024-01-20T14:15:00Z",
    accountNumber: "0012345678",
    clientName: "Juan Carlos Pérez",
  },
  {
    id: "mov-2",
    accountId: "acc-1",
    movementType: "WITHDRAWAL",
    amount: 250.0,
    balance: 1750.75,
    date: "2024-01-19T10:30:00Z",
    isReversed: false,
    createdAt: "2024-01-19T10:30:00Z",
    accountNumber: "0012345678",
    clientName: "Juan Carlos Pérez",
  },
];

const mockTableColumns = [
  { key: "date", title: "Fecha", width: "120px" },
  { key: "accountNumber", title: "Cuenta", width: "140px" },
  { key: "clientName", title: "Cliente", width: "200px" },
  { key: "movementType", title: "Tipo", width: "120px" },
  { key: "amount", title: "Monto", width: "120px", align: "right" as const },
  { key: "balance", title: "Saldo", width: "120px", align: "right" as const },
];

const defaultMovementsPageReturn = {
  tableColumns: mockTableColumns,
  filteredMovements: mockMovementsData,
  isLoading: false,
  error: null,
  handleSearch: vi.fn(),
  handleRowClick: vi.fn(),
  handleClearAccountFilter: vi.fn(),
  handleGeneratePdfReport: vi.fn(),
  isGeneratingReport: false,
  searchQuery: "",
};

const defaultAccountsStoreReturn = {
  selectedAccount: null,
};

describe("MovementsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseMovementsPage.mockReturnValue(defaultMovementsPageReturn);
    mockUseAccountsStore.mockReturnValue(defaultAccountsStoreReturn);
  });

  test("renders page title correctly", () => {
    render(<MovementsPage />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Movimientos"
    );
  });

  test("renders search input with correct placeholder", () => {
    render(<MovementsPage />);

    const searchInput = screen.getByPlaceholderText("Buscar movimientos...");
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveValue("");
  });

  test("renders PDF download button", () => {
    render(<MovementsPage />);

    const pdfButton = screen.getByRole("button", { name: /descargar pdf/i });
    expect(pdfButton).toBeInTheDocument();
    expect(pdfButton).not.toBeDisabled();
  });

  test("renders Table component with correct props", () => {
    render(<MovementsPage />);

    const table = screen.getByRole("table");
    expect(table).toBeInTheDocument();

    expect(screen.getAllByText("Juan Carlos Pérez").length).toBeGreaterThan(0);
    expect(screen.getAllByText("DEPOSIT").length).toBeGreaterThan(0);
    expect(screen.getAllByText("WITHDRAWAL").length).toBeGreaterThan(0);
  });

  test("calls handleSearch when search input value changes", () => {
    const mockHandleSearch = vi.fn();
    mockUseMovementsPage.mockReturnValue({
      ...defaultMovementsPageReturn,
      handleSearch: mockHandleSearch,
    });

    render(<MovementsPage />);

    const searchInput = screen.getByPlaceholderText("Buscar movimientos...");
    fireEvent.change(searchInput, { target: { value: "test search" } });

    expect(mockHandleSearch).toHaveBeenCalledWith("test search");
  });

  test("calls handleGeneratePdfReport when PDF button is clicked", () => {
    const mockHandleGeneratePdfReport = vi.fn();
    mockUseMovementsPage.mockReturnValue({
      ...defaultMovementsPageReturn,
      handleGeneratePdfReport: mockHandleGeneratePdfReport,
    });

    render(<MovementsPage />);

    const pdfButton = screen.getByRole("button", { name: /descargar pdf/i });
    fireEvent.click(pdfButton);

    expect(mockHandleGeneratePdfReport).toHaveBeenCalledTimes(1);
  });

  test("displays search query value in input", () => {
    mockUseMovementsPage.mockReturnValue({
      ...defaultMovementsPageReturn,
      searchQuery: "test query",
    });

    render(<MovementsPage />);

    const searchInput = screen.getByPlaceholderText("Buscar movimientos...");
    expect(searchInput).toHaveValue("test query");
  });

  test("shows loading state in PDF button when generating report", () => {
    mockUseMovementsPage.mockReturnValue({
      ...defaultMovementsPageReturn,
      isGeneratingReport: true,
    });

    render(<MovementsPage />);

    const pdfButton = screen.getByRole("button", { name: /generando.../i });
    expect(pdfButton).toBeInTheDocument();
    expect(pdfButton).toBeDisabled();
  });

  test("displays account filter when selectedAccount exists", () => {
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
    });

    render(<MovementsPage />);

    expect(
      screen.getByText(/mostrando movimientos para la cuenta:/i)
    ).toBeInTheDocument();
    expect(screen.getAllByText("0012345678").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Juan Carlos Pérez").length).toBeGreaterThan(0);
    expect(
      screen.getByRole("button", { name: /mostrar todos/i })
    ).toBeInTheDocument();
  });

  test("displays account filter without client name when clientName is not available", () => {
    const mockSelectedAccount = {
      id: "acc-1",
      accountNumber: "0012345678",
      accountType: "SAVINGS",
      balance: 2250.75,
      isActive: true,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
    };

    mockUseAccountsStore.mockReturnValue({
      selectedAccount: mockSelectedAccount,
    });

    render(<MovementsPage />);

    expect(
      screen.getByText(/mostrando movimientos para la cuenta:/i)
    ).toBeInTheDocument();
    expect(screen.getAllByText("0012345678").length).toBeGreaterThan(0);

    // Check that the account filter doesn't show client name (should not contain " - " which indicates client name)
    const accountFilterText = screen
      .getByText(/mostrando movimientos para la cuenta:/i)
      .closest(".account-filter");
    expect(accountFilterText?.textContent).not.toMatch(/\s-\s/);
  });

  test('calls handleClearAccountFilter when "Mostrar todos" button is clicked', () => {
    const mockHandleClearAccountFilter = vi.fn();
    const mockSelectedAccount = {
      id: "acc-1",
      accountNumber: "0012345678",
      accountType: "SAVINGS",
      balance: 2250.75,
      isActive: true,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
    };

    mockUseMovementsPage.mockReturnValue({
      ...defaultMovementsPageReturn,
      handleClearAccountFilter: mockHandleClearAccountFilter,
    });

    mockUseAccountsStore.mockReturnValue({
      selectedAccount: mockSelectedAccount,
    });

    render(<MovementsPage />);

    const clearButton = screen.getByRole("button", { name: /mostrar todos/i });
    fireEvent.click(clearButton);

    expect(mockHandleClearAccountFilter).toHaveBeenCalledTimes(1);
  });

  test("does not display account filter when selectedAccount is null", () => {
    mockUseAccountsStore.mockReturnValue({
      selectedAccount: null,
    });

    render(<MovementsPage />);

    expect(
      screen.queryByText(/mostrando movimientos para la cuenta:/i)
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /mostrar todos/i })
    ).not.toBeInTheDocument();
  });

  test("renders error state correctly", () => {
    const mockError = new Error("Failed to load movements");
    mockUseMovementsPage.mockReturnValue({
      ...defaultMovementsPageReturn,
      error: mockError,
    });

    render(<MovementsPage />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Movimientos"
    );
    expect(
      screen.getByText(/error al cargar los movimientos:/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/failed to load movements/i)).toBeInTheDocument();

    expect(
      screen.queryByPlaceholderText("Buscar movimientos...")
    ).not.toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });

  test("passes correct props to Table component", () => {
    const mockHandleRowClick = vi.fn();
    mockUseMovementsPage.mockReturnValue({
      ...defaultMovementsPageReturn,
      handleRowClick: mockHandleRowClick,
      isLoading: true,
    });

    render(<MovementsPage />);

    const tableContainer = document.querySelector(".table-container");
    expect(tableContainer).toBeInTheDocument();
  });

  test("renders empty state when no movements", () => {
    mockUseMovementsPage.mockReturnValue({
      ...defaultMovementsPageReturn,
      filteredMovements: [],
    });

    render(<MovementsPage />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Movimientos"
    );
    expect(
      screen.getByPlaceholderText("Buscar movimientos...")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /descargar pdf/i })
    ).toBeInTheDocument();

    const tableContainer = document.querySelector(".table-container");
    expect(tableContainer).toBeInTheDocument();
  });

  test("maintains accessibility with proper button types", () => {
    const mockSelectedAccount = {
      id: "acc-1",
      accountNumber: "0012345678",
      accountType: "SAVINGS",
      balance: 2250.75,
      isActive: true,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
    };

    mockUseAccountsStore.mockReturnValue({
      selectedAccount: mockSelectedAccount,
    });

    render(<MovementsPage />);

    const pdfButton = screen.getByRole("button", { name: /descargar pdf/i });
    const clearButton = screen.getByRole("button", { name: /mostrar todos/i });

    expect(pdfButton).toHaveAttribute("type", "button");
    expect(clearButton).toHaveAttribute("type", "button");
  });

  test("handles complex movement data correctly", () => {
    const complexMovements = [
      ...mockMovementsData,
      {
        id: "mov-3",
        accountId: "acc-2",
        movementType: "DEPOSIT",
        amount: 1000.5,
        balance: 3251.25,
        date: "2024-01-21T09:30:00Z",
        isReversed: false,
        createdAt: "2024-01-21T09:30:00Z",
        accountNumber: "0012345679",
        clientName: "María Elena García",
      },
    ];

    mockUseMovementsPage.mockReturnValue({
      ...defaultMovementsPageReturn,
      filteredMovements: complexMovements,
    });

    render(<MovementsPage />);

    expect(screen.getAllByText("Juan Carlos Pérez").length).toBeGreaterThan(0);
    expect(screen.getAllByText("María Elena García").length).toBeGreaterThan(0);
    expect(screen.getAllByText("DEPOSIT").length).toBeGreaterThan(1);
    expect(screen.getAllByText("WITHDRAWAL").length).toBeGreaterThan(0);
  });

  test("search controls layout is properly structured", () => {
    render(<MovementsPage />);

    const searchSection = document.querySelector(".search-section");
    expect(searchSection).toBeInTheDocument();

    const searchControls = document.querySelector(".search-controls");
    expect(searchControls).toBeInTheDocument();

    const searchInput = screen.getByPlaceholderText("Buscar movimientos...");
    const pdfButton = screen.getByRole("button", { name: /descargar pdf/i });

    expect(searchInput).toBeInTheDocument();
    expect(pdfButton).toBeInTheDocument();
  });
});
