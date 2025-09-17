import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "../../../test/utils/test-utils";
import { Sidebar } from "./Sidebar";

vi.mock("../../../router", () => ({
  useNavigate: () =>
    vi.fn().mockImplementation((param) => {
      console.log("Navigated to:", param);
      return Promise.resolve();
    }),
  router: { navigate: vi.fn() },
}));

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

describe("Sidebar", () => {
  it("renders sidebar and all navigation links", async () => {
    render(<Sidebar />);

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
    render(<Sidebar />);
    await waitFor(() => {
      const accountsLink = screen.getByRole("link", { name: /Cuentas/i });
      expect(accountsLink.className).toMatch(/active|selected/);
    });
  });
});
