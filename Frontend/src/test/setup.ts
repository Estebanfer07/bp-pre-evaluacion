import "@testing-library/jest-dom";
import { afterAll, afterEach, beforeAll, beforeEach, vi } from "vitest";
import { server } from "./utils/mocks/server";
import { cleanup } from "@testing-library/react";
import { queryClient } from "../lib/queryClient";

beforeEach(() => {
  vi.clearAllMocks();
});

beforeAll(() => {
  window.alert = vi.fn();
  server.listen();
});

afterEach(() => {
  server.resetHandlers();
  queryClient.clear();
  cleanup();
});

afterAll(() => server.close());

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
