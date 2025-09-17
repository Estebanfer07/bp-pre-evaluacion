import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "../../../test/utils/test-utils";
import { Sidebar } from "./Sidebar";

vi.mock("../../../hooks/services/apiClient", () => ({
  default: {
    get: vi.fn().mockResolvedValue({ data: [] }),
    post: vi.fn().mockResolvedValue({ data: {} }),
    put: vi.fn().mockResolvedValue({ data: {} }),
    patch: vi.fn().mockResolvedValue({ data: {} }),
    delete: vi.fn().mockResolvedValue({ data: {} }),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  },
}));

vi.mock("../../../router", () => ({
  useNavigate: () =>
    vi.fn().mockImplementation((param) => {
      console.log("Navigated to:", param);
      return Promise.resolve();
    }),
  router: { navigate: vi.fn() },
}));

vi.mock("@tanstack/react-router", async () => {
  const actual = await vi.importActual("@tanstack/react-router");
  return {
    ...actual,
    useLocation: () => ({ pathname: "/accounts" }),
    Link: ({ children, className, to, ...props }: any) => (
      <a href={to} className={className} {...props}>
        {children}
      </a>
    ),
  };
});

describe("Sidebar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders sidebar and all navigation links", async () => {
    render(<Sidebar />, {}, false);

    await waitFor(() => {
      expect(screen.getByTestId("sidebar")).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: /Cuentas/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: /Clientes/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: /Movimientos/i })
      ).toBeInTheDocument();
    });
  });

  it("highlights the active link based on route", async () => {
    render(<Sidebar />, {}, false);

    await waitFor(() => {
      const accountsLink = screen.getByRole("link", { name: /Cuentas/i });
      expect(accountsLink.className).toContain("sidebar__menu-link--active");
    });
  });
});
