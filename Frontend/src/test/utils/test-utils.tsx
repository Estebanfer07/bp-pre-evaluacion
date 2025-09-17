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

const AllTheProviders = (
  { children }: { children: React.ReactNode },
  addRouterProvider: boolean = false
) => {
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
      {addRouterProvider ? <RouterProvider router={router} /> : children}
    </QueryClientProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
  addRouterProvider: boolean = false
) =>
  render(ui, {
    wrapper: (data) => AllTheProviders(data, addRouterProvider),
    ...options,
  });

export * from "@testing-library/react";
export { customRender as render };
