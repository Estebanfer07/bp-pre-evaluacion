import React, { type ReactElement } from "react";
import { render, type RenderOptions } from "@testing-library/react";
import { QueryClientProvider } from "@tanstack/react-query";
import {
  createMemoryHistory,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import { queryClient } from "../../lib/queryClient";
import { routeTree } from "../../router/routeTree.gen";

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const memoryHistory = createMemoryHistory({
    initialEntries: ["/accounts"],
  });

  const router = createRouter({
    routeTree,
    history: memoryHistory,
    defaultComponent: () => <>test{children}</>,
  });

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from "@testing-library/react";
export { customRender as render };
